import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy, AfterViewInit, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare var L: any; 

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      :host { display: block; }
      
      .logistics-container, .logistics-container * { font-family: 'Fredoka', sans-serif !important; }
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel { background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.12); }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }
      .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 8px; }
      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 8px; }
      .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(234, 194, 36, 0.5); }

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

      .leaflet-popup-content-wrapper { background: #1d2f0d; color: white; border: 1px solid rgba(255,255,255,0.2); font-family: 'Fredoka', sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .leaflet-popup-tip { background: #1d2f0d; border: 1px solid rgba(255,255,255,0.2); }
      .map-container { border-radius: 22px; overflow: hidden; transform: translate3d(0,0,0); }
      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <div class="logistics-container min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip relative">

      <!-- FLOATING TOAST NOTIFICATION -->
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

      <!-- EXPANDED IMAGE OVERLAY -->
      @if (expandedImage()) {
        <div class="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200" (click)="expandedImage.set(null)">
          <div class="relative max-w-5xl max-h-full w-full h-full flex flex-col items-center justify-center">
            <button (click)="expandedImage.set(null)" class="absolute top-0 right-0 z-50 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#B4161B] transition-colors border border-white/20 shadow-lg cursor-pointer text-xl font-bold">✕</button>
            <img [src]="expandedImage()" class="max-w-full max-h-[90vh] object-contain rounded-2xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-white p-4" (click)="$event.stopPropagation()">
          </div>
        </div>
      }

      <!-- EXPANDED MAP OVERLAY -->
      @if (expandedMapData()) {
        <div class="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200" (click)="closeExpandedMap()">
          <div class="w-full max-w-5xl h-[80vh] bg-[#1a2b0c] rounded-[28px] border border-white/20 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden" (click)="$event.stopPropagation()">
             <button (click)="closeExpandedMap()" class="absolute top-6 right-6 z-[99999] bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#B4161B] transition-colors border border-white/20 shadow-lg cursor-pointer text-xl font-bold">✕</button>
             
             <div class="absolute top-6 left-6 z-[99999] bg-black/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 pointer-events-none">
               <p class="text-[11px] uppercase tracking-wider text-white/70 font-bold mb-1">Geotag verification</p>
               <p class="text-sm font-bold text-[#9be15d]">{{ expandedMapData().destination ? expandedMapData().destination.split('—')[0].trim() : 'Delivery Location' }}</p>
             </div>

             <!-- Expanded Map Container -->
             <div id="expanded-logistics-map" class="w-full h-full outline-none bg-[#14240a]"></div>
          </div>
        </div>
      }

      <!-- DETAILED E-POD / DELIVERY DETAILS MODAL -->
      @if (viewDetailsModal()) {
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" (click)="closeDetailsModal()">
          <div class="bg-[#1b2b10] border border-white/20 rounded-[28px] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto custom-scroll relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]" (click)="$event.stopPropagation()">
            
            <!-- Close Button -->
            <div class="absolute top-5 right-6 z-20">
              <button (click)="closeDetailsModal()" class="text-white/60 hover:text-white flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer">
                Close ✕
              </button>
            </div>

            <div class="p-8">
              <!-- Header -->
              <div class="flex flex-wrap items-center gap-4 mb-6 pb-5 border-b border-white/10">
                <h2 class="text-3xl font-bold text-white tracking-wide">Delivery Details - {{ viewDetailsModal().route_id || viewDetailsModal().dr_number }}</h2>
                <button class="px-3 py-1.5 rounded-full border border-white/20 text-white/80 text-[11px] font-bold hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Edit
                </button>
                <div class="ml-auto mr-16">
                  <span class="px-4 py-1.5 rounded-full text-xs font-bold border border-[#9be15d]/40 text-[#b7f27c] bg-[#9be15d]/15 shadow-sm uppercase tracking-wider">
                    {{ viewDetailsModal().route_status }}
                  </span>
                </div>
              </div>

              <!-- Information Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <!-- Order Info -->
                <div>
                  <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">📋 Order Info</h4>
                  <div class="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
                    <span class="text-white/50 font-semibold">DR Number:</span> <span class="font-bold text-white">{{ viewDetailsModal().route_id || viewDetailsModal().dr_number }}</span>
                    <span class="text-white/50 font-semibold">Order ID:</span> <span class="font-bold text-white">{{ viewDetailsModal().sales_order_id || viewDetailsModal().order_ref || 'N/A' }}</span>
                    <span class="text-white/50 font-semibold">Dispatch Date:</span> <span class="font-bold text-white">{{ today() }}</span>
                    <span class="text-white/50 font-semibold">Delivery Time:</span> <span class="font-bold text-white">{{ viewDetailsModal().delivery_time || 'Completed' }}</span>
                  </div>
                </div>

                <!-- Destination & Customer -->
                <div>
                  <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">🏢 Destination & Customer</h4>
                  <div class="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                    <span class="text-white/50 font-semibold">Recipient:</span> <span class="font-bold text-white">{{ viewDetailsModal().destination ? viewDetailsModal().destination.split('—')[0].trim() : 'Customer' }}</span>
                    <span class="text-white/50 font-semibold">Address:</span> <span class="font-bold text-white leading-tight">{{ viewDetailsModal().destination ? (viewDetailsModal().destination.includes('—') ? viewDetailsModal().destination.split('—')[1].trim() : viewDetailsModal().destination) : 'N/A' }}</span>
                    <span class="text-white/50 font-semibold mt-1">Contact:</span> <span class="font-bold text-white mt-1">+63 917 123 4567</span>
                  </div>
                </div>

                <!-- Delivery Agent -->
                <div>
                  <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">🚚 Delivery Agent</h4>
                  <div class="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                    <span class="text-white/50 font-semibold">Driver:</span> <span class="font-bold text-white">{{ viewDetailsModal().courier_type || 'Juan dela Cruz' }}</span>
                    <span class="text-white/50 font-semibold">Vehicle:</span> <span class="font-bold text-white">L300 (ABC-1234)</span>
                  </div>
                </div>
              </div>

              <!-- Proof of Delivery (POD) Section -->
              <div class="mb-8">
                <h4 class="text-white font-bold mb-4 pb-2 border-b border-white/10">Proof of Delivery (POD)</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  <!-- E-Signature -->
                  <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col group cursor-pointer" (click)="expandedImage.set(viewDetailsModal().signature_url)">
                    <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">E-Signature</span></div>
                    <div class="bg-white p-4 h-36 flex items-center justify-center border-b border-white/10 relative overflow-hidden">
                      @if (viewDetailsModal().signature_url) {
                        <img [src]="viewDetailsModal().signature_url" class="max-w-full max-h-full object-contain mix-blend-multiply" alt="Signature">
                      } @else {
                        <span class="text-5xl text-gray-900" style="font-family: 'Brush Script MT', cursive; transform: rotate(-3deg);">{{ getInitials(viewDetailsModal().epod_received_by || viewDetailsModal().destination) }}</span>
                      }
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-white font-bold tracking-wider text-xs bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> View Full Image</span>
                      </div>
                    </div>
                    <div class="p-3 text-xs bg-[#16220a] flex-1">
                      <p class="text-white/70 mb-1">Received By: <span class="text-white font-bold">{{ viewDetailsModal().epod_received_by || (viewDetailsModal().destination ? viewDetailsModal().destination.split('—')[0].trim() : 'Customer') }}</span></p>
                      <p class="text-white/40">Timestamp: {{ today() }} {{ viewDetailsModal().delivery_time || 'Completed' }}</p>
                    </div>
                  </div>

                  <!-- Photo Proof -->
                  <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col group cursor-pointer" (click)="expandedImage.set(viewDetailsModal().photo_url || 'https://images.unsplash.com/photo-1580674684081-77673ce86c10?q=80&w=600&auto=format&fit=crop')">
                    <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">Photo Proof</span></div>
                    <div class="h-36 bg-black relative border-b border-white/10">
                      <img [src]="viewDetailsModal().photo_url || 'https://images.unsplash.com/photo-1580674684081-77673ce86c10?q=80&w=600&auto=format&fit=crop'" alt="Proof of delivery" class="w-full h-full object-cover">
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-white font-bold tracking-wider text-xs bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> View Full Image</span>
                      </div>
                    </div>
                    <div class="p-3 text-xs bg-[#16220a] flex-1">
                      <p class="text-white/70">Delivery Photo / Proof of Condition</p>
                    </div>
                  </div>

                  <!-- Geotag / Location -->
                  <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col group cursor-pointer" (click)="openExpandedMap(viewDetailsModal())">
                    <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">Geotag / Location</span></div>
                    <div class="h-36 bg-[#1a2b0c] relative border-b border-white/10">
                       <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" alt="Map View" class="w-full h-full object-cover opacity-50 mix-blend-luminosity">
                       <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span class="text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] filter">📍</span>
                         <span class="bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow-md">Bocaue, Philippines</span>
                       </div>
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <span class="text-white font-bold tracking-wider text-xs bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> Open Interactive Map</span>
                       </div>
                    </div>
                    <div class="p-3 text-[11px] bg-[#16220a] font-mono text-white/60 flex-1">
                      <p>Lat: 14.7930012</p>
                      <p>Long: 120.9323114</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Items Delivered Table -->
              <div>
                <h4 class="text-white font-bold mb-4 pb-2 border-b border-white/10">Items Delivered</h4>
                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden">
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-white/5 text-white/70 text-xs font-bold border-b border-white/10 uppercase tracking-wider">
                      <tr>
                        <th class="p-4 w-24">Qty</th>
                        <th class="p-4">Product Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5 font-medium">
                      <tr class="hover:bg-white/5 transition-colors">
                        <td class="p-4 text-[#EAC224] font-extrabold text-base">{{ viewDetailsModal().total_weight || viewDetailsModal().allocated_qty || '100 units' }}</td>
                        <td class="p-4 font-bold text-white/90">Galaxy Candies Assorted Batch</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8 flex justify-between items-center">
          <h2 class="text-4xl md:text-5xl font-semibold tracking-wide">Logistics &amp; fleet management</h2>
          <button (click)="fetchLogisticsData()" [class]="btnGhost + ' flex items-center gap-2'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh Data
          </button>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">
          <div class="border-b border-white/10 px-8 pt-6 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-x-auto custom-scroll">
            <div class="relative flex w-full min-w-[850px] max-w-[1000px] bg-black/20 p-1.5 rounded-full">
              <!-- Sliding Indicator mathematically adjusted for 5 tabs -->
              <div class="absolute top-1.5 bottom-1.5 w-[calc(20%-2.4px)] bg-[#EAC224] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]"
                   [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'"></div>
              
              <button (click)="setTab('l-routes')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300" [class.text-[#2d3e15]]="subTab() === 'l-routes'" [class.text-white]="subTab() !== 'l-routes'">Delivery Routes</button>
              <button (click)="setTab('l-dispatch')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300" [class.text-[#2d3e15]]="subTab() === 'l-dispatch'" [class.text-white]="subTab() !== 'l-dispatch'">Pending Dispatch</button>
              <button (click)="setTab('l-epod')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300" [class.text-[#2d3e15]]="subTab() === 'l-epod'" [class.text-white]="subTab() !== 'l-epod'">e-POD Uploads</button>
              <button (click)="setTab('l-status')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300" [class.text-[#2d3e15]]="subTab() === 'l-status'" [class.text-white]="subTab() !== 'l-status'">Fleet Status</button>
              <button (click)="setTab('l-reports')" class="relative z-10 w-1/5 py-3 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300" [class.text-[#2d3e15]]="subTab() === 'l-reports'" [class.text-white]="subTab() !== 'l-reports'">Reports &amp; Analytics</button>
            </div>
          </div>

          <div class="p-8">

            <!-- 1. DELIVERY ROUTES -->
            @if (subTab() === 'l-routes') {
              <div class="space-y-6 animate-in fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="text-2xl font-semibold">Fleet routing &amp; e-POD capture</h3>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- LIVE TRACKER API MAP -->
                  <div class="lg:col-span-2 w-full bg-black/20 rounded-[28px] p-2 border border-white/10 flex flex-col h-[420px]">
                    <div class="w-full h-full relative flex items-center justify-center bg-[#14240a] map-container">
                      <div id="logistics-live-map" class="absolute inset-0 z-10 w-full h-full outline-none"></div>
                      <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl z-20 shadow-[0_10px_25px_rgba(0,0,0,0.5)] pointer-events-none">
                        <p class="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">Live fleet status</p>
                        <p class="text-sm font-bold text-[#9be15d] flex items-center">
                          <span class="relative flex h-2.5 w-2.5 mr-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span></span>
                          Geoapify API Active
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 3RD PARTY COURIER TRACKING -->
                  <div class="w-full bg-black/20 rounded-[28px] p-6 border border-white/10 flex flex-col h-[420px]">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xl">🛵</span>
                      <h4 class="text-lg font-bold">3rd-Party Tracking</h4>
                    </div>
                    <div class="mb-3">
                      <input type="text" [(ngModel)]="lalamoveLink" placeholder="e.g. https://lalamove.com/track..." class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white outline-none focus:border-[#EAC224] font-bold">
                    </div>
                    <button (click)="trackLalamove()" class="w-full py-2.5 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-xl font-bold text-sm transition-colors shadow-md mb-4 flex justify-center items-center gap-2 cursor-pointer">
                      Track Delivery
                    </button>

                    <div class="flex-1 bg-black/40 rounded-xl border border-white/5 overflow-hidden relative flex items-center justify-center">
                      @if (showLalamoveMap()) {
                        <div class="absolute inset-0 bg-[#f4f4f4] flex flex-col animate-in fade-in duration-300">
                          <div class="bg-[#F37021] text-white px-3 py-2 flex items-center justify-between shadow-md z-10">
                            <span class="text-xs font-bold">Courier Tracker API</span>
                          </div>
                          <div class="flex-1 relative flex flex-col items-center justify-center text-gray-500 overflow-hidden">
                            <svg class="w-12 h-12 mb-2 text-[#F37021] animate-bounce relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            <span class="text-[11px] font-bold uppercase tracking-wider text-gray-600 relative z-10">Connecting to link...</span>
                          </div>
                        </div>
                      } @else {
                        <div class="text-center p-4">
                          <span class="text-[10px] font-bold text-white/40 tracking-widest uppercase">No Active Tracking</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <!-- Routes table -->
                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll mt-6">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[14px] border-b border-white/10 bg-[#1d2f0d]">
                      <tr>
                        <th class="py-4 px-6 font-bold">DR number</th>
                        <th class="py-4 px-6 font-bold">Order ref</th>
                        <th class="py-4 px-6 font-bold">Destination</th>
                        <th class="py-4 px-6 font-bold">Courier / driver</th>
                        <th class="py-4 px-6 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium text-white">
                      @if (allRoutes().length === 0) {
                        <tr><td colspan="5" class="py-8 text-center text-white/50">No active delivery routes found.</td></tr>
                      }
                      @for (r of allRoutes(); track r.route_id || r.dr_number) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ r.route_id || r.dr_number }}</td>
                          <td class="py-4 px-6 text-sm text-white/85 font-medium">{{ r.sales_order_id || r.order_ref }}</td>
                          <td class="py-4 px-6 text-sm font-bold">{{ r.destination || r.destination_name }}<br><span class="text-xs text-white/75 font-medium">{{ r.destination_address }}</span></td>
                          <td class="py-4 px-6 text-sm font-bold">{{ r.courier_type || 'In-House Fleet' }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + getStatusChip(r.route_status)">{{ r.route_status }}</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. PENDING DISPATCH -->
            @if (subTab() === 'l-dispatch') {
              <div class="space-y-6 animate-in fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="text-2xl font-semibold">Pending dispatch queue</h3>
                </div>

                <div class="grid grid-cols-1 gap-8 items-start">
                  <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll w-full">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white text-[14px] border-b border-white/10 bg-[#1d2f0d]">
                        <tr>
                          <th class="py-4 px-6 font-bold">DR number</th>
                          <th class="py-4 px-6 font-bold">Order ref</th>
                          <th class="py-4 px-6 font-bold">Destination</th>
                          <th class="py-4 px-6 font-bold">Allocated qty</th>
                          <th class="py-4 px-6 font-bold">Status</th>
                          <th class="py-4 px-6 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-medium text-white">
                        @if (dispatchRoutes().length === 0) {
                           <tr><td colspan="6" class="py-8 text-center text-white/50">No routes pending dispatch.</td></tr>
                        }
                        @for (d of dispatchRoutes(); track d.route_id || d.dr_number) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-4 px-6 font-extrabold">{{ d.route_id || d.dr_number }}</td>
                            <td class="py-4 px-6 text-sm text-white/85 font-medium">{{ d.sales_order_id || d.order_ref }}</td>
                            <td class="py-4 px-6 text-sm font-bold">{{ d.destination || d.destination_name }}</td>
                            <td class="py-4 px-6 font-extrabold">{{ d.total_weight || d.allocated_qty }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + chipGold">{{ d.route_status }}</span></td>
                            <td class="py-4 px-6 text-right">
                              @if (d.route_status === 'AWAITING DISPATCH') {
                                <button (click)="dispatchRoute(d)" [class]="btnGold">Dispatch</button>
                              } @else {
                                <span class="text-xs text-white/50 font-bold">Dispatched</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

            <!-- 3. E-POD UPLOADS -->
            @if (subTab() === 'l-epod') {
              <div class="space-y-6 animate-in fade-in">
                <h3 class="text-2xl font-semibold">Electronic proof of delivery (e-POD) portal</h3>

                <div class="grid grid-cols-1 items-start">
                  <!-- Expanded table for full width since mobile simulator is removed -->
                  <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll w-full">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white text-[14px] border-b border-white/10 bg-[#1d2f0d]">
                        <tr>
                          <th class="py-4 px-6 font-bold">DR number</th>
                          <th class="py-4 px-6 font-bold">Destination</th>
                          <th class="py-4 px-6 font-bold">Status</th>
                          <th class="py-4 px-6 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-medium text-white">
                        @if (pendingEpodRoutes().length === 0) {
                           <tr><td colspan="4" class="py-8 text-center text-white/50">All active deliveries have been fulfilled!</td></tr>
                        }
                        @for (e of pendingEpodRoutes(); track e.route_id || e.dr_number) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-4 px-6 font-extrabold">{{ e.route_id || e.dr_number }}<br><span class="text-xs text-white/75 font-medium">{{ e.sales_order_id || e.order_ref }}</span></td>
                            <td class="py-4 px-6 text-sm font-bold">{{ e.destination || e.destination_name }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + (e.route_status === 'DELIVERED' ? chipLime : chipGold)">{{ e.route_status }}</span></td>
                            <td class="py-4 px-6 text-right flex items-center justify-end gap-3">
                              @if (e.route_status === 'DELIVERED') {
                                <span class="text-[#9be15d] font-bold">✓ Uploaded</span>
                                <button (click)="openDetailsModal(e)" class="px-4 py-2 border border-white/30 hover:border-white text-white hover:bg-white/10 rounded-lg text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm">
                                  View Details
                                </button>
                              } @else {
                                <span class="text-[#EAC224] text-xs font-bold bg-[#EAC224]/10 px-3 py-1 rounded-full">Driver completing...</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

            <!-- 4. FLEET STATUS -->
            @if (subTab() === 'l-status') {
              <div class="space-y-6 animate-in fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="text-2xl font-semibold">Fleet status</h3>
                </div>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10 custom-scroll">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[14px] border-b border-white/10 bg-[#1d2f0d]">
                      <tr>
                        <th class="py-4 px-6 font-bold">Vehicle unit</th>
                        <th class="py-4 px-6 font-bold">Driver</th>
                        <th class="py-4 px-6 font-bold">Capacity</th>
                        <th class="py-4 px-6 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium text-white">
                      @if (fleetVehicles().length === 0) {
                         <tr><td colspan="4" class="py-8 text-center text-white/50">No fleet vehicles registered.</td></tr>
                      }
                      @for (v of fleetVehicles(); track v.unit_name) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ v.unit_name }}</td>
                          <td class="py-4 px-6 text-sm font-bold">{{ v.assigned_driver }}<br><span class="text-xs text-white/75 font-medium">{{ v.driver_contact }}</span></td>
                          <td class="py-4 px-6 text-sm text-white/85 font-medium">{{ v.capacity }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + (v.is_on_route ? chipCyan : chipLime)">{{ v.is_on_route ? 'ON ROUTE' : 'AVAILABLE' }}</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 5. REPORTS & ANALYTICS -->
            @if (subTab() === 'l-reports') {
              <div class="space-y-6 animate-in fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="text-2xl font-semibold">Logistics performance &amp; analytics</h3>
                  <button (click)="generatePDF()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Generate Summary PDF
                  </button>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-[#EAC224]">
                    <p class="text-xs font-bold text-white/55 uppercase tracking-wider mb-1">Total Routes</p>
                    <p class="text-3xl font-extrabold text-[#EAC224]">{{ totalDeliveries() }}</p>
                  </div>
                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <p class="text-xs font-bold text-[#b7f27c] uppercase tracking-wider mb-1">Completed</p>
                    <p class="text-3xl font-extrabold text-[#9be15d]">{{ completedDeliveries() }}</p>
                  </div>
                  <div class="bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee]">
                    <p class="text-xs font-bold text-[#7fe7f7] uppercase tracking-wider mb-1">Success Rate</p>
                    <p class="text-3xl font-extrabold text-[#7fe7f7]">{{ successRate() }}%</p>
                  </div>
                  <div class="bg-[#ff9d1c]/10 p-5 rounded-2xl border border-[#ff9d1c]/25 border-b-4 border-b-[#ff9d1c]">
                    <p class="text-xs font-bold text-[#ffbe66] uppercase tracking-wider mb-1">Pending Dispatch</p>
                    <p class="text-3xl font-extrabold text-[#ff9d1c]">{{ pendingDispatchCount() }}</p>
                  </div>
                </div>

                <!-- Full Route History Table -->
                <div class="bg-black/20 rounded-2xl border border-white/10 overflow-hidden mt-6">
                   <div class="px-6 py-4 border-b border-white/10 bg-[#1d2f0d]">
                     <h4 class="font-bold text-white">Comprehensive Route Log</h4>
                   </div>
                   <div class="overflow-x-auto custom-scroll max-h-[400px]">
                     <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="text-white text-[13px] font-bold sticky top-0 bg-[#1d2f0d] z-10 border-b border-white/10 shadow-sm">
                          <tr>
                            <th class="py-4 px-6">Route ID</th>
                            <th class="py-4 px-6">Order Ref</th>
                            <th class="py-4 px-6">Destination</th>
                            <th class="py-4 px-6">Dispatch Date</th>
                            <th class="py-4 px-6 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10 font-medium text-white">
                          @for (r of allRoutes(); track r.route_id || r.dr_number) {
                            <tr class="hover:bg-white/10 transition-colors">
                              <td class="py-4 px-6 font-extrabold">{{ r.route_id || r.dr_number }}</td>
                              <td class="py-4 px-6 font-bold text-white/80">{{ r.sales_order_id || r.order_ref }}</td>
                              <td class="py-4 px-6 font-medium">{{ r.destination || r.destination_name }}</td>
                              <td class="py-4 px-6 font-medium text-white/60">{{ r.created_at ? (r.created_at | date:'medium') : today() }}</td>
                              <td class="py-4 px-6 text-right">
                                 <span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + getStatusChip(r.route_status)">{{ r.route_status }}</span>
                              </td>
                            </tr>
                          }
                          @if (allRoutes().length === 0) {
                             <tr><td colspan="5" class="py-12 text-center text-white/50">No historical routes found.</td></tr>
                          }
                        </tbody>
                     </table>
                   </div>
                </div>
              </div>
            }

          </div>
        </div>

      </div>
    </div>
  `
})
export class LogisticsComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);

  subTab = signal<string>('l-routes');
  lalamoveLink = signal<string>('');
  showLalamoveMap = signal<boolean>(false);

  // Data signals
  allRoutes = signal<any[]>([]);
  dispatchRoutes = signal<any[]>([]);
  pendingEpodRoutes = signal<any[]>([]);
  fleetVehicles = signal<any[]>([]);
  
  viewDetailsModal = signal<any>(null); // State for the Detailed Delivery Modal
  expandedImage = signal<string | null>(null); // State for expanded photo/signature
  expandedMapData = signal<any | null>(null); // State for expanded leaflet map
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  private expandedMapInstance: any = null;

  // Computed signals for Reports
  totalDeliveries = computed(() => this.allRoutes().length);
  completedDeliveries = computed(() => this.allRoutes().filter(r => r.route_status === 'DELIVERED').length);
  successRate = computed(() => {
     const total = this.totalDeliveries();
     return total === 0 ? '0.0' : ((this.completedDeliveries() / total) * 100).toFixed(1);
  });
  pendingDispatchCount = computed(() => this.dispatchRoutes().length);

  // Styles
  btnGold = 'px-4 py-2 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors cursor-pointer';
  btnGhost = 'px-4 py-2 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors cursor-pointer';
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';

  ngOnInit() {
    this.fetchLogisticsData();
  }

  ngAfterViewInit() {
    if (this.subTab() === 'l-routes') {
      this.loadLeaflet();
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 4000);
  }

  generatePDF() {
    this.showToast('Generating Logistics Report PDF...', 'success');
    setTimeout(() => window.print(), 1000);
  }

  getTabIndex(): number {
    return ['l-routes', 'l-dispatch', 'l-epod', 'l-status', 'l-reports'].indexOf(this.subTab());
  }

  setTab(tab: string) {
    this.subTab.set(tab);
    if (tab === 'l-routes') {
      setTimeout(() => this.loadLeaflet(), 100);
    }
  }

  fetchLogisticsData() {
    this.http.get<any[]>('http://localhost:3000/api/delivery-routes').subscribe({
      next: (data) => {
        this.allRoutes.set(data || []);
        this.dispatchRoutes.set((data || []).filter(r => r.route_status === 'DISPATCHED' || r.route_status === 'AWAITING DISPATCH'));
        this.pendingEpodRoutes.set((data || []).filter(r => r.route_status !== 'AWAITING DISPATCH'));
      },
      error: (err) => console.error('Failed to fetch routes', err)
    });

    this.http.get<any[]>('http://localhost:3000/api/fleet-vehicles').subscribe({
      next: (data) => this.fleetVehicles.set(data || []),
      error: (err) => console.error('Failed to fetch fleet', err)
    });
  }

  dispatchRoute(route: any) {
    const id = route.route_id || route.dr_number;
    this.http.put(`http://localhost:3000/api/delivery-routes/${id}/dispatch`, {
      userName: 'Dispatch Officer'
    }).subscribe({
      next: (res: any) => {
        if(res.success) {
          this.fetchLogisticsData(); 
        }
      },
      error: (err) => console.error('Error dispatching route', err)
    });
  }

  openDetailsModal(route: any) {
    this.viewDetailsModal.set(route);
  }

  closeDetailsModal() {
    this.viewDetailsModal.set(null);
  }

  openExpandedMap(data: any) {
    this.expandedMapData.set(data);
    setTimeout(() => this.initExpandedMap(data), 150);
  }

  closeExpandedMap() {
    if (this.expandedMapInstance) {
      this.expandedMapInstance.remove();
      this.expandedMapInstance = null;
    }
    this.expandedMapData.set(null);
  }

  initExpandedMap(data: any) {
    const mapEl = document.getElementById('expanded-logistics-map');
    if (!mapEl || typeof L === 'undefined') return;
    
    const GEOAPIFY_API_KEY = "aa2bebe4416f412b972b1378e8e8054a"; 
    // Fallback coordinates to HQ if not provided
    const lat = parseFloat(data.lat) || 14.7930012;
    const lng = parseFloat(data.lng) || 120.9323114;

    this.expandedMapInstance = L.map(mapEl, {
      zoomControl: true,
      attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`, {
      maxZoom: 20
    }).addTo(this.expandedMapInstance);

    const destIcon = L.divIcon({
      className: 'bg-[#ffb4b7] rounded-full border-4 border-[#1d2f0d] text-[#1d2f0d] shadow-[0_0_20px_rgba(255,180,183,0.6)] flex items-center justify-center font-bold text-lg',
      html: '📍',
      iconSize: [46, 46],
      iconAnchor: [23, 23]
    });
    
    const label = data.destination ? data.destination.split('—')[0].trim() : 'Delivery Location';
    L.marker([lat, lng], { icon: destIcon }).addTo(this.expandedMapInstance)
      .bindPopup(`<b>${label}</b><br>Geotag Record`).openPopup();
  }

  trackLalamove() {
    if (this.lalamoveLink().trim() !== '') {
      this.showLalamoveMap.set(true);
    } else {
      this.showLalamoveMap.set(false);
    }
  }

  getStatusChip(status: string): string {
    if (status === 'DELIVERED') return this.chipLime;
    if (status === 'ON ROUTE') return this.chipCyan;
    return this.chipGold;
  }
  
  today(): string {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getInitials(nameString: string): string {
    if (!nameString) return 'JC';
    const split = nameString.split('—')[0].trim().split(' ');
    if (split.length > 1) {
      return split[0].charAt(0) + ' ' + split[split.length-1];
    }
    return split[0].charAt(0);
  }

  loadLeaflet() {
    if (document.getElementById('leaflet-script')) {
      if (!document.getElementById('logistics-live-map')?.innerHTML) {
        this.initMap();
      }
      return;
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.id = 'leaflet-script';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  initMap() {
    const mapContainer = document.getElementById('logistics-live-map');
    if (!mapContainer) return;

    const GEOAPIFY_API_KEY = "aa2bebe4416f412b972b1378e8e8054a"; 
    const hqCoords = [14.793, 120.932];
    const qcCoords = [14.676, 121.043];

    const map = L.map('logistics-live-map', { 
        zoomControl: false,
        attributionControl: false
    }).setView([14.73, 120.98], 11);
    
    L.control.attribution({ prefix: '<span class="text-white/40">Powered by Geoapify | Leaflet</span>' }).addTo(map);

    L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`, {
        maxZoom: 20
    }).addTo(map);

    const hqIcon = L.divIcon({
        className: 'bg-[#EAC224] rounded-full border-4 border-[#1d2f0d] text-[#1d2f0d] shadow-[0_0_20px_rgba(234,194,36,0.6)] flex items-center justify-center font-bold text-sm',
        html: 'HQ',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    L.marker(hqCoords, { icon: hqIcon }).addTo(map).bindPopup('<b>Bocaue HQ</b><br>Dispatch Center').openPopup();

    const destIcon = L.divIcon({
        className: 'bg-[#ffb4b7] rounded-full border-4 border-[#1d2f0d] text-[#1d2f0d] shadow-[0_0_20px_rgba(255,180,183,0.6)] flex items-center justify-center font-bold text-sm',
        html: 'QC',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    L.marker(qcCoords, { icon: destIcon }).addTo(map).bindPopup('<b>Supermart Downtown</b><br>Quezon City');

    const routingApiUrl = `https://api.geoapify.com/v1/routing?waypoints=${hqCoords[0]},${hqCoords[1]}|${qcCoords[0]},${qcCoords[1]}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;
    
    fetch(routingApiUrl)
      .then(res => res.json())
      .then(data => {
          L.geoJSON(data, {
              style: () => ({ color: '#9be15d', weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' })
          }).addTo(map);
          const layer = L.geoJSON(data);
          map.fitBounds(layer.getBounds(), { padding: [80, 80] });
      })
      .catch(err => console.error('Error fetching route:', err));
  }
}