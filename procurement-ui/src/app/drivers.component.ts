import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, signal, computed, effect,
  AfterViewInit, OnDestroy, inject, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

declare var L: any; 

type Status = 'Assigned' | 'In transit' | 'Arrived' | 'Delivered' | 'Issue';
type Filter = 'all' | 'pending' | 'transit' | 'delivered' | 'issue';

interface Delivery {
  seq: number;
  dr: string;
  order: string;
  customer: string;
  address: string;
  contact: string;
  phone: string;
  packs: number;
  window: string;
  distanceKm: number;
  lat: number;
  lng: number;
  status: Status;
  deliveredAt?: string;
  receivedBy?: string;
  issue?: string;
  photo?: string;
  signature?: string;
}

interface LogEntry { time: string; text: string; tone: 'ok' | 'info' | 'warn'; }

@Component({
  selector: 'app-driver-logistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      app-driver-logistics { display: block; }
      .dl-container, .dl-container * { font-family: 'Fredoka', sans-serif !important; }

      .theme-panel { background: radial-gradient(circle at 80% 20%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .dl-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .dl-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,.15); border-radius: 8px; }
      .dl-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.22); border-radius: 8px; }

      /* Leaflet tweaks */
      .dl-container .leaflet-container { background: #14240a; outline: none; }
      .dl-container .leaflet-control-attribution { background: rgba(0,0,0,.55); color: rgba(255,255,255,.7); font-size: 10px; }
      .dl-container .leaflet-control-attribution a { color: #EAC224; }
      .dl-container .leaflet-popup-content-wrapper, .dl-container .leaflet-popup-tip { background: #1d2f0d; color: #fff; }

      @keyframes dl-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      @keyframes dl-pop { from { opacity: 0; transform: scale(.96) translateY(8px); } to { opacity: 1; transform: none; } }
      @keyframes dl-toast { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
      .a-in { animation: dl-fade-up .6s cubic-bezier(.2,.8,.2,1) both; }
      .a-pop { animation: dl-pop .25s ease-out both; }
      .a-toast { animation: dl-toast .35s cubic-bezier(.16,1,.3,1) both; }
      .in-1 { animation-delay: .05s; } .in-2 { animation-delay: .15s; } .in-3 { animation-delay: .25s; } .in-4 { animation-delay: .35s; }
      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <!-- LOGOUT CONFIRMATION MODAL -->
    @if (logoutModalShow()) {
      <div class="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-6 max-w-[320px] w-full shadow-2xl text-center space-y-4 dl-container">
          <div class="w-16 h-16 bg-[#B4161B]/20 text-[#ffb4b7] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#B4161B]/50">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-white">Sign Out?</h3>
          <p class="text-white/70 text-sm font-medium leading-tight">End your shift and return to the login screen?</p>
          <div class="flex flex-col gap-3 pt-2">
            <button (click)="executeLogout()" [disabled]="isSubmitting()" class="py-3.5 rounded-full font-bold text-sm transition-colors shadow-lg bg-[#B4161B] text-white hover:bg-[#8f1115] w-full cursor-pointer disabled:opacity-50">Yes, Sign Out</button>
            <button (click)="logoutModalShow.set(false)" class="py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors w-full cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    }

    <!-- DETAILED E-POD / DELIVERY DETAILS MODAL -->
    @if (viewDetailsModal()) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 dl-container" (click)="closeDetailsModal()">
        <div class="bg-[#1b2b10] border border-white/20 rounded-[28px] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto dl-scroll relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]" (click)="$event.stopPropagation()">
          
          <!-- Close Button -->
          <div class="absolute top-5 right-6 z-20">
            <button (click)="closeDetailsModal()" class="text-white/60 hover:text-white flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer">
              Close ✕
            </button>
          </div>

          <div class="p-8">
            <!-- Header -->
            <div class="flex flex-wrap items-center gap-4 mb-6 pb-5 border-b border-white/10">
              <h2 class="text-3xl font-bold text-white tracking-wide">Delivery Details - {{ viewDetailsModal().dr }}</h2>
              <div class="ml-auto mr-16">
                <span class="px-4 py-1.5 rounded-full text-xs font-bold border border-[#9be15d]/40 text-[#b7f27c] bg-[#9be15d]/15 shadow-sm uppercase tracking-wider">
                  {{ viewDetailsModal().status }}
                </span>
              </div>
            </div>

            <!-- Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <!-- Order Info -->
              <div>
                <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">📋 Order Info</h4>
                <div class="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
                  <span class="text-white/50 font-semibold">DR Number:</span> <span class="font-bold text-white">{{ viewDetailsModal().dr }}</span>
                  <span class="text-white/50 font-semibold">Order ID:</span> <span class="font-bold text-white">{{ viewDetailsModal().order }}</span>
                  <span class="text-white/50 font-semibold">Dispatch Date:</span> <span class="font-bold text-white">{{ today | date:'mediumDate' }}</span>
                  <span class="text-white/50 font-semibold">Delivery Time:</span> <span class="font-bold text-white">{{ viewDetailsModal().deliveredAt || 'N/A' }}</span>
                </div>
              </div>

              <!-- Destination & Customer -->
              <div>
                <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">🏢 Destination & Customer</h4>
                <div class="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                  <span class="text-white/50 font-semibold">Recipient:</span> <span class="font-bold text-white">{{ viewDetailsModal().customer }}</span>
                  <span class="text-white/50 font-semibold">Address:</span> <span class="font-bold text-white leading-tight">{{ viewDetailsModal().address }}</span>
                  <span class="text-white/50 font-semibold mt-1">Contact:</span> <span class="font-bold text-white mt-1">{{ viewDetailsModal().phone || '+63 917 000 0000' }}</span>
                </div>
              </div>

              <!-- Delivery Agent -->
              <div>
                <h4 class="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">🚚 Delivery Agent</h4>
                <div class="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                  <span class="text-white/50 font-semibold">Driver:</span> <span class="font-bold text-white">{{ userName() }}</span>
                  <span class="text-white/50 font-semibold">Vehicle:</span> <span class="font-bold text-white">{{ vehicle.name }} ({{ vehicle.plate }})</span>
                </div>
              </div>
            </div>

            <!-- Proof of Delivery (POD) Section -->
            <div class="mb-8">
              <h4 class="text-white font-bold mb-4 pb-2 border-b border-white/10">Proof of Delivery (POD)</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <!-- E-Signature -->
                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                  <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">E-Signature</span></div>
                  <!-- Use bg-white here to explicitly show a white canvas -->
                  <div class="bg-white p-4 h-36 flex items-center justify-center border-b border-white/10 relative">
                    @if (viewDetailsModal().signature) {
                      <img [src]="viewDetailsModal().signature" class="max-w-full max-h-full object-contain mix-blend-multiply" alt="Signature">
                    } @else {
                      <span class="text-5xl text-gray-900" style="font-family: 'Brush Script MT', cursive; transform: rotate(-3deg);">{{ getInitials(viewDetailsModal().receivedBy || viewDetailsModal().customer) }}</span>
                    }
                  </div>
                  <div class="p-3 text-xs bg-[#16220a] flex-1">
                    <p class="text-white/70 mb-1">Received By: <span class="text-white font-bold">{{ viewDetailsModal().receivedBy || viewDetailsModal().customer }}</span></p>
                    <p class="text-white/40">Timestamp: {{ today | date:'mediumDate' }} {{ viewDetailsModal().deliveredAt }}</p>
                  </div>
                </div>

                <!-- Photo Proof -->
                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                  <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">Photo Proof</span></div>
                  <div class="h-36 bg-black relative border-b border-white/10">
                    <img [src]="viewDetailsModal().photo || 'https://images.unsplash.com/photo-1580674684081-77673ce86c10?q=80&w=600&auto=format&fit=crop'" alt="Proof of delivery" class="w-full h-full object-cover">
                  </div>
                  <div class="p-3 text-xs bg-[#16220a] flex-1">
                    <p class="text-white/70">Delivery Photo / Proof of Condition</p>
                  </div>
                </div>

                <!-- Geotag / Location -->
                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                  <div class="px-4 py-2.5 border-b border-white/10 bg-white/5"><span class="font-bold text-sm">Geotag / Location</span></div>
                  <div class="h-36 bg-[#1a2b0c] relative border-b border-white/10">
                     <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" alt="Map View" class="w-full h-full object-cover opacity-50 mix-blend-luminosity">
                     <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span class="text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] filter">📍</span>
                       <span class="bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow-md">Delivery Location</span>
                     </div>
                  </div>
                  <div class="p-3 text-[11px] bg-[#16220a] font-mono text-white/60 flex-1">
                    <p>Lat: {{ viewDetailsModal().lat }}</p>
                    <p>Long: {{ viewDetailsModal().lng }}</p>
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
                      <td class="p-4 text-[#EAC224] font-extrabold text-base">{{ viewDetailsModal().packs }} units</td>
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

    <div class="dl-container min-h-screen bg-[#dfe9c6] px-4 md:px-8 pt-6 pb-16 overflow-x-clip">
      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[32px] p-5 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <!-- ================= HEADER ================= -->
        <header class="a-in in-1 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold text-[#EAC224] tracking-wider">🚚 Driver console</span>
            <h1 class="text-4xl md:text-5xl font-semibold tracking-wide">{{ greeting() }}, {{ firstName() }}.</h1>
            <p class="mt-2 text-white/80 font-medium">{{ today | date:'EEEE, MMMM d' }} &middot; {{ vehicle.name }} ({{ vehicle.plate }})</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button type="button" role="switch" [attr.aria-checked]="onDuty()" (click)="toggleDuty()"
              class="glass-panel flex items-center gap-3 pl-5 pr-2 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
              <span class="text-sm font-bold" [class]="onDuty() ? 'text-[#9be15d]' : 'text-white/70'">{{ onDuty() ? 'On duty' : 'Off duty' }}</span>
              <span [class]="'relative w-12 h-7 rounded-full transition-colors ' + (onDuty() ? 'bg-[#9be15d]' : 'bg-white/20')">
                <span [class]="'absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ' + (onDuty() ? 'translate-x-5' : '')"></span>
              </span>
            </button>
            <a [href]="'tel:' + dispatchPhone" [class]="btnGhost + ' inline-flex items-center gap-2'">📞 Call dispatch</a>
            
            <button (click)="logoutModalShow.set(true)" class="w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-[#B4161B] transition-colors shadow-inner border border-white/10 cursor-pointer ml-1">
              <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> 
            </button>
          </div>
        </header>

        @if (!onDuty()) {
          <div class="a-pop mb-6 rounded-2xl border border-[#EAC224]/40 bg-[#EAC224]/10 px-5 py-4 text-sm font-semibold text-[#EAC224]">
            You are off duty. Switch to "On duty" to start or update deliveries.
          </div>
        }

        <!-- ================= KPI TILES ================= -->
        <section class="a-in in-2 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
            <p class="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Stops today</p>
            <p class="text-3xl font-extrabold">{{ total() }}</p>
          </div>
          <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
            <p class="text-xs font-bold uppercase tracking-wider text-[#b7f27c] mb-1">Delivered</p>
            <p class="text-3xl font-extrabold text-[#9be15d]">{{ deliveredCount() }}</p>
          </div>
          <div class="bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee]">
            <p class="text-xs font-bold uppercase tracking-wider text-[#7fe7f7] mb-1">Remaining</p>
            <p class="text-3xl font-extrabold text-[#7fe7f7]">{{ remainingCount() }}</p>
          </div>
          <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224]">
            <p class="text-xs font-bold uppercase tracking-wider text-[#EAC224] mb-1">Packs on board</p>
            <p class="text-3xl font-extrabold text-[#EAC224]">{{ packsOnBoard() | number }}</p>
          </div>
        </section>

        <!-- progress -->
        <section class="a-in in-2 glass-panel rounded-2xl px-6 py-4 mb-8">
          <div class="flex items-center justify-between mb-2 text-sm font-bold">
            <span>Route progress</span>
            <span class="text-[#9be15d]">{{ deliveredCount() }} of {{ total() }} delivered &middot; {{ progress() }}%</span>
          </div>
          <div class="h-2.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" [attr.aria-valuenow]="progress()" aria-valuemin="0" aria-valuemax="100">
            <div class="h-full rounded-full transition-all duration-700 ease-out" style="background: linear-gradient(90deg, #EAC224, #9be15d)" [style.width.%]="progress()"></div>
          </div>
        </section>

        <!-- ================= MAIN GRID ================= -->
        <div class="a-in in-3 grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          <!-- LEFT: current stop + map -->
          <div class="xl:col-span-2 space-y-6">

            <section class="glass-panel rounded-[28px] p-6 md:p-8">
              @if (focusStop(); as d) {
                <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">{{ isActive(d) ? 'Current stop' : 'Stop details' }} &middot; {{ d.seq }} of {{ total() }}</p>
                    <h2 class="text-3xl font-semibold text-[#EAC224] leading-tight">{{ d.customer }}</h2>
                  </div>
                  <span [class]="'px-4 py-1.5 rounded-full text-xs font-bold border ' + chipFor(d.status)">{{ d.status }}</span>
                </div>

                <p class="flex items-start gap-2 text-white font-medium mb-1"><span aria-hidden="true">📍</span> {{ d.address }}</p>
                <p class="flex items-center gap-2 text-white/85 font-medium mb-6"><span aria-hidden="true">👤</span> {{ d.contact }} &middot;
                  <a [href]="'tel:' + d.phone" class="text-[#9be15d] font-bold hover:underline">{{ d.phone }}</a></p>

                <div class="grid grid-cols-3 gap-3 mb-6">
                  <div class="bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
                    <p class="text-xs font-bold text-white/80 mb-1">Packs</p>
                    <p class="text-xl font-extrabold">{{ d.packs }}</p>
                  </div>
                  <div class="bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
                    <p class="text-xs font-bold text-white/80 mb-1">Time window</p>
                    <p class="text-base font-extrabold">{{ d.window }}</p>
                  </div>
                  <div class="bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
                    <p class="text-xs font-bold text-white/80 mb-1">Distance</p>
                    <p class="text-xl font-extrabold">{{ d.distanceKm }} km</p>
                  </div>
                </div>

                <!-- progress stepper -->
                @if (d.status !== 'Issue') {
                  <ol class="grid grid-cols-4 mb-6" aria-label="Delivery progress">
                    @for (s of steps; track s; let i = $index) {
                      <li>
                        <div class="flex items-center">
                          <span [class]="'w-9 h-9 shrink-0 rounded-full grid place-items-center text-sm font-bold border-2 transition-colors ' + stepCircle(i, d)">{{ i < stepIndex(d) ? '✓' : i + 1 }}</span>
                          @if (i < steps.length - 1) { <span [class]="'flex-1 h-0.5 mx-2 transition-colors ' + (i < stepIndex(d) ? 'bg-[#9be15d]' : 'bg-white/15')"></span> }
                        </div>
                        <p [class]="'mt-2 text-xs font-bold ' + (i <= stepIndex(d) ? 'text-white' : 'text-white/60')">{{ s }}</p>
                      </li>
                    }
                  </ol>
                } @else {
                  <div class="mb-6 rounded-2xl border border-[#B4161B]/50 bg-[#B4161B]/15 px-5 py-4">
                    <p class="text-sm font-bold text-[#ffb4b7]">Issue reported: {{ d.issue }}</p>
                    <p class="text-xs text-white/80 font-medium mt-1">Dispatch has been notified. You can retry this stop when ready.</p>
                  </div>
                }

                @if (d.status === 'Delivered') {
                  <div class="rounded-2xl border border-[#9be15d]/30 bg-[#9be15d]/10 px-5 py-4 flex justify-between items-center text-sm font-semibold text-[#b7f27c]">
                    <span>✓ Delivered at {{ d.deliveredAt }} &middot; received by {{ d.receivedBy }}</span>
                    <!-- NEW VIEW DETAILS BUTTON -->
                    <button (click)="openDetailsModal(d)" class="px-3 py-1.5 border border-[#9be15d]/50 hover:bg-[#9be15d]/20 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      View Details
                    </button>
                  </div>
                } @else {
                  <div class="flex flex-wrap items-center gap-3">
                    @if (primaryLabel(d)) {
                      <button type="button" (click)="runPrimary(d)" [disabled]="!canAct(d)"
                        class="px-7 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-45 disabled:cursor-not-allowed text-[#2d3e15] font-bold text-base shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors cursor-pointer">
                        {{ primaryLabel(d) }}
                      </button>
                    }
                    <button type="button" (click)="focusAndNavigate(d)" [class]="btnGhost + ' inline-flex items-center gap-2 !py-3 !text-sm cursor-pointer'">🧭 Navigate</button>
                    <a [href]="'tel:' + d.phone" [class]="btnGhost + ' inline-flex items-center gap-2 !py-3 !text-sm'">📞 Call customer</a>
                    @if (d.status !== 'Issue') {
                      <button type="button" (click)="openIssue(d)" [disabled]="!onDuty()" class="px-5 py-3 rounded-full border border-[#ff8a8f]/50 text-[#ffb4b7] hover:bg-[#B4161B]/25 disabled:opacity-45 text-sm font-bold transition-colors cursor-pointer">⚠️ Report issue</button>
                    }
                  </div>
                  @if (d.status === 'Assigned' && !canStart(d)) {
                    <p class="mt-3 text-xs font-semibold text-[#EAC224]">{{ onDuty() ? 'Finish your current delivery before starting another.' : 'Go on duty to start this trip.' }}</p>
                  }
                }
              } @else {
                <div class="text-center py-10">
                  <p class="text-5xl mb-3" aria-hidden="true">🎉</p>
                  <h2 class="text-2xl font-semibold mb-1">All deliveries completed</h2>
                  <p class="text-white/80 font-medium">Great work, {{ firstName() }}. {{ deliveredCount() }} of {{ total() }} stops delivered today.</p>
                </div>
              }
            </section>

            <!-- MAP -->
            <section class="glass-panel rounded-[28px] p-2">
              <div class="relative h-[340px] rounded-[22px] overflow-hidden bg-[#14240a]">
                <div id="driver-map" class="absolute inset-0 z-10"></div>
                @if (mapFailed()) {
                  <div class="absolute inset-0 z-20 grid place-items-center text-center px-6 bg-[#14240a]">
                    <p class="text-sm font-semibold text-white/80">The map could not be loaded. Please check your internet connection.</p>
                  </div>
                }
                @if (focusStop(); as d) {
                  <div class="absolute top-4 left-4 z-[500] bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl pointer-events-none">
                    <p class="text-xs font-bold uppercase tracking-wider text-white/80">Route to</p>
                    <p class="text-sm font-bold text-[#9be15d]">{{ d.customer }}</p>
                  </div>
                }
              </div>
            </section>
          </div>

          <!-- RIGHT: route, vehicle, activity -->
          <div class="space-y-6">

            <section class="glass-panel rounded-[28px] p-6">
              <h3 class="text-xl font-semibold mb-4">Today's route</h3>
              <ol class="space-y-2">
                @for (s of sortedStops(); track s.dr) {
                  <li>
                    <button type="button" (click)="focusId.set(s.dr)"
                      [class]="'w-full text-left flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors cursor-pointer ' + (focusStop()?.dr === s.dr ? 'bg-[#EAC224]/10 border-[#EAC224]/40' : 'bg-white/5 border-white/10 hover:bg-white/10')">
                      <span [class]="'w-8 h-8 shrink-0 rounded-full grid place-items-center text-sm font-bold ' + dotClass(s.status)">{{ s.status === 'Delivered' ? '✓' : s.seq }}</span>
                      <span class="min-w-0 flex-1">
                        <span class="block text-sm font-bold truncate">{{ s.customer }}</span>
                        <span class="block text-xs text-white/75 font-medium truncate">{{ s.window }} &middot; {{ s.packs }} packs</span>
                      </span>
                      <span [class]="'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ' + chipFor(s.status)">{{ s.status }}</span>
                    </button>
                  </li>
                }
              </ol>
            </section>

            <section class="glass-panel rounded-[28px] p-6">
              <h3 class="text-xl font-semibold mb-4">Vehicle</h3>
              <dl class="space-y-3 text-sm">
                <div class="flex justify-between"><dt class="text-white/80 font-medium">Unit</dt><dd class="font-bold">{{ vehicle.name }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/80 font-medium">Plate</dt><dd class="font-bold">{{ vehicle.plate }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/80 font-medium">Capacity</dt><dd class="font-bold">{{ vehicle.capacity }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/80 font-medium">Dispatch</dt><dd><a [href]="'tel:' + dispatchPhone" class="font-bold text-[#9be15d] hover:underline">{{ dispatchPhone }}</a></dd></div>
              </dl>
            </section>

            <section class="glass-panel rounded-[28px] p-6">
              <h3 class="text-xl font-semibold mb-4">Activity</h3>
              <ul class="space-y-3 max-h-64 overflow-y-auto pr-2 dl-scroll">
                @for (e of log(); track $index) {
                  <li class="flex gap-3">
                    <span [class]="'mt-1.5 w-2.5 h-2.5 shrink-0 rounded-full ' + (e.tone === 'ok' ? 'bg-[#9be15d]' : e.tone === 'warn' ? 'bg-[#ef4444]' : 'bg-[#22d3ee]')"></span>
                    <p class="text-sm font-medium"><span class="font-bold text-white/80">{{ e.time }}</span> &middot; {{ e.text }}</p>
                  </li>
                }
              </ul>
            </section>
          </div>
        </div>

        <!-- ================= ALL DELIVERIES ================= -->
        <section class="a-in in-4 glass-panel rounded-[28px] p-6 md:p-8">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h3 class="text-2xl font-semibold">All deliveries</h3>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Filter deliveries">
              @for (f of filters; track f.key) {
                <button type="button" (click)="filter.set(f.key)"
                  [class]="'px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ' + (filter() === f.key ? 'bg-[#EAC224] text-[#2d3e15] border-[#EAC224] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]' : 'text-white border-white/20 hover:bg-white/10')">
                  {{ f.label }} ({{ countFor(f.key) }})
                </button>
              }
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 dl-scroll">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="text-white text-[14px] font-bold border-b border-white/10">
                <tr>
                  <th class="py-4 px-6">Stop</th>
                  <th class="py-4 px-6">DR number</th>
                  <th class="py-4 px-6">Customer &amp; address</th>
                  <th class="py-4 px-6">Packs</th>
                  <th class="py-4 px-6">Window</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10 font-medium text-white">
                @for (s of filteredStops(); track s.dr) {
                  <tr class="hover:bg-white/5 transition-colors">
                    <td class="py-4 px-6 font-extrabold">{{ s.seq }}</td>
                    <td class="py-4 px-6 font-extrabold">{{ s.dr }}<br><span class="text-xs text-white/75 font-medium">{{ s.order }}</span></td>
                    <td class="py-4 px-6 font-bold">{{ s.customer }}<br><span class="text-xs text-white/75 font-medium">{{ s.address }}</span></td>
                    <td class="py-4 px-6 font-bold">{{ s.packs }}</td>
                    <td class="py-4 px-6">{{ s.window }}</td>
                    <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + chipFor(s.status)">{{ s.status }}</span></td>
                    <td class="py-4 px-6 text-right space-x-2">
                      @if (primaryLabel(s)) {
                        <button type="button" (click)="runPrimary(s)" [disabled]="!canAct(s)" [class]="btnGold + ' disabled:opacity-45 disabled:cursor-not-allowed'">{{ primaryLabel(s) }}</button>
                      }
                      <!-- VIEW DETAILS FOR DELIVERED -->
                      @if (s.status === 'Delivered') {
                         <button type="button" (click)="openDetailsModal(s)" class="px-4 py-2 border border-[#9be15d]/50 hover:bg-[#9be15d]/20 rounded-full text-[#9be15d] text-xs font-bold transition-colors cursor-pointer">
                           View Details
                         </button>
                      }
                      <button type="button" (click)="focusAndNavigate(s)" [class]="btnGhost + ' cursor-pointer'">Navigate</button>
                      <button type="button" (click)="focusId.set(s.dr)" [class]="btnGhost">Details</button>
                    </td>
                  </tr>
                }
                @if (filteredStops().length === 0) {
                  <tr><td colspan="7" class="py-12 text-center text-white/80">No deliveries in this view.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <!-- ================= e-POD MODAL ================= -->
    @if (epodStop(); as d) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" (click)="closeEpod()">
        <div role="dialog" aria-modal="true" aria-label="Proof of delivery" (click)="$event.stopPropagation()"
          class="dl-container a-pop w-full max-w-xl max-h-[92vh] overflow-y-auto dl-scroll rounded-[28px] p-6 md:p-8 text-white border border-white/15 shadow-[0_30px_60px_-12px_rgba(0,0,0,.7)]"
          style="background: linear-gradient(135deg, #2a3f14, #152309)">
          <p class="text-xs font-bold uppercase tracking-wider text-[#EAC224] mb-1">Proof of delivery &middot; {{ d.dr }}</p>
          <h3 class="text-2xl font-semibold mb-1">{{ d.customer }}</h3>
          <p class="text-sm text-white/80 font-medium mb-6">{{ d.packs }} packs &middot; {{ d.address }}</p>

          <div class="space-y-5">
            <!-- PIN Code Input Field -->
            <div class="mb-6 bg-black/20 p-5 rounded-2xl border border-[#9be15d]/30 text-center shadow-inner">
              <label class="block text-lg font-bold mb-2" for="epod-pin">Completion PIN <span class="text-[#EAC224]">*</span></label>
              <p class="text-xs text-white/70 mb-4 font-medium">Ask the customer to provide the 6-digit PIN sent to their email to finalize the job.</p>
              
              <input id="epod-pin" type="text" [(ngModel)]="epodPinCode" name="epodPinCode" placeholder="Enter PIN"
                maxlength="6" inputmode="numeric" pattern="[0-9]*"
                class="w-full sm:w-48 mx-auto block px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-2xl font-mono text-center tracking-widest text-[#EAC224] placeholder-white/30 outline-none focus:border-[#9be15d] transition-colors">
            </div>

            <div>
              <label class="block text-sm font-bold mb-1.5">Photo of delivered goods <span class="text-white/70 font-medium">(recommended)</span></label>
              @if (epodPhoto()) {
                <div class="relative rounded-2xl overflow-hidden border border-white/15">
                  <img [src]="epodPhoto()" alt="Delivery photo preview" class="w-full max-h-52 object-cover">
                  <button type="button" (click)="epodPhoto.set('')" class="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/70 text-xs font-bold cursor-pointer">Remove</button>
                </div>
              } @else {
                <label class="flex flex-col items-center justify-center gap-1 h-32 rounded-2xl border-2 border-dashed border-white/25 bg-black/20 hover:bg-black/30 cursor-pointer transition-colors">
                  <span class="text-3xl" aria-hidden="true">📷</span>
                  <span class="text-sm font-bold">Tap to take a photo</span>
                  <input type="file" accept="image/*" capture="environment" class="sr-only" (change)="onPhoto($event)">
                </label>
              }
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-bold">Customer signature <span class="text-[#EAC224]">*</span></label>
                <button type="button" (click)="clearSignature(sig)" class="text-xs font-bold text-[#9be15d] hover:underline cursor-pointer">Clear</button>
              </div>
              <canvas #sig width="640" height="220" aria-label="Signature pad"
                class="w-full h-40 rounded-2xl bg-white touch-none cursor-crosshair"
                (pointerdown)="sigStart($event)" (pointermove)="sigMove($event)" (pointerup)="sigEnd()" (pointerleave)="sigEnd()"></canvas>
              <p class="mt-1 text-xs text-white/70 font-medium">Ask the customer to sign inside the box.</p>
            </div>

            <div>
              <label class="block text-sm font-bold mb-1.5" for="epod-name">Received by <span class="text-[#EAC224]">*</span></label>
              <input id="epod-name" type="text" [(ngModel)]="epodReceivedBy" name="epodReceivedBy" placeholder="Full name and role"
                class="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white placeholder-white/60 outline-none focus:border-[#EAC224]">
            </div>

            <div>
              <label class="block text-sm font-bold mb-1.5" for="epod-notes">Notes <span class="text-white/70 font-medium">(optional)</span></label>
              <textarea id="epod-notes" [(ngModel)]="epodNotes" name="epodNotes" rows="2" placeholder="Anything dispatch should know..."
                class="w-full px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-sm font-semibold text-white placeholder-white/60 outline-none focus:border-[#EAC224]"></textarea>
            </div>
          </div>

          <div class="mt-7 flex gap-3 justify-end">
            <button type="button" (click)="closeEpod()" [class]="btnGhost + ' !py-3 !px-6 !text-sm'">Cancel</button>
            <button type="button" (click)="submitEpod(sig)" [disabled]="!epodReceivedBy.trim() || !hasSignature() || epodPinCode.length !== 6 || isSubmitting()"
              class="px-7 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-45 disabled:cursor-not-allowed text-[#2d3e15] font-bold text-sm transition-colors cursor-pointer">
              {{ isSubmitting() ? 'Submitting...' : 'Submit e-POD' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ================= ISSUE MODAL ================= -->
    @if (issueStop(); as d) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" (click)="closeIssue()">
        <div role="dialog" aria-modal="true" aria-label="Report an issue" (click)="$event.stopPropagation()"
          class="dl-container a-pop w-full max-w-md rounded-[28px] p-6 md:p-8 text-white border border-white/15 shadow-[0_30px_60px_-12px_rgba(0,0,0,.7)]"
          style="background: linear-gradient(135deg, #2a3f14, #152309)">
          <p class="text-xs font-bold uppercase tracking-wider text-[#ffb4b7] mb-1">Report an issue &middot; {{ d.dr }}</p>
          <h3 class="text-2xl font-semibold mb-5">{{ d.customer }}</h3>

          <label class="block text-sm font-bold mb-1.5" for="issue-reason">What happened?</label>
          <select id="issue-reason" [(ngModel)]="issueReason" name="issueReason"
            class="w-full px-5 py-3 mb-4 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
            @for (r of issueReasons; track r) { <option [value]="r">{{ r }}</option> }
          </select>

          <label class="block text-sm font-bold mb-1.5" for="issue-notes">Details <span class="text-white/70 font-medium">(optional)</span></label>
          <textarea id="issue-notes" [(ngModel)]="issueNotes" name="issueNotes" rows="3" placeholder="Add anything that will help dispatch..."
            class="w-full px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-sm font-semibold text-white placeholder-white/60 outline-none focus:border-[#EAC224]"></textarea>

          <div class="mt-6 flex gap-3 justify-end">
            <button type="button" (click)="closeIssue()" [class]="btnGhost + ' !py-3 !px-6 !text-sm'">Cancel</button>
            <button type="button" (click)="submitIssue()" class="px-7 py-3 rounded-full bg-[#B4161B] hover:bg-[#d11d23] text-white font-bold text-sm transition-colors cursor-pointer">Notify dispatch</button>
          </div>
        </div>
      </div>
    }

    <!-- ================= TOAST ================= -->
    @if (toast(); as t) {
      <div class="dl-container fixed top-6 left-1/2 -translate-x-1/2 z-[200] a-toast">
        <div [class]="'px-6 py-3 rounded-full text-sm font-bold shadow-2xl border ' + (t.type === 'success' ? 'bg-[#1d2f0d] border-[#9be15d]/50 text-[#b7f27c]' : 'bg-[#2a0d0e] border-[#ef4444]/50 text-[#ffb4b7]')" role="status">{{ t.message }}</div>
      </div>
    }
  `
})
export class DriverLogisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // ---------- Configuration ----------
  private readonly GEOAPIFY_API_KEY = 'aa2bebe4416f412b972b1378e8e8054a';
  private readonly HQ: [number, number] = [14.831227246598, 120.96172571182];

  // ---------- Look & feel ----------
  btnGold = 'px-4 py-2 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors cursor-pointer';
  btnGhost = 'px-4 py-2 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors cursor-pointer';

  // ---------- Driver, vehicle, dispatch ----------
  today = new Date();
  firstName = signal<string>('Driver');
  userName = signal<string>('Driver');
  vehicle = { name: 'Van 1', plate: 'NCV-881', capacity: '500 kg max' };
  dispatchPhone = '+63 917 555 0100';
  onDuty = signal<boolean>(true);
  logoutModalShow = signal<boolean>(false);
  
  viewDetailsModal = signal<any>(null); // View Details modal state

  // ---------- Deliveries  ----------
  deliveries = signal<Delivery[]>([]);
  log = signal<LogEntry[]>([{ time: this.nowTime(), text: 'Shift started on Van 1 (NCV-881)', tone: 'info' }]);
  isSubmitting = signal<boolean>(false);

  // ---------- View state ----------
  steps = ['Assigned', 'In transit', 'Arrived', 'Delivered'];
  filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'transit', label: 'In transit' },
    { key: 'delivered', label: 'Delivered' }, { key: 'issue', label: 'Issues' }
  ];
  filter = signal<Filter>('all');
  focusId = signal<string | null>(null);
  mapFailed = signal<boolean>(false);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  // e-POD modal
  epodStop = signal<Delivery | null>(null);
  epodPhoto = signal<string>('');
  hasSignature = signal<boolean>(false);
  epodReceivedBy = '';
  epodPinCode = '';
  epodNotes = '';
  private drawing = false;

  // Issue modal
  issueStop = signal<Delivery | null>(null);
  issueReasons = ['Customer unavailable', 'Wrong or incomplete address', 'Store closed', 'Damaged goods', 'Vehicle problem', 'Traffic or road closure', 'Other'];
  issueReason = this.issueReasons[0];
  issueNotes = '';

  // ---------- Derived data ----------
  sortedStops = computed(() => [...this.deliveries()].sort((a, b) => {
    if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
    if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
    return a.seq - b.seq;
  }));
  total = computed(() => this.deliveries().length);
  deliveredCount = computed(() => this.deliveries().filter(d => d.status === 'Delivered').length);
  remainingCount = computed(() => this.deliveries().filter(d => d.status !== 'Delivered' && d.status !== 'Issue').length);
  packsOnBoard = computed(() => this.deliveries().filter(d => d.status !== 'Delivered').reduce((n, d) => n + d.packs, 0));
  progress = computed(() => this.total() ? Math.round((this.deliveredCount() / this.total()) * 100) : 0);

  activeStop = computed(() => {
    const list = this.sortedStops();
    return list.find(d => d.status === 'In transit' || d.status === 'Arrived')
      ?? list.find(d => d.status === 'Assigned')
      ?? null;
  });
  focusStop = computed(() => {
    const id = this.focusId();
    return (id ? this.deliveries().find(d => d.dr === id) : null) ?? this.activeStop();
  });
  filteredStops = computed(() => {
    const f = this.filter();
    return this.sortedStops().filter(d => this.matches(d, f));
  });
  greeting = computed(() => {
    const h = this.today.getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  });

  // ---------- Map internals ----------
  private map: any = null;
  private mapLayer: any = null;
  private routeToken = 0;

  constructor() {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        const name = (u.name || u.full_name || '').trim();
        if (name) {
          this.userName.set(name);
          this.firstName.set(name.split(' ')[0]);
        }
      }
    } catch { }

    effect(() => this.drawRoute(this.focusStop()));
  }

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    this.apiService.getDeliveryRoutes().subscribe({
      next: async (data: any[]) => {
        const mapped = data.map((d, index) => {
          let customerName = 'Customer';
          let addressStr = d.destination || 'Unknown Address';
          
          if (d.destination && d.destination.includes('—')) {
              const parts = d.destination.split('—');
              customerName = parts[0].trim();
              addressStr = parts[1].trim();
          } else if (d.destination && d.destination.includes('-')) {
              const parts = d.destination.split('-');
              customerName = parts[0].trim();
              addressStr = parts.slice(1).join('-').trim();
          }

          return {
            seq: index + 1,
            dr: d.route_id,
            order: d.sales_order_id || 'Unknown',
            customer: customerName,
            address: addressStr,
            contact: 'Store Contact', 
            phone: '+63 917 000 0000', 
            packs: d.total_weight ? parseInt(d.total_weight) : 10,
            window: '08:00 – 17:00',
            distanceKm: Math.floor(Math.random() * 15) + 5, 
            lat: this.HQ[0],
            lng: this.HQ[1],
            status: this.mapDbStatusToUiStatus(d.route_status),
            deliveredAt: d.route_status === 'DELIVERED' ? 'Completed' : undefined,
            receivedBy: d.route_status === 'DELIVERED' ? 'Customer' : undefined,
            photo: d.photo_url || '',
            signature: d.signature_url || ''
          };
        });

        this.deliveries.set(mapped);
        this.cdr.markForCheck();

        if (this.GEOAPIFY_API_KEY) {
          const updatedDeliveries = [...mapped];
          for (let i = 0; i < updatedDeliveries.length; i++) {
            const item = updatedDeliveries[i];
            try {
               const addressQuery = item.address.includes('Internal Warehouse') ? 'Bocaue, Bulacan' : item.address;
               const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressQuery)}&filter=countrycode:ph&apiKey=${this.GEOAPIFY_API_KEY}`);
               const geoData = await res.json();
               
               if (geoData.features && geoData.features.length > 0) {
                  item.lat = geoData.features[0].properties.lat;
                  item.lng = geoData.features[0].properties.lon;
               }
            } catch(e) {
               console.error("Geocoding failed for address:", item.address);
            }
          }
          this.deliveries.set(updatedDeliveries);
          this.cdr.markForCheck();
          if (this.focusStop()) {
            this.drawRoute(this.focusStop());
          }
        }
      }
    });
  }

  mapDbStatusToUiStatus(dbStatus: string): Status {
    if (!dbStatus) return 'Assigned';
    const s = dbStatus.toUpperCase();
    if (s.includes('DELIVERED')) return 'Delivered';
    if (s.includes('TRANSIT')) return 'In transit';
    if (s.includes('ARRIVED')) return 'Arrived';
    if (s.includes('ISSUE')) return 'Issue';
    return 'Assigned';
  }

  getInitials(nameString: string): string {
    if (!nameString) return 'JC';
    const split = nameString.trim().split(' ');
    if (split.length > 1) {
      return split[0].charAt(0) + ' ' + split[split.length-1];
    }
    return split[0].charAt(0);
  }

  executeLogout() {
    this.isSubmitting.set(true);
    this.apiService.logout(this.firstName()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.logoutModalShow.set(false);
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.logoutModalShow.set(false);
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewInit() { this.loadLeaflet(); }
  ngOnDestroy() { if (this.map) { this.map.remove(); this.map = null; } }

  // ---------- Status helpers ----------
  private matches(d: Delivery, f: Filter): boolean {
    switch (f) {
      case 'pending': return d.status === 'Assigned';
      case 'transit': return d.status === 'In transit' || d.status === 'Arrived';
      case 'delivered': return d.status === 'Delivered';
      case 'issue': return d.status === 'Issue';
      default: return true;
    }
  }
  countFor(f: Filter): number { return this.deliveries().filter(d => this.matches(d, f)).length; }
  isActive(d: Delivery): boolean { return this.activeStop()?.dr === d.dr; }
  stepIndex(d: Delivery): number { return ({ 'Assigned': 0, 'In transit': 1, 'Arrived': 2, 'Delivered': 4, 'Issue': 0 } as Record<Status, number>)[d.status]; }
  stepCircle(i: number, d: Delivery): string {
    const idx = this.stepIndex(d);
    if (i < idx) return 'bg-[#9be15d] border-[#9be15d] text-[#1d2f0d]';
    if (i === idx) return 'bg-[#EAC224] border-[#EAC224] text-[#1d2f0d] ring-4 ring-[#EAC224]/25';
    return 'border-white/25 text-white/70';
  }
  chipFor(s: Status): string {
    switch (s) {
      case 'Delivered': return 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
      case 'In transit': return 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';
      case 'Arrived': return 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
      case 'Issue': return 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50';
      default: return 'bg-white/10 text-white border-white/25';
    }
  }
  dotClass(s: Status): string {
    switch (s) {
      case 'Delivered': return 'bg-[#9be15d] text-[#1d2f0d]';
      case 'In transit': case 'Arrived': return 'bg-[#EAC224] text-[#1d2f0d]';
      case 'Issue': return 'bg-[#B4161B] text-white';
      default: return 'bg-white/15 text-white';
    }
  }

  // ---------- Actions ----------
  canStart(d: Delivery): boolean {
    if (!this.onDuty() || d.status !== 'Assigned') return false;
    return !this.deliveries().some(x => x.status === 'In transit' || x.status === 'Arrived');
  }
  canAct(d: Delivery): boolean {
    if (!this.onDuty()) return false;
    return d.status === 'Assigned' ? this.canStart(d) : d.status === 'In transit' || d.status === 'Arrived' || d.status === 'Issue';
  }
  primaryLabel(d: Delivery): string {
    switch (d.status) {
      case 'Assigned': return 'Start trip';
      case 'In transit': return "I've arrived";
      case 'Arrived': return 'Complete delivery';
      case 'Issue': return 'Retry stop';
      default: return '';
    }
  }

  openDetailsModal(d: Delivery) {
    this.viewDetailsModal.set(d);
  }

  closeDetailsModal() {
    this.viewDetailsModal.set(null);
  }

 runPrimary(d: Delivery) {
    if (!this.canAct(d)) return;
    if (d.status === 'Assigned') {
      this.isSubmitting.set(true);
      this.apiService.startDeliveryTrip(d.dr, this.firstName()).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success) {
            this.setStatus(d, 'In transit', 'Started trip to ' + d.customer + ' (PIN emailed)', 'info');
          } else {
            this.showToast('Failed to dispatch trip email.', 'error');
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.setStatus(d, 'In transit', 'Started trip to ' + d.customer, 'info');
          this.cdr.markForCheck();
        }
      });
    }
    else if (d.status === 'In transit') this.setStatus(d, 'Arrived', 'Arrived at ' + d.customer, 'info');
    else if (d.status === 'Arrived') this.openEpod(d);
    else if (d.status === 'Issue') this.setStatus(d, 'Assigned', d.dr + ' put back in the queue', 'info');
  }

  toggleDuty() {
    this.onDuty.update(v => !v);
    this.addLog(this.onDuty() ? 'Went on duty' : 'Went off duty', 'info');
  }

  private setStatus(d: Delivery, status: Status, text: string, tone: LogEntry['tone'], extra: Partial<Delivery> = {}) {
    this.deliveries.update(list => list.map(x => x.dr === d.dr ? { ...x, ...extra, status } : x));
    this.focusId.set(null);
    this.addLog(text, tone);
    this.showToast(text, 'success');
  }

  private addLog(text: string, tone: LogEntry['tone']) {
    this.log.update(l => [{ time: this.nowTime(), text, tone }, ...l]);
  }
  private nowTime(): string {
    const n = new Date();
    return String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
  }

  private toastTimer: any;
  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3500);
  }

  focusAndNavigate(d: Delivery) {
    this.focusId.set(d.dr);
    const mapElement = document.getElementById('driver-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.showToast('Navigating to ' + d.customer + ' on map', 'success');
  }

  navUrl(d: Delivery): string {
    return 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + encodeURIComponent(d.address);
  }

  // ---------- e-POD ----------
  openEpod(d: Delivery) {
    this.epodReceivedBy = '';
    this.epodNotes = '';
    this.epodPinCode = '';
    this.epodPhoto.set('');
    this.hasSignature.set(false);
    this.epodStop.set(d);
  }
  closeEpod() { this.epodStop.set(null); this.drawing = false; }

  onPhoto(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.epodPhoto.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  private sigPoint(e: PointerEvent): { x: number; y: number } {
    const c = e.target as HTMLCanvasElement;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  }
  
  sigStart(e: PointerEvent) {
    const c = e.target as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    c.setPointerCapture(e.pointerId);
    this.drawing = true;

    // IMPORTANT: Paint the canvas white first so it doesn't save as transparent PNG
    if (!this.hasSignature()) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
    }

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1d2f0d';
    const p = this.sigPoint(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }
  
  sigMove(e: PointerEvent) {
    if (!this.drawing) return;
    const ctx = (e.target as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    const p = this.sigPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!this.hasSignature()) this.hasSignature.set(true);
  }
  
  sigEnd() { this.drawing = false; }
  
  clearSignature(c: HTMLCanvasElement) {
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    this.hasSignature.set(false);
  }

  submitEpod(sig: HTMLCanvasElement) {
    const d = this.epodStop();
    if (!d || !this.epodReceivedBy.trim() || !this.hasSignature() || this.epodPinCode.length !== 6 || this.isSubmitting()) return;
    const receivedBy = this.epodReceivedBy.trim();
    const time = this.nowTime();
    
    this.isSubmitting.set(true);

    const sigUrl = sig.toDataURL('image/png');
    const photoUrl = this.epodPhoto();

    this.apiService.completeDeliveryRoute(d.dr, { 
      userName: this.firstName(), 
      pinCode: this.epodPinCode,
      receivedBy: receivedBy,
      notes: this.epodNotes,
      signature: sigUrl, 
      photo: photoUrl    
    }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if(res.success) {
          this.setStatus(d, 'Delivered', d.dr + ' delivered to ' + d.customer, 'ok', {
            deliveredAt: time, receivedBy, photo: photoUrl, signature: sigUrl
          });
          this.closeEpod();
        } else {
          this.showToast(res.message || 'Invalid Verification PIN. Please check the code provided by the client.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast(err?.error?.message || 'Server error recording delivery and verifying PIN.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  // ---------- Issues ----------
  openIssue(d: Delivery) {
    this.issueReason = this.issueReasons[0];
    this.issueNotes = '';
    this.issueStop.set(d);
  }
  closeIssue() { this.issueStop.set(null); }
  
  submitIssue() {
    const d = this.issueStop();
    if (!d) return;
    this.setStatus(d, 'Issue', 'Issue on ' + d.dr + ': ' + this.issueReason, 'warn', { issue: this.issueReason });
    this.closeIssue();
  }

  // ---------- Map ----------
  private loadLeaflet() {
    if (typeof L !== 'undefined') { this.initMap(); return; }

    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
    }

    let script = document.getElementById('leaflet-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'leaflet-script';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => this.initMap());
    script.addEventListener('error', () => this.mapFailed.set(true));
  }

  private initMap() {
    const el = document.getElementById('driver-map');
    if (!el || this.map || typeof L === 'undefined') return;

    this.map = L.map(el, { zoomControl: false }).setView(this.HQ, 13);
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    if (this.GEOAPIFY_API_KEY) {
      L.tileLayer('https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=' + this.GEOAPIFY_API_KEY, {
        maxZoom: 20, attribution: 'Powered by Geoapify | &copy; OpenStreetMap contributors'
      }).addTo(this.map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19, subdomains: 'abcd', attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(this.map);
    }

    this.mapLayer = L.layerGroup().addTo(this.map);
    this.drawRoute(this.focusStop());
  }

  private pin(label: string, color: string) {
    return L.divIcon({
      className: '',
      html: '<div style="width:38px;height:38px;border-radius:50%;background:' + color + ';border:4px solid #1d2f0d;color:#1d2f0d;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;box-shadow:0 0 18px rgba(234,194,36,.45)">' + label + '</div>',
      iconSize: [38, 38], iconAnchor: [19, 19]
    });
  }

  private esc(s: string): string {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
  }

  private drawRoute(d: Delivery | null) {
    if (!this.map || !this.mapLayer || typeof L === 'undefined') return;
    const token = ++this.routeToken;
    this.mapLayer.clearLayers();

    L.marker(this.HQ, { icon: this.pin('HQ', '#EAC224') }).addTo(this.mapLayer)
      .bindPopup('<b>Bocaue HQ</b><br>Dispatch center');
    if (!d) { this.map.setView(this.HQ, 13); return; }

    const dest: [number, number] = [d.lat, d.lng];
    L.marker(dest, { icon: this.pin(String(d.seq), '#ffb4b7') }).addTo(this.mapLayer)
      .bindPopup('<b>' + this.esc(d.customer) + '</b><br>' + this.esc(d.address));

    const fit = (bounds: any) => this.map.fitBounds(bounds, { padding: [60, 60] });
    const straightLine = () => {
      L.polyline([this.HQ, dest], { color: '#9be15d', weight: 4, opacity: .9, dashArray: '8 10' }).addTo(this.mapLayer);
      fit(L.latLngBounds([this.HQ, dest]));
    };

    if (!this.GEOAPIFY_API_KEY) { straightLine(); return; }

    const url = 'https://api.geoapify.com/v1/routing?waypoints=' + this.HQ[0] + ',' + this.HQ[1] + '|' + dest[0] + ',' + dest[1] + '&mode=drive&apiKey=' + this.GEOAPIFY_API_KEY;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (token !== this.routeToken) return; 
        const route = L.geoJSON(data, { style: () => ({ color: '#9be15d', weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' }) }).addTo(this.mapLayer);
        fit(route.getBounds());
      })
      .catch(() => { if (token === this.routeToken) straightLine(); });
  }
}