import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, computed, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

declare var Chart: any;

@Component({
  selector: 'app-qa-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');

      :host { display: block; }
      :host, :host *, .pos-container, .pos-container * { font-family: 'Fredoka', sans-serif !important; font-synthesis: none; -webkit-font-smoothing: antialiased; }
      
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

      .pp-noscroll { scrollbar-width: none; -ms-overflow-style: none; }
      .pp-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      .pp-focus:focus-visible { outline: 3px solid #EAC224; outline-offset: 3px; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"], [class*="pp-"] { animation: none !important; } }
    </style>

    <!-- FLOATING TOAST NOTIFICATION -->
    @if (toast().show) {
      <div class="fixed top-8 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
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
      <div class="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
          <div class="w-16 h-16 bg-[#B4161B]/20 text-[#ffb4b7] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B4161B]/50">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-white">Sign Out?</h3>
          <p class="text-white/70 text-sm font-medium">Are you sure you want to end your current session?</p>
          <div class="flex justify-center gap-3 pt-4">
            <button (click)="logoutModalShow.set(false)" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer w-full">Cancel</button>
            <button (click)="executeLogout()" class="px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-lg bg-[#B4161B] text-white hover:bg-[#8f1115] w-full">Yes, Sign Out</button>
          </div>
        </div>
      </div>
    }

    <!-- DYNAMIC REPORT / DISPOSITION MODAL -->
    @if (reportModal.show) {
      <div class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
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
                <textarea [(ngModel)]="reportModal.newCapa" placeholder="Describe the action taken..." class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white font-medium h-24 outline-none focus:border-[#EAC224] custom-scrollbar"></textarea>
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
      <div class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
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
              <textarea [(ngModel)]="rejectModal.details" placeholder="Describe the exact issue found during inspection..." class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white h-24 outline-none focus:border-[#ef4444] custom-scrollbar"></textarea>
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

    <!-- MAIN QA TERMINAL SCREEN LAYOUT -->
    <div class="pos-container w-full bg-[#dfe9c6] p-3 sm:p-5 lg:p-8 overflow-hidden flex flex-col" style="height:100vh; height:100dvh;">
      <div class="relative flex-1 min-h-0 flex flex-col rounded-[28px] sm:rounded-[36px] text-white overflow-hidden shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]"
           style="background: radial-gradient(circle at 78% 15%, #35521a 0%, #1d2f0d 50%, #101a07 100%);">

        <!-- DECORATIVE BACKGROUND GLOWS -->
        <div class="absolute inset-0 overflow-hidden rounded-[36px] pointer-events-none z-0">
          <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#9be15d]/10 blur-[100px] rounded-full"></div>
          <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#EAC224]/10 blur-[100px] rounded-full"></div>
          <span class="a-twinkle absolute top-[8%] left-[45%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
          <span class="a-twinkle d1 absolute top-[45%] right-[5%] w-1.5 h-1.5 rounded-full bg-white"></span>
          <span class="a-twinkle d2 absolute bottom-[10%] left-[38%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>
        </div>

        <!-- DEDICATED TERMINAL HEADER (ROBUST FLEX LAYOUT) -->
        <header class="relative z-30 shrink-0 flex flex-wrap items-center justify-between gap-4 px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-white/10">
          
          <!-- LEFT SIDE: Logo & Title (Can shrink) -->
          <div class="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <div class="relative shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 ml-1 sm:ml-3">
              <svg class="absolute -inset-5 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)] drop-shadow-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M82.5 35.5C88.5 45.5 85 61 76.5 71.5C68 82 52.5 87.5 38.5 84C24.5 80.5 12 68 9.5 53.5C7 39 14.5 22.5 26.5 13.5C38.5 4.5 55 3 66 9.5C77 16 76.5 25.5 82.5 35.5Z" fill="#2d4a12"/>
                <path d="M76.5 38.5C82 46.5 80 58 73.5 66.5C67 75 54 80.5 41.5 78.5C29 76.5 17 67 13 54.5C9 42 13 26.5 22.5 17.5C32 8.5 47 6 57.5 11.5C68 17 71 30.5 76.5 38.5Z" fill="#5fa61a"/>
              </svg>
              <svg class="absolute -bottom-1 -left-7 w-6 h-6 text-white pp-twinkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 8.5L12 0Z"/></svg>
              <svg class="absolute -top-4 -right-4 w-4 h-4 text-[#EAC224] pp-twinkle" style="animation-delay: 1.2s;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 8.5L12 0Z"/></svg>
              <img src="logo.png" alt="Galaxy Candies Logo" class="relative z-10 w-full h-full object-contain drop-shadow-md">
            </div>

            <div class="min-w-0 flex-1">
              <h2 class="text-2xl sm:text-4xl font-bold tracking-wide leading-tight truncate">QA Dashboard</h2>
              <p class="mt-1.5 inline-flex items-center gap-2 max-w-full px-4 py-1.5 rounded-full bg-black/25 border border-[#EAC224]/50 text-[#EAC224] text-xs sm:text-sm font-semibold shadow-inner">
                <span class="w-2 h-2 rounded-full bg-[#9be15d] shrink-0"></span>
                <span class="truncate">Logged in as: {{ userName() }}</span>
              </p>
            </div>
          </div>

          <!-- RIGHT SIDE: Search & Button (Never shrink) -->
          <div class="flex items-center gap-3 sm:gap-4 shrink-0 relative">
            <span class="hidden xl:block absolute top-1/2 -left-[6vw] w-1.5 h-1.5 bg-[#EAC224]/70 rounded-full pp-twinkle"></span>
            
            <div class="relative w-48 sm:w-64 lg:w-72 shrink">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-white/50"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
              <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Global search..." aria-label="Search across tables"
                class="pp-focus w-full h-12 pl-10 pr-4 rounded-full bg-black/20 border border-white/20 text-sm text-white placeholder-white/50 focus:border-[#EAC224] focus:bg-white/10 transition-colors font-medium">
            </div>
            
            <button (click)="confirmLogout()" aria-label="Sign Out" class="pp-focus shrink-0 whitespace-nowrap min-w-max h-12 px-5 sm:px-6 bg-[#B4161B] hover:bg-[#d91e24] text-white rounded-full flex items-center justify-center gap-2 font-bold text-sm border border-white/20 shadow-[0_0_15px_rgba(180,22,27,0.6)] transition-all cursor-pointer">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <!-- BODY: Tabs + Content -->
        <div class="pp-noscroll relative z-10 flex-1 min-h-0 flex flex-col px-5 sm:px-8 py-5 overflow-y-auto lg:overflow-hidden">

          <!-- Tabs -->
          <div class="shrink-0 mb-6 w-full overflow-x-auto pp-noscroll pb-2">
            <!-- SMOOTH ANIMATED TABS NAV -->
            <div class="relative flex min-w-[850px] w-full max-w-[1000px] bg-black/20 p-1.5 rounded-full shadow-inner border border-white/5">
              <!-- Sliding Indicator -->
              <div class="absolute top-1.5 bottom-1.5 w-[calc(20%-2.4px)] bg-[#EAC224] rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]"
                   [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'"></div>
              
              <button (click)="subTab.set('q-expected')" class="pp-focus relative z-10 w-1/5 py-3 text-sm lg:text-[15px] font-bold transition-colors duration-300 cursor-pointer rounded-full" [class.text-[#2d3e15]]="subTab() === 'q-expected'" [class.text-white]="subTab() !== 'q-expected'">Expected Deliveries</button>
              <button (click)="subTab.set('q-inbound')" class="pp-focus relative z-10 w-1/5 py-3 text-sm lg:text-[15px] font-bold transition-colors duration-300 cursor-pointer rounded-full" [class.text-[#2d3e15]]="subTab() === 'q-inbound'" [class.text-white]="subTab() !== 'q-inbound'">Pending Inspections</button>
              <button (click)="subTab.set('q-finished')" class="pp-focus relative z-10 w-1/5 py-3 text-sm lg:text-[15px] font-bold transition-colors duration-300 cursor-pointer rounded-full" [class.text-[#2d3e15]]="subTab() === 'q-finished'" [class.text-white]="subTab() !== 'q-finished'">Finished Goods</button>
              <button (click)="subTab.set('q-quarantine')" class="pp-focus relative z-10 w-1/5 py-3 text-sm lg:text-[15px] font-bold transition-colors duration-300 cursor-pointer rounded-full" [class.text-[#2d3e15]]="subTab() === 'q-quarantine'" [class.text-white]="subTab() !== 'q-quarantine'">Quarantine Log</button>
              <button (click)="subTab.set('q-defect')" class="pp-focus relative z-10 w-1/5 py-3 text-sm lg:text-[15px] font-bold transition-colors duration-300 cursor-pointer rounded-full" [class.text-[#2d3e15]]="subTab() === 'q-defect'" [class.text-white]="subTab() !== 'q-defect'">Defect Reports</button>
            </div>
          </div>

          <!-- DYNAMIC WORKSPACE CONTENT -->
          <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">

            <!-- 0. EXPECTED DELIVERIES -->
            @if (subTab() === 'q-expected') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 class="text-2xl font-semibold">Expected Deliveries (In-Transit)</h3>
                  <p class="text-white/60 text-sm font-medium mt-1">Monitor incoming supplier shipments so you can prepare for inbound QA sampling and inspection upon arrival.</p>
                </div>

                <div class="max-h-[450px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                      <tr>
                        <th class="py-4 px-6 font-medium">PO number</th>
                        <th class="py-4 px-6 font-medium">Supplier</th>
                        <th class="py-4 px-6 min-w-[220px]">Expected materials</th>
                        <th class="py-4 px-6 font-medium">Quantity</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (po of pendingReceipts(); track po.no) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold text-[#EAC224]">{{ po.no }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">
                            {{ getSupplierName(po.supplier) }}<br>
                            <span class="text-[11px] text-white/50">{{ po.supplier }}</span>
                          </td>
                          <td class="py-4 px-6 font-bold text-white">{{ po.material }}</td>
                          <td class="py-4 px-6 font-extrabold">{{ formatQtyLabel(po.qty) }}</td>
                          <td class="py-4 px-6"><span class="px-3 py-1.5 rounded-full text-xs font-bold border bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35 shadow-sm">{{ po.status }}</span></td>
                        </tr>
                      }
                      @if (pendingReceipts().length === 0) {
                        <tr><td colspan="5" class="py-12 text-center text-white/50">No incoming deliveries at this time.</td></tr>
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
                  <h3 class="text-2xl font-semibold">Inbound QA check &amp; digital sign-off</h3>
                </div>

                <div class="max-h-[450px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                      <tr>
                        <th class="py-4 px-6 font-medium">Batch ID / Ref</th>
                        <th class="py-4 px-6 font-medium">Source</th>
                        <th class="py-4 px-6 min-w-[200px]">Material / Product</th>
                        <th class="py-4 px-6 font-medium">Received qty</th>
                        <th class="py-4 px-6 font-medium">Inspection type</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (r of filteredInbound(); track r.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold text-[#9be15d]">{{ r.id }}</td>
                          <td class="py-4 px-6 text-xs text-white/75">{{ r.src }}<br><span class="text-[11px] text-white/50 font-bold">{{ r.srcSub }}</span></td>
                          <td class="py-4 px-6 font-bold text-white/90 leading-relaxed">{{ r.item }}</td>
                          <td class="py-4 px-6 font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + r.typeChip">{{ r.type }}</span></td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + (r.status === 'CLEARED' ? chipLime : (r.status === 'QUARANTINED' ? chipRed : chipGold))">{{ r.status }}</span></td>
                          
                          <td class="py-4 px-6 text-right space-x-2">
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
                        <tr><td colspan="7" class="py-12 text-center text-white/60">No pending inspections found.</td></tr>
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
                  <h3 class="text-2xl font-semibold">Finished goods clearance</h3>
                </div>

                <div class="max-h-[450px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                      <tr>
                        <th class="py-4 px-6 font-medium">Batch ID / Ref</th>
                        <th class="py-4 px-6 font-medium">Source line</th>
                        <th class="py-4 px-6 min-w-[200px]">Product</th>
                        <th class="py-4 px-6 font-medium">Yield qty</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (r of filteredFinished(); track r.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold text-[#9be15d]">{{ r.id }}</td>
                          <td class="py-4 px-6 text-xs text-white/75">Internal<br><span class="text-[11px] text-white/50 font-bold">{{ r.line }}</span></td>
                          <td class="py-4 px-6 font-bold text-white/90 leading-relaxed">{{ r.item }}</td>
                          <td class="py-4 px-6 font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-6">
                            <span [class]="'px-3 py-1 rounded-full text-xs font-bold border shadow-sm ' + (r.cleared ? chipLime : (r.quarantined ? chipRed : chipGold))">
                              {{ r.cleared ? '✓ CLEARED' : (r.quarantined ? 'QUARANTINED' : 'PENDING CLEARANCE') }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
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
                        <tr><td colspan="6" class="py-12 text-center text-white/60">No finished goods waiting for QA match this filter.</td></tr>
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
                    <select [(ngModel)]="quarantineFilter" class="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer shadow-sm">
                      <option value="all">All Dispositions</option>
                      <option value="HOLD">Pending Action (Hold)</option>
                      <option value="REWORK">Reworked</option>
                      <option value="SCRAP">Scrapped</option>
                      <option value="RETURN">Returned to Vendor</option>
                    </select>
                    <button (click)="generatePDF()" class="bg-white/10 border border-white/15 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Export report
                    </button>
                  </div>
                </div>

                <!-- RAW MATERIALS TABLE -->
                <div class="mb-8">
                  <h4 class="text-base font-bold text-white mb-3 flex items-center gap-2"><span>📦</span> Raw Materials (Supplier Deliveries)</h4>
                  <div class="max-h-[350px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                    <table class="w-full text-left text-sm border-collapse">
                      <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                        <tr>
                          <th class="py-4 px-6 font-medium">Batch ID</th>
                          <th class="py-4 px-6 min-w-[200px]">Item &amp; Source</th>
                          <th class="py-4 px-6 font-medium">Defect Category</th>
                          <th class="py-4 px-6 min-w-[220px]">Root Cause</th>
                          <th class="py-4 px-6 font-medium">Disposition</th>
                          <th class="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-medium">
                        @for (q of quarantineRaw(); track q.batchId) {
                          <tr class="hover:bg-white/5 transition-colors">
                            <td class="py-4 px-6 font-extrabold text-[#ffb4b7]">{{ q.batchId }}</td>
                            <td class="py-4 px-6 text-xs text-white/80">
                              <span class="font-bold text-white block">{{ q.item }}</span>
                              {{ q.source }}
                            </td>
                            <td class="py-4 px-6"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + q.catChip">{{ q.category }}</span></td>
                            <td class="py-4 px-6 leading-relaxed text-xs text-white/70">{{ q.detail }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + q.dispChip">{{ q.disp }}</span></td>
                            <td class="py-4 px-6 text-right">
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
                  <div class="max-h-[350px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                    <table class="w-full text-left text-sm border-collapse">
                      <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                        <tr>
                          <th class="py-4 px-6 font-medium">Batch ID</th>
                          <th class="py-4 px-6 min-w-[200px]">Item &amp; Source</th>
                          <th class="py-4 px-6 font-medium">Defect Category</th>
                          <th class="py-4 px-6 min-w-[220px]">Root Cause</th>
                          <th class="py-4 px-6 font-medium">Disposition</th>
                          <th class="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-medium">
                        @for (q of quarantineFinished(); track q.batchId) {
                          <tr class="hover:bg-white/5 transition-colors">
                            <td class="py-4 px-6 font-extrabold text-[#ffb4b7]">{{ q.batchId }}</td>
                            <td class="py-4 px-6 text-xs text-white/80">
                              <span class="font-bold text-white block">{{ q.item }}</span>
                              {{ q.source }}
                            </td>
                            <td class="py-4 px-6"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + q.catChip">{{ q.category }}</span></td>
                            <td class="py-4 px-6 leading-relaxed text-xs text-white/70">{{ q.detail }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + q.dispChip">{{ q.disp }}</span></td>
                            <td class="py-4 px-6 text-right">
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

            <!-- 4. DEFECT REPORTS WITH ADVANCED FILTERS & CHARTS -->
            @if (subTab() === 'q-defect') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h3 class="text-xl font-bold text-white">Defect analytics &amp; root cause reports</h3>
                  <button (click)="generatePDF()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Generate PDF
                  </button>
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
                      <p class="text-lg font-extrabold truncate max-w-[150px]">{{ topDefectCat() }}</p>
                    </div>
                  </div>

                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
                    <div class="p-3 bg-[#EAC224]/20 text-[#EAC224] rounded-xl text-xl">📝</div>
                    <div>
                      <p class="text-xs font-bold text-[#EAC224] uppercase tracking-wider">Total Defect Reports</p>
                      <p class="text-2xl font-extrabold">{{ filteredDefects().length }}</p>
                    </div>
                  </div>
                </div>

                <!-- CHART.JS VISUALIZATION CANVAS -->
                <div class="bg-black/20 p-5 rounded-2xl border border-white/10 mt-2 h-64 shadow-inner relative">
                   @if (filteredDefects().length === 0) {
                      <div class="absolute inset-0 flex items-center justify-center text-white/40 font-bold z-10 text-sm">No data to chart based on filters</div>
                   }
                   <canvas id="qaAnalyticsChart" class="w-full h-full"></canvas>
                </div>

                <!-- ADVANCED DATA FILTERS -->
                <div class="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-wrap items-end gap-4 mt-5 mb-4 shrink-0 shadow-sm">
                  <div class="flex-1 min-w-[200px]">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Search Keywords</label>
                    <div class="relative w-full">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Filter by batch, material, category..." class="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:border-[#EAC224] focus:bg-white/10 transition-colors font-medium outline-none shadow-inner">
                    </div>
                  </div>

                  <div class="w-full sm:w-44">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Disposition Status</label>
                    <select [ngModel]="defectStatusFilter()" (ngModelChange)="defectStatusFilter.set($event)" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d] shadow-inner">
                      <option value="all">All Dispositions</option>
                      <option value="HOLD">HOLD (Action Required)</option>
                      <option value="REWORK">REWORK</option>
                      <option value="SCRAP">SCRAP</option>
                      <option value="RETURN">RETURN</option>
                    </select>
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Start Date</label>
                    <input type="date" [ngModel]="defectStartDate()" (ngModelChange)="defectStartDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <div class="w-full sm:w-36">
                    <label class="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">End Date</label>
                    <input type="date" [ngModel]="defectEndDate()" (ngModelChange)="defectEndDate.set($event)" [style.color-scheme]="'dark'" class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-medium outline-none focus:border-[#EAC224] cursor-pointer shadow-inner">
                  </div>

                  <button (click)="clearDefectFilters()" class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center shadow-sm">
                    Reset
                  </button>
                </div>

                <!-- Defect reports table -->
                <div class="max-h-[450px] overflow-x-auto overflow-y-auto bg-black/20 rounded-2xl border border-white/10 custom-scrollbar relative shadow-inner">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10 sticky-thead z-20 shadow-md">
                      <tr>
                        <th class="py-4 px-6 font-medium">Report ID</th>
                        <th class="py-4 px-6 min-w-[200px]">Material / Product</th>
                        <th class="py-4 px-6 font-medium">Source</th>
                        <th class="py-4 px-6 font-medium">Primary Issue</th>
                        <th class="py-4 px-6 min-w-[220px]">Corrective Action (CAPA)</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (d of filteredDefects(); track d.reportId) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold text-[#EAC224]">{{ d.reportId }}</td>
                          <td class="py-4 px-6">
                            <span class="font-bold text-white block">{{ d.item }}</span>
                            <span class="text-[11px] text-white/50 font-semibold">Batch {{ d.batchId }}</span>
                          </td>
                          <td class="py-4 px-6 text-xs text-white/75">{{ d.sourceText }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + d.chip">{{ d.category }}</span></td>
                          <td class="py-4 px-6 leading-relaxed text-xs text-white/80" [title]="d.capa">{{ d.capa }}</td>
                          <td class="py-4 px-6 text-right">
                            <button (click)="viewReport(d)" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border border-white/20">View Report</button>
                          </td>
                        </tr>
                      }
                      @if (filteredDefects().length === 0) {
                        <tr><td colspan="6" class="py-12 text-center text-white/60">No defect reports found matching your filters.</td></tr>
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
export class QaTerminalComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  subTab = signal<string>('q-expected'); 

  // USER & MODAL
  userName = signal<string>('QA Inspector');
  logoutModalShow = signal<boolean>(false);

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
  
  defectStatusFilter = signal<string>('all');
  defectStartDate = signal<string>('');
  defectEndDate = signal<string>('');

  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  // Generic Rejection Form (Inbound QA)
  rejectModal = { show: false, batchId: '', category: '', customCategory: '', details: '' };

  // Dynamic Report & Resolution Modal
  reportModal = { show: false, mode: 'view' as 'view' | 'resolve', data: null as any, newDisposition: '', newCapa: '' };

  // Chart Instance
  chartInstance: any = null;

  constructor() {
    effect(() => {
      const data = this.filteredDefects();
      const tab = this.subTab();
      if (tab === 'q-defect') {
        setTimeout(() => this.drawChart(), 50);
      }
    });
  }

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
    const stat = this.defectStatusFilter();
    const start = this.defectStartDate() ? new Date(this.defectStartDate()) : null;
    const end = this.defectEndDate() ? new Date(this.defectEndDate()) : null;
    
    if (end) end.setHours(23, 59, 59, 999);

    return this.defects().filter(r => {
      const matchQ = !q || r.reportId.toLowerCase().includes(q) || r.batchId.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.item.toLowerCase().includes(q);
      const matchStat = stat === 'all' || r.disp === stat;
      let matchDate = true;
      if (start || end) {
        matchDate = true; 
      }
      return matchQ && matchStat && matchDate;
    });
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
    const canvas = document.getElementById('qaAnalyticsChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const data = this.filteredDefects();
    if (!data || data.length === 0) return;

    // Group defects by category
    const counts = data.reduce((acc, curr) => {
      const cat = curr.category || 'Unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as any);

    const labels = Object.keys(counts);
    const datasetData = Object.values(counts);
    const colors = ['#ffb4b7', '#EAC224', '#22d3ee', '#9be15d', '#a855f7', '#ff9d1c'];

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Defect Frequency',
          data: datasetData,
          backgroundColor: colors,
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
          tooltip: {
             backgroundColor: 'rgba(0,0,0,0.8)',
             titleFont: { family: 'Fredoka', size: 13 },
             bodyFont: { family: 'Fredoka', size: 14, weight: 'bold' },
             padding: 12,
             cornerRadius: 8
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold', size: 12 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { color: '#aaa', font: { family: 'Fredoka', weight: 'bold', size: 11 } }, grid: { display: false } }
        }
      }
    });
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
    this.cdr.markForCheck(); 
    setTimeout(() => {
      this.toast.update(t => ({ ...t, show: false }));
      this.cdr.markForCheck();
    }, 4000);
  }

  generatePDF() {
    this.showToast('Generating PDF report...', 'success');
    setTimeout(() => {
      window.print();
    }, 1000);
  }

  clearDefectFilters() {
    this.searchQuery.set('');
    this.defectStatusFilter.set('all');
    this.defectStartDate.set('');
    this.defectEndDate.set('');
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
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    this.closeReportModal(); // INSTANT CLOSE
    this.cdr.markForCheck(); 
    
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
          this.fetchQaData(); 
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Failed to update disposition.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  passInspection(batchId: string) {
    if (!batchId || this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    const finalBatchId = batchId.startsWith('PRN') ? batchId.replace('PRN', 'BAT') : batchId;
    
    // OPTIMISTIC UI UPDATE: Remove from lists instantly
    this.finished.update(f => f.filter(x => x.id !== batchId && x.id !== finalBatchId));
    this.inbound.update(i => i.filter(x => x.id !== batchId && x.id !== finalBatchId));
    this.cdr.markForCheck(); 

    this.apiService.passQaInspection(finalBatchId, { userName: this.userName() }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res && res.success !== false) {
          this.showToast(`Batch ${finalBatchId} cleared successfully!`, 'success');
          this.fetchQaData(); 
        } else {
          this.showToast(res?.error || 'Failed to clear batch.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error clearing batch:', err);
        this.showToast('Server error while clearing batch.', 'error');
        this.cdr.markForCheck();
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
    if (this.isSubmitting()) return;
    
    const finalCategory = this.rejectModal.category === 'Others' ? this.rejectModal.customCategory : this.rejectModal.category;
    
    this.isSubmitting.set(true);
    const storedBatch = this.rejectModal.batchId;
    this.closeRejectModal(); // INSTANT CLOSE
    
    // OPTIMISTIC UI UPDATE: Remove from lists instantly
    this.finished.update(f => f.filter(x => x.id !== storedBatch));
    this.inbound.update(i => i.filter(x => x.id !== storedBatch));
    this.cdr.markForCheck();
    
    const payload = {
      userName: this.userName(),
      defectCategory: finalCategory,
      rootCauseDetail: this.rejectModal.details
    };

    this.apiService.failQaInspection(storedBatch, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res && res.success !== false) {
          this.showToast(`Batch ${storedBatch} quarantined!`, 'error');
          this.fetchQaData(); 
        } else {
          this.showToast(res?.error || 'Failed to quarantine batch.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error quarantining batch:', err);
        this.showToast('Server error while quarantining batch.', 'error');
        this.cdr.markForCheck();
      }
    });
  }
}