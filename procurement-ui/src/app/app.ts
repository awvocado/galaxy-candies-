import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- AUTHENTICATION VIEW -->
    @if (!isAuthenticated()) {
      <div class="min-h-screen w-full bg-white flex flex-col font-sans animate-in fade-in duration-300">
        
        <!-- Top Header Navigation -->
        <div class="flex items-center justify-between px-8 md:px-16 py-6 bg-white relative z-20 border-b border-gray-100 w-full">
          <!-- Logo Area -->
          <div class="flex items-center gap-3">
            <img src="logo.png" alt="Galaxy Candies Logo" class="w-10 h-10 rounded-xl object-contain shadow-sm">
            <span class="font-black text-xl tracking-wider text-[#476021] uppercase">Galaxy Candies and Snacks</span>
          </div>
          
          <!-- Nav Links -->
          <nav class="hidden md:flex space-x-8 text-sm font-bold text-gray-500">
            <a href="#" class="hover:text-[#598E18] transition-colors">Home</a>
            <a href="#" class="hover:text-[#598E18] transition-colors">About Us</a>
            <a href="#" class="hover:text-[#598E18] transition-colors">Services</a>
            <a href="#" class="hover:text-[#598E18] transition-colors">Contact Us</a>
          </nav>
          
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col md:flex-row relative overflow-hidden w-full">
          
          <!-- Left Side: Vibrant Curved Gradient & Clean Layout -->
          <div class="md:w-[58%] relative z-10 flex flex-col justify-between p-8 md:p-16 lg:p-20 text-white overflow-hidden bg-gradient-to-br from-[#476021] via-[#598E18] to-[#364a18]">

            <!-- Center Content -->
            <div class="flex flex-col lg:flex-row items-center justify-between gap-8 my-auto py-8">
              
              <!-- Left Text Section -->
              <div class="w-full lg:w-[48%] z-20">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-wide text-white drop-shadow-sm">
                  Enterprise<br>Operations<br>Unified.
                </h1>
                <button class="bg-[#EAC224] hover:bg-[#fbd333] text-[#476021] px-8 py-3.5 rounded-full font-black text-sm shadow-lg transition-all transform hover:scale-105 w-max tracking-widest">
                  MORE
                </button>
              </div>

              <!-- Right 3D Rocket & Enhanced SVG Candies Section -->
              <div class="w-full lg:w-[52%] flex items-center justify-center relative min-h-[320px]">
                <!-- Orbit Ring Background -->
                <div class="absolute w-80 h-80 rounded-full border border-dashed border-white/30 animate-spin" style="animation-duration: 45s;"></div>
                
                <!-- Floating 3D Rocket -->
                <div class="relative animate-bounce z-20" style="animation-duration: 4s;">
                  <div class="w-20 h-36 bg-gradient-to-r from-white via-gray-100 to-gray-300 rounded-[40px] rounded-t-[60px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative flex flex-col items-center pt-3 border-2 border-white/80 transform -rotate-6">
                    <div class="w-5 h-7 bg-gradient-to-b from-red-600 to-[#B4161B] rounded-t-full mb-2 shadow-inner"></div>
                    <div class="w-7 h-7 rounded-full bg-[#2c3e15] border-2 border-white flex items-center justify-center shadow-inner my-2">
                      <div class="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                    </div>
                    <div class="w-full h-3.5 bg-gradient-to-r from-[#B4161B] via-red-500 to-[#B4161B] my-1.5 shadow-sm"></div>
                    <div class="absolute -left-5 bottom-3 w-6 h-14 bg-gradient-to-tr from-red-700 to-[#B4161B] rounded-l-xl transform skew-y-12 shadow-md"></div>
                    <div class="absolute -right-5 bottom-3 w-6 h-14 bg-gradient-to-tl from-red-700 to-[#B4161B] rounded-r-xl transform -skew-y-12 shadow-md"></div>
                  </div>
                  <!-- Exhaust Flame -->
                  <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div class="w-8 h-14 bg-gradient-to-t from-transparent via-[#EAC224] to-red-500 rounded-full blur-[3px] animate-pulse"></div>
                    <div class="w-4 h-6 bg-white rounded-full blur-[1px]"></div>
                  </div>
                </div>

                <!-- Enhanced Vector SVG Wrapped Strawberry Candy (Top Left) -->
                <div class="absolute -top-6 -left-8 z-30 animate-pulse drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)]" style="animation-duration: 3.5s;">
                  <svg class="w-20 h-20 transform -rotate-15" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 30 L3 12 L12 30 L3 48 Z" fill="url(#wrapGrad)" opacity="0.9"/>
                    <path d="M72 30 L97 12 L88 30 L97 48 Z" fill="url(#wrapGrad)" opacity="0.9"/>
                    <rect x="24" y="12" width="52" height="36" rx="18" fill="url(#berryGrad)" stroke="white" stroke-width="2.5"/>
                    <ellipse cx="40" cy="22" rx="14" ry="5" fill="white" opacity="0.5" transform="rotate(-15 40 22)"/>
                    <circle cx="62" cy="36" r="3" fill="white" opacity="0.6"/>
                    <defs>
                      <linearGradient id="berryGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#fb7185"/>
                        <stop offset="50%" stop-color="#f43f5e"/>
                        <stop offset="100%" stop-color="#9f1239"/>
                      </linearGradient>
                      <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ffffff"/>
                        <stop offset="100%" stop-color="#94a3b8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <!-- Enhanced Vector SVG Swirl Lollipop (Bottom Left) -->
                <div class="absolute -bottom-8 -left-12 z-30 animate-bounce drop-shadow-[0_12px_25px_rgba(234,179,8,0.4)]" style="animation-duration: 4.5s;">
                  <svg class="w-20 h-24 transform rotate-12" viewBox="0 0 90 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="41" y="55" width="8" height="70" rx="4" fill="url(#stickG)"/>
                    <circle cx="45" cy="40" r="35" fill="url(#popG)" stroke="white" stroke-width="4"/>
                    <circle cx="45" cy="40" r="25" stroke="white" stroke-width="5" stroke-dasharray="12 8" opacity="0.85"/>
                    <circle cx="45" cy="40" r="14" stroke="#fef08a" stroke-width="4" opacity="0.95"/>
                    <ellipse cx="32" cy="26" rx="9" ry="5" fill="white" opacity="0.65" transform="rotate(-30 32 26)"/>
                    <defs>
                      <linearGradient id="popG" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#facc15"/>
                        <stop offset="50%" stop-color="#f43f5e"/>
                        <stop offset="100%" stop-color="#a855f7"/>
                      </linearGradient>
                      <linearGradient id="stickG" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#cbd5e1"/>
                        <stop offset="50%" stop-color="#ffffff"/>
                        <stop offset="100%" stop-color="#94a3b8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <!-- Enhanced Vector SVG Snack Foil Pouch (Top Right) -->
                <div class="absolute -top-8 -right-4 z-30 animate-bounce drop-shadow-[0_15px_30px_rgba(217,119,6,0.5)]" style="animation-duration: 5s;">
                  <svg class="w-18 h-24 transform rotate-12" viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="8" width="68" height="94" rx="10" fill="url(#pouchG)" stroke="white" stroke-width="3"/>
                    <path d="M6 22 H74" stroke="#b91c1c" stroke-width="5" stroke-dasharray="6 3"/>
                    <rect x="14" y="34" width="52" height="42" rx="6" fill="white" opacity="0.95"/>
                    <text x="40" y="52" font-family="sans-serif" font-size="9" font-weight="900" fill="#476021" text-anchor="middle">GALAXY</text>
                    <text x="40" y="66" font-family="sans-serif" font-size="7" font-weight="800" fill="#b91c1c" text-anchor="middle">MANGO BITES</text>
                    <path d="M12 14 L30 100" stroke="white" stroke-width="10" opacity="0.25" stroke-linecap="round"/>
                    <defs>
                      <linearGradient id="pouchG" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="50%" stop-color="#f59e0b"/>
                        <stop offset="100%" stop-color="#b45309"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

            </div>

            <!-- Footer info -->
            <div class="relative z-10 flex items-center justify-between mt-4">
              <div class="flex items-center space-x-2"></div>
              <span class="text-xs text-white/70 font-semibold">&copy; 2026 TipTop Foods OPC</span>
            </div>
            
            <!-- Decorative Floating Backdrop Blobs -->
            <div class="absolute -top-20 -left-20 w-72 h-72 bg-[#EAC224] opacity-15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-[#B4161B] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <!-- Right Side: Pop Login Form -->
          <div class="md:w-[42%] p-8 md:p-16 lg:p-20 relative flex flex-col justify-center bg-white">
            
            <!-- Decorative Floating Shapes -->
            <div class="absolute top-6 right-8 w-20 h-20 bg-[#EAC224] rounded-2xl opacity-20 transform rotate-12 animate-pulse pointer-events-none"></div>
            <div class="absolute bottom-10 right-6 w-16 h-16 bg-[#598E18] rounded-full opacity-15 pointer-events-none"></div>

            <!-- Form Card Wrapper -->
            <div class="relative z-10 bg-white p-8 md:p-12 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 max-w-md w-full mx-auto">
              <h2 class="text-3xl font-black text-[#476021] mb-1">Welcome Back</h2>
              <p class="text-xs text-gray-400 mb-6 font-medium">Please sign in to access your workspace.</p>

              <form class="space-y-4" (submit)="authenticate($event)">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#598E18] focus:border-[#598E18] transition-all outline-none text-sm text-gray-900 bg-gray-50/50 focus:bg-white" placeholder="name@galaxycandies.com" required>
                </div>
                
                <div>
                  <div class="flex justify-between items-center mb-1.5">
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                    <a href="#" class="text-xs font-bold text-[#B4161B] hover:text-[#8a1114] transition-colors">Forgot password?</a>
                  </div>
                  <input type="password" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#598E18] focus:border-[#598E18] transition-all outline-none text-sm text-gray-900 bg-gray-50/50 focus:bg-white" placeholder="••••••••" required>
                </div>
                
                <div class="flex items-center pt-1">
                  <input type="checkbox" id="remember" class="w-4 h-4 text-[#598E18] bg-gray-100 border-gray-300 rounded focus:ring-[#598E18] cursor-pointer">
                  <label for="remember" class="ml-2 text-xs text-gray-600 font-semibold cursor-pointer">Remember me for 30 days</label>
                </div>
                
                <button type="submit" class="w-full bg-[#B4161B] hover:bg-[#991216] text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-[#B4161B]/20 mt-3 transform hover:-translate-y-0.5 tracking-wide">
                  Sign In to Dashboard
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    }

    <!-- MAIN SYSTEM VIEW -->
    @if (isAuthenticated()) {
      <div class="min-h-screen bg-[#f3f6ee] font-sans text-gray-800 flex flex-col">
        
        <!-- TOP NAVIGATION BAR -->
        <header class="bg-[#EAC224] shadow-md sticky top-0 z-40 border-b border-yellow-300">
          <div class="px-6 flex items-center justify-between h-16">
            
            <!-- Logo Area -->
            <div class="flex items-center gap-2.5 cursor-pointer" (click)="activeTab.set('dashboard')">
              <img src="logo.png" alt="Galaxy Candies Logo" class="w-8 h-8 rounded-[10px] object-contain shadow-inner">
              <div class="flex flex-col leading-none">
                <span class="font-black text-[#476021] text-sm">Galaxy</span>
                <span class="font-bold text-[#598E18] text-[10px] tracking-wider uppercase">Candies</span>
              </div>
            </div>

            <!-- Primary Nav -->
            <nav class="hidden md:flex space-x-1 h-full">
              <button (click)="activeTab.set('dashboard')" [class.border-[#476021]]="activeTab() === 'dashboard'" [class.text-[#476021]]="activeTab() === 'dashboard'" [class.font-black]="activeTab() === 'dashboard'" [class.border-transparent]="activeTab() !== 'dashboard'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Dashboard</button>
              <button (click)="activeTab.set('procurement')" [class.border-[#476021]]="activeTab() === 'procurement'" [class.text-[#476021]]="activeTab() === 'procurement'" [class.font-black]="activeTab() === 'procurement'" [class.border-transparent]="activeTab() !== 'procurement'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Procurement</button>
              <button (click)="activeTab.set('qa')" [class.border-[#476021]]="activeTab() === 'qa'" [class.text-[#476021]]="activeTab() === 'qa'" [class.font-black]="activeTab() === 'qa'" [class.border-transparent]="activeTab() !== 'qa'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Quality Assurance</button>
              <button (click)="activeTab.set('inventory')" [class.border-[#476021]]="activeTab() === 'inventory'" [class.text-[#476021]]="activeTab() === 'inventory'" [class.font-black]="activeTab() === 'inventory'" [class.border-transparent]="activeTab() !== 'inventory'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Inventory</button>
              <button (click)="activeTab.set('sales')" [class.border-[#476021]]="activeTab() === 'sales'" [class.text-[#476021]]="activeTab() === 'sales'" [class.font-black]="activeTab() === 'sales'" [class.border-transparent]="activeTab() !== 'sales'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Sales</button>
              <button (click)="activeTab.set('logistics')" [class.border-[#476021]]="activeTab() === 'logistics'" [class.text-[#476021]]="activeTab() === 'logistics'" [class.font-black]="activeTab() === 'logistics'" [class.border-transparent]="activeTab() !== 'logistics'" class="px-4 h-full border-b-4 text-sm font-medium hover:text-[#476021] transition-colors">Logistics</button>
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <div class="relative">
                <button (click)="toggleNotifications()" class="text-[#476021] hover:text-[#476021]/80 relative p-1">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  @if (unreadNotifications() > 0) { <span class="absolute top-0 right-0 h-2.5 w-2.5 bg-[#B4161B] rounded-full ring-2 ring-[#EAC224]"></span> }
                </button>
                @if (showNotifications()) {
                  <div class="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-yellow-200 z-50 overflow-hidden">
                    <div class="p-3 border-b border-gray-100 flex justify-between items-center bg-[#f3f6ee]">
                      <span class="font-bold text-sm text-[#476021]">Notifications</span>
                      <button (click)="clearNotifications()" class="text-xs text-[#598E18] font-bold hover:underline">Clear</button>
                    </div>
                    <div class="max-h-64 overflow-y-auto">
                      @for (notif of notifications(); track notif.id) {
                        <div class="p-3 border-b border-gray-50 text-sm" [class.bg-yellow-50]="!notif.read">
                          <p class="font-bold text-gray-900">{{notif.title}}</p>
                          <p class="text-gray-500 text-xs mt-1">{{notif.message}}</p>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Profile Pill -->
              <div class="flex items-center bg-white rounded-full p-1 pr-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors border border-yellow-300" (click)="logout()">
                <div class="w-7 h-7 bg-[#598E18]/10 text-[#598E18] rounded-full mr-2 flex items-center justify-center text-xs overflow-hidden font-bold">👦🏻</div>
                <span class="text-sm font-bold text-[#476021]">Lorenz</span>
                <svg class="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <!-- Settings -->
              <button class="text-[#476021] hover:text-[#476021]/80">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 p-6 mx-auto w-full max-w-7xl animate-in fade-in duration-300">
          
          <!-- DASHBOARD MODULE -->
          @if (activeTab() === 'dashboard') {
            <div>
               <!-- Header & Search -->
               <div class="flex justify-between items-center mb-6">
                 <h2 class="text-xs font-bold text-[#476021] uppercase tracking-wider">Admin Dashboard</h2>
                 <div class="relative w-64">
                   <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                   <input type="text" placeholder="Search receipts, suppliers..." class="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#598E18] shadow-sm">
                 </div>
               </div>

               <!-- Horizontal KPI Cards -->
               <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 flex-shrink-0 bg-[#f3f6ee] text-[#598E18] rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-500 mb-0.5">Yield Capacity</p>
                      <p class="text-xl font-black text-[#476021]">{{ currentYield() }} <span class="text-xs font-semibold text-gray-400">packs</span></p>
                    </div>
                  </div>
                  <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 flex-shrink-0 bg-yellow-50 text-[#EAC224] rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-500 mb-0.5">Pending QA</p>
                      <p class="text-xl font-black text-[#476021]">{{ qaBatches().length }} <span class="text-xs font-semibold text-gray-400">batches</span></p>
                    </div>
                  </div>
                  <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 flex-shrink-0 bg-green-50 text-[#598E18] rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-500 mb-0.5">Sellable Stock</p>
                      <p class="text-xl font-black text-[#476021]">{{ sellableStock() }} <span class="text-xs font-semibold text-gray-400">units</span></p>
                    </div>
                  </div>
                  <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 flex-shrink-0 bg-red-50 text-[#B4161B] rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-500 mb-0.5">Active Deliveries</p>
                      <p class="text-xl font-black text-[#476021]">{{ deliveries().length }} <span class="text-xs font-semibold text-gray-400">routes</span></p>
                    </div>
                  </div>
               </div>

               <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 <!-- BOM Engine Box -->
                 <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                   <div class="flex justify-between items-center mb-6">
                     <h3 class="text-base font-bold text-[#476021]">Raw Material to Product Calculation Engine</h3>
                     <span class="bg-[#f3f6ee] text-[#598E18] border border-[#598E18]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Auto-Calculating</span>
                   </div>
                   
                   <p class="text-sm font-bold text-gray-700 mb-4">Bill of Materials (BOM) - Mango Candy</p>
                   
                   <div class="overflow-x-auto mb-6">
                     <table class="w-full text-left text-sm">
                       <thead class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                         <tr><th class="pb-3 font-bold">Component</th><th class="pb-3 font-bold">Unit Req</th><th class="pb-3 font-bold">Available Qty</th><th class="pb-3 font-bold">Max Yield Contribution</th><th class="pb-3 font-bold">Status</th></tr>
                       </thead>
                       <tbody class="divide-y divide-gray-50">
                         @for (item of inventoryLevels(); track item.name) {
                           <tr [class.bg-red-50/50]="item.yield < 300">
                             <td class="py-3.5 flex items-center font-semibold" [class.text-[#B4161B]]="item.yield < 300" [class.text-gray-800]="item.yield >= 300">
                               <span class="w-2 h-2 rounded-full mr-2.5" [class.bg-[#B4161B]]="item.yield < 300" [class.bg-[#598E18]]="item.yield >= 300"></span>
                               {{item.name}}
                             </td>
                             <td class="py-3.5 text-gray-500" [class.text-[#B4161B]]="item.yield < 300">{{item.req}}</td>
                             <td class="py-3.5 font-bold" [class.text-[#B4161B]]="item.yield < 300" [class.text-gray-900]="item.yield >= 300">{{item.qty | number}}{{item.unit}}</td>
                             <td class="py-3.5 font-bold" [class.text-[#B4161B]]="item.yield < 300" [class.text-gray-900]="item.yield >= 300">{{item.yield}} packs</td>
                             <td class="py-3.5">
                               @if (item.yield < 300) { <span class="bg-[#B4161B]/10 text-[#B4161B] px-2.5 py-1 rounded-md text-xs font-bold">Bottleneck</span> }
                               @else { <span class="bg-[#598E18]/10 text-[#598E18] px-2.5 py-1 rounded-md text-xs font-bold">Adequate</span> }
                             </td>
                           </tr>
                         }
                       </tbody>
                     </table>
                   </div>

                   <!-- Alert Box -->
                   <div class="bg-[#f3f6ee] border border-[#598E18]/20 rounded-xl p-4 flex justify-between items-center">
                     <div>
                       <p class="text-xs font-bold text-[#476021]">System Recommendation</p>
                       <p class="text-sm text-gray-700 mt-0.5">Generate requisition for <span class="font-bold text-[#B4161B]">210 Packaging Pouches</span> to match Puree limits (360 packs).</p>
                     </div>
                     <button class="bg-[#598E18] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#476021] transition" (click)="addPO()">Create PO</button>
                   </div>
                 </div>
                 
                 <!-- Recent Events Timeline -->
                 <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                   <h3 class="text-base font-bold text-[#476021] mb-6">Recent Events</h3>
                   <div class="relative border-l-2 border-[#598E18]/30 pl-4 space-y-6 ml-2">
                      @for (log of systemLogs(); track log.id) {
                        <div class="relative">
                          <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" [class.bg-[#EAC224]]="log.type === 'sales'" [class.bg-[#598E18]]="log.type !== 'sales'"></div>
                          <p class="text-[10px] text-gray-400 font-bold mb-0.5">{{log.time}}</p>
                          <p class="text-sm font-bold text-gray-800">{{log.title}}</p>
                          <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{log.desc}}</p>
                        </div>
                      }
                   </div>
                 </div>

               </div>
            </div>
          }

          <!-- PROCUREMENT MODULE -->
          @if (activeTab() === 'procurement') {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              <!-- Sub-Nav Header -->
              <div class="border-b border-gray-100 px-6 pt-4 flex justify-between items-end bg-[#f3f6ee]/40">
                <div class="flex space-x-6">
                  <button (click)="subTab.set('p-dash')" [class.border-[#598E18]]="subTab() === 'p-dash'" [class.text-[#476021]]="subTab() === 'p-dash'" [class.font-bold]="subTab() === 'p-dash'" [class.border-transparent]="subTab() !== 'p-dash'" [class.text-gray-500]="subTab() !== 'p-dash'" class="pb-3 border-b-2 text-sm transition-colors">Pending Receipts</button>
                  <button (click)="subTab.set('p-dir')" [class.border-[#598E18]]="subTab() === 'p-dir'" [class.text-[#476021]]="subTab() === 'p-dir'" [class.font-bold]="subTab() === 'p-dir'" [class.border-transparent]="subTab() !== 'p-dir'" [class.text-gray-500]="subTab() !== 'p-dir'" class="pb-3 border-b-2 text-sm transition-colors">Supplier Directory</button>
                  <button (click)="subTab.set('p-log')" [class.border-[#598E18]]="subTab() === 'p-log'" [class.text-[#476021]]="subTab() === 'p-log'" [class.font-bold]="subTab() === 'p-log'" [class.border-transparent]="subTab() !== 'p-log'" [class.text-gray-500]="subTab() !== 'p-log'" class="pb-3 border-b-2 text-sm transition-colors">Incoming Goods Log</button>
                </div>
                <div class="relative w-64 mb-3">
                  <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input type="text" placeholder="Search receipts, suppliers..." class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#598E18]">
                </div>
              </div>

              <!-- Module Content -->
              <div class="p-6">
                
                @if (subTab() === 'p-dash') {
                  <div class="flex justify-between items-center mb-6">
                    <div>
                      <h3 class="text-lg font-bold text-[#476021]">Expected Deliveries & Material Receipt</h3>
                      <p class="text-xs text-gray-500 mt-1">Scan incoming barcodes to trigger GRN and push payload to QA Module (Trigger 1).</p>
                    </div>
                    <button class="bg-[#598E18] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#476021] transition shadow-sm">+ New Purchase Order</button>
                  </div>
                  
                  <table class="w-full text-left text-sm">
                    <thead class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <tr><th class="pb-3 font-bold">PO Number</th><th class="pb-3 font-bold">Supplier</th><th class="pb-3 font-bold">Expected Materials</th><th class="pb-3 font-bold">Quantity</th><th class="pb-3 font-bold">ETA</th><th class="pb-3 font-bold">Status</th><th class="pb-3 font-bold text-right">Action</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr>
                        <td class="py-4 font-bold text-gray-800">PO-2026-009</td><td class="py-4 text-gray-600">Sweet Cane Farms Corp.</td><td class="py-4 text-gray-600">Refined Sugar</td><td class="py-4 text-gray-600">500 kg</td><td class="py-4 text-gray-600">Today, 10:00 AM</td>
                        <td class="py-4"><span class="text-blue-600 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-md">In Transit</span></td>
                        <td class="py-4 text-right"><button class="bg-[#EAC224] text-[#476021] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#d6b01e]" (click)="addStock('Sugar', 500, 'kg')">Scan Arrival</button></td>
                      </tr>
                      <tr>
                        <td class="py-4 font-bold text-gray-800">PO-2026-098</td><td class="py-4 text-gray-600">Plastics Packaging Inc.</td><td class="py-4 text-gray-600">Mango Candy Pouches</td><td class="py-4 text-gray-600">300 pcs</td><td class="py-4 text-gray-600">Today, 1:00 PM</td>
                        <td class="py-4"><span class="text-blue-600 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-md">In Transit</span></td>
                        <td class="py-4 text-right"><button class="bg-[#EAC224] text-[#476021] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#d6b01e]" (click)="addStock('Packaging Pouch', 300, 'pcs')">Scan Arrival</button></td>
                      </tr>
                      <tr>
                        <td class="py-4 font-bold text-gray-800">PO-2026-085</td><td class="py-4 text-gray-600">Tropical Fruits Ltd.</td><td class="py-4 text-gray-600">Mango Puree</td><td class="py-4 text-gray-600">150 L</td><td class="py-4 text-gray-600">Yesterday</td>
                        <td class="py-4"><span class="text-[#598E18] font-bold text-xs bg-green-50 px-2.5 py-1 rounded-md">Received</span></td>
                        <td class="py-4 text-right"><span class="text-gray-400 text-xs">Sent to QA</span></td>
                      </tr>
                    </tbody>
                  </table>
                }

                @if (subTab() === 'p-dir') {
                  <div class="flex justify-between items-center mb-6">
                    <div>
                      <h3 class="text-lg font-bold text-[#476021]">Supplier Directory</h3>
                      <p class="text-xs text-gray-500 mt-1">Manage approved vendors, material sources, and contact information.</p>
                    </div>
                    <button class="bg-[#598E18] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#476021] transition shadow-sm">+ Add New Supplier</button>
                  </div>
                  <table class="w-full text-left text-sm mt-4">
                    <thead class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <tr><th class="pb-3 font-bold">Supplier Name</th><th class="pb-3 font-bold">Material Category</th><th class="pb-3 font-bold">Primary Contact</th><th class="pb-3 font-bold">Contact Info</th><th class="pb-3 font-bold">Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-bold text-gray-800">Sweet Cane Farms Corp.</td><td class="py-4 text-gray-600"><span class="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-semibold">Raw Ingredients</span></td><td class="py-4 text-gray-600">Maria Santos</td><td class="py-4 text-gray-600 text-xs">msantos&#64;sweetcane.com</td><td class="py-4"><span class="text-[#598E18] font-bold text-xs">ACTIVE</span></td></tr>
                      <tr><td class="py-4 font-bold text-gray-800">Plastics Packaging Inc.</td><td class="py-4 text-gray-600"><span class="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-semibold">Packaging</span></td><td class="py-4 text-gray-600">Robert Chen</td><td class="py-4 text-gray-600 text-xs">rchen&#64;plasticspkg.com</td><td class="py-4"><span class="text-[#598E18] font-bold text-xs">ACTIVE</span></td></tr>
                    </tbody>
                  </table>
                }

                @if (subTab() === 'p-log') {
                  <div class="flex justify-between items-center mb-6">
                    <div>
                      <h3 class="text-lg font-bold text-[#476021]">Incoming Goods Log (GRN History)</h3>
                      <p class="text-xs text-gray-500 mt-1">Historical record of all scanned arrivals and generated Goods Receipt Notes.</p>
                    </div>
                    <button class="border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm">Export CSV</button>
                  </div>
                  <table class="w-full text-left text-sm mt-4">
                    <thead class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <tr><th class="pb-3 font-bold">GRN Number</th><th class="pb-3 font-bold">PO Reference</th><th class="pb-3 font-bold">Supplier</th><th class="pb-3 font-bold">Materials Received</th><th class="pb-3 font-bold">Routing Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-bold text-[#598E18]">GRN-2026-0150</td><td class="py-4 text-gray-600">PO-2026-085</td><td class="py-4 text-gray-800 font-medium">Tropical Fruits Ltd.</td><td class="py-4 text-gray-600">Mango Puree (150 L)</td><td class="py-4"><span class="text-blue-600 font-bold text-xs border border-blue-200 bg-blue-50 px-2.5 py-1 rounded-md">Routed to QA</span></td></tr>
                      <tr><td class="py-4 font-bold text-[#598E18]">GRN-2026-0149</td><td class="py-4 text-gray-600">PO-2026-004</td><td class="py-4 text-gray-800 font-medium">Sweet Cane Farms Corp.</td><td class="py-4 text-gray-600">Refined Sugar (200 kg)</td><td class="py-4"><span class="text-[#598E18] font-bold text-xs border border-green-200 bg-green-50 px-2.5 py-1 rounded-md">QA Cleared</span></td></tr>
                    </tbody>
                  </table>
                }

              </div>
            </div>
          }

          <!-- PLACEHOLDERS FOR REMAINING TABS -->
          @if (activeTab() !== 'dashboard' && activeTab() !== 'procurement') {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <h2 class="text-2xl font-bold text-[#476021] capitalize mb-2">{{ activeTab() }} Workspace</h2>
              <p class="text-gray-500 text-sm">UI layouts for this module map exactly to the standard white card container format used in Procurement.</p>
            </div>
          }

        </main>
      </div>
    }
  `
})
export class AppComponent {
  isAuthenticated = signal<boolean>(false);
  activeTab = signal<'dashboard' | 'procurement' | 'qa' | 'inventory' | 'sales' | 'logistics'>('dashboard');
  subTab = signal<string>('p-dash');

  showNotifications = signal<boolean>(false);
  unreadNotifications = signal<number>(1);
  notifications = signal([
    { id: 1, title: 'Low Stock Alert', message: 'Packaging Pouch inventory is at critical bottleneck levels.', read: false }
  ]);

  systemLogs = signal([
    { id: 1, type: 'sales', time: 'Just now • Trigger 4 (Sales)', title: 'Order Allocation & Invoice Gen.', desc: 'Status flipped to ALLOCATED. Delivery Request ticket generated for Route A.' },
    { id: 2, type: 'prod', time: '15 mins ago • Trigger 3 (Production)', title: 'Production Run Completed', desc: 'Raw stock deducted from WIP. Outbound clearance task sent to Module 3.2.' },
    { id: 3, type: 'qa', time: '1 hour ago • Trigger 2 (QA)', title: 'Inbound QA Check: Passed', desc: 'Packaging pouch stock changed to AVAILABLE_RAW. Yield recalculated.' }
  ]);

  inventoryLevels = signal([
    { name: 'Sugar', req: '100g', qty: 40000, unit: 'g', yieldDivider: 100 },
    { name: 'Mango Puree', req: '250ml', qty: 90000, unit: 'ml', yieldDivider: 250 },
    { name: 'Packaging Pouch', req: '1 pc', qty: 150, unit: 'pcs', yieldDivider: 1 }
  ].map(item => ({ ...item, yield: Math.floor(item.qty / item.yieldDivider) })));
  
  sellableStock = signal<number>(0);
  currentYield = computed(() => Math.min(...this.inventoryLevels().map(i => i.yield)));

  qaBatches = signal([{ id: 'BCH-1100' }]);
  deliveries = signal([{ id: 'RT-001' }]);

  authenticate(event: Event) { event.preventDefault(); this.isAuthenticated.set(true); }
  logout() { this.isAuthenticated.set(false); this.activeTab.set('dashboard'); }

  toggleNotifications() { this.showNotifications.set(!this.showNotifications()); }
  clearNotifications() {
    this.unreadNotifications.set(0);
    this.notifications.update(notifs => notifs.map(n => ({ ...n, read: true })));
  }

  addStock(itemName: string, qtyToAdd: number, unit: string) {
    this.inventoryLevels.update(items => items.map(item => {
      if (item.name === itemName) {
        const newQty = item.qty + qtyToAdd;
        return { ...item, qty: newQty, yield: Math.floor(newQty / item.yieldDivider) };
      }
      return item;
    }));
    this.notifications.update(n => [{ id: Date.now(), title: 'Arrival Scanned', message: `${qtyToAdd} ${unit} of ${itemName} routed to QA.`, read: false }, ...n]);
    this.unreadNotifications.update(n => n + 1);
  }

  addPO() {
    this.notifications.update(n => [{ id: Date.now(), title: 'PO Created', message: 'Purchase Requisition sent for 210 pouches.', read: false }, ...n]);
    this.unreadNotifications.update(n => n + 1);
  }
}