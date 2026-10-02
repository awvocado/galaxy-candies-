import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
      .font-candy { font-family: 'Fredoka', sans-serif; }

      @keyframes bob-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
      @keyframes bob-b { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-16px) rotate(-4deg); } }
      @keyframes bob-c { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-24px) rotate(-6deg); } }
      @keyframes rocket-fly { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(12px,-28px) rotate(2deg); } }
      @keyframes flame { from { transform: scale(1,1); } to { transform: scale(.88,1.28); } }
      @keyframes spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0); opacity: 0; } }
      @keyframes spin-slow { to { transform: rotate(360deg); } }
      @keyframes spin-rev { to { transform: rotate(-360deg); } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes crumb { 0% { transform: translate(0,0) rotate(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-30px,70px) rotate(200deg); opacity: 0; } }
      @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
      @keyframes squish { 0%,100% { transform: scale(1,1); } 50% { transform: scale(1.04,.96); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-bob-c { animation: bob-c 6s ease-in-out infinite .8s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-spin { animation: spin-slow 16s linear infinite; }
      .a-spin-rev { animation: spin-rev 40s linear infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-crumb { animation: crumb 3s ease-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .a-squish { animation: squish 2.4s ease-in-out infinite; transform-origin: 50% 100%; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; } .d3 { animation-delay: 2.1s; }
      .candy-shadow { filter: drop-shadow(0 22px 20px rgba(0,0,0,.42)); }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <div class="min-h-screen w-full bg-[#dfe9c6] flex items-center justify-center px-4 py-10 md:px-10 lg:px-14 lg:py-20 font-candy">

      <!-- BIG PANEL (no overflow clipping so candies can spill out) -->
      <div class="relative w-full max-w-[1700px] min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-10rem)] rounded-[36px] text-white flex flex-col shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]"
           style="background: radial-gradient(circle at 78% 50%, #35521a 0%, #1d2f0d 50%, #101a07 100%);">

        <span class="a-twinkle absolute top-[14%] left-[42%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[72%] left-[48%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d3 absolute bottom-[14%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <!-- NAV -->
        <nav class="relative z-40 flex items-center justify-between px-8 md:px-16 pt-10">
          <div class="flex items-center gap-8 text-[15px]">
            <img src="logo.png" alt="Galaxy Candies Logo" class="w-11 h-11 rounded-xl object-contain">
            <a href="#" class="font-semibold text-white">Home</a>
            <a href="#" class="text-white/60 hover:text-[#EAC224] transition-colors">IT Support</a>
          </div>
        </nav>

        <!-- CONTENT -->
        <div class="relative z-30 flex-1 flex items-center px-8 md:px-16 py-12">
          <div class="max-w-[500px] w-full">
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-semibold leading-[1.04] tracking-wide mb-5">
              Sweet work<br>starts here.
            </h1>
            <p class="text-base text-white/60 mb-10 max-w-[400px] leading-relaxed">
              Sign in to manage orders, stock and deliveries. Manager access only.
            </p>

            <form class="space-y-5" (submit)="authenticate($event)">
              <input type="email" placeholder="Email address" aria-label="Email address"
                class="w-full px-6 py-4 rounded-full bg-white/10 border border-white/15 text-base text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">

              <div class="relative">
                <input [type]="showPassword() ? 'text' : 'password'" placeholder="Password" aria-label="Password"
                  class="w-full px-6 py-4 pr-14 rounded-full bg-white/10 border border-white/15 text-base text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
                <button type="button" (click)="togglePassword()" aria-label="Show or hide password"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#EAC224]">
                  @if (showPassword()) { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"></path></svg> }
                  @else { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> }
                </button>
              </div>

              <div class="flex items-center justify-between text-sm text-white/60 px-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="accent-[#EAC224] w-4 h-4"> Remember my device
                </label>
                <a href="#" class="hover:text-[#EAC224] transition-colors">Forgot password?</a>
              </div>

              <div class="flex flex-wrap items-center gap-5 pt-3">
                <button type="submit"
                  class="px-12 py-4 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] font-semibold text-lg tracking-wide shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors">
                  Sign in
                </button>
                <button type="button" class="flex items-center gap-3 text-[15px] text-white/80 hover:text-[#EAC224] transition-colors">
                  <span class="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>
                  </span>
                  Use Corporate ID
                </button>
              </div>
            </form>

            <div class="mt-12 flex items-center gap-2 text-sm text-white/50">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
              </span>
              All services online &nbsp;|&nbsp; Sta. Maria, Central Luzon
            </div>
          </div>
        </div>

        <span class="relative z-30 px-8 md:px-16 pb-8 text-xs text-white/40">&copy; 2026 TipTop Foods OPC</span>

        <!-- CANDY + ROCKET CLUSTER (spills past top, right and bottom edges) -->
        <div class="relative lg:absolute z-20 mx-auto w-full max-w-[640px] h-[620px] mb-6 lg:mb-0 lg:max-w-none lg:w-[52%] xl:w-[54%] lg:h-[calc(100%+120px)] lg:top-[-50px] lg:right-[-60px] pointer-events-none select-none">

          <!-- soft glow + orbit rings around the rocket -->
          <div class="absolute left-[8%] top-[26%] w-[78%] aspect-square rounded-full" style="background: radial-gradient(circle, rgba(234,194,36,.18) 0%, transparent 65%);"></div>
          <div class="a-spin absolute left-[10%] top-[28%] w-[74%] aspect-square rounded-full border-2 border-dashed border-white/15"></div>
          <div class="a-spin-rev absolute left-[22%] top-[38%] w-[50%] aspect-square rounded-full border border-white/10"></div>

          <!-- Cake slice with cherry attached on top -->
          <div class="a-bob-b absolute top-[3%] left-[16%] w-[40%] candy-shadow">
            <svg viewBox="0 0 210 190" fill="none">
              <defs>
                <linearGradient id="gCk1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6d6"/><stop offset="1" stop-color="#f2dd9c"/></linearGradient>
                <linearGradient id="gCk2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c98a1a"/><stop offset="1" stop-color="#f0ac3a"/></linearGradient>
                <linearGradient id="gCk3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2a08"/><stop offset="1" stop-color="#7a4514"/></linearGradient>
                <radialGradient id="gCh" cx=".35" cy=".3"><stop offset="0" stop-color="#ff5d63"/><stop offset=".6" stop-color="#c81a22"/><stop offset="1" stop-color="#7d0a10"/></radialGradient>
              </defs>
              <g transform="translate(0,45)">
                <path d="M20 58 L70 92 L70 112 L20 78 Z" fill="#a86a12"/><path d="M70 92 L190 62 L190 84 L70 112 Z" fill="url(#gCk2)"/>
                <path d="M20 78 L70 112 L70 134 L20 100 Z" fill="#3c2106"/><path d="M70 112 L190 84 L190 108 L70 134 Z" fill="url(#gCk3)"/>
                <path d="M70 92 L190 62 L190 68 L70 98 Z" fill="#B4161B"/>
                <path d="M20 40 L70 74 L70 92 L20 58 Z" fill="#e8d29a"/><path d="M70 74 L190 44 L190 62 L70 92 Z" fill="url(#gCk1)"/>
                <path d="M20 40 L140 14 L190 44 L70 74 Z" fill="#fffbe9"/>
                <path d="M20 40 L70 74 L190 44 L190 52 C178 66 170 56 160 66 C150 76 140 58 128 68 C118 78 104 64 92 74 C84 82 78 78 70 86 C58 76 40 66 20 50 Z" fill="#B4161B"/>
                <path d="M38 40 L128 21" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/>
              </g>
              <ellipse cx="108" cy="90" rx="26" ry="7" fill="#7d0a10" opacity=".35"/>
              <path d="M108 52 Q112 22 146 14" stroke="#8fd14f" stroke-width="6" stroke-linecap="round"/>
              <circle cx="108" cy="66" r="27" fill="url(#gCh)"/>
              <ellipse cx="97" cy="54" rx="8" ry="5" fill="white" opacity=".6" transform="rotate(-30 97 54)"/>
            </svg>
          </div>

          <!-- Lime-glazed donut (bleeds off the right edge) -->
          <div class="a-bob-c absolute top-[17%] right-[0%] w-[46%] candy-shadow">
            <svg viewBox="0 0 220 190" fill="none">
              <defs>
                <linearGradient id="gGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
                <mask id="mDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
              </defs>
              <g mask="url(#mDonut)">
                <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
                <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
                <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#gGlz)"/>
                <ellipse cx="110" cy="86" rx="42" ry="30" fill="#e8a33d"/>
              </g>
              <path d="M38 78 C52 46 88 32 122 32" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".55"/>
              <g>
                <rect x="44" y="84" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(30 52 87)"/>
                <rect x="66" y="52" width="16" height="6" rx="3" fill="#EAC224" transform="rotate(-40 74 55)"/>
                <rect x="112" y="40" width="16" height="6" rx="3" fill="white" transform="rotate(15 120 43)"/>
                <rect x="150" y="50" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(50 158 53)"/>
                <rect x="172" y="84" width="16" height="6" rx="3" fill="#22b8e0" transform="rotate(-20 180 87)"/>
                <rect x="154" y="114" width="16" height="6" rx="3" fill="#EAC224" transform="rotate(35 162 117)"/>
                <rect x="112" y="128" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(-25 120 131)"/>
                <rect x="68" y="118" width="16" height="6" rx="3" fill="white" transform="rotate(40 76 121)"/>
                <rect x="48" y="108" width="16" height="6" rx="3" fill="#22b8e0" transform="rotate(-30 56 111)"/>
              </g>
            </svg>
          </div>

          <!-- ROCKET (hero of the cluster) -->
          <div class="a-rocket absolute top-[34%] left-[26%] w-[24%] drop-shadow-[0_25px_30px_rgba(0,0,0,0.45)]">
            <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
              <defs>
                <linearGradient id="rBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient>
                <clipPath id="rWin"><circle cx="60" cy="104" r="16"/></clipPath>
              </defs>
              <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
              <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
              <circle class="a-spark d2" cx="60" cy="190" r="2.5" fill="#fef08a"/>
              <g class="a-flame">
                <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
                <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
              </g>
              <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
              <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
              <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#rBody)" stroke="#94a3b8" stroke-width="2"/>
              <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
              <path d="M30 68 Q60 78 90 68" stroke="#7d0a10" stroke-width="3"/>
              <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
              <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
              <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
              <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
              <circle cx="46" cy="74" r="1.6" fill="#7d0a10"/><circle cx="60" cy="77" r="1.6" fill="#7d0a10"/><circle cx="74" cy="74" r="1.6" fill="#7d0a10"/>
            </svg>
          </div>

          <!-- Star gummy -->
          <div class="a-bob-a absolute top-[19%] left-[0%] w-[15%] candy-shadow">
            <svg viewBox="0 0 120 120" fill="none">
              <defs><linearGradient id="gStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
              <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#gStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
              <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
            </svg>
          </div>

          <!-- Swirl lollipop -->
          <div class="absolute top-[47%] left-[0%] w-[17%] candy-shadow">
            <svg class="a-wiggle" viewBox="0 0 90 150" fill="none">
              <rect x="41" y="62" width="8" height="86" rx="4" fill="#f4fbe4"/>
              <circle cx="45" cy="42" r="38" fill="#EAC224"/>
              <path d="M45 42 m0 -30 a30 30 0 1 1 -30 30 M45 42 m0 -16 a16 16 0 1 1 -16 16" stroke="#B4161B" stroke-width="8" stroke-linecap="round"/>
              <path d="M20 22 Q26 12 36 9" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/>
            </svg>
          </div>

          <!-- Pudding cup (bleeds off the bottom) -->
          <div class="a-squish absolute bottom-[2%] left-[36%] w-[36%] candy-shadow">
            <svg viewBox="0 0 200 180" fill="none">
              <defs>
                <linearGradient id="gPud" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eadfb6"/><stop offset=".4" stop-color="#fffdf3"/><stop offset="1" stop-color="#efe3bb"/></linearGradient>
                <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2323a"/><stop offset="1" stop-color="#8f0f14"/></linearGradient>
              </defs>
              <path d="M32 62 L168 62 L150 158 Q100 176 50 158 Z" fill="url(#gPud)"/>
              <path d="M32 62 C32 84 42 92 48 74 C54 104 70 106 74 72 C80 98 92 98 96 72 C102 108 120 108 124 72 C130 94 142 92 146 72 C150 88 162 84 168 62 Z" fill="url(#gRed)"/>
              <ellipse cx="100" cy="62" rx="68" ry="20" fill="url(#gRed)"/>
              <ellipse cx="80" cy="56" rx="26" ry="5" fill="white" opacity=".5"/>
              <path d="M150 116 C152 130 148 142 142 150" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".55"/>
            </svg>
          </div>

          <!-- Orange gummy wedge -->
          <div class="a-bob-b d1 absolute top-[51%] left-[58%] w-[12%] candy-shadow">
            <svg viewBox="0 0 60 40" fill="none">
              <path d="M2 4 C10 40 50 40 58 4 Z" fill="#ff9d1c"/><path d="M8 6 C14 30 46 30 52 6 Z" fill="#ffd166"/>
              <path d="M30 6 V26 M18 8 L26 24 M42 8 L34 24" stroke="#ff9d1c" stroke-width="2"/>
            </svg>
          </div>

          <!-- Cyan jelly cube -->
          <div class="a-bob-c d3 absolute top-[60%] right-[14%] w-[13%] candy-shadow">
            <svg viewBox="0 0 110 110" fill="none">
              <path d="M15 35 L55 10 L100 30 L60 58 Z" fill="#8ce8ff"/><path d="M15 35 L60 58 L60 105 L15 82 Z" fill="#22b8e0"/>
              <path d="M60 58 L100 30 L100 78 L60 105 Z" fill="#0d8db3"/>
              <path d="M28 40 L48 28" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
            </svg>
          </div>

          <!-- Wrapped candy -->
          <div class="absolute bottom-[9%] right-[0%] w-[21%] candy-shadow">
            <svg class="a-wiggle" viewBox="0 0 100 60" fill="none">
              <path d="M22 30 L0 8 L8 30 L0 52 Z" fill="#fff" opacity=".9"/><path d="M78 30 L100 8 L92 30 L100 52 Z" fill="#fff" opacity=".9"/>
              <rect x="20" y="8" width="60" height="44" rx="22" fill="#8fd14f"/>
              <path d="M30 20 Q50 12 70 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".7"/>
            </svg>
          </div>

          <!-- Mint swirl -->
          <div class="absolute top-[3%] right-[10%] w-[9%] candy-shadow">
            <svg class="a-spin" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="#f4fbe4"/>
              <path d="M30 30 m0 -22 a22 22 0 1 1 -22 22 M30 30 m0 -12 a12 12 0 1 1 -12 12" stroke="#598E18" stroke-width="5" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- crumbs & sparkles -->
          <svg class="a-crumb absolute top-[30%] right-[1%] w-5" viewBox="0 0 20 20"><path d="M2 4 L16 2 L12 16 Z" fill="#f6c454"/></svg>
          <svg class="a-crumb d1 absolute top-[46%] right-[30%] w-4" viewBox="0 0 20 20"><path d="M2 4 L16 2 L12 16 Z" fill="#fff3c4"/></svg>
          <svg class="a-twinkle absolute top-[10%] left-[6%] w-6" viewBox="0 0 24 24" fill="#EAC224"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
          <svg class="a-twinkle d2 absolute top-[70%] left-[22%] w-5" viewBox="0 0 24 24" fill="white"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
          <svg class="a-twinkle d1 absolute top-[40%] right-[3%] w-5" viewBox="0 0 24 24" fill="#9be15d"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  showPassword = signal<boolean>(false);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  authenticate(event: Event) {
    event.preventDefault();
    this.loginSuccess.emit();
    this.router.navigate(['/dashboard']);
  }
}