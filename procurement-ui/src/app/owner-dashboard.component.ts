import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy, OnInit, inject, computed, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Chart: any;

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      :host { display: block; }
      .owner-container, .owner-container * { font-family: 'Fredoka', sans-serif !important; }
      
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel { background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.12); }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }
      
      /* STYLED CUSTOM SCROLLBARS */
      .custom-scroll { scrollbar-width: thin !important; scrollbar-color: rgba(234, 194, 36, 0.6) rgba(0, 0, 0, 0.2) !important; }
      .custom-scroll::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
      .custom-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2) !important; border-radius: 10px !important; }
      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(234, 194, 36, 0.6) !important; border-radius: 10px !important; }

      .sticky-thead { position: sticky; top: 0; z-index: 20; background: #18280b; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35); }

      @keyframes slide-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      .a-toast { animation: slide-up 0.4s ease-out forwards; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }

      @keyframes aurora { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,20px) scale(1.1); } }
      .a-aurora { animation: aurora 12s ease-in-out infinite; }
      .a-aurora-rev { animation: aurora 15s ease-in-out infinite reverse; }

      @media print {
        body * { visibility: hidden; }
        #printable-report, #printable-report * { visibility: visible; }
        #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: black !important; background: white !important; }
        .no-print { display: none !important; }
      }
    </style>

    <div class="owner-container min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip relative">

      <!-- FLOATING TOAST -->
      @if (toast().show) {
        <div class="fixed top-8 left-0 right-0 z-[99999] flex justify-center pointer-events-none">
          <div [class]="'a-toast pointer-events-auto px-8 py-5 rounded-3xl shadow-2xl border-4 flex items-center gap-5 max-w-lg w-full mx-4 ' + (toast().type === 'success' ? 'bg-[#9be15d] border-white text-[#1d2f0d]' : 'bg-[#B4161B] border-white text-white')" role="status">
            <span class="text-4xl">{{ toast().type === 'success' ? '✅' : '🚨' }}</span>
            <div>
              <h4 class="text-xl font-extrabold uppercase tracking-wide">{{ toast().type === 'success' ? 'Success!' : 'Attention!' }}</h4>
              <p class="font-bold text-sm mt-1">{{ toast().message }}</p>
            </div>
          </div>
        </div>
      }

      <!-- LOGOUT CONFIRMATION MODAL -->
      @if (logoutModalShow()) {
        <div class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" (click)="logoutModalShow.set(false)">
          <div class="bg-[#1b2b10] border border-white/20 rounded-[28px] w-full max-w-sm p-8 relative shadow-2xl text-center" (click)="$event.stopPropagation()">
            <div class="w-16 h-16 bg-[#B4161B]/20 text-[#ffb4b7] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B4161B]/50">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Sign Out?</h3>
            <p class="text-white/70 text-sm font-medium mb-6">Are you sure you want to securely end your session?</p>
            
            <div class="flex flex-col gap-3">
              <button (click)="executeLogout()" class="w-full px-6 py-3 rounded-full bg-[#B4161B] hover:bg-[#8f1115] text-white font-bold text-sm transition-colors cursor-pointer shadow-md">
                Yes, Sign Out
              </button>
              <button (click)="logoutModalShow.set(false)" class="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <!-- PO REJECTION MODAL -->
      @if (rejectModalData()) {
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" (click)="rejectModalData.set(null)">
          <div class="bg-[#1b2b10] border border-white/20 rounded-[28px] w-full max-w-md p-8 relative shadow-2xl" (click)="$event.stopPropagation()">
            <h3 class="text-2xl font-bold text-white mb-2 text-[#ffb4b7]">Reject Purchase Order</h3>
            <p class="text-white/70 text-sm font-medium mb-6">Please provide a reason for rejecting <span class="font-bold text-white">{{ rejectModalData().po_number }}</span>.</p>
            
            <textarea [(ngModel)]="rejectReason" rows="3" placeholder="Enter reason for rejection..." class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#ffb4b7] transition-colors font-bold mb-6 custom-scroll"></textarea>
            
            <div class="flex justify-end gap-3">
              <button (click)="rejectModalData.set(null)" class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button (click)="submitRejection()" [disabled]="isSubmitting() || !rejectReason.trim()" class="px-6 py-2.5 rounded-full bg-[#B4161B] hover:bg-[#8f1115] disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer shadow-md">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      }

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)] min-h-[85vh] flex flex-col">

        <!-- DECORATIVE BACKGROUND GLOWS CONFINED TO PANEL -->
        <div class="absolute inset-0 overflow-hidden rounded-[36px] pointer-events-none z-0">
          <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#9be15d]/10 blur-[100px] rounded-full a-aurora"></div>
          <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#EAC224]/10 blur-[100px] rounded-full a-aurora-rev"></div>
          <span class="a-twinkle absolute top-[8%] left-[45%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
          <span class="a-twinkle absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
          <span class="a-twinkle absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>
        </div>

        <!-- Header -->
        <div class="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div>
             <span class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold text-[#EAC224] tracking-wider uppercase shadow-sm">👑 Owner Command Center</span>
             <h2 class="text-4xl md:text-5xl font-semibold tracking-wide">Enterprise Dashboard</h2>
          </div>
          <button (click)="confirmLogout()" class="px-6 py-2.5 bg-[#B4161B] hover:bg-[#8f1115] text-white rounded-full font-bold text-sm border border-white/20 shadow-md transition-all cursor-pointer flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224] flex-1 flex flex-col min-h-0 shadow-2xl">
          <!-- Main Navigation Tabs -->
          <div class="border-b border-white/10 px-6 md:px-8 pt-6 pb-6 flex overflow-x-auto custom-scroll shrink-0">
            <div class="relative flex w-full max-w-[800px] bg-black/25 p-1.5 rounded-full shadow-inner border border-white/5">
              <!-- Slider mathematically adjusted for exactly 3 tabs (33.33% each) -->
              <div class="absolute top-1.5 bottom-1.5 w-[calc(33.333%-4px)] bg-[#EAC224] rounded-full transition-transform duration-500 shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]"
                   [style.transform]="'translateX(' + getTabIndex() * 100 + '%)'"></div>
              
              <button (click)="activeTab.set('approvals')" class="relative z-10 w-1/3 py-3 text-[15px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5" [class.text-[#2d3e15]]="activeTab() === 'approvals'" [class.text-white]="activeTab() !== 'approvals'">
                <span>PO Approvals</span>
                @if(pendingPOs().length > 0) { 
                  <span [class]="'px-2 py-0.5 rounded-full text-[10px] ml-1 shadow-sm ' + (activeTab() === 'approvals' ? 'bg-[#1d2f0d] text-[#EAC224]' : 'bg-[#EAC224] text-[#1d2f0d]')">
                    {{ pendingPOs().length }}
                  </span> 
                }
              </button>
              <button (click)="activeTab.set('reports')" class="relative z-10 w-1/3 py-3 text-[15px] font-bold transition-colors cursor-pointer" [class.text-[#2d3e15]]="activeTab() === 'reports'" [class.text-white]="activeTab() !== 'reports'">
                Global Reports
              </button>
              <button (click)="activeTab.set('audit')" class="relative z-10 w-1/3 py-3 text-[15px] font-bold transition-colors cursor-pointer" [class.text-[#2d3e15]]="activeTab() === 'audit'" [class.text-white]="activeTab() !== 'audit'">
                System Audit Trail
              </button>
            </div>
          </div>

          <div class="p-6 md:p-8 flex-1 flex flex-col min-h-0">

            <!-- 1. PO APPROVALS -->
            @if (activeTab() === 'approvals') {
              <div class="space-y-6 animate-in fade-in h-full flex flex-col min-h-0">
                <div class="flex justify-between items-center mb-2 shrink-0">
                  <h3 class="text-2xl font-semibold">Purchase Order Authorizations</h3>
                  <button (click)="fetchPendingPOs()" class="px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold hover:bg-white/20 cursor-pointer transition-colors flex items-center gap-2 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh
                  </button>
                </div>

                <div class="max-h-[500px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 bg-[#1d2f0d] sticky-thead">
                      <tr>
                        <th class="py-4 px-6 font-medium">PO Number</th>
                        <th class="py-4 px-6 font-medium">Material / Item</th>
                        <th class="py-4 px-6 font-medium">Quantity</th>
                        <th class="py-4 px-6 font-medium">Drafted Date</th>
                        <th class="py-4 px-6 font-medium text-right">Owner Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium text-white">
                      @for (po of pendingPOs(); track po.po_number) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold text-[#EAC224]">{{ po.po_number }}</td>
                          <td class="py-4 px-6 font-bold text-white/90">{{ po.material_desc }}</td>
                          <td class="py-4 px-6 font-extrabold text-[#9be15d]">{{ po.qty }}</td>
                          <td class="py-4 px-6 text-white/70 text-xs">{{ po.exact_date || 'N/A' }}</td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <button (click)="openRejectModal(po)" [disabled]="isSubmitting()" class="px-5 py-2.5 bg-[#B4161B]/20 hover:bg-[#B4161B] text-[#ffb4b7] hover:text-white border border-[#B4161B]/50 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-sm">Reject</button>
                            <button (click)="approvePO(po.po_number)" [disabled]="isSubmitting()" class="px-6 py-2.5 bg-[#9be15d] hover:bg-[#b0f07a] text-[#1d2f0d] rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-md">✓ Approve</button>
                          </td>
                        </tr>
                      }
                      @if (pendingPOs().length === 0) {
                        <tr><td colspan="5" class="py-16 text-center text-white/50 text-base">No purchase orders currently awaiting authorization.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. GLOBAL REPORTS -->
            @if (activeTab() === 'reports') {
              <div class="animate-in fade-in flex flex-col h-full min-h-0" id="printable-report">
                
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print border-b border-white/10 pb-5 shrink-0">
                  <h3 class="text-2xl font-semibold">Module Analytics & Reports</h3>
                  <div class="flex items-center gap-3">
                    <button (click)="exportCSV()" class="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-sm">📥 Export CSV</button>
                    <button (click)="printPDF()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#1d2f0d] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors cursor-pointer flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                      Print PDF
                    </button>
                  </div>
                </div>

                <!-- DEDICATED MODULE REPORT PAGES (Sub-Navigation) -->
                <div class="flex overflow-x-auto custom-scroll gap-3 py-4 no-print shrink-0 border-b border-white/5">
                  <button (click)="loadReport('sales')" [class]="reportModule() === 'sales' ? btnActive : btnIdle">🛒 Sales & Revenue</button>
                  <button (click)="loadReport('purchasing')" [class]="reportModule() === 'purchasing' ? btnActive : btnIdle">📦 Procurement & POs</button>
                  <button (click)="loadReport('inventory')" [class]="reportModule() === 'inventory' ? btnActive : btnIdle">🏭 Warehouse Inventory</button>
                  <button (click)="loadReport('production')" [class]="reportModule() === 'production' ? btnActive : btnIdle">⚙️ Production Runs</button>
                  <button (click)="loadReport('qa')" [class]="reportModule() === 'qa' ? btnActive : btnIdle">🔬 QA Inspections</button>
                  <button (click)="loadReport('logistics')" [class]="reportModule() === 'logistics' ? btnActive : btnIdle">🚚 Logistics & Fleet</button>
                </div>

                <!-- SMART MODULE INSIGHT -->
                <div class="bg-black/30 border border-[#9be15d]/20 rounded-2xl p-4 mt-5 flex items-center gap-4 no-print shrink-0 shadow-inner">
                  <div class="w-10 h-10 rounded-full bg-[#9be15d]/20 text-[#9be15d] flex items-center justify-center text-xl shrink-0 shadow-[0_0_15px_rgba(155,225,93,0.3)]">💡</div>
                  <div>
                    <h5 class="text-[#9be15d] font-bold text-[11px] uppercase tracking-wider mb-1">Executive Insight</h5>
                    <p class="text-white/90 text-sm font-medium">{{ moduleInsight() }}</p>
                  </div>
                </div>

                <!-- DYNAMIC KPI SUMMARY CARDS -->
                @if (moduleKpis().length > 0) {
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 no-print shrink-0">
                    @for (kpi of moduleKpis(); track kpi.label) {
                      <div class="bg-black/20 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-sm">
                        <div class="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150" [style.background-color]="kpi.color"></div>
                        
                        <p class="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-80" [style.color]="kpi.color">{{ kpi.label }}</p>
                        <div class="flex items-end gap-2">
                          <p class="text-3xl font-black text-white tracking-tight">{{ kpi.value }}</p>
                          @if (kpi.subtext) {
                            <span class="text-[10px] font-bold text-white/50 mb-1.5">{{ kpi.subtext }}</span>
                          }
                        </div>
                        
                        @if (kpi.progress !== undefined) {
                          <div class="w-full bg-black/40 h-1.5 rounded-full mt-4 overflow-hidden border border-white/5">
                            <div class="h-full rounded-full" [style.width.%]="kpi.progress" [style.background-color]="kpi.color"></div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }

                <!-- CHART.JS VISUALIZATION CANVAS -->
                <div class="bg-black/20 p-5 rounded-2xl border border-white/10 mt-5 h-64 no-print shrink-0 shadow-inner relative">
                   @if (filteredReportData().length === 0) {
                      <div class="absolute inset-0 flex items-center justify-center text-white/40 font-bold z-10 text-sm">No data to chart based on filters</div>
                   }
                   <canvas id="ownerAnalyticsChart" class="w-full h-full"></canvas>
                </div>

                <!-- ADVANCED DATA FILTERS -->
                <div class="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-wrap items-end gap-4 mt-5 mb-4 no-print shrink-0 shadow-sm">
                  <div class="flex-1 min-w-[200px]">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Search Keywords</label>
                    <div class="relative w-full">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input type="text" [value]="reportSearchQuery()" (input)="reportSearchQuery.set($any($event.target).value)" placeholder="Filter any column..." class="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:border-[#EAC224] focus:bg-white/10 transition-colors font-medium outline-none shadow-inner">
                    </div>
                  </div>

                  <div class="w-full sm:w-44">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Status</label>
                    <select [ngModel]="reportStatusFilter()" (ngModelChange)="reportStatusFilter.set($event)" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d] shadow-inner">
                      <option value="all">All Statuses</option>
                      @for (s of reportStatusOptions(); track s) {
                        <option [value]="s">{{ s }}</option>
                      }
                    </select>
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Start Date</label>
                    <input type="date" [ngModel]="reportStartDate()" (ngModelChange)="reportStartDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">End Date</label>
                    <input type="date" [ngModel]="reportEndDate()" (ngModelChange)="reportEndDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <button (click)="clearReportFilters()" class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center shadow-sm">
                    Reset
                  </button>
                </div>

                <!-- DYNAMIC TABLE -->
                <div class="max-h-[500px] overflow-y-auto overflow-x-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[12px] font-bold bg-[#152309] sticky-thead uppercase tracking-wider">
                      <tr>
                        @for (header of reportHeaders(); track header) {
                          <th class="py-4 px-6 font-medium">{{ header.replace(/_/g, ' ') }}</th>
                        }
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium text-white/90">
                      @for (row of filteredReportData(); track $index) {
                        <tr class="hover:bg-white/5 transition-colors">
                          @for (col of reportHeaders(); track col) {
                            <td class="py-3 px-6">{{ row[col] || '—' }}</td>
                          }
                        </tr>
                      }
                      @if (filteredReportData().length === 0) {
                        <tr><td [colSpan]="reportHeaders().length" class="py-16 text-center text-white/40 text-base">No records found matching your filters.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 3. SYSTEM AUDIT TRAIL -->
            @if (activeTab() === 'audit') {
              <div class="space-y-6 animate-in fade-in h-full flex flex-col min-h-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 border-b border-white/10 pb-5">
                  <h3 class="text-2xl font-semibold">System Audit Trail</h3>
                </div>

                <!-- AUDIT CHART CANVAS -->
                <div class="bg-black/20 p-5 rounded-2xl border border-white/10 mt-2 h-56 no-print shrink-0 shadow-inner relative">
                   @if (filteredAuditLogs().length === 0) {
                      <div class="absolute inset-0 flex items-center justify-center text-white/40 font-bold z-10 text-sm">No logs to chart based on filters</div>
                   }
                   <canvas id="auditAnalyticsChart" class="w-full h-full"></canvas>
                </div>

                <!-- ADVANCED AUDIT FILTERS -->
                <div class="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-wrap items-end gap-4 mt-5 mb-4 shrink-0 shadow-sm">
                  <div class="flex-1 min-w-[200px]">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Search Keywords</label>
                    <div class="relative w-full">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input type="text" [value]="auditSearchQuery()" (input)="auditSearchQuery.set($any($event.target).value)" placeholder="Search users, actions..." class="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:border-[#EAC224] focus:bg-white/10 transition-colors font-medium outline-none shadow-inner">
                    </div>
                  </div>

                  <div class="w-full sm:w-40">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Module</label>
                    <select [ngModel]="auditModuleFilter()" (ngModelChange)="auditModuleFilter.set($event)" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d] shadow-inner">
                      <option value="all">All Modules</option>
                      <option value="System">System</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Sales/POS">Sales / POS</option>
                      <option value="QA">QA</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Start Date</label>
                    <input type="date" [ngModel]="auditStartDate()" (ngModelChange)="auditStartDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">End Date</label>
                    <input type="date" [ngModel]="auditEndDate()" (ngModelChange)="auditEndDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <button (click)="clearAuditFilters()" class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center shadow-sm">
                    Reset
                  </button>
                </div>

                <div class="max-h-[500px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 bg-[#1d2f0d] sticky-thead">
                      <tr>
                        <th class="py-4 px-6 font-medium">Timestamp</th>
                        <th class="py-4 px-6 font-medium">User / Actor</th>
                        <th class="py-4 px-6 font-medium">Module</th>
                        <th class="py-4 px-6 font-medium">Action</th>
                        <th class="py-4 px-6 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium text-white">
                      @for (log of filteredAuditLogs(); track log.id || $index) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 text-white/70 text-xs">{{ log.timestamp }}</td>
                          <td class="py-4 px-6 font-extrabold text-[#EAC224]">{{ log.user_name }}</td>
                          <td class="py-4 px-6 font-bold">{{ log.module_name }}</td>
                          <td class="py-4 px-6">
                            <span class="bg-white/10 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border border-white/10">{{ log.action_type }}</span>
                          </td>
                          <td class="py-4 px-6 text-white/90 whitespace-normal min-w-[300px] leading-relaxed">{{ log.details }}</td>
                        </tr>
                      }
                      @if (filteredAuditLogs().length === 0) {
                        <tr><td colspan="5" class="py-16 text-center text-white/50 text-base">No audit logs found matching your filters.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  `
})
export class OwnerDashboardComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Core navigation
  activeTab = signal<'approvals' | 'reports' | 'audit'>('approvals');
  
  // Reports Module Navigation & Raw Data
  reportModule = signal<'sales' | 'purchasing' | 'inventory' | 'production' | 'qa' | 'logistics'>('sales');
  reportHeaders = signal<string[]>([]);
  reportData = signal<any[]>([]);

  // Filtering Signals for Reports
  reportSearchQuery = signal<string>('');
  reportStatusFilter = signal<string>('all');
  reportStartDate = signal<string>('');
  reportEndDate = signal<string>('');

  // Filtering Signals for Audit Logs
  auditLogs = signal<any[]>([]);
  auditSearchQuery = signal<string>('');
  auditModuleFilter = signal<string>('all');
  auditStartDate = signal<string>('');
  auditEndDate = signal<string>('');

  // Chart Instance
  chartInstance: any = null;

  constructor() {
    // Automatically redraw chart when filtered data changes or tab changes
    effect(() => {
      const tab = this.activeTab();
      if (tab === 'reports') {
        const _ = this.filteredReportData(); // establish dependency
        setTimeout(() => this.drawChart(), 50);
      } else if (tab === 'audit') {
        const _ = this.filteredAuditLogs(); // establish dependency
        setTimeout(() => this.drawChart(), 50);
      }
    });
  }

  ngOnInit() {
    this.checkAuth();
    this.fetchPendingPOs();
    this.fetchAuditLogs();
    this.loadReport('sales');
  }

  ngAfterViewInit() {
    this.loadChartJs();
  }

  loadChartJs() {
    if (typeof Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.drawChart();
      document.head.appendChild(script);
    }
  }

  drawChart() {
    if (typeof Chart === 'undefined') return;
    const tab = this.activeTab();

    if (tab === 'reports') {
      const canvas = document.getElementById('ownerAnalyticsChart') as HTMLCanvasElement;
      if (!canvas) return;
      if (this.chartInstance) this.chartInstance.destroy();

      const mod = this.reportModule();
      const data = this.filteredReportData();
      if (!data || data.length === 0) return;

      let labels: string[] = [];
      let datasetData: number[] = [];
      let labelName = 'Count';
      let type = 'bar';

      if (mod === 'inventory') {
        const sorted = [...data].sort((a,b) => parseFloat(b.qty) - parseFloat(a.qty)).slice(0, 10);
        labels = sorted.map(i => i.name || i.sku).map(s => s.length > 20 ? s.substring(0, 20) + '...' : s);
        datasetData = sorted.map(i => parseFloat(i.qty));
        labelName = 'Stock Quantity';
      } else if (mod === 'sales') {
        const daily: any = {};
        data.forEach(curr => {
          const dateStr = curr.generated_at || curr.created_at || '';
          const d = dateStr.split(' ')[0] || 'Unknown';
          if (d !== 'Unknown') { daily[d] = (daily[d] || 0) + parseFloat(curr.amount || 0); }
        });
        labels = Object.keys(daily).sort();
        datasetData = labels.map(l => daily[l]);
        labelName = 'Daily Revenue (₱)';
        type = 'line';
      } else {
        const counts = data.reduce((acc, curr) => {
          const s = curr.status || curr.route_status || curr.order_status || 'UNKNOWN';
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {} as any);
        labels = Object.keys(counts);
        datasetData = Object.values(counts);
        labelName = 'Record Count';
        type = 'bar';
      }

      const colors = ['#EAC224', '#9be15d', '#22d3ee', '#ffb4b7', '#a855f7', '#ff9d1c'];

      this.chartInstance = new Chart(canvas, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: labelName,
            data: datasetData,
            backgroundColor: type === 'line' ? 'rgba(155, 225, 93, 0.15)' : colors,
            borderColor: type === 'line' ? '#9be15d' : '#1d2f0d',
            borderWidth: type === 'line' ? 3 : 2,
            fill: type === 'line',
            tension: 0.4,
            pointBackgroundColor: '#EAC224',
            borderRadius: type === 'bar' ? 6 : 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#fff', font: { family: 'Fredoka', size: 13, weight: 'bold' } } },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Fredoka', size: 13 }, bodyFont: { family: 'Fredoka', size: 14, weight: 'bold' }, padding: 12, cornerRadius: 8 }
          },
          scales: (type === 'bar' || type === 'line') ? {
            y: { beginAtZero: true, ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold' } }, grid: { display: false } }
          } : undefined
        }
      });
    } else if (tab === 'audit') {
      const canvas = document.getElementById('auditAnalyticsChart') as HTMLCanvasElement;
      if (!canvas) return;
      if (this.chartInstance) this.chartInstance.destroy();

      const data = this.filteredAuditLogs();
      if (!data || data.length === 0) return;

      const counts = data.reduce((acc, curr) => {
        const m = curr.module_name || 'System';
        acc[m] = (acc[m] || 0) + 1;
        return acc;
      }, {} as any);

      this.chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: Object.keys(counts),
          datasets: [{
            label: 'Actions per Module',
            data: Object.values(counts),
            backgroundColor: ['#EAC224', '#9be15d', '#22d3ee', '#ffb4b7', '#a855f7'],
            borderColor: '#1d2f0d',
            borderWidth: 2,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Fredoka', size: 13 }, bodyFont: { family: 'Fredoka', size: 14, weight: 'bold' }, padding: 12, cornerRadius: 8 }
          },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold' } }, grid: { display: false } }
          }
        }
      });
    }
  }

  // Computed options for the Status dropdown based on active module
  reportStatusOptions = computed(() => {
    const mod = this.reportModule();
    if (mod === 'sales') return ['PAID', 'PENDING_PAYMENT'];
    if (mod === 'purchasing') return ['Pending Approval', 'In transit', 'Received', 'Rejected'];
    if (mod === 'inventory') return ['AVAILABLE', 'LOW STOCK'];
    if (mod === 'production') return ['SCHEDULED', 'IN PROGRESS', 'COMPLETED', 'CLEARED', 'QUARANTINED'];
    if (mod === 'qa') return ['PENDING CLEARANCE', 'CLEARED', 'QUARANTINED'];
    if (mod === 'logistics') return ['AWAITING DISPATCH', 'DISPATCHED', 'IN TRANSIT', 'DELIVERED'];
    return [];
  });

  filteredReportData = computed(() => {
    const data = this.reportData();
    const q = this.reportSearchQuery().toLowerCase();
    const stat = this.reportStatusFilter();
    const start = this.reportStartDate() ? new Date(this.reportStartDate()) : null;
    const end = this.reportEndDate() ? new Date(this.reportEndDate()) : null;
    if (end) end.setHours(23, 59, 59, 999); 

    return data.filter(row => {
      const matchesSearch = !q || Object.values(row).some(v => String(v).toLowerCase().includes(q));
      let matchesStatus = true;
      if (stat !== 'all') {
        const rowStatus = String(row.status || row.route_status || row.order_status || '').toUpperCase();
        if (this.reportModule() === 'inventory') {
            const isLow = parseFloat(row.qty) <= parseFloat(row.min_reorder_level);
            matchesStatus = stat === 'LOW STOCK' ? isLow : !isLow;
        } else {
            matchesStatus = rowStatus.includes(stat.toUpperCase());
        }
      }
      let matchesDate = true;
      if (start || end) {
         const dateFieldStr = row.created_at || row.generated_at || row.started_at || row.exact_date || row.timestamp || row.delivery_date;
         if (dateFieldStr) {
           const rowDate = new Date(dateFieldStr);
           if (!isNaN(rowDate.getTime())) {
             if (start && rowDate < start) matchesDate = false;
             if (end && rowDate > end) matchesDate = false;
           }
         } else {
           matchesDate = false;
         }
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  filteredAuditLogs = computed(() => {
    const data = this.auditLogs();
    const q = this.auditSearchQuery().toLowerCase();
    const mod = this.auditModuleFilter();
    const start = this.auditStartDate() ? new Date(this.auditStartDate()) : null;
    const end = this.auditEndDate() ? new Date(this.auditEndDate()) : null;
    if (end) end.setHours(23, 59, 59, 999);

    return data.filter(log => {
      const matchesSearch = !q || Object.values(log).some(val => String(val).toLowerCase().includes(q));
      const matchesMod = mod === 'all' || log.module_name === mod;
      let matchesDate = true;
      if (start || end) {
        const logDate = new Date(log.timestamp);
        if (!isNaN(logDate.getTime())) {
          if (start && logDate < start) matchesDate = false;
          if (end && logDate > end) matchesDate = false;
        }
      }
      return matchesSearch && matchesMod && matchesDate;
    });
  });

  moduleInsight = computed(() => {
    const mod = this.reportModule();
    const data = this.reportData();
    if (!data || data.length === 0) return 'No data available to generate insights.';

    if (mod === 'sales') {
      const totalRev = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return `You have processed ₱${totalRev.toLocaleString('en-US', {minimumFractionDigits: 2})} in lifetime verified revenue across ${data.length} invoices.`;
    }
    if (mod === 'purchasing') {
      const pending = data.filter(i => i.status === 'Pending Approval').length;
      return pending > 0 
        ? `There are ${pending} purchase orders waiting for your authorization in the approvals tab.` 
        : 'All purchase orders have been processed. No pending approvals.';
    }
    if (mod === 'inventory') {
      const low = data.filter(i => parseFloat(i.qty) <= parseFloat(i.min_reorder_level)).length;
      return low > 0 
        ? `Attention: ${low} inventory items are currently at or below their minimum reorder thresholds.` 
        : 'Inventory levels are healthy across all tracked materials and finished goods.';
    }
    if (mod === 'production') {
      const active = data.filter(i => i.status === 'IN PROGRESS').length;
      return active > 0 
        ? `${active} production runs are currently active on the manufacturing floor.` 
        : 'No production runs are currently active.';
    }
    if (mod === 'qa') {
      const quarantined = data.filter(i => i.status === 'QUARANTINED').length;
      return quarantined > 0 
        ? `${quarantined} batches are currently quarantined and require disposition review.` 
        : 'All inspected batches have been successfully cleared to the warehouse.';
    }
    if (mod === 'logistics') {
      const transit = data.filter(i => i.route_status === 'IN TRANSIT').length;
      return transit > 0 
        ? `${transit} drivers are currently on the road delivering orders.` 
        : 'No deliveries are currently in transit.';
    }
    return '';
  });

  moduleKpis = computed<any[]>(() => {
    const mod = this.reportModule();
    const data = this.filteredReportData();
    if (!data || data.length === 0) return [];
    
    if (mod === 'sales') {
      const rev = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const paid = data.filter(i => i.status === 'PAID').length;
      const pending = data.length - paid;
      const paidPercent = data.length ? Math.round((paid / data.length) * 100) : 0;
      return [
        { label: 'Revenue (Filtered)', value: '₱' + rev.toLocaleString('en-US', {minimumFractionDigits: 2}), color: '#9be15d', subtext: 'In Range' },
        { label: 'Total Invoices', value: data.length, color: '#EAC224' },
        { label: 'Paid Transactions', value: paid, color: '#22d3ee', progress: paidPercent },
        { label: 'Pending / Unpaid', value: pending, color: '#ffb4b7', progress: 100 - paidPercent }
      ];
    }
    if (mod === 'purchasing') {
      const pending = data.filter(i => i.status === 'Pending Approval').length;
      const received = data.filter(i => i.status === 'Received').length;
      const rejected = data.filter(i => i.status === 'Rejected').length;
      const recvPercent = data.length ? Math.round((received / data.length) * 100) : 0;
      return [
        { label: 'Total POs', value: data.length, color: '#22d3ee' },
        { label: 'Pending Approvals', value: pending, color: '#EAC224' },
        { label: 'Received Orders', value: received, color: '#9be15d', progress: recvPercent },
        { label: 'Rejected', value: rejected, color: '#B4161B' }
      ];
    }
    if (mod === 'inventory') {
      const totalQty = data.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);
      const lowStock = data.filter(i => parseFloat(i.qty) <= parseFloat(i.min_reorder_level)).length;
      const healthy = data.length - lowStock;
      const healthPercent = data.length ? Math.round((healthy / data.length) * 100) : 0;
      return [
        { label: 'Tracked SKUs', value: data.length, color: '#22d3ee' },
        { label: 'Total Volume', value: totalQty.toLocaleString('en-US'), color: '#9be15d', subtext: 'Units/Weight' },
        { label: 'Stock Health', value: healthPercent + '%', color: '#EAC224', progress: healthPercent },
        { label: 'Low Stock Alerts', value: lowStock, color: '#B4161B' }
      ];
    }
    if (mod === 'production') {
      const completed = data.filter(i => i.status === 'COMPLETED' || i.status === 'CLEARED').length;
      const planned = data.reduce((sum, item) => sum + (parseFloat(item.planned_units) || 0), 0);
      const active = data.filter(i => i.status === 'IN PROGRESS').length;
      const compPercent = data.length ? Math.round((completed / data.length) * 100) : 0;
      return [
        { label: 'Total Runs', value: data.length, color: '#EAC224' },
        { label: 'Completed Runs', value: completed, color: '#9be15d', progress: compPercent },
        { label: 'Active on Floor', value: active, color: '#22d3ee' },
        { label: 'Units Planned', value: planned.toLocaleString('en-US'), color: '#a855f7' }
      ];
    }
    if (mod === 'qa') {
      const cleared = data.filter(i => i.status === 'CLEARED').length;
      const quarantined = data.filter(i => i.status === 'QUARANTINED').length;
      const clearPercent = data.length ? Math.round((cleared / data.length) * 100) : 0;
      return [
        { label: 'Total Inspections', value: data.length, color: '#EAC224' },
        { label: 'Cleared Batches', value: cleared, color: '#9be15d', progress: clearPercent },
        { label: 'Pass Rate', value: clearPercent + '%', color: '#22d3ee' },
        { label: 'Quarantined', value: quarantined, color: '#B4161B' }
      ];
    }
    if (mod === 'logistics') {
      const delivered = data.filter(i => i.route_status === 'DELIVERED').length;
      const transit = data.filter(i => i.route_status === 'IN TRANSIT').length;
      const dispatch = data.filter(i => i.route_status === 'AWAITING DISPATCH').length;
      const delPercent = data.length ? Math.round((delivered / data.length) * 100) : 0;
      return [
        { label: 'Total Routes', value: data.length, color: '#22d3ee' },
        { label: 'Delivered', value: delivered, color: '#9be15d', progress: delPercent },
        { label: 'In Transit', value: transit, color: '#EAC224' },
        { label: 'Queued', value: dispatch, color: '#ff9d1c' }
      ];
    }
    return [];
  });

  pendingPOs = signal<any[]>([]);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  rejectModalData = signal<any>(null);
  rejectReason = '';
  isSubmitting = signal<boolean>(false);
  logoutModalShow = signal<boolean>(false);

  btnActive = 'px-6 py-3 rounded-full font-bold text-sm bg-[#EAC224] text-[#1d2f0d] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)] transition-all whitespace-nowrap cursor-pointer shrink-0 border border-[#EAC224]';
  btnIdle = 'px-6 py-3 rounded-full font-bold text-sm bg-white/5 text-white/80 hover:bg-white/15 hover:text-white border border-white/15 transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-sm';

  userRole = '';
  userName = '';

  checkAuth() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.userRole = user.role;
          this.userName = user.name || user.full_name || 'Owner';
          if (this.userRole !== 'OWNER') {
            alert('Unauthorized Access. This dashboard is restricted to the Company Owner.');
            this.router.navigate(['/login']);
          }
        } catch (e) {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  confirmLogout() { this.logoutModalShow.set(true); }

  executeLogout() {
    this.logoutModalShow.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 4000);
  }

  getTabIndex(): number {
    return ['approvals', 'reports', 'audit'].indexOf(this.activeTab());
  }

  getReportTitle(): string {
    const titles: Record<string, string> = {
      'sales': 'Sales & Orders',
      'purchasing': 'Procurement & Purchase Orders',
      'inventory': 'Warehouse Inventory',
      'production': 'Production Runs',
      'qa': 'QA Inspections',
      'logistics': 'Logistics & Fleet Routes'
    };
    return titles[this.reportModule()];
  }

  today(): string {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  fetchPendingPOs() {
    this.http.get<any[]>('http://localhost:3000/api/purchase-orders').subscribe({
      next: (data) => {
        this.pendingPOs.set((data || []).filter(po => po.status === 'Pending Approval'));
      }
    });
  }

  fetchAuditLogs() {
    this.http.get<any[]>('http://localhost:3000/api/audit-logs').subscribe({
      next: (data) => {
        this.auditLogs.set(data || []);
      }
    });
  }

  approvePO(poNumber: string) {
    this.isSubmitting.set(true);
    this.http.put(`http://localhost:3000/api/purchase-orders/${poNumber}/approve`, { userName: this.userName, role: this.userRole }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast(`PO ${poNumber} authorized. Procurement notified.`, 'success');
          this.fetchPendingPOs();
        } else {
          this.showToast(res.message || 'Authorization failed.', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast(err.error?.message || 'Server error.', 'error');
      }
    });
  }

  openRejectModal(po: any) {
    this.rejectReason = '';
    this.rejectModalData.set(po);
  }

  submitRejection() {
    if (!this.rejectReason.trim()) return;
    this.isSubmitting.set(true);
    const poNumber = this.rejectModalData().po_number;
    this.http.put(`http://localhost:3000/api/purchase-orders/${poNumber}/reject`, { userName: this.userName, role: this.userRole, reason: this.rejectReason }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast(`PO ${poNumber} rejected securely.`, 'success');
          this.rejectModalData.set(null);
          this.fetchPendingPOs();
        } else {
          this.showToast(res.message || 'Rejection failed.', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast(err.error?.message || 'Server error.', 'error');
      }
    });
  }

  clearReportFilters() {
    this.reportSearchQuery.set('');
    this.reportStatusFilter.set('all');
    this.reportStartDate.set('');
    this.reportEndDate.set('');
  }

  clearAuditFilters() {
    this.auditSearchQuery.set('');
    this.auditModuleFilter.set('all');
    this.auditStartDate.set('');
    this.auditEndDate.set('');
  }

  loadReport(module: 'sales' | 'purchasing' | 'inventory' | 'production' | 'qa' | 'logistics') {
    this.reportModule.set(module);
    this.clearReportFilters(); 
    let endpoint = '';
    switch(module) {
      case 'sales': endpoint = '/api/sales-invoices'; break;
      case 'purchasing': endpoint = '/api/purchase-orders'; break;
      case 'inventory': endpoint = '/api/warehouse-stock'; break;
      case 'production': endpoint = '/api/production-runs'; break;
      case 'qa': endpoint = '/api/qa-inspections'; break;
      case 'logistics': endpoint = '/api/delivery-routes'; break;
    }
    this.http.get<any[]>(`http://localhost:3000${endpoint}`).subscribe({
      next: (data) => {
        const arr = data || [];
        if (arr.length > 0) {
          const excludedKeys = ['photo_url', 'signature_url', 'image_url', 'verification_pin'];
          const rawHeaders = Object.keys(arr[0]).filter(k => !excludedKeys.includes(k));
          this.reportHeaders.set(rawHeaders);
          this.reportData.set(arr.map(row => {
            const cleanRow: any = {};
            rawHeaders.forEach(h => cleanRow[h] = row[h]);
            return cleanRow;
          }));
        } else {
          this.reportHeaders.set([]);
          this.reportData.set([]);
        }
      }
    });
  }

  exportCSV() {
    const data = this.filteredReportData(); 
    if (!data || data.length === 0) return this.showToast('No data to export based on current filters.', 'error');
    const headers = this.reportHeaders();
    const csvContent = [
      headers.map(h => h.replace(/_/g, ' ')).join(','),
      ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `GalaxyCandies_${this.reportModule()}_Report_${this.today()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('CSV downloaded successfully.', 'success');
  }

  printPDF() { window.print(); }
}