import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
      .font-candy { font-family: 'Fredoka', sans-serif; }
      .font-erp { font-family: 'Nunito', sans-serif; }
      
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      .dash-anim { stroke-dasharray: 10; animation: dash 20s linear infinite; }
      @keyframes dash { to { stroke-dashoffset: -1000; } }

      .scan-laser { animation: scan 2s cubic-bezier(0.53, 0, 0.43, 1) infinite; }
      @keyframes scan { 0%, 100% { top: 10%; opacity: 0; } 10%, 90% { opacity: 1; } 50% { top: 90%; } }
    </style>

    <!-- AUTHENTICATION & INTERNAL PORTAL LOGIN VIEW (UNCHANGED) -->
    @if (!isAuthenticated()) {
      <div class="min-h-screen w-full bg-[#fbfdf9] flex flex-col font-erp animate-in fade-in duration-300 overflow-x-hidden">
        
        <!-- Clean Header -->
        <header class="w-full bg-white px-8 md:px-12 py-4 flex items-center shadow-sm relative z-50 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <img src="logo.png" alt="Galaxy Candies Logo" class="w-10 h-10 rounded-xl object-contain shadow-sm">
            <div class="flex flex-col">
              <span class="font-candy font-bold text-lg tracking-wider text-[#476021] uppercase">Galaxy Candies & Snacks</span>
              <span class="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Internal Enterprise Cloud ERP</span>
            </div>
          </div>
        </header>

        <div class="flex-1 flex flex-col lg:flex-row w-full relative overflow-hidden">
          <!-- Left Side: Clean Green Hero Panel with Floating Candies -->
          <div class="lg:w-[55%] xl:w-[60%] relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-20 text-white bg-gradient-to-br from-[#476021] via-[#598E18] to-[#2d3e15] rounded-br-[100px] lg:rounded-br-[250px] shadow-[15px_0_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <div class="max-w-5xl mx-auto w-full flex flex-col xl:flex-row items-center justify-between gap-12 z-20">
              <div class="w-full xl:w-1/2 flex flex-col items-start text-left">
                <span class="inline-block bg-[#EAC224] text-[#B4161B] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6 shadow-sm">🚀 Enterprise Operations Hub</span>
                <h1 class="font-candy text-5xl lg:text-6xl xl:text-[72px] font-bold mb-6 leading-[1.05] tracking-wide text-white drop-shadow-sm">Welcome to<br><span class="text-[#EAC224] drop-shadow-md">Galaxy</span><br><span class="text-[#fde047] drop-shadow-md">Candies</span><br>and Snacks.</h1>
                <p class="text-white/80 font-semibold mb-8 max-w-sm text-sm lg:text-base leading-relaxed">Unified procurement, inventory, and quality assurance management system for seamless confectionery operations.</p>
              </div>
              
              <!-- Clean Central Rocket Graphic with Floating Candies -->
              <div class="w-full xl:w-1/2 flex justify-center items-center">
                <div class="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] flex items-center justify-center flex-shrink-0 mt-8 xl:mt-0">
                  <div class="absolute inset-[15%] rounded-full border-[2px] border-dashed border-white/20 animate-spin" style="animation-duration: 60s;"></div>
                  
                  <div class="relative animate-bounce z-20" style="animation-duration: 4.5s;">
                    <div class="w-[110px] h-[180px] bg-gradient-to-r from-white via-gray-100 to-gray-300 rounded-[50px] rounded-t-[80px] shadow-[0_25px_50px_rgba(0,0,0,0.35)] relative flex flex-col items-center pt-4 border-2 border-white/80 transform -rotate-6">
                      <div class="w-10 h-10 rounded-full bg-[#2c3e15] border-[3px] border-white flex items-center justify-center shadow-inner my-2"><div class="w-3.5 h-3.5 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.9)]"></div></div>
                      <div class="absolute -left-7 bottom-5 w-8 h-20 bg-gradient-to-tr from-red-700 to-[#B4161B] rounded-l-2xl transform skew-y-12 shadow-md"></div>
                      <div class="absolute -right-7 bottom-5 w-8 h-20 bg-gradient-to-tl from-red-700 to-[#B4161B] rounded-r-2xl transform -skew-y-12 shadow-md"></div>
                    </div>
                  </div>

                  <div class="absolute top-[2%] left-[0%] z-30 animate-pulse drop-shadow-[0_15px_30px_rgba(244,63,94,0.6)]" style="animation-duration: 3.5s;">
                    <svg class="w-28 h-28 transform -rotate-15" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 30 L0 10 L8 30 L0 50 Z" fill="url(#wrapGrad)" stroke="white" stroke-width="1.5" opacity="0.95"/>
                      <path d="M12 30 L4 20 M12 30 L4 40" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                      <path d="M78 30 L100 10 L92 30 L100 50 Z" fill="url(#wrapGrad)" stroke="white" stroke-width="1.5" opacity="0.95"/>
                      <path d="M88 30 L96 20 M88 30 L96 40" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                      <rect x="20" y="10" width="60" height="40" rx="20" fill="url(#berryGrad)" stroke="white" stroke-width="3"/>
                      <path d="M28 20 Q50 14 72 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
                      <ellipse cx="70" cy="35" rx="4" ry="2" fill="white" opacity="0.6"/>
                      <defs>
                        <linearGradient id="berryGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#9f1239"/></linearGradient>
                        <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div class="absolute bottom-[2%] left-[-4%] z-30 animate-bounce drop-shadow-[0_15px_30px_rgba(234,179,8,0.5)]" style="animation-duration: 4.5s;">
                    <svg class="w-24 h-32 transform rotate-12" viewBox="0 0 90 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="41" y="55" width="8" height="75" rx="4" fill="url(#stickG)" shadow="md"/>
                      <rect x="42" y="55" width="2" height="75" fill="black" opacity="0.1"/>
                      <circle cx="45" cy="40" r="38" fill="url(#popG)" stroke="white" stroke-width="4.5"/>
                      <circle cx="45" cy="40" r="28" stroke="white" stroke-width="6" stroke-dasharray="15 10" opacity="0.9"/>
                      <circle cx="45" cy="40" r="16" stroke="#fef08a" stroke-width="5" opacity="0.95"/>
                      <ellipse cx="26" cy="24" rx="12" ry="5" fill="white" opacity="0.75" transform="rotate(-30 26 24)"/>
                      <defs>
                        <linearGradient id="popG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#c026d3"/></linearGradient>
                        <linearGradient id="stickG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div class="absolute top-[8%] right-[-2%] z-30 animate-bounce drop-shadow-[0_20px_35px_rgba(217,119,6,0.6)]" style="animation-duration: 5s;">
                    <svg class="w-24 h-32 transform rotate-12" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="80" height="110" rx="12" fill="url(#pouchG)" stroke="white" stroke-width="4"/>
                      <path d="M10 25 H90" stroke="#b91c1c" stroke-width="6" stroke-dasharray="8 4"/>
                      <path d="M10 105 H90" stroke="#b91c1c" stroke-width="6" stroke-dasharray="8 4"/>
                      <rect x="20" y="45" width="60" height="45" rx="8" fill="white" opacity="0.95" stroke="#fef08a" stroke-width="2"/>
                      <text x="50" y="62" class="font-candy font-bold" font-size="12" fill="#476021" text-anchor="middle">GALAXY</text>
                      <text x="50" y="78" font-family="sans-serif" font-size="9" font-weight="800" fill="#b91c1c" text-anchor="middle">MANGO BITES</text>
                      <path d="M18 16 L35 115" stroke="white" stroke-width="12" opacity="0.3" stroke-linecap="round"/>
                      <defs>
                        <linearGradient id="pouchG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div class="absolute bottom-[10%] right-[0%] z-30 animate-pulse drop-shadow-[0_15px_30px_rgba(120,53,15,0.6)]" style="animation-duration: 4.2s;">
                    <svg class="w-20 h-28 transform -rotate-12" viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="5" width="60" height="95" rx="6" fill="#78350f" stroke="#451a03" stroke-width="3"/>
                      <rect x="16" y="12" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <rect x="42" y="12" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <rect x="16" y="38" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <rect x="42" y="38" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <rect x="16" y="64" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <rect x="42" y="64" width="22" height="22" rx="3" fill="#92400e" stroke="#fcd34d" stroke-width="0.5" stroke-opacity="0.3"/>
                      <path d="M5 65 L 15 55 L 25 65 L 35 55 L 45 65 L 55 55 L 65 65 L 75 55 L 75 105 L 5 105 Z" fill="url(#foilGrad)" stroke="white" stroke-width="2.5"/>
                      <path d="M15 55 L 15 105 M 35 55 L 35 105 M 55 55 L 55 105" stroke="#94a3b8" stroke-width="1.5" opacity="0.6"/>
                      <defs><linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient></defs>
                    </svg>
                  </div>
                  <div class="absolute -top-[5%] right-[38%] z-30 animate-bounce drop-shadow-[0_15px_30px_rgba(239,68,68,0.5)]" style="animation-duration: 3.8s;">
                    <svg class="w-20 h-20 transform rotate-45" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="40" r="36" fill="white" stroke="#f1f5f9" stroke-width="3"/>
                      <g fill="#ef4444">
                        <path d="M40 40 L40 4 A36 36 0 0 1 65.45 14.54 Z"/>
                        <path d="M40 40 L40 4 A36 36 0 0 1 65.45 14.54 Z" transform="rotate(90 40 40)"/>
                        <path d="M40 40 L40 4 A36 36 0 0 1 65.45 14.54 Z" transform="rotate(180 40 40)"/>
                        <path d="M40 40 L40 4 A36 36 0 0 1 65.45 14.54 Z" transform="rotate(270 40 40)"/>
                      </g>
                      <circle cx="40" cy="40" r="12" fill="white" opacity="0.95"/>
                      <circle cx="40" cy="40" r="6" fill="#ef4444" opacity="0.9"/>
                      <ellipse cx="25" cy="20" rx="12" ry="6" fill="white" opacity="0.85" transform="rotate(-30 25 20)"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
            <div class="absolute bottom-6 left-8 lg:left-12 z-20"><span class="text-xs text-white/50 font-bold">&copy; 2026 TipTop Foods OPC</span></div>
          </div>

          <!-- Right Side: Clean Login Form Panel -->
          <div class="lg:w-[45%] xl:w-[40%] flex flex-col items-center justify-center p-8 lg:p-16 relative bg-white">
            
            <div class="relative z-10 bg-white p-10 md:p-12 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 max-w-[440px] w-full">
              <h2 class="font-candy text-4xl font-bold text-[#476021] mb-1">Welcome Back</h2>
              <p class="text-sm text-gray-500 mb-8 font-semibold">Please sign in to access your ERP workspace.</p>
              
              <form class="space-y-5" (submit)="authenticate($event)">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input type="email" class="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#598E18] focus:border-[#598E18] transition-all outline-none text-sm text-gray-900 bg-gray-50/50 focus:bg-white font-semibold" placeholder="name@galaxycandies.com" required>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'" class="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#598E18] transition-all outline-none text-sm text-gray-900 bg-gray-50/50 font-semibold" placeholder="••••••••" required>
                    <button type="button" (click)="togglePassword()" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#598E18]">
                      @if (showPassword()) { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"></path></svg> }
                      @else { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> }
                    </button>
                  </div>
                </div>
                <button type="submit" class="font-candy w-full bg-[#B4161B] hover:bg-[#991216] text-white py-4 rounded-xl shadow-md mt-4 tracking-wide text-lg transition-colors">Sign In</button>
              </form>
            </div>

            <!-- HQ MAP LOCATION WIDGET -->
            <div class="relative z-10 w-full max-w-[440px] mt-6 bg-white rounded-[24px] p-4 border border-gray-100 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
               <div class="w-16 h-16 bg-[#f8fafc] rounded-2xl overflow-hidden relative border border-gray-200 flex-shrink-0">
                  <svg class="absolute inset-0 w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 100 100"><path stroke-width="2" d="M0 20h100M0 40h100M0 60h100M0 80h100M20 0v100M40 0v100M60 0v100M80 0v100" /></svg>
                  <div class="absolute inset-0 flex items-center justify-center"><div class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4161B] opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-[#B4161B] border-2 border-white"></span></div></div>
               </div>
               <div>
                  <p class="text-[10px] font-bold text-[#598E18] uppercase tracking-widest font-candy">Corporate Headquarters</p>
                  <p class="text-sm font-bold text-gray-800 leading-tight mt-0.5">Bocaue, Central Luzon</p>
                  <p class="text-xs text-gray-500 font-semibold mt-0.5">Philippines</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- MAIN SYSTEM VIEW -->
    @if (isAuthenticated()) {
      <div class="min-h-screen bg-[#fbfdf9] font-erp text-gray-800 flex flex-col relative overflow-hidden">
        
        <!-- HEADER -->
        <header class="bg-gradient-to-r from-[#476021] via-[#598E18] to-[#2d3e15] shadow-lg sticky top-0 z-50 border-b border-[#EAC224]/30">
          <div class="px-8 flex items-center justify-between h-24">
            
            <!-- LOGO AND TITLE -->
            <div class="flex items-center gap-4 cursor-pointer" (click)="switchTab('dashboard')">
              <div class="bg-white p-1.5 rounded-2xl shadow-sm"><img src="logo.png" alt="Logo" class="w-12 h-12 object-contain rounded-xl"></div>
              <div class="flex flex-col leading-tight font-candy">
                <span class="font-bold text-white text-2xl tracking-wide">Galaxy Candies</span>
                <span class="font-bold text-white text-[13px] tracking-widest uppercase">and Snacks</span>
              </div>
            </div>

            <!-- NAVIGATION PILLS -->
            <nav class="hidden lg:flex space-x-2 bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/10 shadow-inner">
              <button (click)="switchTab('dashboard')" [class.bg-white]="activeTab() === 'dashboard'" [class.text-[#476021]]="activeTab() === 'dashboard'" [class.text-white]="activeTab() !== 'dashboard'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Dashboard</button>
              <button (click)="switchTab('procurement')" [class.bg-white]="activeTab() === 'procurement'" [class.text-[#476021]]="activeTab() === 'procurement'" [class.text-white]="activeTab() !== 'procurement'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Procurement</button>
              <button (click)="switchTab('inventory')" [class.bg-white]="activeTab() === 'inventory'" [class.text-[#476021]]="activeTab() === 'inventory'" [class.text-white]="activeTab() !== 'inventory'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Warehouse</button>
              <button (click)="switchTab('qa')" [class.bg-white]="activeTab() === 'qa'" [class.text-[#476021]]="activeTab() === 'qa'" [class.text-white]="activeTab() !== 'qa'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">QA</button>
              <button (click)="switchTab('production')" [class.bg-white]="activeTab() === 'production'" [class.text-[#476021]]="activeTab() === 'production'" [class.text-white]="activeTab() !== 'production'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Production</button>
              <button (click)="switchTab('sales')" [class.bg-white]="activeTab() === 'sales'" [class.text-[#476021]]="activeTab() === 'sales'" [class.text-white]="activeTab() !== 'sales'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Sales</button>
              <button (click)="switchTab('logistics')" [class.bg-white]="activeTab() === 'logistics'" [class.text-[#476021]]="activeTab() === 'logistics'" [class.text-white]="activeTab() !== 'logistics'" class="px-5 py-2.5 rounded-full text-sm font-bold font-candy tracking-wide transition-all">Logistics</button>
            </nav>

            <!-- PROFILE, SETTINGS & LOGOUT ACTION BUTTONS -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 pr-5 shadow-inner border border-white/20">
                <div class="w-10 h-10 bg-[#EAC224] text-[#476021] rounded-full mr-3 flex items-center justify-center text-lg font-bold shadow-sm">👦🏻</div>
                <span class="text-base font-bold text-white font-candy tracking-wide">Lorenz</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <!-- SETTINGS DROPDOWN WRAPPER -->
                <div class="relative">
                  <!-- Invisible backdrop to close menu when clicking outside -->
                  @if (showSettingsMenu()) {
                    <div class="fixed inset-0 z-40" (click)="showSettingsMenu.set(false)"></div>
                  }
                  
                  <!-- Settings Button -->
                  <button (click)="toggleSettings()" class="relative z-50 bg-white/10 p-3 rounded-full text-white hover:bg-white/20 hover:text-[#EAC224] transition-colors border border-white/20 shadow-inner" title="Settings">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>

                  <!-- Settings Dropdown Menu -->
                  @if (showSettingsMenu()) {
                    <div class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div class="p-3 border-b border-gray-50 bg-gray-50/50">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider font-candy">System Settings</p>
                      </div>
                      <div class="p-2 space-y-1">
                        <button class="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-[#598E18]/10 hover:text-[#598E18] transition-colors flex items-center gap-2">
                          <span class="text-lg">👤</span> Profile & Account
                        </button>
                        <button class="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-[#598E18]/10 hover:text-[#598E18] transition-colors flex items-center gap-2">
                          <span class="text-lg">🎨</span> Interface Theme
                        </button>
                        <button class="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-[#598E18]/10 hover:text-[#598E18] transition-colors flex items-center gap-2">
                          <span class="text-lg">🔔</span> Notifications
                        </button>
                        <button class="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-[#598E18]/10 hover:text-[#598E18] transition-colors flex items-center gap-2">
                          <span class="text-lg">🔐</span> Security & Access
                        </button>
                      </div>
                    </div>
                  }
                </div>
                
                <button (click)="logout()" class="bg-[#B4161B] p-3 rounded-full text-white hover:bg-[#991216] transition-colors border border-red-900/30 shadow-md" title="Log Out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            </div>

          </div>
        </header>

        <main class="flex-1 p-6 md:p-8 mx-auto w-full max-w-7xl relative z-10 animate-in slide-in-from-bottom-4 duration-500">
          
          <!-- DASHBOARD -->
          @if (activeTab() === 'dashboard') {
            <div class="mb-8"><h2 class="font-candy text-3xl text-[#476021] font-bold">Welcome Back, Lorenz.</h2><p class="text-sm text-gray-500 font-semibold mt-1">Here is the current state of your galaxy.</p></div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-white/80 rounded-[32px] p-6 shadow-sm border border-white">
                <p class="text-xs font-bold text-gray-400 mb-1 uppercase">Yield Capacity</p><p class="text-3xl font-candy font-bold text-[#476021]">{{ currentYield() }} <span class="text-sm font-sans font-bold text-gray-400">packs</span></p>
              </div>
              <div class="bg-white/80 rounded-[32px] p-6 shadow-sm border border-white">
                <p class="text-xs font-bold text-gray-400 mb-1 uppercase">Pending QA</p><p class="text-3xl font-candy font-bold text-[#476021]">1 <span class="text-sm font-sans font-bold text-gray-400">batches</span></p>
              </div>
              <div class="bg-white/80 rounded-[32px] p-6 shadow-sm border border-white">
                <p class="text-xs font-bold text-gray-400 mb-1 uppercase">Sellable Stock</p><p class="text-3xl font-candy font-bold text-[#476021]">{{ sellableStock() }} <span class="text-sm font-sans font-bold text-gray-400">units</span></p>
              </div>
              <div class="bg-white/80 rounded-[32px] p-6 shadow-sm border border-white">
                <p class="text-xs font-bold text-gray-400 mb-1 uppercase">Active Deliveries</p><p class="text-3xl font-candy font-bold text-[#476021]">1 <span class="text-sm font-sans font-bold text-gray-400">routes</span></p>
              </div>
            </div>
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white p-8">
               <h3 class="font-candy text-2xl text-[#476021] mb-6">Recent Events</h3>
               <div class="border-l-[3px] border-gray-100 pl-6 space-y-6 ml-3">
                  <div class="relative"><div class="absolute -left-[31.5px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm bg-[#EAC224]"></div><p class="text-[10px] text-gray-400 font-bold uppercase font-candy">Just now</p><p class="text-base font-bold text-gray-800">Order Allocation & Invoice Gen.</p></div>
                  <div class="relative"><div class="absolute -left-[31.5px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm bg-[#598E18]"></div><p class="text-[10px] text-gray-400 font-bold uppercase font-candy">15 mins ago</p><p class="text-base font-bold text-gray-800">Production Run Completed</p></div>
               </div>
            </div>
          }

          <!-- 1. PROCUREMENT MODULE -->
          @if (activeTab() === 'procurement') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('p-dash')" [class.bg-white]="subTab() === 'p-dash'" [class.text-[#476021]]="subTab() === 'p-dash'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">PO Dashboard</button>
                <button (click)="subTab.set('p-pr')" [class.bg-white]="subTab() === 'p-pr'" [class.text-[#476021]]="subTab() === 'p-pr'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Create PR</button>
                <button (click)="subTab.set('p-dir')" [class.bg-white]="subTab() === 'p-dir'" [class.text-[#476021]]="subTab() === 'p-dir'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Supplier Directory</button>
              </div>
              
              <div class="p-8">
                @if (subTab() === 'p-dash') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Active Purchase Orders</h3>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">PO Number</th><th class="pb-4">Supplier</th><th class="pb-4">Material</th><th class="pb-4">Qty</th><th class="pb-4">Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-black">PO-2026-009</td><td class="py-4 font-bold text-gray-600">Sweet Cane Farms Corp.</td><td class="py-4 text-gray-600">Refined Sugar</td><td class="py-4 font-black">500 kg</td><td class="py-4"><span class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">Dispatched</span></td></tr>
                      <tr><td class="py-4 font-black">PO-2026-010</td><td class="py-4 font-bold text-gray-600">Plastics Packaging Inc.</td><td class="py-4 text-gray-600">Mango Candy Pouches</td><td class="py-4 font-black">210 pcs</td><td class="py-4"><span class="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">Pending Approval</span></td></tr>
                    </tbody>
                  </table>
                }
                @if (subTab() === 'p-pr') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-2">Purchase Requisition (PR) Creator</h3>
                  <p class="text-sm text-gray-500 mb-6">Create a new requisition to generate a PO.</p>
                  <form class="max-w-2xl space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div class="grid grid-cols-2 gap-4">
                      <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Supplier ID</label><select class="w-full p-3 rounded-xl border border-gray-200"><option>SUP-001 (Sweet Cane Farms)</option><option>SUP-002 (Plastics Inc)</option></select></div>
                      <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Raw Material ID</label><select class="w-full p-3 rounded-xl border border-gray-200"><option>RM-SUG (Refined Sugar)</option><option>RM-PCH (Packaging Pouch)</option></select></div>
                      <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label><input type="number" class="w-full p-3 rounded-xl border border-gray-200" placeholder="e.g. 500"></div>
                      <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Cost (₱)</label><input type="number" class="w-full p-3 rounded-xl border border-gray-200" placeholder="0.00"></div>
                    </div>
                    <button type="button" class="mt-4 font-candy bg-[#EAC224] text-[#476021] px-6 py-3 rounded-xl font-bold">Generate Requisition</button>
                  </form>
                }
                @if (subTab() === 'p-dir') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Supplier Directory</h3>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">ID</th><th class="pb-4">Supplier Name</th><th class="pb-4">Category</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-black">SUP-001</td><td class="py-4 font-bold text-gray-800">Sweet Cane Farms Corp.</td><td class="py-4"><span class="bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 uppercase">Raw Ingredients</span></td></tr>
                      <tr><td class="py-4 font-black">SUP-002</td><td class="py-4 font-bold text-gray-800">Plastics Packaging Inc.</td><td class="py-4"><span class="bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 uppercase">Packaging</span></td></tr>
                    </tbody>
                  </table>
                }
              </div>
            </div>
          }

          <!-- 2. WAREHOUSE & INVENTORY MODULE -->
          @if (activeTab() === 'inventory') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('i-receive')" [class.bg-white]="subTab() === 'i-receive'" [class.text-[#476021]]="subTab() === 'i-receive'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Inbound Receiver</button>
                <button (click)="subTab.set('i-ledger')" [class.bg-white]="subTab() === 'i-ledger'" [class.text-[#476021]]="subTab() === 'i-ledger'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Stock Ledger</button>
                
                <!-- NEW CAPACITY PLANNER TAB -->
                <button (click)="subTab.set('i-calc')" [class.bg-white]="subTab() === 'i-calc'" [class.text-[#476021]]="subTab() === 'i-calc'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Capacity Planner</button>
              </div>
              <div class="p-8">
                @if (subTab() === 'i-receive') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-2">Inbound Shipment Receiver (GRN)</h3>
                  <p class="text-sm text-gray-500 mb-6">Scan barcodes to map to PO_ID and generate Goods Receipt Notes.</p>
                  <div class="flex flex-col md:flex-row gap-8 items-center">
                    <div class="w-full md:w-72 h-64 bg-gray-900 rounded-[32px] p-6 text-center relative overflow-hidden flex flex-col items-center justify-center border-4 border-gray-800 shadow-2xl">
                      <div class="w-full h-24 border-2 border-dashed border-gray-600 rounded-lg relative overflow-hidden flex items-center justify-center">
                        <div class="w-full h-1 bg-red-500 absolute scan-laser shadow-[0_0_15px_red]"></div>
                        <p class="text-gray-600 font-mono text-xs uppercase tracking-widest z-10">Awaiting Scan</p>
                      </div>
                      <p class="text-white font-bold mt-6 font-candy tracking-widest text-lg">SCAN BARCODE</p>
                    </div>
                    <div class="flex-1 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Manual PO_ID Entry</label>
                      <div class="flex gap-2">
                        <input type="text" class="flex-1 p-3 rounded-xl border border-gray-200 font-mono" placeholder="PO-XXXX-XXX">
                        <button class="bg-[#598E18] text-white px-6 rounded-xl font-bold font-candy">Fetch Payload</button>
                      </div>
                    </div>
                  </div>
                }
                @if (subTab() === 'i-ledger') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Inventory Stock Ledger</h3>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">Date</th><th class="pb-4">Material</th><th class="pb-4">Type</th><th class="pb-4">Qty Change</th><th class="pb-4">Running Balance</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 text-gray-500 text-xs">Today, 08:00 AM</td><td class="py-4 font-bold text-gray-800">Mango Puree</td><td class="py-4"><span class="bg-red-50 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">OUT (PROD)</span></td><td class="py-4 font-black text-red-600">-10,000 ml</td><td class="py-4 font-black">90,000 ml</td></tr>
                      <tr><td class="py-4 text-gray-500 text-xs">Yesterday, 14:00 PM</td><td class="py-4 font-bold text-gray-800">Mango Puree</td><td class="py-4"><span class="bg-green-50 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">IN (GRN)</span></td><td class="py-4 font-black text-green-600">+150,000 ml</td><td class="py-4 font-black">100,000 ml</td></tr>
                    </tbody>
                  </table>
                }
                
                <!-- NEW CAPACITY PLANNER CONTENT -->
                @if (subTab() === 'i-calc') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-2">Production Capacity Planner</h3>
                  <p class="text-sm text-gray-500 mb-6">Automatically calculate maximum finished goods yield based on current raw material inventory.</p>
                  
                  <div class="flex flex-col md:flex-row gap-6">
                     <!-- Current Stock Panel -->
                     <div class="flex-1 bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                        <h4 class="font-bold text-gray-700 uppercase tracking-widest text-xs mb-4">Current Warehouse Stock</h4>
                        <ul class="space-y-4">
                          <li class="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
                             <span class="font-bold text-gray-700">Refined Sugar</span>
                             <span class="font-black text-[#598E18] text-lg">{{ sugarStock() | number }} <span class="text-sm font-sans font-bold text-gray-400">kg</span></span>
                          </li>
                          <li class="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
                             <span class="font-bold text-gray-700">Mango Puree</span>
                             <span class="font-black text-[#598E18] text-lg">{{ pureeStock() | number }} <span class="text-sm font-sans font-bold text-gray-400">Liters</span></span>
                          </li>
                          <li class="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
                             <span class="font-bold text-gray-700">Packaging Pouches</span>
                             <span class="font-black text-[#598E18] text-lg">{{ pouchStock() | number }} <span class="text-sm font-sans font-bold text-gray-400">pcs</span></span>
                          </li>
                        </ul>
                        
                        <div class="mt-6 pt-6 border-t border-gray-200">
                          <h4 class="font-bold text-gray-700 uppercase tracking-widest text-xs mb-3">Required BOM (Per 100 Boxes)</h4>
                          <div class="flex gap-4 text-xs font-bold text-gray-500">
                            <span class="bg-white px-3 py-1.5 rounded-lg border border-gray-200">50 kg Sugar</span>
                            <span class="bg-white px-3 py-1.5 rounded-lg border border-gray-200">30 L Puree</span>
                            <span class="bg-white px-3 py-1.5 rounded-lg border border-gray-200">1,000 pcs Pouch</span>
                          </div>
                        </div>
                     </div>

                     <!-- Calculator Panel -->
                     <div class="flex-1 bg-gradient-to-br from-[#f3f6ee] to-white p-8 rounded-3xl border border-[#598E18]/20 flex flex-col justify-center items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
                        
                        <button (click)="calculateCapacity()" class="relative z-10 font-candy bg-[#EAC224] text-[#476021] px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:scale-105 hover:bg-[#fde047] transition-all mb-8 w-full max-w-sm">
                           Run Auto-Calculation
                        </button>
                        
                        @if (calculatedYield() !== null) {
                           <div class="relative z-10 animate-in zoom-in duration-300 w-full">
                              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Maximum Possible Yield</p>
                              <div class="bg-white py-6 rounded-2xl border border-gray-100 shadow-sm mb-4">
                                <p class="font-candy text-6xl text-[#476021] font-black leading-none mb-1">{{ calculatedYield() | number }}</p>
                                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Mango Candy Boxes</p>
                              </div>
                              <p class="text-xs font-bold text-[#B4161B] bg-red-50 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-red-100 shadow-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                Bottleneck Material: {{ limitingFactor() }}
                              </p>
                           </div>
                           
                           <!-- Decorative background circle when calculated -->
                           <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-[#EAC224] opacity-10 rounded-full blur-[40px] pointer-events-none"></div>
                        } @else {
                           <div class="relative z-10 opacity-60 flex flex-col items-center">
                             <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                             <p class="text-sm font-bold text-gray-400 max-w-[200px]">Click the button to calculate yield based on live inventory data.</p>
                           </div>
                        }
                     </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- 3. QA MODULE -->
          @if (activeTab() === 'qa') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('q-inbound')" [class.bg-white]="subTab() === 'q-inbound'" [class.text-[#476021]]="subTab() === 'q-inbound'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Inbound QA</button>
                <button (click)="subTab.set('q-finished')" [class.bg-white]="subTab() === 'q-finished'" [class.text-[#476021]]="subTab() === 'q-finished'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Finished Goods Clearance</button>
                <button (click)="subTab.set('q-defect')" [class.bg-white]="subTab() === 'q-defect'" [class.text-[#476021]]="subTab() === 'q-defect'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Defect Logger</button>
              </div>
              <div class="p-8">
                @if (subTab() === 'q-inbound') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Pending Inbound Materials</h3>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">Batch ID</th><th class="pb-4">Material</th><th class="pb-4">Action</th></tr>
                    </thead>
                    <tbody><tr><td class="py-4 font-black">BCH-2026-01A</td><td class="py-4 font-bold text-gray-600">Refined Sugar (500 kg)</td><td class="py-4"><button class="bg-[#EAC224] text-[#476021] px-4 py-1.5 rounded-lg text-xs font-bold">Log Inspection</button></td></tr></tbody>
                  </table>
                }
                @if (subTab() === 'q-finished') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Finished Goods Awaiting Clearance</h3>
                  <p class="text-sm text-gray-500 font-semibold italic">No production runs currently awaiting QA clearance.</p>
                }
                @if (subTab() === 'q-defect') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-2">Defect / Quarantine Logger</h3>
                  <p class="text-sm text-gray-500 mb-6">Submit qa_inspections tied to a batch_id.</p>
                  <form class="max-w-2xl space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Batch ID</label><input type="text" class="w-full p-3 rounded-xl border border-gray-200" placeholder="e.g. BCH-XXXX"></div>
                    <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Inspection Stage</label><select class="w-full p-3 rounded-xl border border-gray-200"><option>INBOUND_RAW</option><option>FINISHED_GOODS</option></select></div>
                    <div>
                      <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Inspection Result</label>
                      <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-xl"><input type="radio" name="result" value="pass" class="accent-[#598E18]"><span class="font-bold text-[#598E18]">PASS</span></label>
                        <label class="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-xl"><input type="radio" name="result" value="fail" class="accent-[#B4161B]"><span class="font-bold text-[#B4161B]">FAIL (Quarantine)</span></label>
                      </div>
                    </div>
                    <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Defect Reason (If Failed)</label><textarea class="w-full p-3 rounded-xl border border-gray-200 h-24" placeholder="Describe contamination, damage, or metric failure..."></textarea></div>
                    <button type="button" class="mt-4 font-candy bg-[#476021] text-white px-6 py-3 rounded-xl font-bold">Submit QA Log</button>
                  </form>
                }
              </div>
            </div>
          }

          <!-- 4. PRODUCTION & BOM MODULE -->
          @if (activeTab() === 'production') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('prod-run')" [class.bg-white]="subTab() === 'prod-run'" [class.text-[#476021]]="subTab() === 'prod-run'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Run Manager</button>
                <button (click)="subTab.set('prod-bom')" [class.bg-white]="subTab() === 'prod-bom'" [class.text-[#476021]]="subTab() === 'prod-bom'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">BOM Viewer</button>
              </div>
              <div class="p-8">
                @if (subTab() === 'prod-run') {
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="font-candy text-2xl text-[#476021]">Production Run Manager</h3>
                    <button class="bg-[#598E18] text-white px-4 py-2 rounded-xl text-sm font-bold">+ Start New Run</button>
                  </div>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">Run ID</th><th class="pb-4">BOM ID</th><th class="pb-4">Planned Units</th><th class="pb-4">Actual Units</th><th class="pb-4">Started At</th><th class="pb-4">Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-black">PRN-101</td><td class="py-4 font-bold text-gray-800">BOM-MGC (Mango)</td><td class="py-4 font-bold">1,000 packs</td><td class="py-4 font-black text-[#598E18]">1,000 packs</td><td class="py-4 text-xs text-gray-500">08:00 AM</td><td class="py-4"><span class="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">Completed</span></td></tr>
                      <tr><td class="py-4 font-black">PRN-102</td><td class="py-4 font-bold text-gray-800">BOM-MGC (Mango)</td><td class="py-4 font-bold">500 packs</td><td class="py-4 font-black text-gray-400">--</td><td class="py-4 text-xs text-gray-500">Pending</td><td class="py-4"><span class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">Scheduled</span></td></tr>
                    </tbody>
                  </table>
                }
                @if (subTab() === 'prod-bom') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Bill of Materials (BOM)</h3>
                  <div class="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                     <p class="font-bold text-gray-800 text-lg mb-4">BOM-MGC: Mango Candy <span class="text-xs bg-gray-200 px-2 py-1 rounded ml-2 text-gray-600">Active</span></p>
                     <ul class="space-y-3">
                       <li class="flex justify-between border-b border-gray-200 pb-2"><span class="font-bold text-gray-600">Refined Sugar</span><span class="font-black">100g</span></li>
                       <li class="flex justify-between border-b border-gray-200 pb-2"><span class="font-bold text-gray-600">Mango Puree</span><span class="font-black">250ml</span></li>
                       <li class="flex justify-between"><span class="font-bold text-gray-600">Packaging Pouch</span><span class="font-black">1 pc</span></li>
                     </ul>
                  </div>
                }
              </div>
            </div>
          }

          <!-- 5. SALES & POS MODULE -->
          @if (activeTab() === 'sales') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('s-pos')" [class.bg-white]="subTab() === 's-pos'" [class.text-[#476021]]="subTab() === 's-pos'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Order Capture (POS)</button>
                <button (click)="subTab.set('s-inv')" [class.bg-white]="subTab() === 's-inv'" [class.text-[#476021]]="subTab() === 's-inv'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Invoice Generator</button>
              </div>
              <div class="p-8">
                @if (subTab() === 's-pos') {
                  <div class="flex flex-col md:flex-row gap-8">
                    <div class="flex-1">
                      <h3 class="font-candy text-2xl text-[#476021] mb-6">Create Order</h3>
                      <div class="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                        <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Customer / Client</label><input type="text" class="w-full p-3 rounded-xl border border-gray-200" placeholder="e.g. Candy Corner PH"></div>
                        <div><label class="block text-xs font-bold text-gray-700 uppercase mb-1">Sales Channel</label><select class="w-full p-3 rounded-xl border border-gray-200"><option>B2B Direct</option><option>Online Portal</option></select></div>
                      </div>
                    </div>
                    <div class="w-full md:w-96 bg-[#f3f6ee] p-6 rounded-3xl border border-[#598E18]/20 flex flex-col justify-between">
                      <div>
                        <p class="font-bold text-[#476021] uppercase tracking-wider text-xs mb-4">Cart</p>
                        <div class="flex justify-between items-center bg-white p-3 rounded-xl border border-[#598E18]/10">
                          <div><p class="font-bold text-gray-800">Mango Candy Box</p><p class="text-[10px] text-gray-500 font-bold uppercase">Stock: {{ sellableStock() }} avail</p></div>
                          <div class="flex items-center gap-2"><button class="bg-gray-200 w-6 h-6 rounded font-bold">-</button><span class="font-black">10</span><button class="bg-gray-200 w-6 h-6 rounded font-bold">+</button></div>
                        </div>
                        @if(sellableStock() < 10) { <p class="text-xs text-red-500 font-bold mt-2">Insufficient Stock! Requires Production.</p> }
                      </div>
                      <button class="w-full font-candy bg-[#476021] text-white py-4 rounded-xl text-lg mt-6 shadow-md" [disabled]="sellableStock() < 10" [class.opacity-50]="sellableStock() < 10">Confirm Order</button>
                    </div>
                  </div>
                }
                @if (subTab() === 's-inv') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Invoices</h3>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">Inv #</th><th class="pb-4">Client</th><th class="pb-4">Total Amount</th><th class="pb-4">Payment Status</th><th class="pb-4">Action</th></tr>
                    </thead>
                    <tbody><tr><td class="py-4 font-black">INV-0142</td><td class="py-4 font-bold text-gray-600">Candy Corner Ph</td><td class="py-4 font-black">₱ 45,000.00</td><td class="py-4"><span class="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">Paid</span></td><td class="py-4"><button class="text-[#598E18] font-bold text-xs underline">Download PDF</button></td></tr></tbody>
                  </table>
                }
              </div>
            </div>
          }

          <!-- 6. LOGISTICS & FLEET MODULE -->
          @if (activeTab() === 'logistics') {
            <div class="bg-white/90 rounded-[40px] shadow-sm border border-white overflow-hidden">
              <div class="border-b border-gray-100 px-8 pt-6 pb-2 flex space-x-2 bg-gradient-to-b from-[#fbfdf9] to-transparent">
                <button (click)="subTab.set('l-routes')" [class.bg-white]="subTab() === 'l-routes'" [class.text-[#476021]]="subTab() === 'l-routes'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Dispatch Dashboard</button>
                <button (click)="subTab.set('l-epod')" [class.bg-white]="subTab() === 'l-epod'" [class.text-[#476021]]="subTab() === 'l-epod'" class="px-5 py-2 rounded-full text-sm font-bold font-candy transition-all">Driver e-POD (Mobile)</button>
              </div>
              
              <div class="p-8">
                @if (subTab() === 'l-routes') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-6">Fleet Dispatch & Live Tracker</h3>
                  <div class="mb-10 w-full bg-[#f3f6ee] rounded-[32px] p-2 border border-[#598E18]/20 shadow-inner">
                    <div class="w-full h-[350px] bg-white rounded-[24px] relative overflow-hidden shadow-sm flex items-center justify-center">
                      <div class="absolute inset-0 bg-[#eef2e6] opacity-50" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></div>
                      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 350" preserveAspectRatio="xMidYMid slice">
                        <path d="M 200 80 Q 400 80, 500 150 T 800 250" fill="none" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
                        <path d="M 350 300 Q 450 200, 500 150" fill="none" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
                        <path d="M 200 80 Q 400 80, 500 150 T 800 250" fill="none" stroke="#598E18" stroke-width="4" class="dash-anim" stroke-linecap="round"/>
                        <g transform="translate(200, 80)"><circle cx="0" cy="0" r="25" fill="#EAC224" opacity="0.2" class="animate-pulse" /><circle cx="0" cy="0" r="12" fill="white" stroke="#598E18" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#598E18"/><text x="0" y="-20" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#476021">Bocaue HQ</text></g>
                        <g transform="translate(800, 250)"><circle cx="0" cy="0" r="12" fill="white" stroke="#B4161B" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#B4161B"/><text x="0" y="25" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#B4161B">Quezon City</text></g>
                        <g transform="translate(560, 175) rotate(15)">
                          <circle cx="0" cy="0" r="16" fill="white" stroke="#598E18" stroke-width="2" class="shadow-lg" />
                          <svg x="-8" y="-8" width="16" height="16" fill="none" stroke="#476021" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path><circle cx="7.5" cy="17.5" r="1.5" fill="#476021" /><circle cx="16.5" cy="17.5" r="1.5" fill="#476021" /></svg>
                          <rect x="-30" y="-35" width="60" height="20" rx="6" fill="#476021" />
                          <text x="0" y="-22" text-anchor="middle" font-family="Nunito" font-weight="bold" font-size="9" fill="white">DSP-402</text>
                        </g>
                      </svg>
                      <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                         <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Fleet Status</p>
                         <p class="text-sm font-bold text-[#598E18] flex items-center"><span class="w-2 h-2 rounded-full bg-[#598E18] mr-2 animate-pulse"></span> 1 Active Route</p>
                      </div>
                    </div>
                  </div>
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-gray-400 text-xs font-bold font-candy uppercase border-b-2 border-gray-100">
                      <tr><th class="pb-4">Order ID</th><th class="pb-4">Vehicle ID</th><th class="pb-4">Driver ID</th><th class="pb-4">Destination</th><th class="pb-4">Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr><td class="py-4 font-black">SO-1042</td><td class="py-4 font-bold text-gray-600">ABC-123 (Truck A)</td><td class="py-4 text-gray-600">DRV-05 (J. Dela Cruz)</td><td class="py-4 font-black">Quezon City</td><td class="py-4"><span class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">In Transit</span></td></tr>
                    </tbody>
                  </table>
                }
                
                @if (subTab() === 'l-epod') {
                  <h3 class="font-candy text-2xl text-[#476021] mb-2 text-center">Driver Mobile App (e-POD)</h3>
                  <p class="text-sm text-gray-500 mb-8 text-center">Simulated Mobile View for Electronic Proof of Delivery.</p>
                  
                  <div class="w-[340px] h-[650px] bg-[#fbfdf9] border-[14px] border-gray-900 rounded-[3rem] mx-auto shadow-2xl relative overflow-hidden flex flex-col font-erp">
                     <div class="w-32 h-6 bg-gray-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50"></div>
                     <div class="bg-[#EAC224] p-6 pt-10 pb-4 shadow-md">
                       <p class="text-xs font-bold text-[#476021] uppercase">Delivery Order</p>
                       <p class="text-xl font-black text-gray-900">SO-1042</p>
                       <p class="text-sm text-gray-800 font-semibold mt-1">Candy Corner PH - Quezon City</p>
                     </div>
                     <div class="flex-1 p-5 overflow-y-auto space-y-5">
                        <div>
                          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Recipient Photo (recipient_photo_url)</label>
                          <div class="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition">
                            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span class="text-xs font-bold">Tap to Open Camera</span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Recipient Signature (signature_url)</label>
                          <div class="w-full h-32 bg-white border border-gray-200 rounded-2xl shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                             <span class="text-gray-200 font-bold text-xl select-none absolute">SIGN HERE</span>
                             <div class="w-full border-b-2 border-gray-100 absolute bottom-6"></div>
                          </div>
                        </div>
                     </div>
                     <div class="p-5 bg-white border-t border-gray-100">
                       <button class="w-full bg-[#598E18] text-white py-4 rounded-xl font-bold font-candy tracking-wide shadow-lg text-lg">Submit e-POD</button>
                     </div>
                  </div>
                }
              </div>
            </div>
          }
        </main>
      </div>
    }
  `
})
export class AppComponent {
  isAuthenticated = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  
  // Controls the settings dropdown visibility
  showSettingsMenu = signal<boolean>(false);
  
  activeTab = signal<'dashboard' | 'procurement' | 'qa' | 'inventory' | 'production' | 'sales' | 'logistics'>('dashboard');
  subTab = signal<string>('p-dash');

  sellableStock = signal<number>(0);
  currentYield = signal<number>(150);

  // Auto-Calculator State
  sugarStock = signal<number>(1850); // kg
  pureeStock = signal<number>(560); // Liters
  pouchStock = signal<number>(8500); // pcs
  
  calculatedYield = signal<number | null>(null);
  limitingFactor = signal<string | null>(null);

  togglePassword() { this.showPassword.update(v => !v); }
  
  // Toggles the settings menu visibility
  toggleSettings() { this.showSettingsMenu.update(v => !v); }
  
  authenticate(event: Event) { event.preventDefault(); this.isAuthenticated.set(true); }
  logout() { 
    this.isAuthenticated.set(false); 
    this.switchTab('dashboard'); 
    this.showSettingsMenu.set(false);
  }

  // Capacity Calculator Logic based on BOM (per 100 boxes: 50kg sugar, 30L puree, 1000 pouches)
  calculateCapacity() {
    const maxBatchesBySugar = Math.floor(this.sugarStock() / 50);
    const maxBatchesByPuree = Math.floor(this.pureeStock() / 30);
    const maxBatchesByPouch = Math.floor(this.pouchStock() / 1000);

    const maxBatches = Math.min(maxBatchesBySugar, maxBatchesByPuree, maxBatchesByPouch);
    
    this.calculatedYield.set(maxBatches * 100);

    // Identify Bottleneck
    if (maxBatches === maxBatchesByPouch) this.limitingFactor.set('Packaging Pouches');
    else if (maxBatches === maxBatchesByPuree) this.limitingFactor.set('Mango Puree');
    else this.limitingFactor.set('Refined Sugar');
  }

  switchTab(tab: 'dashboard' | 'procurement' | 'qa' | 'inventory' | 'production' | 'sales' | 'logistics') {
    this.activeTab.set(tab);
    switch (tab) {
      case 'procurement': this.subTab.set('p-dash'); break;
      case 'qa': this.subTab.set('q-inbound'); break;
      case 'inventory': this.subTab.set('i-calc'); break; // Automatically show the new Capacity Planner when navigating to Inventory
      case 'production': this.subTab.set('prod-run'); break;
      case 'sales': this.subTab.set('s-pos'); break;
      case 'logistics': this.subTab.set('l-routes'); break;
      default: this.subTab.set('none'); break;
    }
  }
}