import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <style>
      /* IMPORTING ONLY ONE FONT: Fredoka */
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      :host { 
        display: block; 
        min-height: 100vh; 
        background: #dfe9c6; 
        font-family: 'Fredoka', sans-serif;
        padding: 1.5rem 2rem 4.5rem; 
        position: relative; 
        overflow-x: clip; 
      }
      
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel { background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.12); }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }
      
      /* FIXED SCROLLBARS: Forced thin profile without native buttons */
      .custom-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: rgba(234, 194, 36, 0.6) rgba(0, 0, 0, 0.2) !important;
        overflow-y: auto;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2) !important;
        border-radius: 10px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-track:hover {
        background: rgba(0, 0, 0, 0.2) !important;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(234, 194, 36, 0.6) !important;
        border-radius: 10px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(234, 194, 36, 0.9) !important;
      }
      .custom-scrollbar::-webkit-scrollbar-button {
        display: none !important;
        height: 0 !important;
        width: 0 !important;
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent !important;
      }

      /* Flush sticky table header with subtle bottom glow */
      .sticky-thead {
        position: sticky;
        top: 0;
        z-index: 20;
        background: #18280b;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.12);
      }

      @keyframes bob-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
      @keyframes bob-b { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
      @keyframes rocket-fly { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(8px,-16px) rotate(2deg); } }
      @keyframes flame { from { transform: scale(1,1); } to { transform: scale(.88,1.28); } }
      @keyframes spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0); opacity: 0; } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
      @keyframes slide-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .a-toast { animation: slide-up 0.4s ease-out forwards; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <!-- FLOATING TOAST NOTIFICATION -->
    @if (toast().show) {
      <div class="fixed bottom-10 right-10 z-50 a-toast">
        <div [class]="'px-6 py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border backdrop-blur-md font-bold flex items-center gap-3 ' + (toast().type === 'success' ? 'bg-[#1d2f0d]/95 border-[#9be15d]/60 text-[#b7f27c]' : 'bg-[#2a0f12]/95 border-[#B4161B]/60 text-[#ff7b7b]')">
          <span class="text-2xl">{{ toast().type === 'success' ? '✅' : '⚠️' }}</span>
          <span class="tracking-wide text-white">{{ toast().message }}</span>
        </div>
      </div>
    }

    <!-- CONFIRMATION MODAL -->
    @if (confirmModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
          <div class="text-4xl">{{ confirmModal.type === 'approve' ? '✅' : (confirmModal.type === 'receive' ? '📦' : '⚠️') }}</div>
          <h3 class="text-2xl font-bold text-white">Confirm Action</h3>
          <p class="text-white/85 text-base">{{ confirmModal.message }}</p>
          <div class="flex justify-center gap-4 pt-4">
            <button (click)="confirmModal.show = false" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
            <button (click)="executeConfirmedAction()" class="px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-lg " [class]="confirmModal.type === 'approve' || confirmModal.type === 'receive' ? 'bg-[#9be15d] text-[#1d2f0d] hover:bg-[#b0f07a]' : 'bg-[#B4161B] text-white hover:bg-[#8f1115]'">
              {{ confirmModal.type === 'approve' ? 'Yes, Approve' : (confirmModal.type === 'reject' ? 'Yes, Reject' : (confirmModal.type === 'receive' ? 'Yes, Scan Arrival' : 'Yes, Delete')) }}
            </button>
          </div>
        </div>
      </div>
    }

    <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">
      <div class="relative z-10 mb-8">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-wide">Procurement management</h2>
      </div>

      <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">
        <div class="border-b border-white/10 px-8 pt-6 pb-6 overflow-x-auto custom-scrollbar">
          
          <!-- SMOOTH ANIMATED TABS NAV -->
          <div class="relative flex w-full min-w-[700px] max-w-[850px] bg-black/25 p-1.5 rounded-full border border-white/10">
            <!-- Sliding Indicator (adjusted for 4 tabs) -->
            <div class="absolute top-1.5 bottom-1.5 w-[calc(25%-2.4px)] bg-[#EAC224] rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]"
                 [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'"></div>
            
            <button (click)="subTab.set('p-dash')" class="relative z-10 w-1/4 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'p-dash'" [class.text-white]="subTab() !== 'p-dash'">PO Dashboard</button>
            <button (click)="subTab.set('p-po')" class="relative z-10 w-1/4 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'p-po'" [class.text-white]="subTab() !== 'p-po'">Create PO</button>
            <button (click)="subTab.set('p-repeat')" class="relative z-10 w-1/4 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'p-repeat'" [class.text-white]="subTab() !== 'p-repeat'">Repeating Orders</button>
            <button (click)="subTab.set('p-dir')" class="relative z-10 w-1/4 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'p-dir'" [class.text-white]="subTab() !== 'p-dir'">Supplier Directory</button>
          </div>

        </div>

        <div class="p-6 md:p-8">

          <!-- PO DASHBOARD -->
          @if (subTab() === 'p-dash') {
            <!-- Dashboard Content Unchanged -->
            <h3 class="text-2xl font-semibold mb-6 text-white">Procurement & Receipts Overview</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224] flex items-center justify-between shadow-sm">
                <div>
                  <span class="text-xs font-bold text-[#EAC224] block mb-1 uppercase tracking-wider">Awaiting Owner Approval</span>
                  <span class="text-4xl font-extrabold text-[#EAC224]">{{ activePos().length }}</span>
                </div>
                <div class="text-4xl">📝</div>
              </div>
              <div (click)="scrollToSection('expected-deliveries')" class="cursor-pointer hover:-translate-y-1 transition-all bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee] flex items-center justify-between shadow-sm hover:shadow-lg">
                <div>
                  <span class="text-xs font-bold text-[#7fe7f7] block mb-1 uppercase tracking-wider">Expected Deliveries</span>
                  <span class="text-4xl font-extrabold text-[#7fe7f7]">{{ pendingReceipts().length }}</span>
                </div>
                <div class="text-4xl">🚚</div>
              </div>
              <div (click)="subTab.set('p-dir')" class="cursor-pointer hover:-translate-y-1 transition-all bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d] flex items-center justify-between shadow-sm hover:shadow-lg">
                <div>
                  <span class="text-xs font-bold text-[#b7f27c] block mb-1 uppercase tracking-wider">Active Suppliers</span>
                  <span class="text-4xl font-extrabold text-[#9be15d]">{{ suppliers().length }}</span>
                </div>
                <div class="text-4xl">🤝</div>
              </div>
              <div (click)="scrollToSection('grn-history')" class="cursor-pointer hover:-translate-y-1 transition-all bg-white/5 p-5 rounded-2xl border border-white/10 border-b-4 border-b-white/30 flex items-center justify-between shadow-sm hover:shadow-lg">
                <div>
                  <span class="text-xs font-bold text-white/80 block mb-1 uppercase tracking-wider">GRNs Processed</span>
                  <span class="text-4xl font-extrabold text-white">{{ grnLogs().length }}</span>
                </div>
                <div class="text-4xl">📦</div>
              </div>
            </div>

            <!-- COMPILATION 1: EXPECTED DELIVERIES -->
            <div id="expected-deliveries" class="mb-10">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 class="text-xl font-bold text-white">Expected deliveries &amp; material receipt</h3>
                <button (click)="subTab.set('p-po')" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg> New purchase order
                </button>
              </div>

              <div class="max-h-[400px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="text-white text-[14px] font-bold sticky-thead">
                    <tr>
                      <th class="py-4 px-5 whitespace-nowrap">PO number</th>
                      <th class="py-4 px-5 whitespace-nowrap">Supplier</th>
                      <th class="py-4 px-5 min-w-[220px]">Expected materials</th>
                      <th class="py-4 px-5 whitespace-nowrap">Quantity</th>
                      <th class="py-4 px-5 whitespace-nowrap">Status</th>
                      <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 text-white font-medium">
                    @for (po of pendingReceipts(); track po.no) {
                      <tr class="hover:bg-white/10 transition-colors">
                        <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#EAC224]">{{ po.no }}</td>
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span class="font-bold block">{{ getSupplierName(po.supplier) }}</span>
                          <span class="text-[11px] text-white/50 font-semibold">{{ po.supplier }}</span>
                        </td>
                        <td class="py-4 px-5 leading-relaxed">{{ po.material }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-bold">{{ formatQtyLabel(po.qty) }}</td>
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span class="px-3 py-1.5 rounded-full text-xs font-bold border bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35">{{ po.status }}</span>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap text-right">
                          <button (click)="promptAction('receive', po.no)" [disabled]="isSubmitting()" class="bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#2d3e15] px-4 py-2 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                            Scan arrival
                          </button>
                        </td>
                      </tr>
                    }
                    @if (pendingReceipts().length === 0) {
                      <tr><td colspan="6" class="py-10 text-center text-white/60">No pending deliveries at this time.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- COMPILATION 2: INCOMING GOODS LOG -->
            <div id="grn-history" class="mb-10">
              <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
                <div>
                  <h3 class="text-xl font-bold text-white">Incoming goods log (GRN history)</h3>
                  <div class="flex flex-wrap items-center gap-2 mt-2">
                    <button (click)="selectedGrnStatusFilter.set('all')" [class]="'text-xs px-3 py-1 rounded-full font-bold border transition-colors cursor-pointer ' + (selectedGrnStatusFilter() === 'all' ? 'bg-white/20 text-white border-white/40' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10')">
                      Total: {{ grnSummary().total }}
                    </button>
                    <button (click)="selectedGrnStatusFilter.set('Cleared to Warehouse')" [class]="'text-xs px-3 py-1 rounded-full font-bold border transition-colors cursor-pointer ' + (selectedGrnStatusFilter() === 'Cleared to Warehouse' ? 'bg-[#9be15d]/30 text-[#b7f27c] border-[#9be15d]/60' : 'bg-[#9be15d]/10 text-[#b7f27c]/80 border-[#9be15d]/20 hover:bg-[#9be15d]/20')">
                      Cleared: {{ grnSummary().cleared }}
                    </button>
                    <button (click)="selectedGrnStatusFilter.set('Routed to QA')" [class]="'text-xs px-3 py-1 rounded-full font-bold border transition-colors cursor-pointer ' + (selectedGrnStatusFilter() === 'Routed to QA' ? 'bg-[#22d3ee]/30 text-[#7fe7f7] border-[#22d3ee]/60' : 'bg-[#22d3ee]/10 text-[#7fe7f7]/80 border-[#22d3ee]/20 hover:bg-[#22d3ee]/20')">
                      In QA: {{ grnSummary().inQa }}
                    </button>
                    @if (grnSummary().issues > 0) {
                      <span class="text-xs px-3 py-1 rounded-full font-bold border bg-[#ff9d1c]/15 text-[#ffbe66] border-[#ff9d1c]/30">
                        Exceptions / Returns: {{ grnSummary().issues }}
                      </span>
                    }
                  </div>
                </div>
                
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex items-center gap-2">
                    <label class="text-xs font-bold text-white/80 uppercase tracking-wider">Supplier:</label>
                    <select [ngModel]="selectedGrnSupplierFilter()" (ngModelChange)="selectedGrnSupplierFilter.set($event)" class="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                      <option value="">All Suppliers</option>
                      @for (s of suppliers(); track s.id) {
                        <option [value]="s.name">{{ s.name }}</option>
                      }
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-xs font-bold text-white/80 uppercase tracking-wider">Routing Status:</label>
                    <select [ngModel]="selectedGrnStatusFilter()" (ngModelChange)="selectedGrnStatusFilter.set($event)" class="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                      <option value="all">All Statuses</option>
                      <option value="Routed to QA">Routed to QA</option>
                      <option value="Cleared to Warehouse">Cleared to Warehouse</option>
                      <option value="Quarantined (Hold)">Quarantined (Hold)</option>
                      <option value="Returned to Vendor">Returned to Vendor</option>
                      <option value="Scrapped">Scrapped</option>
                      <option value="Reworked">Reworked</option>
                    </select>
                  </div>
                  @if (selectedGrnSupplierFilter() || selectedGrnStatusFilter() !== 'all') {
                    <button (click)="selectedGrnSupplierFilter.set(''); selectedGrnStatusFilter.set('all')" class="text-xs font-bold text-[#EAC224] hover:underline px-2 py-1 cursor-pointer">
                      Reset
                    </button>
                  }
                </div>
              </div>

              <div class="max-h-[420px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="text-white text-[14px] font-bold sticky-thead">
                    <tr>
                      <th class="py-4 px-5 whitespace-nowrap">Timestamp</th>
                      <th class="py-4 px-5 whitespace-nowrap">GRN number</th>
                      <th class="py-4 px-5 whitespace-nowrap">PO reference</th>
                      <th class="py-4 px-5 whitespace-nowrap">Supplier</th>
                      <th class="py-4 px-5 min-w-[240px]">Materials received</th>
                      <th class="py-4 px-5 whitespace-nowrap text-right">Routing status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 text-white font-medium">
                    @for (grn of filteredGrns(); track grn.grn_number) {
                      <tr class="hover:bg-white/10 transition-colors">
                        <td class="py-4 px-5 whitespace-nowrap text-white/75">{{ grn.timestamp }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#9be15d]">{{ grn.grn_number }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-semibold text-white/90">{{ grn.po_number }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-bold">{{ grn.supplier_name }}</td>
                        <td class="py-4 px-5 leading-relaxed">{{ formatMaterialReceipt(grn.material_desc, grn.qty) }}</td>
                        <td class="py-4 px-5 whitespace-nowrap text-right">
                          <span [class]="'inline-block border px-3.5 py-1.5 rounded-full text-xs font-bold ' + getGrnChipClass(grn.routing_status)">
                            {{ grn.routing_status }}
                          </span>
                        </td>
                      </tr>
                    }
                    @if (filteredGrns().length === 0) {
                      <tr><td colspan="6" class="py-12 text-center text-white/60">No receipt logs match this filter.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- COMPILATION 3: RECENT PURCHASE ORDERS TABLE -->
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-white">Pending requests &amp; drafted orders</h3>
            </div>
            <div class="max-h-[400px] overflow-y-auto overflow-x-auto rounded-2xl border border-white/10 bg-black/25 mb-10 custom-scrollbar relative">
              <table class="w-full text-left text-sm border-collapse">
                <thead class="text-white text-[14px] font-bold sticky-thead">
                  <tr>
                    <th class="py-4 px-5 whitespace-nowrap">PO number</th>
                    <th class="py-4 px-5 whitespace-nowrap">Supplier</th>
                    <th class="py-4 px-5 min-w-[220px]">Material</th>
                    <th class="py-4 px-5 whitespace-nowrap">Qty</th>
                    <th class="py-4 px-5 whitespace-nowrap text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10 text-white font-medium">
                  @for (po of activePos(); track po.no) {
                    <tr class="hover:bg-white/10 transition-colors">
                      <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#EAC224]">{{ po.no }}</td>
                      <td class="py-4 px-5 whitespace-nowrap">
                        <span class="font-bold text-white block">{{ getSupplierName(po.supplier) }}</span>
                        <span class="text-[11px] text-white/50 font-semibold">{{ po.supplier }}</span>
                      </td>
                      <td class="py-4 px-5 leading-relaxed">{{ po.material }}</td>
                      <td class="py-4 px-5 whitespace-nowrap font-extrabold">{{ formatQtyLabel(po.qty) }}</td>
                      <td class="py-4 px-5 whitespace-nowrap text-right">
                        <span [class]="'inline-block px-3.5 py-1.5 rounded-full text-xs font-bold border ' + po.chip">{{ po.status }}</span>
                      </td>
                    </tr>
                  }
                  @if (activePos().length === 0) {
                    <tr><td colspan="5" class="py-10 text-center text-white/60">No pending purchase orders found.</td></tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- MOST ORDERED SUPPLIER SHOWCASE -->
            @if (topSupplierStats(); as top) {
              <div class="mt-8 mb-6 bg-gradient-to-br from-black/30 via-white/[0.04] to-black/20 p-6 md:p-8 rounded-3xl border border-[#EAC224]/30 shadow-xl relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-44 h-44 bg-[#EAC224]/10 blur-[60px] rounded-full pointer-events-none"></div>

                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-white/10 pb-5">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-[#EAC224]/20 border border-[#EAC224]/40 flex items-center justify-center text-3xl shadow-inner">🏆</div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs uppercase tracking-widest text-[#EAC224] bg-[#EAC224]/15 px-3 py-0.5 rounded-full border border-[#EAC224]/30 font-bold">Top Strategic Partner</span>
                        <span class="text-xs text-white/70 font-bold">{{ top.supplierId }}</span>
                      </div>
                      <h4 class="text-2xl md:text-3xl font-bold text-white mt-1">{{ top.name }}</h4>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div class="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span class="text-xs text-white/70 block font-bold uppercase tracking-wider mb-1">Total POs Issued</span>
                    <span class="text-3xl font-extrabold text-[#EAC224]">{{ top.totalOrders }}</span>
                    <span class="text-xs text-white/80 block mt-1 font-bold">{{ top.poShare }}% of all requisitions</span>
                  </div>
                  <div class="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span class="text-xs text-white/70 block font-bold uppercase tracking-wider mb-1">Total Units Ordered</span>
                    <span class="text-3xl font-extrabold text-white">{{ top.totalUnits | number }}</span>
                    <span class="text-xs text-white/80 block mt-1 font-bold">Across all orders</span>
                  </div>
                  <div class="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span class="text-xs text-white/70 block font-bold uppercase tracking-wider mb-1">Receipt Clearance</span>
                    <span class="text-3xl font-extrabold text-[#9be15d]">{{ top.fulfilledOrders }} / {{ top.totalOrders }}</span>
                    <span class="text-xs text-[#9be15d] block mt-1 font-bold">{{ top.fulfillmentRate }}% Received</span>
                  </div>
                  <div class="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span class="text-xs text-white/70 block font-bold uppercase tracking-wider mb-1">Catalog Breadth</span>
                    <span class="text-3xl font-extrabold text-[#7fe7f7]">{{ top.catalogCount }}</span>
                    <span class="text-xs text-[#7fe7f7] block mt-1 font-bold">Distinct materials</span>
                  </div>
                </div>

                <div>
                  <h5 class="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span>📦</span> Most Requested Materials from this Supplier
                  </h5>
                  <div class="bg-black/30 rounded-2xl border border-white/10 overflow-hidden custom-scrollbar overflow-x-auto">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="bg-white/5 text-white border-b border-white/10 font-bold">
                        <tr>
                          <th class="py-3 px-5 whitespace-nowrap">Material Description</th>
                          <th class="py-3 px-5 text-center whitespace-nowrap">Orders Placed</th>
                          <th class="py-3 px-5 text-right whitespace-nowrap">Cumulative Volume</th>
                          <th class="py-3 px-5 text-right whitespace-nowrap">Est. Unit Price</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/5 text-white font-medium">
                        @for (prod of top.topProducts; track prod.name) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-3 px-5 font-bold flex items-center gap-2">
                              <span class="w-2 h-2 rounded-full bg-[#EAC224]"></span>{{ prod.name }}
                            </td>
                            <td class="py-3 px-5 text-center">{{ prod.count }} {{ prod.count === 1 ? 'order' : 'orders' }}</td>
                            <td class="py-3 px-5 text-right font-extrabold text-[#9be15d]">{{ prod.totalQty | number }} {{ prod.totalQty === 1 ? 'unit' : 'units' }}</td>
                            <td class="py-3 px-5 text-right font-bold">
                              {{ prod.unitPrice > 0 ? ('₱' + (prod.unitPrice | number:'1.2-2')) : 'Contract pricing' }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
          }

          <!-- CREATE PO -->
          @if (subTab() === 'p-po') {
            <h3 class="text-2xl font-bold mb-4 text-white">Purchase Order (PO) creator</h3>
            <form (ngSubmit)="submitPO()" class="max-w-4xl bg-black/25 p-6 md:p-8 rounded-3xl border border-white/10">
              
              <div class="mb-6">
                <label class="block text-sm text-white mb-1.5 font-bold">Supplier</label>
                <select [(ngModel)]="prSupplier" name="supplier" (ngModelChange)="onSupplierChange()" required class="w-full md:w-1/2 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                  <option value="" disabled selected>Select a supplier...</option>
                  @for (s of suppliers(); track s.id) { <option [value]="s.id">{{ s.id }} ({{ s.name }})</option> }
                </select>
              </div>

              <div class="space-y-4 mb-6 border-t border-white/10 pt-6">
                <label class="block text-sm text-white mb-2 font-bold">Raw Materials</label>
                
                @for (item of prItems(); track $index) {
                  <div class="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                    
                    <!-- Material Selection -->
                    <div class="flex-1 w-full min-w-[200px]">
                      <label class="block text-xs text-white/80 mb-1.5 font-bold">Material</label>
                      <select [(ngModel)]="item.material" [name]="'material_'+$index" (ngModelChange)="onMaterialSelect($index)" [disabled]="!prSupplier" required class="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] disabled:opacity-50 cursor-pointer">
                        <option value="" disabled selected>Select material...</option>
                        @for (rm of availableMaterials(); track rm.name) { 
                          <option [value]="rm.name" [disabled]="isMaterialAlreadySelected(rm.name, $index)">
                            {{ rm.name }} (₱{{ rm.price.toLocaleString('en-US', {minimumFractionDigits: 2}) }})
                          </option> 
                        }
                      </select>
                    </div>

                    <!-- Unit Cost First -->
                    <div class="w-full md:w-32">
                      <label class="block text-xs text-white/80 mb-1.5 font-bold">Unit Cost (Fixed)</label>
                      <div class="relative w-full">
                        <span class="absolute left-3 top-2.5 text-white/70 font-bold text-sm">₱</span>
                        <input type="number" [(ngModel)]="item.cost" [name]="'cost_'+$index" disabled class="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white outline-none cursor-not-allowed font-bold">
                      </div>
                    </div>
                    
                    <!-- Quantity with minimum orders implemented for bulk -->
                    <div class="w-full md:w-32">
                      <div class="flex justify-between items-center mb-1.5">
                        <label class="text-xs text-white/80 font-bold">Qty (Units)</label>
                        <div class="flex flex-col items-end leading-none">
                          @if (item.minLimit > 1) { <span class="text-[9px] text-[#22d3ee] font-bold">Min: {{ item.minLimit }}</span> }
                          @if (item.maxLimit > 0) { <span class="text-[9px] text-[#EAC224] font-bold">Max: {{ item.maxLimit }}</span> }
                        </div>
                      </div>
                      <input type="number" [(ngModel)]="item.qty" [name]="'qty_'+$index" required [min]="item.minLimit" [max]="item.maxLimit > 0 ? item.maxLimit : null" placeholder="0" class="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/20 text-sm text-white font-bold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>

                    <!-- Total Calculated row Cost -->
                    <div class="w-full md:w-32">
                      <label class="block text-xs text-white/80 mb-1.5 font-bold">Total Cost</label>
                      <div class="relative w-full">
                        <span class="absolute left-3 top-2.5 text-[#9be15d] font-bold text-sm">₱</span>
                        <input type="text" [value]="(item.qty && item.cost ? (item.qty * item.cost) : 0) | number:'1.2-2'" disabled class="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/10 border border-[#9be15d]/30 text-sm text-[#9be15d] outline-none cursor-not-allowed font-extrabold">
                      </div>
                    </div>

                    <div class="pt-5 flex justify-end">
                      <button type="button" (click)="removePrRow($index)" [disabled]="prItems().length === 1" class="text-red-400 hover:text-red-300 hover:bg-red-400/20 disabled:opacity-30 disabled:hover:bg-transparent p-2 rounded-lg transition-colors cursor-pointer" title="Remove row">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                }

                <button type="button" (click)="addPrRow()" [disabled]="!prSupplier || prItems().length >= availableMaterials().length" class="mt-2 text-sm font-bold text-[#EAC224] hover:text-[#f5d34a] hover:bg-[#EAC224]/10 disabled:opacity-40 disabled:hover:bg-transparent px-4 py-2 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg> Add another material
                </button>
              </div>

              <!-- LIVE TOTAL PRICE BANNER -->
              <div class="mt-6 flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-black/40 border border-[#9be15d]/30 shadow-inner gap-4">
                <div class="flex items-center gap-4">
                  <span class="text-white text-lg font-bold">Total Estimated Cost:</span>
                  <span class="text-4xl font-extrabold text-[#9be15d]">
                    ₱{{ calculateTotal() }}
                  </span>
                </div>
                
                <button type="submit" [disabled]="isSubmitting() || !prSupplier" class="tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#2d3e15] px-8 py-3 rounded-full font-bold shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors w-full md:w-auto cursor-pointer">
                  {{ isSubmitting() ? 'Processing...' : 'Submit for Approval' }}
                </button>
              </div>
            </form>
          }

          <!-- REPEATING ORDERS TAB -->
          @if (subTab() === 'p-repeat') {
            @if (showRepeatOrderForm()) {
              <div class="mb-10 animate-in fade-in duration-300">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-bold text-white">{{ repeatForm.id ? 'Edit recurring order' : 'Setup recurring order' }}</h3>
                  <button (click)="closeRepeatForm()" class="text-white hover:text-[#EAC224] transition-colors text-sm font-bold cursor-pointer">✕ Cancel</button>
                </div>
                
                <form (ngSubmit)="submitRepeatOrder()" class="max-w-4xl space-y-6 bg-black/25 p-8 rounded-3xl border border-white/10 shadow-lg">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Supplier *</label>
                      <select [(ngModel)]="repeatForm.supplierId" name="rSupplier" (ngModelChange)="onRepeatSupplierChange()" required class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                        <option value="" disabled selected>Select a supplier...</option>
                        @for (s of suppliers(); track s.id) { <option [value]="s.id">{{ s.name }}</option> }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Material *</label>
                      <select [(ngModel)]="repeatForm.material" name="rMaterial" [disabled]="!repeatForm.supplierId" required class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] disabled:opacity-50 cursor-pointer">
                        <option value="" disabled selected>Select material...</option>
                        @for (rm of availableRepeatMaterials(); track rm.name) { 
                          <option [value]="rm.name">{{ rm.name }} (₱{{ rm.price }})</option> 
                        }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Quantity (Units) *</label>
                      <input type="number" [(ngModel)]="repeatForm.qty" name="rQty" required min="1" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Order Frequency *</label>
                      <select [(ngModel)]="repeatForm.frequency" name="rFreq" required class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Next Trigger Date *</label>
                      <input type="date" [(ngModel)]="repeatForm.nextDate" name="rDate" required [style.color-scheme]="'dark'" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold outline-none focus:border-[#EAC224]">
                    </div>
                  </div>
                  <div class="pt-4 border-t border-white/10 flex justify-end">
                    <button type="submit" [disabled]="isSubmitting() || !repeatForm.supplierId || !repeatForm.material" class="bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 text-[#1d2f0d] px-8 py-3 rounded-full font-extrabold shadow-[0_12px_28px_-8px_rgba(155,225,93,0.5)] transition-colors cursor-pointer">
                      {{ isSubmitting() ? 'Saving...' : 'Save Configuration' }}
                    </button>
                  </div>
                </form>
              </div>
            }

            <div [class]="showRepeatOrderForm() ? 'opacity-30 pointer-events-none' : ''">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 class="text-2xl font-bold text-white">Automated repeating orders</h3>
                <button (click)="openRepeatForm()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg> Setup recurring order
                </button>
              </div>

              <div class="max-h-[500px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="text-white text-[14px] font-bold sticky-thead">
                    <tr>
                      <th class="py-4 px-5 whitespace-nowrap">Config ID</th>
                      <th class="py-4 px-5 whitespace-nowrap">Supplier</th>
                      <th class="py-4 px-5 min-w-[220px]">Material &amp; Qty</th>
                      <th class="py-4 px-5 whitespace-nowrap">Frequency</th>
                      <th class="py-4 px-5 whitespace-nowrap">Next trigger date</th>
                      <th class="py-4 px-5 whitespace-nowrap">Status</th>
                      <th class="py-4 px-5 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 text-white font-medium">
                    @for (ro of repeatingOrders(); track ro.id) {
                      <tr class="hover:bg-white/10 transition-colors">
                        <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#EAC224]">{{ ro.id }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-bold">{{ ro.supplierName }}</td>
                        <td class="py-4 px-5 leading-relaxed">{{ formatMaterialReceipt(ro.material, ro.qty) }}</td>
                        <td class="py-4 px-5 whitespace-nowrap font-bold">
                          <span class="bg-white/15 px-3 py-1.5 rounded-full text-xs border border-white/25">{{ ro.frequency }}</span>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap">{{ ro.nextDate }}</td>
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + (ro.status === 'Active' ? 'border-[#9be15d]/30 text-[#b7f27c] bg-[#9be15d]/15' : 'border-white/30 text-white/50 bg-white/10')">
                            {{ ro.status }}
                          </span>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap text-right space-x-2">
                          @if (ro.status === 'Active') {
                            <button (click)="triggerRepeatingOrder(ro.id)" class="bg-[#22d3ee]/15 hover:bg-[#22d3ee] text-[#7fe7f7] hover:text-[#101a07] px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#22d3ee]/30" title="Dispatch order immediately">
                              ⚡ Dispatch now
                            </button>
                          }
                          <button (click)="openRepeatForm(ro)" class="bg-[#EAC224]/10 hover:bg-[#EAC224] text-[#EAC224] hover:text-[#1d2f0d] p-2 rounded-lg transition-colors cursor-pointer shadow-sm inline-flex items-center" title="Edit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </button>
                          <button (click)="toggleRepeatStatus(ro.id)" [class]="'px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ' + (ro.status === 'Active' ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-[#9be15d]/20 hover:bg-[#9be15d]/40 text-[#b7f27c] border-[#9be15d]/40')">
                            {{ ro.status === 'Active' ? 'Pause' : 'Resume' }}
                          </button>
                          <button (click)="deleteRepeatOrder(ro.id)" class="bg-[#B4161B]/20 hover:bg-[#B4161B] text-[#ffb4b7] hover:text-white p-2 rounded-lg transition-colors cursor-pointer shadow-sm border border-[#B4161B]/30 inline-flex items-center" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </td>
                      </tr>
                    }
                    @if (repeatingOrders().length === 0) {
                      <tr><td colspan="7" class="py-12 text-center text-white/60">No recurring orders set up.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- SUPPLIER DIRECTORY -->
          @if (subTab() === 'p-dir') {
            @if (showAddSupplierForm()) {
              <div class="mb-10">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-bold text-white">{{ editSupplierId() ? 'Edit supplier profile' : 'Register new supplier' }}</h3>
                  <button (click)="showAddSupplierForm.set(false)" class="text-white hover:text-[#EAC224] transition-colors text-sm font-bold cursor-pointer">✕ Cancel</button>
                </div>
                
                <form (ngSubmit)="submitSupplier()" class="max-w-4xl space-y-6 bg-black/25 p-8 rounded-3xl border border-white/10 shadow-lg">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Company name *</label>
                      <input type="text" [(ngModel)]="newSupp.name" name="s_name" required placeholder="e.g. Fiesta Ingredients" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Primary contact name</label>
                      <input type="text" [(ngModel)]="newSupp.contact" name="s_contact" placeholder="e.g. Juan Dela Cruz" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Email address</label>
                      <input type="email" [(ngModel)]="newSupp.email" name="s_email" placeholder="contact@supplier.com" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Phone number</label>
                      <input type="text" [(ngModel)]="newSupp.phone" name="s_phone" placeholder="+63 900 000 0000" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white mb-1.5 font-bold">Contact role</label>
                      <input type="text" [(ngModel)]="newSupp.role" name="s_role" placeholder="e.g. Sales Manager" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                  </div>

                  <div class="mt-6 border-t border-white/10 pt-6">
                    <label class="block text-sm text-white mb-3 font-bold">Material Catalog (Ingredients &amp; Prices)</label>
                    <div class="space-y-3">
                      @for (m of supplierMaterials(); track $index) {
                        <div class="flex flex-col sm:flex-row gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/10">
                          <input type="text" [(ngModel)]="m.name" [ngModelOptions]="{standalone: true}" placeholder="e.g. White Sugar - 1 Sack (60kg)" class="w-full sm:w-2/3 px-4 py-2.5 rounded-lg bg-black/30 border border-white/20 text-sm text-white font-semibold placeholder-white/40 outline-none focus:border-[#EAC224]">
                          <div class="flex w-full sm:w-1/3 gap-3 items-center">
                            <div class="relative w-full">
                              <span class="absolute left-3 top-2.5 text-white/70 font-bold text-sm">₱</span>
                              <input type="number" [(ngModel)]="m.price" [ngModelOptions]="{standalone: true}" placeholder="0.00" class="w-full pl-8 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/20 text-sm text-white font-bold placeholder-white/40 outline-none focus:border-[#EAC224]">
                            </div>
                            <button type="button" (click)="removeMaterialRow($index)" class="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-2 rounded-lg transition-colors cursor-pointer" title="Remove Ingredient">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                    <button type="button" (click)="addMaterialRow()" class="mt-3 text-sm font-bold text-[#EAC224] hover:text-[#f5d34a] hover:bg-[#EAC224]/10 px-4 py-2 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg> Add Ingredient
                    </button>
                  </div>

                  <div class="pt-4 border-t border-white/10 flex justify-end">
                    <button type="submit" [disabled]="isSubmitting() || !newSupp.name" class="bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 text-[#1d2f0d] px-8 py-3 rounded-full font-extrabold shadow-[0_12px_28px_-8px_rgba(155,225,93,0.5)] transition-colors cursor-pointer">
                      {{ isSubmitting() ? 'Saving...' : 'Save supplier profile' }}
                    </button>
                  </div>
                </form>
              </div>
            }

            <div [class]="showAddSupplierForm() ? 'opacity-30 pointer-events-none' : ''">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h3 class="text-2xl font-bold text-white">Supplier directory</h3>
                <button (click)="openAddSupplier()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg> Add new supplier
                </button>
              </div>
              <div class="max-h-[500px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="text-white text-[14px] font-bold sticky-thead">
                    <tr>
                      <th class="py-4 px-5 whitespace-nowrap">Supplier ID &amp; Name</th>
                      <th class="py-4 px-5 min-w-[300px]">Material catalog &amp; prices</th>
                      <th class="py-4 px-5 whitespace-nowrap">Primary contact</th>
                      <th class="py-4 px-5 whitespace-nowrap">Contact info</th>
                      <th class="py-4 px-5 whitespace-nowrap text-right">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 text-white font-medium">
                    @for (s of suppliers(); track s.id) {
                      <tr class="hover:bg-white/10 transition-colors">
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span class="text-[11px] text-[#EAC224] font-extrabold tracking-widest block mb-0.5">{{ s.id }}</span>
                          <span class="font-bold text-white text-base">{{ s.name }}</span>
                        </td>
                        <td class="py-4 px-5 whitespace-normal max-w-md leading-relaxed">
                          <div class="flex flex-wrap gap-2">
                            @for (cat of splitCategory(s.category); track cat) { 
                              <span class="bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-[11px] font-bold border border-white/20 shadow-sm">{{ cat }}</span> 
                            }
                          </div>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span class="font-bold text-white text-sm block">{{ s.contact }}</span>
                          <span class="text-white/60 text-[11px] font-bold uppercase tracking-wider">{{ s.role }}</span>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap text-white/80 text-xs font-semibold space-y-1">
                          <div class="flex items-center gap-2"><span class="opacity-60">📧</span> {{ s.email || '—' }}</div>
                          <div class="flex items-center gap-2"><span class="opacity-60">📞</span> {{ s.phone || '—' }}</div>
                        </td>
                        <td class="py-4 px-5 whitespace-nowrap text-right">
                          <div class="flex items-center justify-end gap-3">
                            <span class="border border-[#9be15d]/30 bg-[#9be15d]/15 text-[#b7f27c] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Active</span>
                            <button (click)="openEditSupplier(s)" class="bg-[#EAC224]/10 text-[#EAC224] hover:text-[#1d2f0d] hover:bg-[#EAC224] p-2 rounded-xl transition-colors cursor-pointer shadow-sm" title="Edit Supplier">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button (click)="promptDeleteSupplier(s.id)" class="bg-[#B4161B]/10 text-[#B4161B] hover:text-white hover:bg-[#B4161B] p-2 rounded-xl transition-colors cursor-pointer shadow-sm" title="Delete Supplier">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

        </div>
      </div>

      <!-- ========== ROCKET & CANDIES SPILLING OVER THE PANEL EDGES ========== -->
      <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[12%] w-24 pointer-events-none candy-shadow">
        <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
          <defs><linearGradient id="pRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
          <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
          <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
          <g class="a-flame">
            <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
            <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
          </g>
          <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#pRBody)" stroke="#94a3b8" stroke-width="2"/>
          <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
          <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
          <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
          <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
        </svg>
      </div>

      <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
        <svg viewBox="0 0 120 120" fill="none">
          <defs><linearGradient id="pStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
          <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#pStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
          <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        </svg>
      </div>

      <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
        <svg viewBox="0 0 220 190" fill="none">
          <defs>
            <linearGradient id="pGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
            <mask id="pDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
          </defs>
          <g mask="url(#pDonut)">
            <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
            <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
            <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#pGlz)"/>
            <ellipse cx="110" cy="86" rx="42" ry="30" fill="#e8a33d"/>
          </g>
          <path d="M38 78 C52 46 88 32 122 32" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".55"/>
          <rect x="66" y="52" width="16" height="6" rx="3" fill="#EAC224" transform="rotate(-40 74 55)"/>
          <rect x="150" y="50" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(50 158 53)"/>
          <rect x="172" y="84" width="16" height="6" rx="3" fill="#22b8e0" transform="rotate(-20 180 87)"/>
          <rect x="112" y="128" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(-25 120 131)"/>
          <rect x="60" y="112" width="16" height="6" rx="3" fill="white" transform="rotate(40 68 115)"/>
        </svg>
      </div>

      <div class="hidden md:block absolute z-20 -bottom-14 -left-6 w-[70px] pointer-events-none candy-shadow">
        <svg class="a-wiggle" viewBox="0 0 90 150" fill="none">
          <rect x="41" y="62" width="8" height="86" rx="4" fill="#f4fbe4"/>
          <circle cx="45" cy="42" r="38" fill="#EAC224"/>
          <path d="M45 42 m0 -30 a30 30 0 1 1 -30 30 M45 42 m0 -16 a16 16 0 1 1 -16 16" stroke="#B4161B" stroke-width="8" stroke-linecap="round"/>
          <path d="M20 22 Q26 12 36 9" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/>
        </svg>
      </div>

      <div class="hidden md:block absolute z-20 -bottom-8 left-[14%] w-20 pointer-events-none candy-shadow">
        <svg class="a-wiggle" viewBox="0 0 100 60" fill="none">
          <path d="M22 30 L0 8 L8 30 L0 52 Z" fill="#fff" opacity=".9"/><path d="M78 30 L100 8 L92 30 L100 52 Z" fill="#fff" opacity=".9"/>
          <rect x="20" y="8" width="60" height="44" rx="22" fill="#8fd14f"/>
          <path d="M30 20 Q50 12 70 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".7"/>
        </svg>
      </div>
    </div>
  `
})
export class ProcurementComponent implements OnInit {
  private apiService = inject(ApiService);

  subTab = signal<string>('p-dash');
  
  allPurchaseOrders = signal<any[]>([]);
  activePos = signal<any[]>([]);       
  pendingReceipts = signal<any[]>([]); 
  grnLogs = signal<any[]>([]);         
  suppliers = signal<any[]>([]);
  warehouseStock = signal<any[]>([]);

  showRepeatOrderForm = signal<boolean>(false);
  repeatForm = { id: '', supplierId: '', material: '', qty: 1, frequency: 'Weekly', nextDate: '', status: 'Active' };
  availableRepeatMaterials = signal<{name: string, price: number}[]>([]);

  repeatingOrders = signal<any[]>([
    { id: 'RO-001', supplierId: 'SUP-001', supplierName: 'Fiesta Ingredients', material: 'White Sugar - 1 Sack (60kg)', qty: 10, frequency: 'Weekly', nextDate: '2026-10-21', status: 'Active' },
    { id: 'RO-002', supplierId: 'SUP-002', supplierName: 'Packaging Co.', material: 'Printed Plastic Pouch (100g)', qty: 5000, frequency: 'Monthly', nextDate: '2026-11-01', status: 'Active' }
  ]);

  prSupplier = ''; 

  prItems = signal<{material: string, qty: number | null, cost: number | null, minLimit: number, maxLimit: number}[]>([
    {material: '', qty: null, cost: null, minLimit: 50, maxLimit: 0}
  ]);
  
  availableMaterials = signal<{name: string, price: number}[]>([]);
  
  selectedSupplierFilter = signal<string>('');
  selectedGrnSupplierFilter = signal<string>('');
  selectedGrnStatusFilter = signal<string>('all');
  
  confirmModal = { show: false, type: 'approve' as 'approve' | 'reject' | 'deleteSupplier' | 'receive', targetId: '', message: '' };

  showAddSupplierForm = signal<boolean>(false);
  editSupplierId = signal<string | null>(null);
  newSupp = { name: '', category: '', contact: '', role: '', email: '', phone: '' };
  
  supplierMaterials = signal<{name: string, price: number | null}[]>([{name: '', price: null}]);
  
  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  getTabIndex(): number {
    return ['p-dash', 'p-po', 'p-repeat', 'p-dir'].indexOf(this.subTab());
  }

  getSupplierName(supplierIdOrName: string): string {
    if (!supplierIdOrName) return 'Unknown Supplier';
    const found = this.suppliers().find(s => s.id === supplierIdOrName || s.name === supplierIdOrName);
    return found ? found.name : supplierIdOrName;
  }

  formatMaterialReceipt(desc: string, qty: any): string {
    const cleanDesc = (desc || '').replace(/\(1 units\)/gi, '(1 unit)').trim();
    if (qty === undefined || qty === null || qty === '') return cleanDesc;

    const rawQty = String(qty).trim();
    if (/\(\d+\s*units?\)$/i.test(cleanDesc)) {
      return cleanDesc;
    }

    const numMatch = rawQty.match(/^(\d+(?:\.\d+)?)\s*(units?)?$/i);
    if (numMatch) {
      const count = parseFloat(numMatch[1]);
      return `${cleanDesc} (${count} ${count === 1 ? 'unit' : 'units'})`;
    }
    return `${cleanDesc} (${rawQty.replace(/\b1 units\b/gi, '1 unit')})`;
  }

  formatQtyLabel(qty: any): string {
    if (qty === undefined || qty === null) return '0 units';
    const str = String(qty).trim().replace(/\b1 units\b/gi, '1 unit');
    if (/^\d+$/.test(str)) {
      const n = parseInt(str, 10);
      return `${n} ${n === 1 ? 'unit' : 'units'}`;
    }
    return str;
  }

  isMaterialAlreadySelected(materialName: string, currentIndex: number): boolean {
    return this.prItems().some((item, idx) => idx !== currentIndex && item.material === materialName);
  }

  scrollToSection(elementId: string) {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  filteredApprovals = computed(() => {
    const list = this.activePos();
    const filter = this.selectedSupplierFilter().trim().toLowerCase();
    
    if (!filter) return list;
    
    return list.filter(po => {
      const supId = (po.supplier || '').toLowerCase();
      const supObj = this.suppliers().find(s => s.id === po.supplier);
      const supName = supObj ? supObj.name.toLowerCase() : '';
      return supId.includes(filter) || supName.includes(filter);
    });
  });

  filteredGrns = computed(() => {
    const list = this.grnLogs();
    const supplierFilter = this.selectedGrnSupplierFilter().trim().toLowerCase();
    const statusFilter = this.selectedGrnStatusFilter();
    
    return list.filter(grn => {
      const supName = (grn.supplier_name || '').toLowerCase();
      const matchesSupplier = !supplierFilter || supName.includes(supplierFilter);
      const matchesStatus = statusFilter === 'all' || grn.routing_status === statusFilter;
      return matchesSupplier && matchesStatus;
    });
  });

  topSupplierStats = computed(() => {
    const pos = this.allPurchaseOrders();
    const supps = this.suppliers();

    if (pos.length === 0 || supps.length === 0) return null;

    const supplierCounts: { [key: string]: { totalOrders: number; fulfilled: number; totalUnits: number; products: { [mat: string]: { count: number; qty: number } } } } = {};

    for (const po of pos) {
      const sid = po.supplier_id;
      if (!sid) continue;

      if (!supplierCounts[sid]) {
        supplierCounts[sid] = { totalOrders: 0, fulfilled: 0, totalUnits: 0, products: {} };
      }

      supplierCounts[sid].totalOrders++;

      if (po.status === 'Received') {
        supplierCounts[sid].fulfilled++;
      }

      const match = String(po.qty || '').match(/[\d.]+/);
      const qtyNum = match ? parseFloat(match[0]) : 1;
      supplierCounts[sid].totalUnits += qtyNum;

      const mat = po.material_desc || 'General Stock';
      if (!supplierCounts[sid].products[mat]) {
        supplierCounts[sid].products[mat] = { count: 0, qty: 0 };
      }
      supplierCounts[sid].products[mat].count++;
      supplierCounts[sid].products[mat].qty += qtyNum;
    }

    let topSupplierId = '';
    let maxOrders = -1;

    for (const sid of Object.keys(supplierCounts)) {
      if (supplierCounts[sid].totalOrders > maxOrders) {
        maxOrders = supplierCounts[sid].totalOrders;
        topSupplierId = sid;
      }
    }

    if (!topSupplierId) return null;

    const topData = supplierCounts[topSupplierId];
    const topSupplierObj = supps.find(s => s.id === topSupplierId);
    const supplierName = topSupplierObj ? topSupplierObj.name : topSupplierId;

    const catalogPrices: { [name: string]: number } = {};
    let catalogCount = 0;
    if (topSupplierObj && topSupplierObj.category) {
      const splitItems = topSupplierObj.category.split(',');
      catalogCount = splitItems.length;
      for (const item of splitItems) {
        const parts = item.split('|');
        if (parts.length > 1) {
          catalogPrices[parts[0].trim().toLowerCase()] = parseFloat(parts[1].trim()) || 0;
        }
      }
    }

    const topProducts = Object.entries(topData.products)
      .map(([name, stat]) => {
        const unitPrice = catalogPrices[name.toLowerCase()] || 0;
        return {
          name,
          count: stat.count,
          totalQty: stat.qty,
          unitPrice
        };
      })
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 4);

    const fulfillmentRate = topData.totalOrders > 0 ? Math.round((topData.fulfilled / topData.totalOrders) * 100) : 0;
    const poShare = pos.length > 0 ? Math.round((topData.totalOrders / pos.length) * 100) : 0;

    return {
      supplierId: topSupplierId,
      name: supplierName,
      totalOrders: topData.totalOrders,
      fulfilledOrders: topData.fulfilled,
      totalUnits: topData.totalUnits,
      fulfillmentRate,
      poShare,
      catalogCount,
      topProducts
    };
  });

  grnSummary = computed(() => {
    const logs = this.grnLogs();
    let cleared = 0;
    let inQa = 0;
    let issues = 0;

    for (const log of logs) {
      if (log.routing_status === 'Cleared to Warehouse') cleared++;
      else if (log.routing_status === 'Routed to QA') inQa++;
      else issues++; 
    }

    return {
      total: logs.length,
      cleared,
      inQa,
      issues,
      recent: logs.slice(0, 5) 
    };
  });

  filterByTopSupplier(supplierId: string) {
    this.selectedSupplierFilter.set(supplierId);
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 4000);
  }

  splitCategory(category: string): string[] { 
    if (!category) return [];
    return category.split(',').map(item => {
      const parts = item.split('|');
      return parts.length > 1 ? `${parts[0].trim()} (₱${parts[1].trim()})` : item.trim();
    }); 
  }

  getGrnChipClass(status: string): string {
    if (status === 'Cleared to Warehouse') return 'border-[#9be15d]/40 text-[#b7f27c] bg-[#9be15d]/15';
    if (status.includes('Quarantined')) return 'border-[#B4161B]/40 text-[#ffb4b7] bg-[#B4161B]/15';
    if (status === 'Returned to Vendor') return 'border-[#ff9d1c]/40 text-[#ffbe66] bg-[#ff9d1c]/15';
    if (status === 'Scrapped') return 'border-white/30 text-white/70 bg-white/10';
    if (status === 'Reworked') return 'border-[#EAC224]/40 text-[#EAC224] bg-[#EAC224]/15';
    return 'border-[#22d3ee]/40 text-[#7fe7f7] bg-[#22d3ee]/15'; 
  }

  ngOnInit() {
    this.fetchSuppliers();
    this.fetchPurchaseOrders();
    this.fetchGRNs();
    this.fetchWarehouseStock();
  }

  fetchSuppliers() {
    this.apiService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers.set(data.map(s => ({ id: s.supplier_id, name: s.name, category: s.category || '', contact: s.contact_name || 'N/A', role: s.contact_role || '', email: s.email || '', phone: s.phone || '' })));
      }
    });
  }

  fetchPurchaseOrders() {
    this.apiService.getPurchaseOrders().subscribe({
      next: (data) => {
        this.allPurchaseOrders.set(data);

        const allPos = data.map(po => ({
          no: po.po_number,
          batch_code: po.batch_code,
          date: po.exact_date || 'Date Unrecorded',
          supplier: po.supplier_id,
          material: po.material_desc,
          qty: po.qty,
          status: po.status || 'Pending Approval',
          chip: po.status === 'In transit' || po.status === 'Dispatched' ? 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35' : 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35'
        }));
        this.activePos.set(allPos.filter(po => po.status === 'Pending Approval' || po.status === 'Draft'));
        this.pendingReceipts.set(allPos.filter(po => po.status === 'In transit' || po.status === 'Dispatched'));
      }
    });
  }

  fetchGRNs() {
    this.apiService.getGoodsReceipts().subscribe(data => {
      const mapped = data.map((grn: any) => ({
        ...grn,
        exact_date: grn.exact_date || 'Date Unrecorded',
        batch_code: grn.batch_code
      }));
      this.grnLogs.set(mapped);
    });
  }

  fetchWarehouseStock() {
    this.apiService.getWarehouseStock().subscribe({
      next: (data: any[]) => this.warehouseStock.set(data),
      error: () => {}
    });
  }

  onSupplierChange() {
    this.prItems.set([{material: '', qty: null, cost: null, minLimit: 50, maxLimit: 0}]);
    
    const sel = this.suppliers().find(s => s.id === this.prSupplier);
    if (sel && sel.category) {
      const materials = sel.category.split(',').map((i: string) => {
        const parts = i.split('|');
        return {
          name: parts[0].trim(),
          price: parts.length > 1 ? parseFloat(parts[1].trim()) : 0
        };
      });
      this.availableMaterials.set(materials);
    } else {
      this.availableMaterials.set([]);
    }
  }

  onMaterialSelect(index: number) {
    const items = [...this.prItems()];
    const currentItem = items[index];
    
    const selected = this.availableMaterials().find(m => m.name === currentItem.material);
    if (selected) {
      currentItem.cost = selected.price;
      currentItem.minLimit = 50; 

      const coreName = currentItem.material.split('-')[0].split('(')[0].trim().toLowerCase();
      
      const matchedStock = this.warehouseStock().find(w => w.name.toLowerCase().includes(coreName) || coreName.includes(w.name.toLowerCase()));
      if (matchedStock) {
        const maxCap = parseFloat(matchedStock.max_capacity) || 1000;
        const currentQty = parseFloat(matchedStock.qty) || 0;
        
        const match = currentItem.material.match(/\(([\d,.]+)\s*(pcs\vert{}kg\vert{}g\vert{}L\vert{}ml)\)/i);
        let multiplier = 1;
        if (match) multiplier = parseFloat(match[1].replace(/,/g, ''));
        
        const remainingSpace = maxCap - currentQty;
        currentItem.maxLimit = Math.max(1, Math.floor(remainingSpace / multiplier));
      } else {
        currentItem.maxLimit = 500;
      }
    }
    
    this.prItems.set(items);
  }

  addPrRow() {
    this.prItems.update(items => [...items, {material: '', qty: null, cost: null, minLimit: 50, maxLimit: 0}]);
  }

  removePrRow(index: number) {
    this.prItems.update(items => items.length > 1 ? items.filter((_, i) => i !== index) : items);
  }

  calculateTotal(): string {
    const total = this.prItems().reduce((sum, item) => sum + ((item.qty || 0) * (item.cost || 0)), 0);
    return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  promptAction(type: 'approve' | 'reject' | 'deleteSupplier' | 'receive', targetId: string) {
    let msg = '';
    if (type === 'approve') msg = `Are you sure you want to approve Purchase Order ${targetId}? This will dispatch the order and move it to Expected Deliveries.`;
    else if (type === 'reject') msg = `Are you sure you want to reject Purchase Order ${targetId}?`;
    else if (type === 'deleteSupplier') msg = `Are you sure you want to permanently delete supplier ${targetId}? This action cannot be undone.`;
    else if (type === 'receive') msg = `Are you sure you want to scan the arrival of Purchase Order ${targetId}? This will generate a Goods Receipt Note (GRN) and route the items to QA.`;

    this.confirmModal = {
      show: true,
      type,
      targetId,
      message: msg
    };
  }

  promptDeleteSupplier(id: string) {
    this.promptAction('deleteSupplier', id);
  }

  executeConfirmedAction() {
    const { type, targetId } = this.confirmModal;
    this.confirmModal.show = false;
    this.isSubmitting.set(true);

    if (type === 'deleteSupplier') {
      if ((this.apiService as any).deleteSupplier) {
        (this.apiService as any).deleteSupplier(targetId).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.fetchSuppliers();
            this.showToast(`Supplier ${targetId} has been deleted.`, 'success');
          },
          error: () => {
            this.isSubmitting.set(false);
            this.showToast(`Failed to delete supplier ${targetId}.`, 'error');
          }
        });
      } else {
        setTimeout(() => {
          this.isSubmitting.set(false);
          this.suppliers.update(s => s.filter(supp => supp.id !== targetId));
          this.showToast(`Supplier ${targetId} has been deleted.`, 'success');
        }, 500);
      }
      return;
    }

    if (type === 'receive') {
      this.apiService.receivePurchaseOrder(targetId, { userName: 'Lorenz' }).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success) {
            this.fetchPurchaseOrders(); 
            this.fetchGRNs();           
            this.subTab.set('p-dash');
            this.showToast(`Arrival scanned! GRN generated for ${targetId}.`, 'success');
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          this.showToast('Failed to process incoming goods scan.', 'error');
        }
      });
      return;
    }

    const actionObservable = type === 'approve' 
      ? this.apiService.approvePurchaseOrder(targetId, { userName: 'Lorenz' })
      : this.apiService.rejectPurchaseOrder(targetId, { userName: 'Lorenz' });

    actionObservable.subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.fetchPurchaseOrders();
          this.showToast(`Purchase Order ${targetId} has been ${type === 'approve' ? 'approved' : 'rejected'}.`, type === 'approve' ? 'success' : 'error');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast(`Failed to ${type} purchase order.`, 'error');
      }
    });
  }

  submitPO() {
    const itemsToProcess = this.prItems();
    
    if (!this.prSupplier || itemsToProcess.some(i => !i.material || !i.qty || i.cost === null)) {
      this.showToast('Please fill out all fields correctly for all rows.', 'error');
      return;
    }

    if (itemsToProcess.some(i => i.minLimit > 0 && (i.qty || 0) < i.minLimit)) {
      this.showToast('One or more quantities are below the bulk minimum order limit.', 'error');
      return;
    }

    if (itemsToProcess.some(i => i.maxLimit > 0 && (i.qty || 0) > i.maxLimit)) {
      this.showToast('One or more quantities exceed warehouse capacity limit.', 'error');
      return;
    }
    
    this.isSubmitting.set(true);
    let completed = 0;
    let hasError = false;

    itemsToProcess.forEach(item => {
      this.apiService.createPurchaseOrder({ 
        supplierId: this.prSupplier, 
        materialId: item.material, 
        qty: item.qty, 
        cost: item.cost, 
        userName: 'Lorenz',
        status: 'Pending Approval' 
      }).subscribe({
        next: () => {
          completed++;
          if (completed === itemsToProcess.length) this.finalizePoSubmit(hasError);
        },
        error: () => {
          hasError = true;
          completed++;
          if (completed === itemsToProcess.length) this.finalizePoSubmit(hasError);
        }
      });
    });
  }

  finalizePoSubmit(hasError: boolean) {
    this.isSubmitting.set(false);
    if (hasError) {
      this.showToast('Some purchase orders failed to create.', 'error');
    } else {
      this.prSupplier = ''; 
      this.prItems.set([{material: '', qty: null, cost: null, minLimit: 50, maxLimit: 0}]);
      this.availableMaterials.set([]);
      
      this.fetchPurchaseOrders(); 
      this.showToast(`Purchase Order(s) submitted and awaiting approval.`, 'success');
    }
  }

  openRepeatForm(ro?: any) {
    if (ro) {
      this.repeatForm = { ...ro };
      this.onRepeatSupplierChange(); 
    } else {
      this.repeatForm = { id: '', supplierId: '', material: '', qty: 1, frequency: 'Weekly', nextDate: '', status: 'Active' };
      this.availableRepeatMaterials.set([]);
    }
    this.showRepeatOrderForm.set(true);
  }

  closeRepeatForm() {
    this.showRepeatOrderForm.set(false);
  }

  onRepeatSupplierChange() {
    const sel = this.suppliers().find(s => s.id === this.repeatForm.supplierId);
    if (sel && sel.category) {
      const materials = sel.category.split(',').map((i: string) => {
        const parts = i.split('|');
        return { name: parts[0].trim(), price: parts.length > 1 ? parseFloat(parts[1].trim()) : 0 };
      });
      this.availableRepeatMaterials.set(materials);
    } else {
      this.availableRepeatMaterials.set([]);
    }
  }

  submitRepeatOrder() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      const sup = this.suppliers().find(s => s.id === this.repeatForm.supplierId);
      const nextNum = this.repeatingOrders().length + 1;
      const newEntry = {
        ...this.repeatForm,
        id: this.repeatForm.id || `RO-${String(nextNum).padStart(3, '0')}`,
        supplierName: sup ? sup.name : 'Unknown'
      };

      if (this.repeatForm.id) {
        this.repeatingOrders.update(orders => orders.map(o => o.id === this.repeatForm.id ? newEntry : o));
        this.showToast('Recurring order configuration updated!', 'success');
      } else {
        this.repeatingOrders.update(orders => [newEntry, ...orders]);
        this.showToast('Recurring order configuration created!', 'success');
      }

      this.isSubmitting.set(false);
      this.closeRepeatForm();
    }, 600);
  }

  toggleRepeatStatus(id: string) {
    this.repeatingOrders.update(orders => orders.map(o => {
      if (o.id === id) {
        const newStatus = o.status === 'Active' ? 'Paused' : 'Active';
        this.showToast(`Order schedule ${id} is now ${newStatus}.`, 'success');
        return { ...o, status: newStatus };
      }
      return o;
    }));
  }

  deleteRepeatOrder(id: string) {
    this.repeatingOrders.update(orders => orders.filter(o => o.id !== id));
    this.showToast(`Recurring order ${id} deleted permanently.`, 'success');
  }

  triggerRepeatingOrder(id: string) {
    const ro = this.repeatingOrders().find(r => r.id === id);
    if (!ro) return;
    this.showToast(`Automated PO triggered for ${ro.material} (${ro.supplierName}).`, 'success');
  }

  openAddSupplier() {
    this.editSupplierId.set(null);
    this.newSupp = { name: '', category: '', contact: '', role: '', email: '', phone: '' };
    this.supplierMaterials.set([{name: '', price: null}]);
    this.showAddSupplierForm.set(true);
  }

  openEditSupplier(s: any) {
    this.editSupplierId.set(s.id);
    this.newSupp = { name: s.name, category: '', contact: s.contact, role: s.role, email: s.email, phone: s.phone };
    
    if (s.category) {
      const parsed = s.category.split(',').map((item: string) => {
        const parts = item.split('|');
        return { name: parts[0].trim(), price: parts.length > 1 ? parseFloat(parts[1].trim()) : null };
      });
      this.supplierMaterials.set(parsed);
    } else {
      this.supplierMaterials.set([{name: '', price: null}]);
    }
    this.showAddSupplierForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  addMaterialRow() {
    this.supplierMaterials.update(m => [...m, {name: '', price: null}]);
  }

  removeMaterialRow(index: number) {
    this.supplierMaterials.update(m => {
      if (m.length === 1) return [{name: '', price: null}];
      return m.filter((_, i) => i !== index);
    });
  }

  submitSupplier() {
    if (!this.newSupp.name) {
      this.showToast('Supplier Name is required.', 'error');
      return;
    }
    
    const catString = this.supplierMaterials()
      .filter(m => m.name.trim() !== '')
      .map(m => `${m.name.trim()}|${m.price || 0}`)
      .join(', ');
      
    if (!catString) {
      this.showToast('Please add at least one material to the catalog.', 'error');
      return;
    }

    this.newSupp.category = catString;
    this.isSubmitting.set(true);

    const isEdit = this.editSupplierId();
    const action = isEdit 
      ? this.apiService.updateSupplier(isEdit, { ...this.newSupp, userName: 'Lorenz' })
      : this.apiService.addSupplier({ ...this.newSupp, userName: 'Lorenz' });

    action.subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.newSupp = { name: '', category: '', contact: '', role: '', email: '', phone: '' };
          this.supplierMaterials.set([{name: '', price: null}]);
          this.showAddSupplierForm.set(false);
          this.fetchSuppliers(); 
          this.showToast(`Successfully ${isEdit ? 'updated' : 'registered'} supplier!`, 'success');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast(`Failed to ${isEdit ? 'update' : 'add'} supplier.`, 'error');
      }
    });
  }
}