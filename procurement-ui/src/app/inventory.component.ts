import { Component, ChangeDetectionStrategy, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');
      .font-candy { font-family: 'Fredoka', sans-serif !important; }
    </style>

    <div class="w-full text-gray-800 font-candy" style="font-family: 'Fredoka', sans-serif !important;">
      
      <!-- Main Container Card -->
      <div class="w-full bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden p-2">
        
        <!-- Navigation Header with Pill-Shaped Tabs & Search -->
        <div class="border-b border-gray-100 px-6 pt-4 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-b from-[#fbfdf9] to-transparent">
          <div class="flex flex-wrap gap-2 bg-gray-100/80 p-1.5 rounded-full border border-gray-200/60">
            <button 
              (click)="activeTab.set('ledger')" 
              [ngClass]="activeTab() === 'ledger' ? 'bg-white text-[#476021] shadow-sm font-bold' : 'text-gray-500 font-medium hover:text-[#476021]'"
              class="px-6 py-2 rounded-full text-sm transition-all">
              Raw Material Ledger
            </button>
            <button 
              (click)="activeTab.set('yield')" 
              [ngClass]="activeTab() === 'yield' ? 'bg-white text-[#476021] shadow-sm font-bold' : 'text-gray-500 font-medium hover:text-[#476021]'"
              class="px-6 py-2 rounded-full text-sm transition-all">
              Yield Engine
            </button>
            <button 
              (click)="activeTab.set('finished')" 
              [ngClass]="activeTab() === 'finished' ? 'bg-white text-[#476021] shadow-sm font-bold' : 'text-gray-500 font-medium hover:text-[#476021]'"
              class="px-6 py-2 rounded-full text-sm transition-all">
              Finished Goods
            </button>
            <button 
              (click)="activeTab.set('movement')" 
              [ngClass]="activeTab() === 'movement' ? 'bg-white text-[#476021] shadow-sm font-bold' : 'text-gray-500 font-medium hover:text-[#476021]'"
              class="px-6 py-2 rounded-full text-sm transition-all">
              Stock Movement
            </button>
          </div>
          
          <!-- Search Bar -->
          <div class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input type="text" placeholder="Search SKU, materials..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#598E18]">
          </div>
        </div>

        <div class="p-6">
          
          <!-- 1. RAW MATERIAL LEDGER / YIELD ENGINE TAB -->
          @if (activeTab() === 'ledger' || activeTab() === 'yield') {
            <div class="animate-in fade-in duration-300 space-y-6">
              <div>
                <h2 class="text-[22px] font-black text-[#476021] mb-1">Available Raw Stock</h2>
                <p class="text-xs text-gray-500 font-medium">Materials cleared by QA (Trigger 2). Ready for BOM consumption.</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                <!-- Left Table -->
                <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-gray-50/70 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                      <tr>
                        <th class="px-6 py-3">Item SKU</th>
                        <th class="px-6 py-3">Material</th>
                        <th class="px-6 py-3 text-right">Available Qty</th>
                        <th class="px-6 py-3">UOM</th>
                        <th class="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 font-medium">
                      <tr>
                        <td class="px-6 py-4 text-xs font-bold text-gray-600">RAW-SUG-01</td>
                        <td class="px-6 py-4 text-gray-900 font-bold">Refined Sugar</td>
                        <td class="px-6 py-4 text-right font-black text-gray-900">40,000</td>
                        <td class="px-6 py-4 text-xs text-gray-500">g</td>
                        <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[10px] font-black tracking-wider">AVAILABLE</span></td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 text-xs font-bold text-gray-600">RAW-PUR-02</td>
                        <td class="px-6 py-4 text-gray-900 font-bold">Mango Puree</td>
                        <td class="px-6 py-4 text-right font-black text-gray-900">90,000</td>
                        <td class="px-6 py-4 text-xs text-gray-500">ml</td>
                        <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[10px] font-black tracking-wider">AVAILABLE</span></td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 text-xs font-bold text-gray-600">PKG-PCH-03</td>
                        <td class="px-6 py-4 text-red-600 font-bold">Mango Candy Pouches</td>
                        <td class="px-6 py-4 text-right font-black text-red-600">150</td>
                        <td class="px-6 py-4 text-xs text-gray-500">pcs</td>
                        <td class="px-6 py-4"><span class="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-[10px] font-black tracking-wider">LOW STOCK</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Right Sidebar Card: Yield Optimizer Engine -->
                <div class="bg-white rounded-3xl p-6 border-2 border-[#EAC224]/80 shadow-sm relative space-y-4">
                  <div class="absolute -top-3 right-4 bg-[#EAC224] text-[#476021] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Limiting Ingredient Algo
                  </div>

                  <div>
                    <h3 class="text-base font-black text-[#476021]">Yield Optimizer Engine</h3>
                    <p class="text-[11px] text-gray-400 font-medium leading-relaxed mt-0.5">Calculates maximum producible units based on current AVAILABLE_RAW stock against the standard BOM.</p>
                  </div>

                  <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs">
                    <span class="text-gray-500 font-bold block">1 PACK (MANGO CANDY) BOM:</span>
                    <div class="flex justify-between text-gray-700 font-semibold">
                      <span>Refined Sugar</span>
                      <span class="font-bold text-gray-900">100 g</span>
                    </div>
                    <div class="flex justify-between text-gray-700 font-semibold">
                      <span>Mango Puree</span>
                      <span class="font-bold text-gray-900">250 ml</span>
                    </div>
                    <div class="flex justify-between text-gray-700 font-semibold">
                      <span>Packaging Pouch</span>
                      <span class="font-bold text-gray-900">1 pc</span>
                    </div>
                  </div>

                  <div class="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-sm">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Max Output Capacity</span>
                    <div class="flex items-baseline justify-center gap-1.5 mb-3">
                      <span class="text-4xl font-black text-gray-900">150</span>
                      <span class="text-sm font-bold text-gray-400">packs</span>
                    </div>
                    <div class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-[11px] font-medium text-left leading-relaxed">
                      <span class="font-bold block mb-0.5">⚠️ Bottleneck Detected: Packaging Pouches.</span> You have enough sugar for 400 packs and puree for 360 packs, but pouches cap output at 150.
                    </div>
                  </div>

                  <button class="w-full bg-[#598E18] hover:bg-[#476021] text-white py-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2">
                    Push to Production Planner
                  </button>
                </div>

              </div>
            </div>
          }

          <!-- 2. FINISHED GOODS TAB -->
          @if (activeTab() === 'finished') {
            <div class="animate-in fade-in duration-300 space-y-6">
              <div>
                <h2 class="text-[22px] font-black text-[#476021] mb-1">Sellable Finished Goods</h2>
                <p class="text-xs text-gray-500 font-medium">Stock populated via QA clearance (Trigger 3) and dynamically reserved by Sales orders (Trigger 4).</p>
              </div>

              <!-- Metrics Row -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Sellable Value</span>
                  <span class="text-xl font-black text-gray-900">₱ 45,200.00</span>
                </div>
                <div class="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
                  <span class="text-[10px] font-bold text-green-700 uppercase tracking-widest block mb-1">Available for Sale</span>
                  <span class="text-xl font-black text-[#598E18]">850 units</span>
                </div>
                <div class="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100 shadow-sm">
                  <span class="text-[10px] font-bold text-yellow-700 uppercase tracking-widest block mb-1">Allocated (Awaiting Dispatch)</span>
                  <span class="text-xl font-black text-yellow-800">120 units</span>
                </div>
                <div class="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
                  <span class="text-[10px] font-bold text-red-700 uppercase tracking-widest block mb-1">Low Stock Alerts</span>
                  <span class="text-xl font-black text-red-700">1 SKU</span>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-gray-50/70 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                    <tr>
                      <th class="px-6 py-3">Product SKU</th>
                      <th class="px-6 py-3">Product Name</th>
                      <th class="px-6 py-3 text-right">Available Stock</th>
                      <th class="px-6 py-3 text-right">Allocated Stock</th>
                      <th class="px-6 py-3 text-right">Total On-Hand</th>
                      <th class="px-6 py-3">Status</th>
                      <th class="px-6 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 font-medium">
                    <tr>
                      <td class="px-6 py-4 text-xs font-bold text-gray-600">FG-MAN-001</td>
                      <td class="px-6 py-4 text-gray-900 font-bold">Mango Candy (Single Pack)</td>
                      <td class="px-6 py-4 text-right font-black text-gray-800">150</td>
                      <td class="px-6 py-4 text-right font-bold text-yellow-600">50</td>
                      <td class="px-6 py-4 text-right font-black text-gray-900">200</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[10px] font-black">IN STOCK</span></td>
                      <td class="px-6 py-4 text-center text-gray-400 hover:text-gray-600 cursor-pointer">🕒</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 text-xs font-bold text-gray-600">FG-MAN-010</td>
                      <td class="px-6 py-4 text-gray-900 font-bold">Mango Candy (Box of 10)</td>
                      <td class="px-6 py-4 text-right font-black text-gray-800">45</td>
                      <td class="px-6 py-4 text-right font-bold text-gray-400">0</td>
                      <td class="px-6 py-4 text-right font-black text-gray-900">45</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[10px] font-black">IN STOCK</span></td>
                      <td class="px-6 py-4 text-center text-gray-400 hover:text-gray-600 cursor-pointer">🕒</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 text-xs font-bold text-gray-600">FG-TAM-001</td>
                      <td class="px-6 py-4 text-red-600 font-bold">Tamarind Candy (Single Pack)</td>
                      <td class="px-6 py-4 text-right font-black text-red-600">12</td>
                      <td class="px-6 py-4 text-right font-bold text-yellow-600">70</td>
                      <td class="px-6 py-4 text-right font-black text-gray-900">82</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-[10px] font-black">LOW STOCK</span></td>
                      <td class="px-6 py-4 text-center text-gray-400 hover:text-gray-600 cursor-pointer">🕒</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- 3. STOCK MOVEMENT TAB -->
          @if (activeTab() === 'movement') {
            <div class="animate-in fade-in duration-300 space-y-6">
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="text-[22px] font-black text-[#476021] mb-1">Stock Ledger & Movement Audit Trail</h2>
                  <p class="text-xs text-gray-500 font-medium">Chronological ledger tracking raw material deductions, WIP transitions, and finished goods additions.</p>
                </div>
                <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2">
                  📥 Export Audit Log
                </button>
              </div>

              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-gray-50/70 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                    <tr>
                      <th class="px-6 py-3">Timestamp</th>
                      <th class="px-6 py-3">Movement Type</th>
                      <th class="px-6 py-3">Item & SKU</th>
                      <th class="px-6 py-3 text-right">Qty Change</th>
                      <th class="px-6 py-3">Reference Source</th>
                      <th class="px-6 py-3">Trigger / Actor</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 font-medium text-xs">
                    <tr>
                      <td class="px-6 py-4 text-gray-500 font-medium">2026-09-19 11:00</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-black">⇄ ALLOCATION</span></td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-gray-900 block">Mango Candy (Pack)</span>
                        <span class="text-[10px] text-gray-400 font-bold">FG-MAN-001</span>
                      </td>
                      <td class="px-6 py-4 text-right font-black text-red-600">-50 packs</td>
                      <td class="px-6 py-4 font-bold text-gray-700">ORD-2026-104</td>
                      <td class="px-6 py-4 text-gray-500 font-medium">Trigger 4 (Sales Validation)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 text-gray-500 font-medium">2026-09-19 09:30</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md font-black">+ PRODUCTION ADD</span></td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-gray-900 block">Mango Candy (Pack)</span>
                        <span class="text-[10px] text-gray-400 font-bold">FG-MAN-001</span>
                      </td>
                      <td class="px-6 py-4 text-right font-black text-green-600">+150 packs</td>
                      <td class="px-6 py-4 font-bold text-gray-700">FG-RUN-402</td>
                      <td class="px-6 py-4 text-gray-500 font-medium">Trigger 3 (QA Clearance)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 text-gray-500 font-medium">2026-09-19 09:29</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md font-black">- BOM DEDUCTION</span></td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-gray-900 block">Packaging Pouches</span>
                        <span class="text-[10px] text-gray-400 font-bold">PKG-PCH-03</span>
                      </td>
                      <td class="px-6 py-4 text-right font-black text-red-600">-150 pcs</td>
                      <td class="px-6 py-4 font-bold text-gray-700">FG-RUN-402</td>
                      <td class="px-6 py-4 text-gray-500 font-medium">Trigger 3 (Production Run)</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 text-gray-500 font-medium">2026-09-18 15:00</td>
                      <td class="px-6 py-4"><span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-black">✓ QA INGESTION</span></td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-gray-900 block">Refined Sugar</span>
                        <span class="text-[10px] text-gray-400 font-bold">RAW-SUG-01</span>
                      </td>
                      <td class="px-6 py-4 text-right font-black text-green-600">+40,000 g</td>
                      <td class="px-6 py-4 font-bold text-gray-700">BAT-2609-02</td>
                      <td class="px-6 py-4 text-gray-500 font-medium">Trigger 2 (QA Pass)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class InventoryComponent {
  activeTab = signal<'ledger' | 'yield' | 'finished' | 'movement'>('ledger');
}