import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');

      :host { display: block; }
      .qa-container, .qa-container * { font-family: 'Fredoka', sans-serif !important; }
      
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel { background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.12); }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }

      .custom-scrollbar { scrollbar-width: thin !important; scrollbar-color: rgba(234, 194, 36, 0.6) rgba(0, 0, 0, 0.2) !important; overflow-y: auto; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2) !important; border-radius: 10px !important; }
      .custom-scrollbar::-webkit-scrollbar-track:hover { background: rgba(0, 0, 0, 0.2) !important; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 194, 36, 0.6) !important; border-radius: 10px !important; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 194, 36, 0.9) !important; }
      .custom-scrollbar::-webkit-scrollbar-button { display: none !important; height: 0 !important; width: 0 !important; }
      .custom-scrollbar::-webkit-scrollbar-corner { background: transparent !important; }

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
      @keyframes slide-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-toast { animation: slide-up 0.4s ease-out forwards; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <div class="qa-container min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip relative">

      <!-- FLOATING TOAST -->
      @if (toast().show) {
        <div class="fixed bottom-10 right-10 z-[9999] a-toast">
          <div [class]="'px-6 py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border backdrop-blur-md font-bold flex items-center gap-3 ' + (toast().type === 'success' ? 'bg-[#1d2f0d]/95 border-[#9be15d]/60 text-[#b7f27c]' : 'bg-[#2a0f12]/95 border-[#B4161B]/60 text-[#ff7b7b]')">
            <span class="text-2xl">{{ toast().type === 'success' ? '✅' : '⚠️' }}</span>
            <span class="tracking-wide text-white">{{ toast().message }}</span>
          </div>
        </div>
      }

      <!-- DYNAMIC REPORT / DISPOSITION MODAL -->
      @if (reportModal.show) {
        <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div class="bg-[#1d2f0d] border border-white/20 rounded-[32px] p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
            
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/10 blur-[60px] rounded-full pointer-events-none"></div>

            <!-- Header -->
            <div class="relative z-10 flex justify-between items-start border-b border-white/10 pb-5">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="text-3xl">{{ reportModal.mode === 'view' ? '📄' : '⚙️' }}</span>
                  <h3 class="text-3xl font-bold text-white">{{ reportModal.mode === 'view' ? 'Defect Report Details' : 'Process Work Order' }}</h3>
                </div>
                <p class="text-[#EAC224] text-sm font-bold tracking-wider mt-1">{{ reportModal.data?.reportId }}</p>
              </div>
              <button (click)="closeReportModal()" class="text-white/40 hover:text-white transition-colors cursor-pointer text-xl p-1 bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <!-- Read-Only Info Box -->
            <div class="relative z-10 bg-black/20 rounded-3xl p-6 border border-white/10 space-y-5">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-1.5">Batch ID</span>
                  <span class="text-lg font-extrabold text-white tracking-wide block truncate">{{ reportModal.data?.batchId }}</span>
                </div>
                <div>
                  <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-1.5">Defect Category</span>
                  <span class="text-sm font-bold text-[#ffb4b7] bg-[#B4161B]/20 px-3 py-1.5 rounded-lg border border-[#B4161B]/50 inline-block shadow-sm">{{ reportModal.data?.category }}</span>
                </div>
              </div>
              <div class="pt-3 border-t border-white/5">
                <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-2">Root Cause / Detail</span>
                <div class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                  <p class="text-white/90 leading-relaxed text-sm font-medium">{{ reportModal.data?.detail }}</p>
                </div>
              </div>
            </div>

            <!-- Interactive Form (If resolving) -->
            @if (reportModal.mode === 'resolve') {
              <div class="relative z-10 space-y-5 mt-6 border-t border-white/10 pt-6">
                <div>
                  <label class="block text-[11px] uppercase tracking-wider text-white/60 mb-2 font-bold">Action / Disposition *</label>
                  <select [(ngModel)]="reportModal.newDisposition" class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                    <option value="" disabled selected>Select disposition action...</option>
                    <option value="REWORK">Rework / Reprocess Batch</option>
                    <option value="SCRAP">Scrap / Destroy Material</option>
                    <option value="RETURN">Return to Vendor</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] uppercase tracking-wider text-white/60 mb-2 font-bold">Corrective Action (CAPA) *</label>
                  <textarea [(ngModel)]="reportModal.newCapa" placeholder="Describe the action taken (e.g., 'Generated WO-102 for rework', 'Emailed supplier for replacement')..." class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white font-medium h-24 outline-none focus:border-[#EAC224] custom-scrollbar"></textarea>
                </div>
              </div>
              
              <div class="relative z-10 flex justify-end gap-3 pt-6 mt-2">
                <button (click)="closeReportModal()" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
                <button (click)="submitResolution()" [disabled]="isSubmitting() || !reportModal.newDisposition || !reportModal.newCapa" class="px-6 py-2.5 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#2d3e15] font-bold text-sm transition-colors cursor-pointer shadow-md">
                  {{ isSubmitting() ? 'Saving...' : 'Finalize Disposition' }}
                </button>
              </div>
            } 
            
            <!-- View-Only Resolution (If already dispositioned) -->
            @if (reportModal.mode === 'view') {
              <div class="relative z-10 bg-gradient-to-br from-white/5 to-transparent rounded-3xl p-6 border border-[#EAC224]/30 space-y-5 mt-6 overflow-hidden shadow-lg">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#EAC224]/10 rounded-full blur-2xl"></div>
                
                <div class="relative z-10">
                  <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-1.5">Final Disposition</span>
                  <span class="text-2xl font-extrabold text-[#EAC224] uppercase tracking-wide drop-shadow-md flex items-center gap-2">
                    ✓ {{ reportModal.data?.disp }}
                  </span>
                </div>
                <div class="relative z-10 pt-3 border-t border-white/10">
                  <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-2">Corrective Action (CAPA)</span>
                  <div class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                    <p class="text-white/90 leading-relaxed text-sm font-medium">{{ reportModal.data?.capa }}</p>
                  </div>
                </div>
              </div>
              
              <div class="relative z-10 flex justify-end pt-6">
                <button (click)="closeReportModal()" class="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">Close Report</button>
              </div>
            }

          </div>
        </div>
      }

      <!-- QA REJECTION MODAL -->
      @if (rejectModal.show) {
        <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">⚠️</span>
              <h3 class="text-2xl font-bold text-[#ffb4b7]">Reject & Quarantine</h3>
            </div>
            <p class="text-white/70 text-sm">Specify the reason for rejecting batch <span class="font-bold text-white">{{ rejectModal.batchId }}</span>.</p>
            
            <div class="space-y-4 mt-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold">Defect Category *</label>
                <select [(ngModel)]="rejectModal.category" class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white outline-none focus:border-[#ef4444] cursor-pointer [&>option]:bg-[#1d2f0d]">
                  <option value="" disabled selected>Select a primary reason...</option>
                  <option value="Physical Damage">Physical Damage / Broken Packaging</option>
                  <option value="Contamination">Contamination / Foreign Matter</option>
                  <option value="Weight Variance">Weight / Volume Variance</option>
                  <option value="Temperature Abuse">Temperature Abuse / Spoilage</option>
                  <option value="Expired">Expired / Short Shelf Life</option>
                  <option value="Documentation">Incorrect Documentation / Specs</option>
                  <option value="Others">Others (Specify below)</option>
                </select>
              </div>

              @if (rejectModal.category === 'Others') {
                <div>
                  <label class="block text-xs text-white/60 mb-1.5 font-bold">Specify Custom Category *</label>
                  <input type="text" [(ngModel)]="rejectModal.customCategory" placeholder="Enter custom reason..." class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white outline-none focus:border-[#ef4444]">
                </div>
              }

              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold">Detailed Explanation (Optional)</label>
                <textarea [(ngModel)]="rejectModal.details" placeholder="Describe the exact issue found during inspection, severity, and any other notes..." class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white h-24 outline-none focus:border-[#ef4444] custom-scrollbar"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
              <button (click)="closeRejectModal()" class="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button (click)="confirmReject()" [disabled]="isSubmitting() || !rejectModal.category || (rejectModal.category === 'Others' && !rejectModal.customCategory)" class="px-5 py-2 rounded-full bg-[#B4161B] hover:bg-[#8f1115] disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer shadow-md">
                {{ isSubmitting() ? 'Processing...' : 'Confirm Reject' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MAIN THEME PANEL -->
      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">
        
        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <!-- Header Matching Procurement -->
        <div class="relative z-10 mb-8">
          <h2 class="text-4xl md:text-5xl font-semibold tracking-wide">Quality Assurance (QA)</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">
          
          <!-- SLIDING TABS NAVIGATION -->
          <div class="border-b border-white/10 px-8 pt-6 pb-6 overflow-x-auto custom-scrollbar">
            <div class="relative flex w-full min-w-[750px] max-w-[950px] bg-black/25 p-1.5 rounded-full border border-white/10">
              <!-- Sliding Indicator -->
              <div class="absolute top-1.5 bottom-1.5 w-[calc(20%-2.4px)] bg-[#EAC224] rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]"
                   [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'"></div>
              
              <button (click)="subTab.set('q-expected')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'q-expected'" [class.text-white]="subTab() !== 'q-expected'">Expected Deliveries</button>
              <button (click)="subTab.set('q-inbound')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'q-inbound'" [class.text-white]="subTab() !== 'q-inbound'">Pending Inspections</button>
              <button (click)="subTab.set('q-finished')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'q-finished'" [class.text-white]="subTab() !== 'q-finished'">Finished Goods</button>
              <button (click)="subTab.set('q-quarantine')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'q-quarantine'" [class.text-white]="subTab() !== 'q-quarantine'">Quarantine Log</button>
              <button (click)="subTab.set('q-defect')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold transition-colors duration-300 cursor-pointer" [class.text-[#2d3e15]]="subTab() === 'q-defect'" [class.text-white]="subTab() !== 'q-defect'">Defect Reports</button>
            </div>
          </div>

          <div class="p-6 md:p-8">

            <!-- 0. EXPECTED DELIVERIES -->
            @if (subTab() === 'q-expected') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Expected deliveries &amp; material receipt</h3>
                </div>

                <div class="max-h-[420px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5 whitespace-nowrap">PO number</th>
                        <th class="py-4 px-5 whitespace-nowrap">Supplier</th>
                        <th class="py-4 px-5 min-w-[220px]">Expected materials</th>
                        <th class="py-4 px-5 whitespace-nowrap">Quantity</th>
                        <th class="py-4 px-5 whitespace-nowrap">Status</th>
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
                            <span class="px-3 py-1.5 rounded-full text-xs font-bold border bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35 shadow-sm">{{ po.status }}</span>
                          </td>
                        </tr>
                      }
                      @if (pendingReceipts().length === 0) {
                        <tr><td colspan="5" class="py-10 text-center text-white/60">No pending deliveries at this time.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 1. PENDING INSPECTIONS -->
            @if (subTab() === 'q-inbound') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Inbound QA check &amp; digital sign-off</h3>
                  <div class="relative w-full md:w-72">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search batches, materials..." class="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/15 transition-colors font-medium outline-none">
                  </div>
                </div>

                <div class="max-h-[450px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5 whitespace-nowrap">Batch ID / Ref</th>
                        <th class="py-4 px-5 whitespace-nowrap">Source</th>
                        <th class="py-4 px-5 min-w-[200px]">Material / Product</th>
                        <th class="py-4 px-5 whitespace-nowrap">Received qty</th>
                        <th class="py-4 px-5 whitespace-nowrap">Inspection type</th>
                        <th class="py-4 px-5 whitespace-nowrap">Status</th>
                        <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 text-white font-medium">
                      @for (r of filteredInbound(); track r.id) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#9be15d]">{{ r.id }}</td>
                          <td class="py-4 px-5 whitespace-nowrap text-xs text-white/75">{{ r.src }}<br><span class="text-[11px] text-white/50 font-bold">{{ r.srcSub }}</span></td>
                          <td class="py-4 px-5 font-bold text-white/90 leading-relaxed">{{ r.item }}</td>
                          <td class="py-4 px-5 whitespace-nowrap font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + r.typeChip">{{ r.type }}</span></td>
                          <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + (r.status === 'CLEARED' ? chipLime : (r.status === 'QUARANTINED' ? chipRed : chipGold))">{{ r.status }}</span></td>
                          <td class="py-4 px-5 whitespace-nowrap text-right space-x-2">
                            @if (r.status === 'CLEARED') {
                              <span class="text-xs text-[#9be15d] italic font-bold pr-2">✓ Passed QA</span>
                            } @else if (r.status === 'QUARANTINED') {
                              <span class="text-xs text-[#ffb4b7] italic font-bold pr-2">⚠ Quarantined</span>
                            } @else {
                              <button (click)="openRejectModal(r.id)" [disabled]="isSubmitting()" class="bg-[#B4161B] hover:bg-[#8f1115] disabled:opacity-50 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm">Reject</button>
                              <button (click)="passInspection(r.id)" [disabled]="isSubmitting()" class="bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 text-[#1d2f0d] px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm">✓ Pass</button>
                            }
                          </td>
                        </tr>
                      }
                      @if (filteredInbound().length === 0) {
                        <tr><td colspan="7" class="py-12 text-center text-white/50">No pending inspections found.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. FINISHED GOODS CLEARANCE -->
            @if (subTab() === 'q-finished') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Finished goods clearance</h3>
                  <div class="relative w-full md:w-72">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search batches, products..." class="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/15 transition-colors font-medium outline-none">
                  </div>
                </div>

                <div class="max-h-[450px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5 whitespace-nowrap">Batch ID / Ref</th>
                        <th class="py-4 px-5 whitespace-nowrap">Source line</th>
                        <th class="py-4 px-5 min-w-[200px]">Product</th>
                        <th class="py-4 px-5 whitespace-nowrap">Yield qty</th>
                        <th class="py-4 px-5 whitespace-nowrap">Status</th>
                        <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 text-white font-medium">
                      @for (r of filteredFinished(); track r.id) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#9be15d]">{{ r.id }}</td>
                          <td class="py-4 px-5 whitespace-nowrap text-xs text-white/75">Internal<br><span class="text-[11px] text-white/50 font-bold">{{ r.line }}</span></td>
                          <td class="py-4 px-5 font-bold text-white/90 leading-relaxed">{{ r.item }}</td>
                          <td class="py-4 px-5 whitespace-nowrap font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-5 whitespace-nowrap">
                            <span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + (r.cleared ? chipLime : (r.quarantined ? chipRed : chipGold))">
                              {{ r.cleared ? '✓ CLEARED' : (r.quarantined ? 'QUARANTINED' : 'PENDING CLEARANCE') }}
                            </span>
                          </td>
                          <td class="py-4 px-5 whitespace-nowrap text-right space-x-2">
                            @if (r.cleared) {
                              <span class="text-xs text-white/50 italic font-bold pr-2">Sent to Inventory</span>
                            } @else if (r.quarantined) {
                              <span class="text-xs text-[#ffb4b7] italic font-bold pr-2">⚠ Quarantined</span>
                            } @else {
                              <button (click)="openRejectModal(r.id)" [disabled]="isSubmitting()" class="bg-[#B4161B] hover:bg-[#8f1115] disabled:opacity-50 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm">Reject</button>
                              <button (click)="passInspection(r.id)" [disabled]="isSubmitting()" class="bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 text-[#1d2f0d] px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm">✓ Pass</button>
                            }
                          </td>
                        </tr>
                      }
                      @if (filteredFinished().length === 0) {
                        <tr><td colspan="6" class="py-12 text-center text-white/60">No finished goods waiting for QA.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 3. QUARANTINE LOG -->
            @if (subTab() === 'q-quarantine') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Quarantine log &amp; disposition</h3>
                  
                  <div class="flex items-center gap-3">
                    <select [(ngModel)]="quarantineFilter" class="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer shadow-sm">
                      <option value="all">All Dispositions</option>
                      <option value="HOLD">Pending Action (Hold)</option>
                      <option value="REWORK">Reworked</option>
                      <option value="SCRAP">Scrapped</option>
                      <option value="RETURN">Returned to Vendor</option>
                    </select>
                    <div class="relative w-full md:w-64">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search log..." class="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/15 transition-colors font-medium outline-none">
                    </div>
                  </div>
                </div>

                <!-- RAW MATERIALS TABLE -->
                <div class="mb-8">
                  <h4 class="text-base font-bold text-white mb-3 flex items-center gap-2"><span>📦</span> Raw Materials (Supplier Deliveries)</h4>
                  <div class="max-h-[350px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                    <table class="w-full text-left text-sm border-collapse">
                      <thead class="text-white text-[14px] font-bold sticky-thead">
                        <tr>
                          <th class="py-4 px-5 whitespace-nowrap">Batch ID</th>
                          <th class="py-4 px-5 min-w-[200px]">Item &amp; Source</th>
                          <th class="py-4 px-5 whitespace-nowrap">Defect Category</th>
                          <th class="py-4 px-5 min-w-[220px]">Root Cause</th>
                          <th class="py-4 px-5 whitespace-nowrap">Disposition</th>
                          <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 text-white font-medium">
                        @for (q of quarantineRaw(); track q.batchId) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#ffb4b7]">{{ q.batchId }}</td>
                            <td class="py-4 px-5 whitespace-nowrap text-xs text-white/80">
                              <span class="font-bold text-white block">{{ q.item }}</span>
                              {{ q.source }}
                            </td>
                            <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + q.catChip">{{ q.category }}</span></td>
                            <td class="py-4 px-5 leading-relaxed text-xs text-white/70">{{ q.detail }}</td>
                            <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + q.dispChip">{{ q.disp }}</span></td>
                            <td class="py-4 px-5 whitespace-nowrap text-right">
                              <button (click)="openResolveModal(q)" class="bg-[#EAC224]/15 hover:bg-[#EAC224] text-[#EAC224] hover:text-[#1d2f0d] border border-[#EAC224]/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer">
                                {{ q.action }}
                              </button>
                            </td>
                          </tr>
                        }
                        @if (quarantineRaw().length === 0) {
                          <tr><td colspan="6" class="py-10 text-center text-white/60">No raw material quarantines found.</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- FINISHED GOODS TABLE -->
                <div>
                  <h4 class="text-base font-bold text-white mb-3 flex items-center gap-2"><span>🍬</span> Finished Goods (Internal Production)</h4>
                  <div class="max-h-[350px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                    <table class="w-full text-left text-sm border-collapse">
                      <thead class="text-white text-[14px] font-bold sticky-thead">
                        <tr>
                          <th class="py-4 px-5 whitespace-nowrap">Batch ID</th>
                          <th class="py-4 px-5 min-w-[200px]">Item &amp; Source</th>
                          <th class="py-4 px-5 whitespace-nowrap">Defect Category</th>
                          <th class="py-4 px-5 min-w-[220px]">Root Cause</th>
                          <th class="py-4 px-5 whitespace-nowrap">Disposition</th>
                          <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 text-white font-medium">
                        @for (q of quarantineFinished(); track q.batchId) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#ffb4b7]">{{ q.batchId }}</td>
                            <td class="py-4 px-5 whitespace-nowrap text-xs text-white/80">
                              <span class="font-bold text-white block">{{ q.item }}</span>
                              {{ q.source }}
                            </td>
                            <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + q.catChip">{{ q.category }}</span></td>
                            <td class="py-4 px-5 leading-relaxed text-xs text-white/70">{{ q.detail }}</td>
                            <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + q.dispChip">{{ q.disp }}</span></td>
                            <td class="py-4 px-5 whitespace-nowrap text-right">
                              <button (click)="openResolveModal(q)" class="bg-[#EAC224]/15 hover:bg-[#EAC224] text-[#EAC224] hover:text-[#1d2f0d] border border-[#EAC224]/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer">
                                {{ q.action }}
                              </button>
                            </td>
                          </tr>
                        }
                        @if (quarantineFinished().length === 0) {
                          <tr><td colspan="6" class="py-10 text-center text-white/60">No finished goods quarantines found.</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

            <!-- 4. DEFECT REPORTS -->
            @if (subTab() === 'q-defect') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Defect analytics &amp; root cause reports</h3>
                  <div class="flex items-center gap-3 w-full md:w-auto">
                    <div class="relative w-full md:w-64">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search reports..." class="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/15 transition-colors font-medium outline-none">
                    </div>
                    <button (click)="generatePDF()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                      Generate PDF
                    </button>
                  </div>
                </div>

                <!-- Metric cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-[#22d3ee] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
                    <div class="p-3 bg-[#22d3ee]/20 text-[#7fe7f7] rounded-xl text-xl">📊</div>
                    <div>
                      <p class="text-xs font-bold text-white/55 uppercase tracking-wider">Overall Defect Rate</p>
                      <p class="text-2xl font-extrabold">{{ defectRate() }}%</p>
                    </div>
                  </div>

                  <div class="bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
                    <div class="p-3 bg-[#B4161B]/30 text-[#ffb4b7] rounded-xl text-xl">⚠️</div>
                    <div>
                      <p class="text-xs font-bold text-[#ffb4b7] uppercase tracking-wider">Top Defect Category</p>
                      <p class="text-lg font-extrabold">{{ topDefectCat() }}</p>
                    </div>
                  </div>

                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
                    <div class="p-3 bg-[#EAC224]/20 text-[#EAC224] rounded-xl text-xl">📝</div>
                    <div>
                      <p class="text-xs font-bold text-[#EAC224] uppercase tracking-wider">Total Defect Reports</p>
                      <p class="text-2xl font-extrabold">{{ totalDefects() }}</p>
                    </div>
                  </div>
                </div>

                <!-- Defect reports table -->
                <div class="max-h-[450px] overflow-y-auto overflow-x-auto border border-white/10 rounded-2xl bg-black/25 custom-scrollbar relative">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5 whitespace-nowrap">Report ID</th>
                        <th class="py-4 px-5 min-w-[200px]">Material / Product</th>
                        <th class="py-4 px-5 whitespace-nowrap">Source</th>
                        <th class="py-4 px-5 whitespace-nowrap">Primary Issue</th>
                        <th class="py-4 px-5 min-w-[220px]">Corrective Action (CAPA)</th>
                        <th class="py-4 px-5 whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 text-white font-medium">
                      @for (d of filteredDefects(); track d.reportId) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 whitespace-nowrap font-extrabold text-[#EAC224]">{{ d.reportId }}</td>
                          <td class="py-4 px-5 whitespace-nowrap">
                            <span class="font-bold text-white block">{{ d.item }}</span>
                            <span class="text-[11px] text-white/50 font-semibold">Batch {{ d.batchId }}</span>
                          </td>
                          <td class="py-4 px-5 whitespace-nowrap text-xs text-white/75">{{ d.sourceText }}</td>
                          <td class="py-4 px-5 whitespace-nowrap"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + d.chip">{{ d.category }}</span></td>
                          <td class="py-4 px-5 leading-relaxed text-xs text-white/80" [title]="d.capa">{{ d.capa }}</td>
                          <td class="py-4 px-5 whitespace-nowrap text-right">
                            <button (click)="viewReport(d)" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border border-white/20">View Report</button>
                          </td>
                        </tr>
                      }
                      @if (filteredDefects().length === 0) {
                        <tr><td colspan="6" class="py-12 text-center text-white/60">No defect reports found.</td></tr>
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
            <defs><linearGradient id="qRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#qRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="qStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#qStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="qGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="qDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#qDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#qGlz)"/>
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
    </div>
  `
})
export class QaComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  subTab = signal<string>('q-expected'); 

  // USER & MODAL
  userName = signal<string>('QA Inspector');

  // Database Driven Signals
  pendingReceipts = signal<any[]>([]); 
  suppliers = signal<any[]>([]);       
  inbound = signal<any[]>([]);
  finished = signal<any[]>([]);
  quarantine = signal<any[]>([]);
  defects = signal<any[]>([]);

  // Search and Filter signals
  searchQuery = signal<string>('');
  quarantineFilter = signal<string>('all');

  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  // Generic Rejection Form (Inbound QA)
  rejectModal = { show: false, batchId: '', category: '', customCategory: '', details: '' };

  // Dynamic Report & Resolution Modal
  reportModal = { show: false, mode: 'view' as 'view' | 'resolve', data: null as any, newDisposition: '', newCapa: '' };

  // Dynamic Metric Signals computed from the database
  totalDefects = computed(() => this.defects().length);
  
  topDefectCat = computed(() => {
    const list = this.defects();
    if (!list.length) return 'N/A';
    const counts: any = {};
    let maxCat = '';
    let maxCount = 0;
    for (const d of list) {
      counts[d.category] = (counts[d.category] || 0) + 1;
      if (counts[d.category] > maxCount) {
        maxCount = counts[d.category];
        maxCat = d.category;
      }
    }
    return maxCat;
  });

  defectRate = computed(() => {
    const total = this.inbound().length + this.finished().length + this.defects().length;
    if (total === 0) return '0.0';
    return ((this.defects().length / total) * 100).toFixed(1);
  });

  // Filtered computed properties for tables
  filteredInbound = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.inbound().filter(r => !q || r.id.toLowerCase().includes(q) || r.item.toLowerCase().includes(q));
  });

  filteredFinished = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.finished().filter(r => !q || r.id.toLowerCase().includes(q) || r.item.toLowerCase().includes(q));
  });

  filteredQuarantine = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const f = this.quarantineFilter();
    return this.quarantine().filter(r => {
      const matchQ = !q || r.batchId.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q);
      const matchF = f === 'all' || r.disp === f;
      return matchQ && matchF;
    });
  });

  quarantineRaw = computed(() => this.filteredQuarantine().filter(q => q.type === 'RAW_MATERIAL'));
  quarantineFinished = computed(() => this.filteredQuarantine().filter(q => q.type === 'FINISHED_GOOD'));

  filteredDefects = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.defects().filter(r => !q || r.reportId.toLowerCase().includes(q) || r.batchId.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  });

  // Tab + button + chip styles
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';
  chipOrange = 'bg-[#ff9d1c]/15 text-[#ffbe66] border-[#ff9d1c]/35';
  chipRed = 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50';

  ngOnInit() {
    this.updateUser();
    this.fetchQaData();
  }

  updateUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try { 
          const parsed = JSON.parse(userStr);
          this.userName.set(parsed.name || parsed.full_name || 'QA Inspector'); 
        } catch(e) {}
      }
    }
  }

  getTabIndex(): number {
    return ['q-expected', 'q-inbound', 'q-finished', 'q-quarantine', 'q-defect'].indexOf(this.subTab());
  }

  getSupplierName(supplierIdOrName: string): string {
    if (!supplierIdOrName) return 'Unknown Supplier';
    const found = this.suppliers().find(s => s.id === supplierIdOrName || s.name === supplierIdOrName);
    return found ? found.name : supplierIdOrName;
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

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 4000);
  }

  generatePDF() {
    this.showToast('Generating PDF report...', 'success');
    setTimeout(() => {
      window.print();
    }, 1000);
  }

  fetchQaData() {
    this.apiService.getSuppliers().subscribe(data => {
      this.suppliers.set(data.map(s => ({ id: s.supplier_id, name: s.name })));
    });

    this.apiService.getPurchaseOrders().subscribe(data => {
      const expected = data.filter(po => po.status === 'In transit' || po.status === 'Dispatched').map(po => ({
        no: po.po_number,
        supplier: po.supplier_id,
        material: po.material_desc,
        qty: po.qty,
        status: po.status
      }));
      this.pendingReceipts.set(expected);
    });

    this.apiService.getQaInspections().subscribe({
      next: (data) => {
        const pendingQueue = data.filter(d => d.status !== 'CLEARED' && d.status !== 'QUARANTINED');
        this.inbound.set(pendingQueue.map(d => ({
          id: d.batch_id,
          src: d.inspection_type === 'INBOUND_RAW' ? 'Supplier Delivery' : 'Internal Production',
          srcSub: d.source_ref || 'Unknown Source',
          item: d.item_name,
          qty: d.received_qty,
          type: d.inspection_type === 'INBOUND_RAW' ? 'Inbound Raw' : 'Finished Goods',
          typeChip: d.inspection_type === 'INBOUND_RAW' ? this.chipCyan : this.chipOrange,
          status: d.status || 'PENDING',
          fg: d.inspection_type === 'FINISHED_GOODS'
        })));
        this.cdr.detectChanges();
      }
    });

    this.apiService.getProductionRuns().subscribe({
      next: (data) => {
        const pendingFinished = data.filter((d: any) => d.status !== 'CLEARED' && d.status !== 'QUARANTINED');
        
        this.finished.set(pendingFinished.map((d: any) => {
          let productName = d.bom_id || 'Unknown Product';
          if (productName === 'Multi-Order Batch') {
            switch (d.run_id) {
              case 'PRN-5956': productName = 'Mega White'; break;
              case 'PRN-8579': productName = 'Jumbo Pandan'; break;
              case 'PRN-2436': productName = 'Mega Pastillas'; break;
              case 'PRN-4165': productName = 'Mega Pastillas'; break;
            }
          }
          return {
            id: d.run_id,
            line: 'Production Line', 
            item: productName,
            qty: `${d.actual_units || 0} units`,
            cleared: d.status === 'CLEARED',
            quarantined: d.status === 'QUARANTINED',
            status: d.status,
            customer: d.customer_name 
          };
        }));
        this.cdr.detectChanges();
      }
    });

    this.apiService.getQaDefects().subscribe({
      next: (data) => {
        this.quarantine.set(data.map(d => {
          const isRaw = d.source_ref && d.source_ref.startsWith('PO');
          const sourceText = isRaw ? `PO: ${d.source_ref}` : (d.source_ref ? `Run: ${d.source_ref}` : 'Internal Production');

          return {
            reportId: d.report_id,
            batchId: d.batch_id,
            item: d.item_name || `Batch ${d.batch_id}`,
            source: sourceText,
            type: isRaw ? 'RAW_MATERIAL' : 'FINISHED_GOOD',
            edge: d.disposition_status === 'SCRAP' || d.disposition_status === 'RETURN' ? 'shadow-[inset_4px_0_0_#ef4444]' : 'shadow-[inset_4px_0_0_#EAC224]',
            category: d.defect_category,
            catChip: d.defect_category?.includes('DAMAGE') || d.defect_category?.includes('CONTAMINATION') || d.defect_category?.includes('FAIL') || d.defect_category?.includes('Expired') ? this.chipRed : this.chipGold,
            detail: d.root_cause_detail,
            disp: d.disposition_status,
            dispChip: d.disposition_status === 'SCRAP' || d.disposition_status === 'RETURN' ? this.chipRed : (d.disposition_status === 'REWORK' ? this.chipGold : 'bg-white/10 text-white border-white/20'),
            action: d.disposition_status === 'HOLD' ? 'Create Work Order' : 'View Report',
            btn: d.disposition_status === 'HOLD' ? '' : '',
            capa: d.capa_action
          };
        }));

        this.defects.set(data.map(d => {
          const isRaw = d.source_ref && d.source_ref.startsWith('PO');
          const sourceText = isRaw ? `PO: ${d.source_ref}` : (d.source_ref ? `Run: ${d.source_ref}` : 'Internal Production');

          return {
            reportId: d.report_id,
            batchId: d.batch_id,
            item: d.item_name || `Batch ${d.batch_id}`,
            sourceText: sourceText,
            category: d.defect_category,
            chip: d.defect_category?.includes('DAMAGE') || d.defect_category?.includes('CONTAMINATION') || d.defect_category?.includes('FAIL') || d.defect_category?.includes('Expired') ? this.chipRed : this.chipGold,
            detail: d.root_cause_detail,
            disp: d.disposition_status,
            capa: d.capa_action
          };
        }));
        
        this.cdr.detectChanges();
      }
    });
  }

  openResolveModal(record: any) {
    if (record.disp !== 'HOLD') {
      this.viewReport(record);
      return;
    }
    this.reportModal = { show: true, mode: 'resolve', data: record, newDisposition: '', newCapa: '' };
  }

  viewReport(record: any) {
    this.reportModal = { show: true, mode: 'view', data: record, newDisposition: '', newCapa: '' };
  }

  closeReportModal() {
    this.reportModal = { show: false, mode: 'view', data: null, newDisposition: '', newCapa: '' };
  }

  submitResolution() {
    if (!this.reportModal.newDisposition || !this.reportModal.newCapa) {
      this.showToast('Disposition and Corrective Action are required.', 'error');
      return;
    }
    this.isSubmitting.set(true);
    const payload = {
      userName: this.userName(),
      disposition: this.reportModal.newDisposition,
      capa: this.reportModal.newCapa
    };

    this.apiService.resolveQaDefect(this.reportModal.data.reportId, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast(`Defect report updated and disposition set!`, 'success');
          this.closeReportModal();
          this.fetchQaData(); 
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Failed to update disposition.', 'error');
      }
    });
  }

  passInspection(batchId: string) {
    if (!batchId) return;
    this.isSubmitting.set(true);
    const finalBatchId = batchId.startsWith('PRN') ? batchId.replace('PRN', 'BAT') : batchId;

    this.apiService.passQaInspection(finalBatchId, { userName: this.userName() }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res && (res.success !== false)) {
          this.showToast(`Batch ${finalBatchId} cleared successfully!`, 'success');
          this.fetchQaData(); 
        } else {
          this.showToast(res?.error || 'Failed to clear batch.', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error clearing batch:', err);
        this.showToast('Server error while clearing batch.', 'error');
      }
    });
  }

  openRejectModal(batchId: string) {
    if (!batchId) return;
    const finalBatchId = batchId.startsWith('PRN') ? batchId.replace('PRN', 'BAT') : batchId;
    this.rejectModal = { show: true, batchId: finalBatchId, category: '', customCategory: '', details: '' };
  }

  closeRejectModal() {
    this.rejectModal = { show: false, batchId: '', category: '', customCategory: '', details: '' };
  }

  confirmReject() {
    if (!this.rejectModal.category || !this.rejectModal.batchId) {
      this.showToast('Please select a defect category.', 'error');
      return;
    }
    const finalCategory = this.rejectModal.category === 'Others' ? this.rejectModal.customCategory : this.rejectModal.category;
    
    this.isSubmitting.set(true);
    const payload = {
      userName: this.userName(),
      defectCategory: finalCategory,
      rootCauseDetail: this.rejectModal.details
    };

    this.apiService.failQaInspection(this.rejectModal.batchId, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res && (res.success !== false)) {
          this.showToast(`Batch ${this.rejectModal.batchId} quarantined!`, 'error');
          this.closeRejectModal();
          this.fetchQaData(); 
        } else {
          this.showToast(res?.error || 'Failed to quarantine batch.', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error quarantining batch:', err);
        this.showToast('Server error while quarantining batch.', 'error');
      }
    });
  }
}