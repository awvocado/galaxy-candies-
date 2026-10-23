import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      /* Lime backdrop + room around the panel so candies can spill past its edges */
      :host {
        display: block;
        min-height: 100vh;
        background: #dfe9c6;
        font-family: 'Nunito', sans-serif;
        padding: 1.5rem 2rem 4.5rem;
        position: relative;
        overflow-x: clip;
      }
      .font-candy { font-family: 'Fredoka', sans-serif; }

      .theme-panel {
        background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%);
      }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }

      /* ADDED height: 6px to style horizontal scrollbars identically */
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }

      @keyframes bob-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
      @keyframes bob-b { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
      @keyframes rocket-fly { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(8px,-16px) rotate(2deg); } }
      @keyframes flame { from { transform: scale(1,1); } to { transform: scale(.88,1.28); } }
      @keyframes spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0); opacity: 0; } }
      @keyframes spin-slow { to { transform: rotate(360deg); } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-spin { animation: spin-slow 16s linear infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-float { animation: float-y 4.5s ease-in-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      /* HIGH-VISIBILITY TOAST ANIMATION */
      @keyframes toast-drop { 
        0% { opacity: 0; transform: translateY(-40px) scale(0.9); filter: blur(5px); } 
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
      }
      .a-toast-new { animation: toast-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .a-bounce-icon { animation: bounce 1s infinite; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <!-- HIGH-VISIBILITY FLOATING TOAST NOTIFICATION -->
    @if (toast().show) {
      <div class="fixed top-12 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
        <div [class]="'a-toast-new pointer-events-auto px-8 py-5 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-4 flex items-center gap-5 max-w-lg w-full mx-4 ' + (toast().type === 'success' ? 'bg-[#9be15d] border-white text-[#1d2f0d]' : (toast().type === 'error' ? 'bg-[#B4161B] border-white text-white' : 'bg-[#22d3ee] border-white text-[#083344]'))">
          <span class="text-5xl a-bounce-icon">{{ toast().type === 'success' ? '✅' : (toast().type === 'error' ? '🚨' : 'ℹ️') }}</span>
          <div>
            <h4 class="text-2xl font-candy font-extrabold uppercase tracking-wide">{{ toast().type === 'success' ? 'Success!' : (toast().type === 'error' ? 'Attention Required!' : 'Information') }}</h4>
            <p class="font-bold text-base opacity-95 mt-1 font-candy">{{ toast().message }}</p>
          </div>
        </div>
      </div>
    }

    <!-- BIG DARK PANEL -->
    <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

      <span class="a-twinkle absolute top-[6%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
      <span class="a-twinkle d1 absolute top-[48%] right-[4%] w-1.5 h-1.5 rounded-full bg-white"></span>
      <span class="a-twinkle d2 absolute bottom-[8%] left-[38%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

      <!-- Welcome header -->
      <div class="relative z-10 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide flex items-center gap-3">
            Welcome back, {{ userName() }}.
          </h2>
        </div>

        <div class="flex flex-col items-start lg:items-end gap-3 self-start lg:self-auto">
          <!-- Status Pill -->
          <div class="glass-panel px-5 py-3 rounded-full flex items-center gap-3 hover:bg-white/10 transition-colors cursor-default">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
            </span>
            <span class="font-candy text-sm text-white/70">Production line: <span class="text-[#9be15d] font-semibold">Active (Jumbo White Pastillas)</span></span>
          </div>
          
          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          </div>
        </div>
      </div>

      <!-- Metrics: 5 columns with compact number formatting -->
      <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        
        <!-- Sales Compilation -->
        <div class="group glass-panel rounded-[28px] p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border-b-4 border-b-[#ec4899] relative overflow-hidden cursor-pointer">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#ec4899]/10 rounded-full group-hover:bg-[#ec4899]/20 transition-colors duration-300"></div>
          
          <!-- Mini Bar Chart Background -->
          <div class="absolute bottom-0 left-0 right-0 h-10 px-4 flex items-end justify-between gap-1.5 opacity-[0.15] pointer-events-none">
            <div class="w-full bg-white rounded-t-sm h-[30%] group-hover:h-[40%] transition-all duration-500"></div>
            <div class="w-full bg-white rounded-t-sm h-[50%] group-hover:h-[60%] transition-all duration-500 delay-75"></div>
            <div class="w-full bg-white rounded-t-sm h-[40%] group-hover:h-[30%] transition-all duration-500 delay-100"></div>
            <div class="w-full bg-white rounded-t-sm h-[70%] group-hover:h-[80%] transition-all duration-500 delay-150"></div>
            <div class="w-full bg-white rounded-t-sm h-[60%] group-hover:h-[50%] transition-all duration-500 delay-200"></div>
            <div class="w-full bg-white rounded-t-sm h-[90%] group-hover:h-[100%] transition-all duration-500 delay-300"></div>
            <div class="w-full bg-[#EAC224] rounded-t-sm h-[100%] group-hover:animate-pulse transition-all duration-500"></div>
          </div>

          <div class="flex justify-between items-start relative z-10 gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white mb-2 font-candy tracking-wide truncate">Sales compilation</p>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl lg:text-4xl font-candy font-semibold truncate tracking-tight">{{ salesCompilationFormatted() }}</p>
              </div>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#ec4899]/20 flex items-center justify-center text-xl lg:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">💰</div>
          </div>
        </div>

        <div class="group glass-panel rounded-[28px] p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border-b-4 border-b-[#9be15d] relative overflow-hidden cursor-pointer">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#9be15d]/10 rounded-full group-hover:bg-[#9be15d]/20 transition-colors duration-300"></div>
          <div class="flex justify-between items-start relative gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white mb-2 font-candy tracking-wide truncate">Yield capacity</p>
              <div class="flex items-baseline gap-2">
                <p class="text-4xl lg:text-5xl font-candy font-semibold">{{ currentYield() | number }}</p>
                <span class="text-sm text-white/70">packs</span>
              </div>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#9be15d]/20 flex items-center justify-center text-xl lg:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">🍬</div>
          </div>
        </div>

        <div class="group glass-panel rounded-[28px] p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border-b-4 border-b-[#22d3ee] relative overflow-hidden cursor-pointer">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#22d3ee]/10 rounded-full group-hover:bg-[#22d3ee]/20 transition-colors duration-300"></div>
          <div class="flex justify-between items-start relative gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white mb-2 font-candy tracking-wide truncate">Pending QA</p>
              <div class="flex items-baseline gap-2">
                <p class="text-4xl lg:text-5xl font-candy font-semibold">{{ pendingQa() }}</p>
                <span class="text-sm text-white/70">batches</span>
              </div>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#22d3ee]/20 flex items-center justify-center text-xl lg:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">🔬</div>
          </div>
        </div>

        <div class="group glass-panel rounded-[28px] p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border-b-4 border-b-[#EAC224] relative overflow-hidden cursor-pointer">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#EAC224]/10 rounded-full group-hover:bg-[#EAC224]/20 transition-colors duration-300"></div>
          <div class="flex justify-between items-start relative gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white mb-2 font-candy tracking-wide truncate">Sellable stock</p>
              <div class="flex items-baseline gap-2">
                <p class="text-4xl lg:text-5xl font-candy font-semibold">{{ sellableStock() | number }}</p>
                <span class="text-sm text-white/70">units</span>
              </div>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-xl lg:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">⭐</div>
          </div>
        </div>

        <div class="group glass-panel rounded-[28px] p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border-b-4 border-b-[#ff9d1c] relative overflow-hidden cursor-pointer">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#ff9d1c]/10 rounded-full group-hover:bg-[#ff9d1c]/20 transition-colors duration-300"></div>
          <div class="flex justify-between items-start relative gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white mb-2 font-candy tracking-wide truncate">Active deliveries</p>
              <div class="flex items-baseline gap-2">
                <p class="text-4xl lg:text-5xl font-candy font-semibold">{{ activeDeliveries() }}</p>
                <span class="text-sm text-white/70">routes</span>
              </div>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#ff9d1c]/20 flex items-center justify-center text-xl lg:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">🚚</div>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex flex-col xl:flex-row gap-6 mb-6">

        <!-- Calculation engine -->
        <div class="xl:w-[65%] glass-panel rounded-[32px] p-8 flex flex-col">

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 class="font-candy text-2xl md:text-3xl font-semibold mb-2">Raw material to product calculation</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-white/55">Bill of materials (BOM)</span>
                
                <!-- DYNAMIC PRODUCT SELECTOR -->
                <div class="relative">
                  <select [(ngModel)]="selectedProductSku" (ngModelChange)="fetchBomAnalysis()" class="bg-[#EAC224]/15 border border-[#EAC224]/40 text-[#EAC224] pl-4 pr-8 py-1.5 rounded-full font-candy text-sm font-bold outline-none cursor-pointer hover:bg-[#EAC224]/25 transition-colors appearance-none text-center">
                    @for (p of catalogItems(); track p.sku) {
                        <option [value]="p.sku" class="bg-[#1d2f0d] text-white">{{ p.name }}</option>
                    }
                  </select>
                  <svg class="w-4 h-4 text-[#EAC224] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <span class="bg-[#9be15d]/15 text-[#b7f27c] px-4 py-2 rounded-full text-xs font-bold border border-[#9be15d]/30 flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
              </span>
              Auto-calculating
            </span>
          </div>

          <!-- ADDED custom-scrollbar here so it matches the thin styling horizontally -->
          <div class="overflow-x-auto mb-6 bg-black/20 rounded-2xl border border-white/10 p-2 custom-scrollbar">
            <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead>
                <tr class="text-white/50 font-candy text-[13px]">
                  <th class="py-4 px-4 font-medium border-b border-white/10">Component</th>
                  <th class="py-4 px-4 font-medium border-b border-white/10">Unit req</th>
                  <th class="py-4 px-4 font-medium border-b border-white/10">Available qty</th>
                  <th class="py-4 px-4 font-medium border-b border-white/10">Max yield contribution</th>
                  <th class="py-4 px-4 font-medium text-center border-b border-white/10">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                
                @for (req of bomAnalysis()?.requirements; track req.material) {
                  <tr class="hover:bg-white/5 transition-colors cursor-pointer group" [class.bg-[#B4161B]/20]="getContribution(req) === bomAnalysis()?.maxProducible">
                    <td [class.shadow-[inset_4px_0_0_#ef4444]]="getContribution(req) === bomAnalysis()?.maxProducible" class="py-4 px-4 font-bold text-white/90">
                      <div class="flex items-center gap-3" [class.text-[#ffb4b7]]="getContribution(req) === bomAnalysis()?.maxProducible">
                        <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">📦</span> 
                        {{ req.material }}
                      </div>
                    </td>
                    <td class="py-4 px-4 text-white/70" [class.text-[#ffb4b7]]="getContribution(req) === bomAnalysis()?.maxProducible">
                      {{ req.required }} {{ req.unit }}
                    </td>
                    <td class="py-4 px-4 font-extrabold text-base" [class.text-[#ffb4b7]]="getContribution(req) === bomAnalysis()?.maxProducible">
                      {{ req.available | number }} {{ req.unit }}
                    </td>
                    <td class="py-4 px-4 font-bold text-[#9be15d]" [class.text-[#ffb4b7]]="getContribution(req) === bomAnalysis()?.maxProducible">
                      {{ getContribution(req) | number }} pieces
                    </td>
                    <td class="py-4 px-4 text-center">
                      @if (getContribution(req) === bomAnalysis()?.maxProducible) {
                         <span class="bg-[#B4161B] text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">Bottleneck</span>
                      } @else {
                         <span class="bg-[#9be15d]/15 text-[#b7f27c] px-3 py-1.5 rounded-full text-xs font-bold border border-[#9be15d]/30">Adequate</span>
                      }
                    </td>
                  </tr>
                }
                
                @if (!bomAnalysis()?.requirements?.length) {
                  <tr><td colspan="5" class="py-8 text-center text-white/50">No Bill of Materials found for this product.</td></tr>
                }
              </tbody>
            </table>
          </div>

          <!-- DYNAMIC System Recommendation Auto-Messaging -->
          <div class="mt-auto bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-[#22d3ee]/10 transition-colors">
            <div class="flex items-center gap-6 w-full md:w-auto">
              <!-- Highlighted Yield Metric -->
              <div class="bg-[#22d3ee]/15 border border-[#22d3ee]/40 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[140px] shadow-inner shrink-0">
                <span class="font-candy text-4xl font-extrabold text-[#7fe7f7] mb-1">{{ (bomAnalysis()?.maxProducible || 0) | number }}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#22d3ee]">Total Pieces</span>
              </div>
              
              <div class="flex-1">
                <h4 class="font-candy font-bold text-xl text-white mb-1.5 flex items-center gap-2">
                  <span></span> Production Capacity Analysis
                </h4>
              </div>
            </div>

            <button (click)="autoProcureShortfalls()" [disabled]="isSubmitting() || (bomAnalysis()?.requirements?.length === 0)" class="font-candy tracking-wide bg-[#22d3ee]/20 border border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee] hover:text-[#101a07] px-8 py-3.5 rounded-full font-bold text-sm transition-all whitespace-nowrap cursor-pointer hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] shrink-0 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting() ? 'Drafting PRs...' : 'Auto-Procure Shortfalls' }}
            </button>
          </div>
        </div>

        <!-- Recent events dynamically loaded from DB -->
        <div class="xl:w-[35%] glass-panel rounded-[32px] p-8 flex flex-col relative overflow-hidden">
          <!-- Decorative background blur -->
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#9be15d]/5 rounded-full blur-[60px] pointer-events-none"></div>

          <div class="flex items-center justify-between mb-8 relative z-10">
            <h3 class="font-candy text-2xl font-semibold flex items-center gap-3">
              Recent Activity
            </h3>
            <button (click)="fetchDashboardData()" aria-label="Refresh events" class="bg-black/20 border border-white/10 text-white/70 hover:text-[#EAC224] hover:border-[#EAC224]/50 hover:bg-[#EAC224]/10 hover:rotate-180 transition-all duration-500 p-2.5 rounded-xl cursor-pointer shadow-inner">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>

          <!-- The list fills the card (the left column sets the height) and scrolls inside it, so there is no dead space below -->
          <div class="flex-1 min-h-[320px] relative z-10 -ml-4">
           <div class="absolute inset-0 overflow-y-auto pr-6 pl-4 pb-2 custom-scrollbar">
            <div class="relative min-h-full pt-2 pb-6">
              <!-- Enhanced Timeline Line: Bound to the full padding container so it doesn't get cut off -->
              <div class="absolute left-[11px] top-4 bottom-4 w-[2px] bg-white/10 rounded-full"></div>

              <div class="space-y-5 relative z-10 pl-10">
                
                @for (event of recentEvents(); track event.log_id; let i = $index) {
                  <div class="relative group cursor-pointer">
                    <!-- Glowing Timeline Dot -->
                    <div class="absolute -left-[40px] top-1.5 w-6 h-6 rounded-full border-[3px] border-[#1d2f0d] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-all duration-300 z-10"
                         [ngClass]="getEventColor(event.action_type)">
                      <div class="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                      @if (i === 0) {
                         <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" [ngClass]="getEventColor(event.action_type)"></span>
                      }
                    </div>
                    
                    <!-- Enhanced Event Card -->
                    <div class="bg-gradient-to-br from-white/10 to-transparent p-5 rounded-[20px] border border-white/10 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:translate-x-1.5 group-hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5)] relative overflow-hidden">
                      <!-- Subtle left glow effect based on event type -->
                      <div class="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity" [ngClass]="getEventColor(event.action_type)"></div>
                      
                      <div class="flex items-center justify-between mb-2 gap-2">
                        <p class="text-[10px] font-extrabold uppercase tracking-widest font-candy flex items-center gap-1.5" [ngClass]="getTextColor(event.action_type)">
                          <svg class="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {{ event.timestamp }}
                        </p>
                        <span class="text-[9px] bg-black/30 px-2 py-0.5 rounded border border-white/5 text-white/50 font-bold uppercase tracking-wider">{{ event.module_name }}</span>
                      </div>
                      
                      <h4 class="text-[15px] font-extrabold mb-1.5 text-white tracking-wide">{{ event.action_type }} <span class="text-white/40 font-normal mx-1">|</span> <span class="text-white/80 font-medium text-sm">{{ event.record_ref }}</span></h4>
                      
                      <p class="text-[13px] text-white/60 leading-relaxed font-medium">{{ event.details }}</p>
                    </div>
                  </div>
                }

                @if (recentEvents().length > 0) {
                  <p class="text-center text-[11px] font-semibold text-white/35 pt-1">✓ You're all caught up</p>
                }

                @if (recentEvents().length === 0) {
                  <div class="flex flex-col items-center justify-center text-center py-10 opacity-50">
                    <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3 border border-white/10">📭</div>
                    <p class="text-sm font-semibold">No recent activity</p>
                    <p class="text-xs mt-1 font-medium">Events will appear here once actions are taken.</p>
                  </div>
                }

              </div>
            </div>
           </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row - Most Purchased & Employee Sales -->
      <div class="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <!-- Most Purchased Product Dynamically Fetched -->
        <div class="glass-panel rounded-[32px] p-8 flex flex-col relative overflow-hidden group">
          <div class="absolute -right-16 -bottom-16 w-56 h-56 bg-[#EAC224]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex items-center justify-between gap-3 mb-8">
            <h3 class="font-candy text-2xl font-semibold">Highest Production Volume</h3>
            <span class="inline-flex items-center gap-1.5 bg-[#EAC224]/15 border border-[#EAC224]/40 text-[#EAC224] px-3 py-1 rounded-full font-candy text-xs font-semibold whitespace-nowrap">🏆 Top Manufactured</span>
          </div>

          <div class="relative z-10 flex flex-col sm:flex-row gap-8 items-center flex-1">

            <!-- Product photo with error fallback -->
            <div class="relative shrink-0 w-full sm:w-60 h-44 md:h-48 flex items-center justify-center">
              <div class="absolute inset-4 rounded-full bg-[#EAC224]/15 blur-3xl"></div>
              <div class="a-float relative w-full h-full flex items-center justify-center">
                @if (imageError()) {
                  <div class="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-5xl shadow-inner">
                    🍬
                  </div>
                } @else {
                  <img [src]="bestSeller().image_url || 'assets/products/placeholder.png'" 
                       [alt]="bestSeller().name" 
                       (error)="imageError.set(true)"
                       class="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-[0_22px_30px_-12px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out group-hover:scale-105" />
                }
              </div>
            </div>

            <!-- Details -->
            <div class="flex flex-col justify-center text-center sm:text-left">
              <p class="font-candy text-xs font-semibold text-white/50 tracking-wider mb-1">Top product</p>
              <h4 class="font-candy text-3xl font-bold text-[#EAC224] mb-2 leading-tight">{{ bestSeller().name }}</h4>

              <div class="grid grid-cols-2 gap-3 max-w-sm">
                <div class="bg-[#9be15d]/10 border border-[#9be15d]/25 rounded-2xl px-4 py-3">
                  <p class="font-candy text-2xl font-bold text-[#9be15d] leading-none">{{ bestSeller().inStock | number }}</p>
                  <p class="text-[11px] text-white/55 font-semibold mt-1.5">Units in Vault</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <p class="flex items-center justify-center sm:justify-start gap-2 font-candy text-lg font-bold leading-none">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#9be15d] animate-pulse"></span>Active
                  </p>
                  <p class="text-[11px] text-white/55 font-semibold mt-2">Production Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Highest Sales for Employees (Users Leaderboard) -->
        <div class="glass-panel rounded-[32px] p-8 flex flex-col">
          <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h3 class="font-candy text-2xl font-semibold">Active Authorized Personnel</h3>

            <!-- Animated slider tabs: gold pill that glides exactly one column per step -->
            <div class="relative grid grid-cols-3 bg-black/20 p-1 rounded-full w-[220px] shrink-0" role="group" aria-label="Time range">
              <div class="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] bg-[#EAC224] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_6px_14px_-6px_rgba(234,194,36,0.8)]"
                   [style.transform]="'translateX(' + (employeeFilter() === 'Daily' ? 0 : employeeFilter() === 'Weekly' ? 100 : 200) + '%)'">
              </div>

              <button (click)="employeeFilter.set('Daily')" class="relative z-10 py-1.5 text-xs font-bold transition-colors duration-300 cursor-pointer"
                      [ngClass]="employeeFilter() === 'Daily' ? 'text-[#2d3e15]' : 'text-white'">Daily</button>
              <button (click)="employeeFilter.set('Weekly')" class="relative z-10 py-1.5 text-xs font-bold transition-colors duration-300 cursor-pointer"
                      [ngClass]="employeeFilter() === 'Weekly' ? 'text-[#2d3e15]' : 'text-white'">Weekly</button>
              <button (click)="employeeFilter.set('Monthly')" class="relative z-10 py-1.5 text-xs font-bold transition-colors duration-300 cursor-pointer"
                      [ngClass]="employeeFilter() === 'Monthly' ? 'text-[#2d3e15]' : 'text-white'">Monthly</button>
            </div>
          </div>

          <!-- EXPANDED LEADERBOARD -->
          <div class="flex-1 flex flex-col gap-3 justify-center">
            
            @for (emp of topEmployees(); track emp.name; let i = $index) {
              <div class="group flex items-center gap-4 p-4 rounded-2xl border hover:bg-white/10 transition-all duration-300 ease-out hover:translate-x-1.5 relative overflow-hidden shadow-lg"
                   [ngClass]="i === 0 ? 'bg-[#EAC224]/10 border-[#EAC224]/40' : 'bg-white/5 border-white/10'">
                @if (i === 0) {
                  <div class="absolute -right-4 -top-4 w-16 h-16 bg-[#EAC224]/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                }
                
                <div class="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg text-[#1d2f0d] shadow-lg group-hover:rotate-12 transition-transform duration-300"
                     [style.background]="i === 0 ? 'linear-gradient(135deg,#EAC224,#ff9d1c)' : i === 1 ? 'linear-gradient(135deg,#e2e8f0,#94a3b8)' : 'linear-gradient(135deg,#f59e0b,#b45309)'">
                  {{ emp.initials }}
                </div>
                
                <div class="flex-1 relative z-10">
                  <h4 class="font-bold text-base transition-colors flex items-center gap-2 text-white group-hover:text-[#EAC224]">
                    {{ emp.name }} <span class="text-sm">{{ i === 0 ? '🥇' : (i === 1 ? '🥈' : '🥉') }}</span>
                  </h4>
                  <p class="text-xs text-white/60">System Operator</p>
                </div>
                <div class="text-right relative z-10">
                  <p class="font-candy font-bold text-[#9be15d] text-xl group-hover:scale-110 origin-right transition-transform duration-300">
                    {{ getEmployeeSales(emp) }}
                  </p>
                  <p class="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Mock KPI</p>
                </div>
              </div>
            }

            @if (topEmployees().length === 0) {
              <div class="text-center text-white/50 py-8">No registered operators found.</div>
            }

          </div>
        </div>

      </div>

      <!-- ========== CANDIES & ROCKET SPILLING OVER THE PANEL EDGES ========== -->

      <!-- Rocket: lowered to avoid hitting the top navbar -->
      <div class="a-rocket hidden xl:block absolute z-20 -top-6 left-[47%] w-24 pointer-events-none candy-shadow">
        <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
          <defs>
            <linearGradient id="dRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient>
          </defs>
          <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
          <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
          <g class="a-flame">
            <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
            <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
          </g>
          <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#dRBody)" stroke="#94a3b8" stroke-width="2"/>
          <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
          <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
          <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
          <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
        </svg>
      </div>

      <!-- Star gummy: top edge -->
      <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
        <svg viewBox="0 0 120 120" fill="none">
          <defs><linearGradient id="dStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
          <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#dStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
          <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        </svg>
      </div>

      <!-- Mint swirl: right edge -->
      <div class="hidden md:block absolute z-20 top-[34%] -right-6 w-14 pointer-events-none candy-shadow">
        <svg class="a-spin" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" fill="#f4fbe4"/>
          <path d="M30 30 m0 -22 a22 22 0 1 1 -22 22 M30 30 m0 -12 a12 12 0 1 1 -12 12" stroke="#598E18" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Lime donut: bottom-right corner -->
      <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
        <svg viewBox="0 0 220 190" fill="none">
          <defs>
            <linearGradient id="dGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
            <mask id="dDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
          </defs>
          <g mask="url(#dDonut)">
            <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
            <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
            <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#dGlz)"/>
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

      <!-- Lollipop: bottom-left corner -->
      <div class="hidden md:block absolute z-20 -bottom-14 -left-6 w-[70px] pointer-events-none candy-shadow">
        <svg class="a-wiggle" viewBox="0 0 90 150" fill="none">
          <rect x="41" y="62" width="8" height="86" rx="4" fill="#f4fbe4"/>
          <circle cx="45" cy="42" r="38" fill="#EAC224"/>
          <path d="M45 42 m0 -30 a30 30 0 1 1 -30 30 M45 42 m0 -16 a16 16 0 1 1 -16 16" stroke="#B4161B" stroke-width="8" stroke-linecap="round"/>
          <path d="M20 22 Q26 12 36 9" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/>
        </svg>
      </div>

      <!-- Wrapped candy: bottom edge -->
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
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  Math = Math; // Template reference

  // DYNAMIC USER SIGNAL
  userName = signal<string>('User');

  currentYield = signal<number>(0);
  sellableStock = signal<number>(0);
  pendingQa = signal<number>(0);
  activeDeliveries = signal<number>(0);
  
  isSubmitting = signal<boolean>(false);
  suppliers = signal<any[]>([]);

  salesCompilation = signal<number>(0);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error' | 'info'}>({ show: false, message: '', type: 'success' });

  recentEvents = signal<any[]>([]);
  topEmployees = signal<any[]>([]);
  bestSeller = signal<any>({ name: 'Loading...', inStock: 0, image_url: '' });
  imageError = signal<boolean>(false);

  // Add properties for dynamic BOM calculation
  catalogItems = signal<any[]>([]);
  selectedProductSku = signal<string>('FG-JWH-001'); // Default to Jumbo White
  bomAnalysis = signal<any>(null);

  salesCompilationFormatted = computed(() => {
    const val = this.salesCompilation();
    if (val === 0) return '₱ 0';
    if (val >= 1000000) return '₱' + (val / 1000000).toFixed(2).replace(/\.00$/, '') + ' M';
    if (val >= 1000) return '₱' + (val / 1000).toFixed(1).replace(/\.0$/, '') + ' K';
    return '₱' + val.toString();
  });

  employeeFilter = signal<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 4000);
  }

  generateReport() {
    this.showToast('Generating operations report...', 'info');
    setTimeout(() => window.print(), 1000);
  }

  viewPoDetails() {
    this.showToast('Navigating to Procurement module...', 'info');
    setTimeout(() => {
      this.router.navigate(['/procurement']);
    }, 800);
  }

  getEventColor(action: string) {
    if (action.includes('REJECT') || action.includes('FAIL')) return 'bg-[#B4161B]';
    if (action.includes('APPROVE') || action.includes('CLEARED') || action.includes('LOGIN')) return 'bg-[#9be15d]';
    if (action.includes('UPDATE')) return 'bg-[#EAC224]';
    return 'bg-[#22d3ee]';
  }
  
  getTextColor(action: string) {
    if (action.includes('REJECT') || action.includes('FAIL')) return 'text-[#ffb4b7]';
    if (action.includes('APPROVE') || action.includes('CLEARED') || action.includes('LOGIN')) return 'text-[#b7f27c]';
    if (action.includes('UPDATE')) return 'text-[#EAC224]';
    return 'text-[#7fe7f7]';
  }

  getEmployeeSales(emp: any): string {
    const f = this.employeeFilter();
    const s = emp.sales.find((x: any) => x.filter === f);
    return s ? s.amount : '₱0 K';
  }

  // Calculate the max yield contribution for a specific row
  getContribution(req: any): number {
    if (!req || !req.required) return 0;
    return Math.floor(req.available / req.required);
  }

  ngOnInit() {
    // Load active user name
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try { 
          const parsed = JSON.parse(userStr);
          this.userName.set(parsed.name || parsed.full_name || 'User'); 
        } catch(e) {}
      }
    }

    this.fetchDashboardData();
    this.fetchCatalog();
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.apiService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers.set(data.map(s => ({ id: s.supplier_id, name: s.name, category: s.category || '' })));
      },
      error: () => console.error('Failed to load suppliers')
    });
  }

  fetchCatalog() {
    this.apiService.getPosCatalog().subscribe({
      next: (data) => {
        this.catalogItems.set(data);
        if (!data.some(d => d.sku === this.selectedProductSku()) && data.length > 0) {
          this.selectedProductSku.set(data[0].sku);
        }
        this.fetchBomAnalysis();
      },
      error: () => console.error('Failed to load catalog for BOM')
    });
  }

  fetchBomAnalysis() {
    const payload = { productSku: this.selectedProductSku(), qty: 1 };
    
    // Explicitly using fetch here to align with backend structure
    fetch('http://localhost:3000/api/calculate-materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        this.bomAnalysis.set(res);
      } else {
        this.bomAnalysis.set(null);
      }
    })
    .catch(() => {
      this.bomAnalysis.set(null);
      console.error('Network error checking BOM feasibility');
    });
  }

  autoProcureShortfalls() {
    const analysis = this.bomAnalysis();
    if (!analysis || !analysis.requirements) return;

    const shortfalls = analysis.requirements.filter((r: any) => r.shortfall > 0);
    if (shortfalls.length === 0) {
      this.showToast('No shortfalls detected. Stock is adequate.', 'info');
      return;
    }

    this.isSubmitting.set(true);
    let completed = 0;
    let hasError = false;

    shortfalls.forEach((item: any) => {
      let foundSupplierId = '';
      let foundCost = 0;
      let foundCatalogName = item.material;

      for (const sup of this.suppliers()) {
        if (!sup.category) continue;
        const catalogItems = sup.category.split(',');
        for (const catItem of catalogItems) {
          const parts = catItem.split('|');
          const catName = parts[0].trim().toLowerCase();
          
          const coreName = item.material.toLowerCase().split('-')[0].trim();
          if (catName.includes(coreName) || coreName.includes(catName)) {
            foundSupplierId = sup.id;
            foundCost = parts.length > 1 ? parseFloat(parts[1].trim()) : 0;
            foundCatalogName = parts[0].trim();
            break;
          }
        }
        if (foundSupplierId) break;
      }

      if (!foundSupplierId && this.suppliers().length > 0) {
         foundSupplierId = this.suppliers()[0].id;
      }

      this.apiService.createPurchaseOrder({
        supplierId: foundSupplierId,
        materialId: foundCatalogName,
        qty: Math.ceil(item.shortfall), 
        cost: foundCost,
        userName: 'System Auto-MRP',
        status: 'Pending Approval' // Sent to Approvals tab
      }).subscribe({
        next: () => {
          completed++;
          if (completed === shortfalls.length) this.finalizeAutoProcure(hasError);
        },
        error: () => {
          hasError = true;
          completed++;
          if (completed === shortfalls.length) this.finalizeAutoProcure(hasError);
        }
      });
    });
  }

  finalizeAutoProcure(hasError: boolean) {
    this.isSubmitting.set(false);
    if (hasError) {
      this.showToast('Some automated POs failed to generate.', 'error');
    } else {
      this.showToast('Success! Purchase Requisitions drafted and sent for approval.', 'success');
      // Navigate to procurement after a short delay so user can see it pending
      setTimeout(() => {
        this.router.navigate(['/procurement']);
      }, 1500);
    }
  }

  fetchDashboardData() {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.currentYield.set(data.currentYield);
        this.sellableStock.set(data.sellableStock);
        this.pendingQa.set(data.pendingQA);
        this.activeDeliveries.set(data.activeDeliveries);
        this.salesCompilation.set(data.totalSales || 1250400); 

        // Apply real data from database queries
        this.recentEvents.set(data.recentEvents || []);
        
        if (data.bestSeller && data.bestSeller.name !== 'Unknown') {
           this.imageError.set(false); // Reset error state on new product data

           // Automatically intercept and correct the file extension to PNG
           if (data.bestSeller.image_url) {
               data.bestSeller.image_url = data.bestSeller.image_url.replace(/\.jpe?g$/i, '.png');
           }

           this.bestSeller.set(data.bestSeller);
        } else {
           this.bestSeller.set({ name: 'No Product Available', inStock: 0, image_url: 'assets/products/placeholder.png' });
        }

        // Dynamically map users to the leaderboard
        const users = data.employees || [];
        const mappedUsers = users.map((u: any, idx: number) => ({
            name: u.name,
            initials: u.name.substring(0, 2).toUpperCase(),
            sales: [
               { filter: 'Daily', amount: '₱' + (14.2 - idx * 3).toFixed(1) + ' K' },
               { filter: 'Weekly', amount: '₱' + (85.4 - idx * 20).toFixed(1) + ' K' },
               { filter: 'Monthly', amount: '₱' + (312.0 - idx * 60).toFixed(1) + ' K' }
            ]
        }));
        
        this.topEmployees.set(mappedUsers);
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }
}