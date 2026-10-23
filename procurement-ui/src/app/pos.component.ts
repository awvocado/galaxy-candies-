import { Component, signal, computed, ViewEncapsulation, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

      :host { display: block; }
      :host, :host *, .pos-container, .pos-container * { font-family: 'Fredoka', sans-serif !important; font-synthesis: none; -webkit-font-smoothing: antialiased; }
      
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(234, 194, 36, 0.45) rgba(0, 0, 0, 0.2); }
      .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .custom-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(234, 194, 36, 0.45); border-radius: 10px; }
      
      .print-receipt-container { display: none; }

      /* ========================================================= */
      /* FIXED RECEIPT PRINTER STYLES (80mm Thermal Printer)       */
      /* ========================================================= */
      @media print {
        @page { size: 80mm auto; margin: 0; }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        /* Force root elements to release layout constraints */
        html, body, app-root, app-pos { 
          display: block !important;
          width: 80mm !important; 
          height: auto !important; 
          min-height: auto !important;
          margin: 0 !important; 
          padding: 0 !important; 
          overflow: visible !important;
          background: white !important; 
        }
        
        /* Completely hide the POS application layout */
        .pos-container { display: none !important; }
        
        /* Show ONLY the receipt container, strictly constrained to 76mm */
        .print-receipt-container {
          display: block !important;
          width: 76mm !important;
          margin: 0 auto !important;
          padding: 4mm !important;
          color: black !important;
          font-family: 'Space Mono', 'Courier New', monospace !important; 
          font-size: 12px !important;
          line-height: 1.5 !important;
          box-sizing: border-box !important;
        }

        .print-receipt-container table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .print-receipt-container th, .print-receipt-container td { font-size: 12px !important; font-family: 'Space Mono', 'Courier New', monospace !important; }
      }

      @keyframes toast-drop { 0% { opacity: 0; transform: translateY(-40px) scale(0.9); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      .a-toast-new { animation: toast-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

      .pp-noscroll { scrollbar-width: none; -ms-overflow-style: none; }
      .pp-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      .pp-stripe { background: repeating-linear-gradient(115deg, #EAC224 0 14px, #fff4cf 14px 28px, #8fd14f 28px 42px, #fff4cf 42px 56px); }
      .pp-focus:focus-visible { outline: 3px solid #EAC224; outline-offset: 3px; }

      @keyframes pp-logo-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
      @keyframes pp-glow { 0%,100% { opacity: .5; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.1); } }
      @keyframes pp-twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes pp-aurora { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px,30px) scale(1.2); } }
      .pp-logo { animation: pp-logo-float 5s ease-in-out infinite; }
      .pp-glow { animation: pp-glow 3.5s ease-in-out infinite; }
      .pp-twinkle { animation: pp-twinkle 2.4s ease-in-out infinite; }
      .pp-aurora { animation: pp-aurora 14s ease-in-out infinite; }
      .pp-aurora-b { animation: pp-aurora 18s ease-in-out infinite reverse; }
      @media (prefers-reduced-motion: reduce) {
        .pp-logo, .pp-glow, .pp-twinkle, .pp-aurora, .pp-aurora-b, .a-toast-new { animation: none !important; }
      }
    </style>

    <!-- FLOATING TOAST -->
    @if (toast().show) {
      <div class="fixed top-8 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
        <div [class]="'a-toast-new pointer-events-auto px-8 py-5 rounded-3xl shadow-2xl border-4 flex items-center gap-5 max-w-lg w-full mx-4 ' + (toast().type === 'success' ? 'bg-[#9be15d] border-white text-[#1d2f0d]' : 'bg-[#B4161B] border-white text-white')" role="status">
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
      <div class="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="w-full max-w-[360px] overflow-hidden rounded-[28px] bg-[#fff4cf] text-[#2d3e15] text-center shadow-2xl" role="dialog" aria-modal="true" aria-label="Sign out">
          <div class="pp-stripe h-3 w-full" aria-hidden="true"></div>
          <div class="px-7 pt-7 pb-7 space-y-4">
            <div class="w-16 h-16 bg-[#B4161B]/10 text-[#B4161B] rounded-full flex items-center justify-center mx-auto border-2 border-[#B4161B]/30">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <h3 class="text-2xl font-semibold">Sign Out?</h3>
            <p class="text-[#2d3e15]/75 text-sm font-medium leading-snug">Are you sure you want to end your current session?</p>
            <div class="flex justify-center gap-3 pt-2">
              <button (click)="logoutModalShow.set(false)" class="pp-focus px-6 py-3 rounded-full bg-[#2d3e15]/10 hover:bg-[#2d3e15]/20 text-[#2d3e15] font-semibold text-sm transition-colors cursor-pointer w-full">Cancel</button>
              <button (click)="executeLogout()" class="pp-focus px-6 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer shadow-lg bg-[#B4161B] text-white hover:bg-[#8f1115] w-full">Yes, Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- PRINT CONFIRMATION MODAL -->
    @if (printConfirmModalShow()) {
      <div class="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="w-full max-w-[360px] overflow-hidden rounded-[28px] bg-[#fff4cf] text-[#2d3e15] text-center shadow-2xl" role="dialog" aria-modal="true" aria-label="Confirm Payment">
          <div class="pp-stripe h-3 w-full" aria-hidden="true"></div>
          <div class="px-7 pt-7 pb-7 space-y-4">
            <div class="w-16 h-16 bg-[#2d3e15]/10 text-[#2d3e15] rounded-full flex items-center justify-center mx-auto border-2 border-[#2d3e15]/30">
              <span class="text-3xl">🖨️</span>
            </div>
            <h3 class="text-2xl font-semibold">Confirm Payment</h3>
            <p class="text-[#2d3e15]/75 text-sm font-medium leading-snug">Did the receipt print successfully? Choose an action below.</p>
            <div class="flex justify-center gap-3 pt-2">
              <button (click)="cancelCheckout()" class="pp-focus px-6 py-3 rounded-full bg-[#B4161B]/10 hover:bg-[#B4161B]/20 text-[#B4161B] font-semibold text-sm transition-colors cursor-pointer w-full">Void</button>
              <button (click)="finalizeCheckout()" class="pp-focus px-6 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer shadow-lg bg-[#2d3e15] text-[#EAC224] hover:bg-[#3b5220] w-full">Finalize</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- MAIN POS SCREEN -->
    <div class="pos-container w-full bg-[#dfe9c6] p-3 sm:p-5 lg:p-8 overflow-hidden flex flex-col" style="height:100vh; height:100dvh;">
      <div class="relative flex-1 min-h-0 flex flex-col rounded-[28px] sm:rounded-[36px] text-white overflow-hidden shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]"
           style="background: radial-gradient(circle at 78% 15%, #35521a 0%, #1d2f0d 50%, #101a07 100%);">

        <!-- ambient glow + sparkles (decorative) -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="pp-aurora absolute -left-24 top-[10%] w-80 h-80 rounded-full bg-[#9be15d]/20 blur-3xl"></div>
          <div class="pp-aurora-b absolute right-[30%] bottom-[2%] w-72 h-72 rounded-full bg-[#EAC224]/12 blur-3xl"></div>
          <span class="pp-twinkle absolute top-[10%] left-[44%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
          <span class="pp-twinkle absolute top-[55%] left-[58%] w-1.5 h-1.5 rounded-full bg-white" style="animation-delay:1.4s"></span>
          <span class="pp-twinkle absolute bottom-[8%] left-[6%] w-1.5 h-1.5 rounded-full bg-[#EAC224]" style="animation-delay:2.1s"></span>
        </div>

        <!-- HEADER -->
        <header class="relative z-10 shrink-0 flex flex-wrap items-center justify-between gap-4 px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-white/10">
          <div class="flex items-center gap-4 sm:gap-5 min-w-0">
            <div class="relative shrink-0">
              <span class="pp-glow absolute -inset-3 rounded-full bg-[#EAC224]/25 blur-2xl"></span>
              <img src="logo.png" alt="Galaxy Candies Logo" class="pp-logo relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-contain drop-shadow-md">
              <svg class="pp-twinkle absolute -top-2 -right-3 w-4 sm:w-5" viewBox="0 0 24 24" fill="#EAC224" aria-hidden="true"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
              <svg class="pp-twinkle absolute -bottom-1 -left-4 w-3 sm:w-4" style="animation-delay:1.2s" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-2xl sm:text-4xl font-semibold tracking-wide leading-tight truncate">Cashier Terminal</h2>
              <p class="mt-1.5 inline-flex items-center gap-2 max-w-full px-3 py-1 rounded-full bg-[#EAC224]/15 border border-[#EAC224]/40 text-[#EAC224] text-xs sm:text-sm font-medium">
                <span class="w-2 h-2 rounded-full bg-[#9be15d] shrink-0"></span>
                <span class="truncate">Logged in as: {{ userName() }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-none sm:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
              <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search item or scan barcode..." aria-label="Search item or scan barcode"
                class="pp-focus w-full h-12 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/15 transition-colors font-medium">
            </div>
            <button (click)="confirmLogout()" aria-label="Sign Out" class="pp-focus shrink-0 h-12 px-5 bg-[#B4161B] hover:bg-[#d91e24] text-white rounded-full flex items-center justify-center gap-2 font-semibold text-sm border-2 border-white/40 shadow-[0_10px_24px_-8px_rgba(180,22,27,0.9)] transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <!-- BODY: menu + ticket (stacked rows scroll on small screens, scrollbars hidden) -->
        <div class="pp-noscroll relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row gap-5 px-5 sm:px-8 py-5 overflow-y-auto lg:overflow-hidden">

          <!-- LEFT: PRODUCT GRID -->
          <section class="flex flex-col lg:flex-1 lg:min-h-0 lg:overflow-hidden">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
              <h3 class="text-2xl font-semibold tracking-wide">Menu</h3>
              <div class="flex gap-2 text-sm font-medium items-center">
                <button (click)="categoryFilter.set('all')" [class]="categoryFilter() === 'all' ? 'pp-focus px-5 py-2.5 bg-[#EAC224] text-[#2d3e15] font-semibold rounded-full shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)] cursor-pointer' : 'pp-focus px-5 py-2.5 bg-white/10 text-white/80 border border-white/20 rounded-full hover:bg-white/15 cursor-pointer'">All Items</button>
                <button (click)="categoryFilter.set('instock')" [class]="categoryFilter() === 'instock' ? 'pp-focus px-5 py-2.5 bg-[#EAC224] text-[#2d3e15] font-semibold rounded-full shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)] cursor-pointer' : 'pp-focus px-5 py-2.5 bg-white/10 text-white/80 border border-white/20 rounded-full hover:bg-white/15 cursor-pointer'">In Stock Only</button>
              </div>
            </div>

            <div class="pp-noscroll lg:flex-1 lg:min-h-0 lg:overflow-y-auto pb-2">
              <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (p of filteredProducts(); track p.sku) {
                  <div (click)="!p.out && addToCart(p)" role="button" [attr.aria-disabled]="p.out" [attr.aria-label]="p.name + ', ' + p.price"
                    [class]="'group relative flex flex-col justify-between p-4 rounded-[24px] border transition-all ' + (p.out ? 'bg-white/[0.03] border-white/10 opacity-50 grayscale' : 'bg-white/[0.07] border-white/15 hover:border-[#EAC224] hover:-translate-y-1 cursor-pointer hover:shadow-[0_14px_28px_-12px_rgba(234,194,36,0.45)]')">
                    <span [class]="'absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ' + (p.out ? 'bg-[#B4161B] text-white border-white/30' : 'bg-[#2d3e15]/90 text-[#b7f27c] border-[#9be15d]/40')">{{ p.stock }}</span>

                    <div class="h-28 w-full flex items-center justify-center mb-3 mt-5 rounded-2xl overflow-hidden bg-[#fff4cf] relative p-2">
                      @if (p.image) { <img [src]="p.image" class="w-full h-full object-contain relative z-10" (error)="onImageError($event)"> }
                      <div [style.display]="p.image ? 'none' : 'flex'" class="absolute inset-0 flex-col items-center justify-center text-[#2d3e15]/40 text-xs font-bold gap-1"><span class="text-3xl">🍬</span></div>
                    </div>

                    <div>
                      <p class="font-semibold text-base leading-tight text-white line-clamp-2">{{ p.name }}</p>
                      <p class="text-xs text-[#7fe7f7] mt-1 font-medium tracking-wider">{{ p.sku }}</p>
                    </div>

                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                      <span class="font-semibold text-lg text-[#EAC224]">{{ p.price }}</span>
                      <div [class]="p.out ? 'w-9 h-9 bg-white/10 text-white/30 rounded-full flex items-center justify-center' : 'w-9 h-9 bg-[#EAC224] text-[#2d3e15] rounded-full flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(234,194,36,0.7)]'">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"></path></svg>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>

          <!-- RIGHT: CART TICKET (cream wrapper paper) -->
          <aside class="w-full lg:w-[400px] shrink-0 lg:min-h-0 flex flex-col rounded-[28px] overflow-hidden bg-[#fff4cf] text-[#2d3e15] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
            <div class="pp-stripe h-3 w-full shrink-0" aria-hidden="true"></div>

            <div class="flex flex-col flex-1 min-h-0 p-5">
              <div class="flex justify-between items-center gap-3 pb-4 mb-4 border-b-2 border-dashed border-[#2d3e15]/25 shrink-0">
                <div class="min-w-0 flex-1">
                  <label for="pp-customer" class="block text-xs font-medium text-[#2d3e15]/60 mb-0.5">Customer</label>
                  <input id="pp-customer" type="text" [(ngModel)]="customerName" placeholder="Walk-in Customer" class="pp-focus w-full bg-transparent text-[#2d3e15] font-semibold text-xl placeholder-[#2d3e15]/40 rounded-lg">
                </div>
                @if (cart().length > 0) { <button (click)="clearCart()" class="pp-focus shrink-0 text-sm text-[#B4161B] px-4 py-2 bg-[#B4161B]/10 border border-[#B4161B]/30 rounded-full font-semibold hover:bg-[#B4161B]/20 transition-colors cursor-pointer">Clear</button> }
              </div>

              <div class="pp-noscroll max-h-[40vh] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto space-y-3 mb-4">
                @if (cart().length === 0) {
                  <div class="h-full min-h-[160px] flex flex-col items-center justify-center text-center text-[#2d3e15]/55 space-y-3 py-6">
                    <svg class="w-20" viewBox="0 0 100 60" fill="none" aria-hidden="true">
                      <path d="M22 30 L0 8 L8 30 L0 52 Z" fill="#EAC224"/><path d="M78 30 L100 8 L92 30 L100 52 Z" fill="#EAC224"/>
                      <rect x="20" y="8" width="60" height="44" rx="22" fill="#8fd14f"/>
                      <path d="M30 20 Q50 12 70 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".7"/>
                    </svg>
                    <p class="font-medium text-base">Cart is empty. Scan barcode or add items.</p>
                  </div>
                }
                @for (item of cart(); track item.sku) {
                  <div class="relative overflow-hidden rounded-2xl bg-white border border-[#2d3e15]/10 p-4 pl-5">
                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EAC224]"></div>
                    <div class="flex justify-between items-start gap-3 mb-2">
                      <p class="font-semibold text-base w-2/3 leading-tight">{{ item.name }}</p>
                      <span class="font-semibold text-base text-[#2d3e15]">₱ {{ (item.price * item.qty) | number:'1.2-2' }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-xs text-[#2d3e15]/60 font-medium">₱ {{ item.price | number:'1.2-2' }} / ea</p>
                      <div class="flex items-center gap-2 bg-[#2d3e15]/5 p-1 rounded-full border border-[#2d3e15]/10">
                        <button (click)="updateCartQty(item.sku, -1)" aria-label="Decrease quantity" class="pp-focus w-8 h-8 rounded-full bg-white hover:bg-[#2d3e15]/10 flex items-center justify-center text-[#2d3e15] cursor-pointer transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path></svg>
                        </button>
                        <span class="font-semibold text-base min-w-[24px] text-center">{{ item.qty }}</span>
                        <button (click)="updateCartQty(item.sku, 1)" aria-label="Increase quantity" class="pp-focus w-8 h-8 rounded-full bg-white hover:bg-[#2d3e15]/10 flex items-center justify-center text-[#2d3e15] cursor-pointer transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- UPDATED TOTALS DISPLAY -->
              <div class="shrink-0 pt-4 border-t-2 border-dashed border-[#2d3e15]/25 space-y-2.5">
                <div class="flex justify-between text-sm text-[#2d3e15]/70 font-medium">
                  <span>Subtotal (Net of VAT)</span><span>₱ {{ cartSubtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm text-[#2d3e15]/70 font-medium">
                  <span>Tax (12% VAT)</span><span>₱ {{ cartTax() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between items-baseline text-xl font-semibold pt-1 border-t border-[#2d3e15]/10 mt-1">
                  <span>Total Amount</span><span class="text-3xl text-[#2d3e15]">₱ {{ cartTotal() | number:'1.2-2' }}</span>
                </div>

                <div class="pt-3">
                  <button (click)="processCheckout()" [disabled]="cart().length === 0 || isSubmitting()" class="pp-focus w-full bg-[#2d3e15] hover:bg-[#3b5220] disabled:opacity-40 text-[#EAC224] py-4 rounded-full font-semibold text-lg tracking-wide shadow-[0_12px_28px_-10px_rgba(29,47,13,0.8)] flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed transition-all active:scale-95">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Pay &amp; Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- PRINT RECEIPT LAYOUT (Only visible when printing)         -->
    <!-- ========================================================= -->
    <div class="print-receipt-container">
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">GALAXY CANDIES</h2>
        <p style="margin: 2px 0; font-size: 12px;">Bocaue, Central Luzon</p>
        <p style="margin: 2px 0; font-size: 12px;">VAT Reg TIN: 123-456-789-000</p>
      </div>
      
      <div style="padding-bottom: 10px; margin-bottom: 10px; font-size: 12px;">
        <p style="margin: 2px 0;">Date: {{ printDate }}</p>
        <p style="margin: 2px 0;">Receipt No: {{ currentReceiptNo }}</p>
        <p style="margin: 2px 0;">Cashier: {{ userName() }}</p>
        <p style="margin: 2px 0;">Customer: {{ customerName || 'Walk-in' }}</p>
      </div>

      <div style="border-top: 1px dashed black; border-bottom: 1px dashed black; padding: 5px 0; margin-bottom: 10px;">
        <table style="width: 100%; font-size: 12px; border-collapse: collapse; table-layout: fixed;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 2px 0; width: 50%;">Item</th>
              <th style="text-align: right; padding: 2px 0; width: 30%;">Price</th>
              <th style="text-align: right; padding: 2px 0; width: 20%;">Qty</th>
            </tr>
          </thead>
          <tbody>
            @for (item of cart(); track item.sku) {
              <tr>
                <td style="padding: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }}</td>
                <td style="text-align: right; padding: 2px 0;">{{ item.price | number:'1.2-2' }}</td>
                <td style="text-align: right; padding: 2px 0;">{{ item.qty }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div style="border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 10px; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Subtotal</span>
          <span>{{ cartSubtotal() | number:'1.2-2' }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>VAT (12%)</span>
          <span>{{ cartTax() | number:'1.2-2' }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 8px;">
          <span>TOTAL</span>
          <span>PHP {{ cartTotal() | number:'1.2-2' }}</span>
        </div>
      </div>

      <div style="text-align: center; font-size: 12px; margin-top: 15px;">
        <p style="margin: 2px 0; font-weight: bold;">*** THIS IS NOT AN OFFICIAL RECEIPT ***</p>
        <p style="margin: 2px 0;">Thank you for shopping with us!</p>
      </div>
    </div>
  `
})
export class PosComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  products = signal<any[]>([]);
  cart = signal<{sku: string, name: string, price: number, qty: number, maxStock: number}[]>([]);
  
  searchQuery = signal<string>('');
  categoryFilter = signal<'all' | 'instock'>('all');
  customerName = 'Walk-in customer';
  
  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  // Receipt data
  printDate = '';
  currentReceiptNo = '';

  // USER & MODAL
  userName = signal<string>('Cashier');
  logoutModalShow = signal<boolean>(false);
  printConfirmModalShow = signal<boolean>(false);

  // Barcode Scanner logic
  barcodeBuffer = '';
  barcodeTimeout: any;

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    
    if (event.key === 'Enter') {
      if (this.barcodeBuffer.length > 2) {
        this.scanItem(this.barcodeBuffer);
      }
      this.barcodeBuffer = '';
    } else {
      this.barcodeBuffer += event.key;
      clearTimeout(this.barcodeTimeout);
      this.barcodeTimeout = setTimeout(() => { this.barcodeBuffer = ''; }, 50); 
    }
  }

  filteredProducts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.products().filter(p => 
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) && 
      (this.categoryFilter() === 'all' || !p.out)
    );
  });

  // PH Standard VAT Inclusive Math
  cartTotal = computed(() => this.cart().reduce((sum, item) => sum + (item.price * item.qty), 0));
  cartSubtotal = computed(() => this.cartTotal() / 1.12);
  cartTax = computed(() => this.cartTotal() - this.cartSubtotal());

  ngOnInit() {
    this.updateUser();
    this.loadProducts();
  }

  updateUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try { 
          const parsed = JSON.parse(userStr);
          this.userName.set(parsed.name || parsed.full_name || 'Cashier'); 
        } catch(e) {}
      }
    }
  }

  confirmLogout() {
    this.logoutModalShow.set(true);
  }

  executeLogout() {
    this.logoutModalShow.set(false);
    this.apiService.logout(this.userName()).subscribe({
      next: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    this.cdr.markForCheck();
    setTimeout(() => { this.toast.update(t => ({ ...t, show: false })); this.cdr.markForCheck(); }, 3500);
  }

  resolveImageUrl(url: string): string {
    if (!url || url.trim() === '') return '';
    let cleanUrl = url.trim();
    if (cleanUrl.toLowerCase().endsWith('.jpg')) cleanUrl = cleanUrl.substring(0, cleanUrl.length - 4) + '.png';
    return cleanUrl.startsWith('/') || cleanUrl.startsWith('http') ? cleanUrl : '/' + cleanUrl;
  }

  onImageError(event: any) {
    event.target.style.display = 'none'; 
    if (event.target.nextElementSibling) event.target.nextElementSibling.style.display = 'flex';
  }

  loadProducts() {
    this.apiService.getPosCatalog().subscribe((catalog: any[]) => {
      this.apiService.getWarehouseStock().subscribe((stock: any[]) => {
         const merged = catalog.map((c: any) => {
            const whItem = stock.find((s: any) => s.sku === c.sku);
            const qty = whItem ? parseFloat(whItem.qty) : 0;
            return {
              name: c.name, sku: c.sku, 
              price: '₱ ' + parseFloat(c.price).toFixed(2), 
              stock: qty > 0 ? qty + ' Left' : 'Out',
              out: qty <= 0, rawQty: qty, rawPrice: parseFloat(c.price), 
              image: this.resolveImageUrl(c.image_url)
            };
         });
         this.products.set(merged);
         this.cdr.markForCheck();
      });
    });
  }

  scanItem(barcode: string) {
    const product = this.products().find(p => p.sku.toLowerCase() === barcode.toLowerCase());
    if (product) {
      if (product.out) {
        this.showToast(`Product ${product.name} is out of stock!`, 'error');
      } else {
        this.addToCart(product);
        this.showToast(`${product.name} added via scanner!`, 'success');
      }
    } else {
      this.showToast(`Barcode ${barcode} not found.`, 'error');
    }
  }

  addToCart(product: any) {
    if (product.out) return;
    this.cart.update(items => {
      const existing = items.find(i => i.sku === product.sku);
      if (existing) {
        if (existing.qty >= product.rawQty) { this.showToast(`Cannot exceed available stock.`, 'error'); return items; }
        return items.map(i => i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i);
      }
      return [{ sku: product.sku, name: product.name, price: product.rawPrice, qty: 1, maxStock: product.rawQty }, ...items]; 
    });
  }

  updateCartQty(sku: string, delta: number) {
    this.cart.update(items => items.map(item => {
      if (item.sku !== sku) return item;
      const nextQty = item.qty + delta;
      if (nextQty > item.maxStock) { this.showToast(`Cannot exceed available stock.`, 'error'); return item; }
      return { ...item, qty: nextQty };
    }).filter(item => item.qty > 0));
  }

  clearCart() { this.cart.set([]); }

  processCheckout() {
    if (this.cart().length === 0) return;
    this.isSubmitting.set(true);
    
    // Prepare Receipt Data before printing
    this.currentReceiptNo = `RCT-${Math.floor(100000 + Math.random() * 900000)}`;
    this.printDate = new Date().toLocaleString();
    
    // Rename document title to remove "localhost" header
    const originalTitle = document.title;
    document.title = 'Galaxy_Candies_Receipt';
    
    this.cdr.detectChanges(); // Ensures the DOM updates the receipt details
    
    setTimeout(() => {
      // Setup a one-time listener for when the print dialog closes
      const afterPrintHandler = () => {
        // Restore title
        document.title = originalTitle;
        
        // Trigger the internal styled modal instead of browser alert
        this.printConfirmModalShow.set(true);
        this.cdr.markForCheck();
        
        window.removeEventListener('afterprint', afterPrintHandler);
      };

      window.addEventListener('afterprint', afterPrintHandler, { once: true });
      window.print();
    }, 250);
  }

  finalizeCheckout() {
    this.printConfirmModalShow.set(false);
    this.showToast(`Payment received. Order ${this.currentReceiptNo} completed!`, 'success');
    
    // Update local stock to reflect purchase
    this.cart().forEach(cartItem => {
      this.products.update(list => list.map(p => {
        if (p.sku === cartItem.sku) {
          const newQty = p.rawQty - cartItem.qty;
          return { ...p, rawQty: newQty, stock: newQty > 0 ? newQty + ' Left' : 'Out', out: newQty <= 0 };
        }
        return p;
      }));
    });

    this.clearCart();
    this.customerName = '';
    this.isSubmitting.set(false);
    this.cdr.markForCheck();
  }

  cancelCheckout() {
    this.printConfirmModalShow.set(false);
    this.showToast('Transaction voided / Print cancelled.', 'error');
    this.isSubmitting.set(false);
    this.cdr.markForCheck();
  }
}