import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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

      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 10px; }

      @keyframes bob-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
      @keyframes bob-b { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
      @keyframes rocket-fly { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(8px,-16px) rotate(2deg); } }
      @keyframes flame { from { transform: scale(1,1); } to { transform: scale(.88,1.28); } }
      @keyframes spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0); opacity: 0; } }
      @keyframes spin-slow { to { transform: rotate(360deg); } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-spin { animation: spin-slow 16s linear infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <!-- BIG DARK PANEL (same look as the login screen) -->
    <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

      <span class="a-twinkle absolute top-[6%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
      <span class="a-twinkle d1 absolute top-[48%] right-[4%] w-1.5 h-1.5 rounded-full bg-white"></span>
      <span class="a-twinkle d2 absolute bottom-[8%] left-[38%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

      <!-- Welcome header -->
      <div class="relative z-10 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🍬</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy Operations Command</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide flex items-center gap-3">
            Welcome back, Lorenz.
            <span class="inline-block text-3xl">🍭</span>
          </h2>
        </div>

        <div class="glass-panel px-5 py-3 rounded-full flex items-center gap-3 self-start sm:self-auto">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
          </span>
          <span class="font-candy text-sm text-white/70">Production line: <span class="text-[#9be15d] font-semibold">Active (Mango Batch)</span></span>
        </div>
      </div>

      <!-- Metrics -->
      <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div class="glass-panel rounded-[28px] p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border-b-4 border-b-[#9be15d] relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#9be15d]/10 rounded-full"></div>
          <div class="flex justify-between items-start relative">
            <div>
              <p class="text-xs font-semibold text-white/50 mb-2 font-candy tracking-wide">Yield capacity</p>
              <div class="flex items-baseline gap-2">
                <p class="text-5xl font-candy font-semibold">{{ currentYield() }}</p>
                <span class="text-sm text-white/50">packs</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-[#9be15d]/20 flex items-center justify-center text-2xl">🍬</div>
          </div>
        </div>

        <div class="glass-panel rounded-[28px] p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border-b-4 border-b-[#22d3ee] relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#22d3ee]/10 rounded-full"></div>
          <div class="flex justify-between items-start relative">
            <div>
              <p class="text-xs font-semibold text-white/50 mb-2 font-candy tracking-wide">Pending QA</p>
              <div class="flex items-baseline gap-2">
                <p class="text-5xl font-candy font-semibold">1</p>
                <span class="text-sm text-white/50">batches</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-[#22d3ee]/20 flex items-center justify-center text-2xl">🔬</div>
          </div>
        </div>

        <div class="glass-panel rounded-[28px] p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border-b-4 border-b-[#EAC224] relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#EAC224]/10 rounded-full"></div>
          <div class="flex justify-between items-start relative">
            <div>
              <p class="text-xs font-semibold text-white/50 mb-2 font-candy tracking-wide">Sellable stock</p>
              <div class="flex items-baseline gap-2">
                <p class="text-5xl font-candy font-semibold">{{ sellableStock() }}</p>
                <span class="text-sm text-white/50">units</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-2xl">⭐</div>
          </div>
        </div>

        <div class="glass-panel rounded-[28px] p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border-b-4 border-b-[#ff9d1c] relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#ff9d1c]/10 rounded-full"></div>
          <div class="flex justify-between items-start relative">
            <div>
              <p class="text-xs font-semibold text-white/50 mb-2 font-candy tracking-wide">Active deliveries</p>
              <div class="flex items-baseline gap-2">
                <p class="text-5xl font-candy font-semibold">1</p>
                <span class="text-sm text-white/50">routes</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-[#ff9d1c]/20 flex items-center justify-center text-2xl">🚚</div>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex flex-col xl:flex-row gap-6">

        <!-- Calculation engine -->
        <div class="xl:w-[65%] glass-panel rounded-[32px] p-8 flex flex-col">

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 class="font-candy text-2xl md:text-3xl font-semibold mb-2">Raw material to product calculation</h3>
              <p class="text-sm text-white/55 flex items-center gap-2">
                Bill of materials (BOM)
                <span class="text-[#EAC224] font-bold bg-[#EAC224]/15 px-3 py-1 rounded-full border border-[#EAC224]/35 inline-flex items-center gap-1.5">🥭 Mango Candy</span>
              </p>
            </div>
            <span class="bg-[#9be15d]/15 text-[#b7f27c] px-4 py-2 rounded-full text-xs font-bold border border-[#9be15d]/30 flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
              </span>
              Auto-calculating
            </span>
          </div>

          <div class="overflow-x-auto mb-6 bg-black/20 rounded-2xl border border-white/10 p-2">
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
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3 font-bold">
                      <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">🧊</span> Sugar
                    </div>
                  </td>
                  <td class="py-4 px-4 text-white/70">100g</td>
                  <td class="py-4 px-4 font-extrabold text-base">40,000g</td>
                  <td class="py-4 px-4 font-bold text-[#9be15d]">400 packs</td>
                  <td class="py-4 px-4 text-center">
                    <span class="bg-[#9be15d]/15 text-[#b7f27c] px-3 py-1.5 rounded-full text-xs font-bold border border-[#9be15d]/30">Adequate</span>
                  </td>
                </tr>
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3 font-bold">
                      <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">🧃</span> Mango Puree
                    </div>
                  </td>
                  <td class="py-4 px-4 text-white/70">250ml</td>
                  <td class="py-4 px-4 font-extrabold text-base">90,000ml</td>
                  <td class="py-4 px-4 font-bold text-[#9be15d]">360 packs</td>
                  <td class="py-4 px-4 text-center">
                    <span class="bg-[#9be15d]/15 text-[#b7f27c] px-3 py-1.5 rounded-full text-xs font-bold border border-[#9be15d]/30">Adequate</span>
                  </td>
                </tr>
                <tr class="bg-[#B4161B]/20 hover:bg-[#B4161B]/25 transition-colors">
                  <td class="py-4 px-4 shadow-[inset_4px_0_0_#ef4444]">
                    <div class="flex items-center gap-3 font-bold text-[#ffb4b7]">
                      <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">🛍️</span> Packaging Pouch
                    </div>
                  </td>
                  <td class="py-4 px-4 font-bold text-[#ffb4b7]">1 pc</td>
                  <td class="py-4 px-4 font-extrabold text-base text-[#ffb4b7]">150 pcs</td>
                  <td class="py-4 px-4 font-extrabold text-[#ffb4b7]">150 packs</td>
                  <td class="py-4 px-4 text-center">
                    <span class="bg-[#B4161B] text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">Bottleneck</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-auto bg-[#EAC224]/10 border border-[#EAC224]/35 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-xl shrink-0">💡</div>
              <div>
                <h4 class="font-candy font-semibold text-lg mb-1 tracking-wide">System recommendation</h4>
                <p class="text-sm text-white/70 leading-relaxed">
                  Generate requisition for
                  <span class="bg-[#B4161B]/30 text-[#ffb4b7] px-2 py-0.5 rounded-md font-extrabold border border-[#B4161B]/50">210 packaging pouches</span>
                  to match puree limits (360 packs).
                </p>
              </div>
            </div>
            <button class="font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-8 py-3 rounded-full font-semibold text-base shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors whitespace-nowrap cursor-pointer">
              Create PO
            </button>
          </div>
        </div>

        <!-- Recent events -->
        <div class="xl:w-[35%] glass-panel rounded-[32px] p-8 flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-candy text-2xl font-semibold flex items-center gap-2">Recent events <span class="text-sm">⚡</span></h3>
            <button aria-label="Refresh events" class="text-white/50 hover:text-[#EAC224] transition-colors p-1 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 relative custom-scrollbar">
            <div class="absolute left-[11px] top-3 bottom-4 w-[2px] bg-gradient-to-b from-white/25 via-white/15 to-transparent"></div>

            <div class="space-y-6 relative z-10 pl-8">
              <div class="relative">
                <div class="absolute -left-[32px] top-1 w-6 h-6 rounded-full bg-[#EAC224] border-[3px] border-[#1d2f0d] flex items-center justify-center"></div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p class="text-xs text-[#EAC224] font-semibold mb-1 font-candy">Just now &nbsp;|&nbsp; Trigger 4 (Sales)</p>
                  <p class="text-base font-bold mb-1.5">Order allocation &amp; invoice gen.</p>
                  <p class="text-xs text-white/55 leading-relaxed">Status flipped to <span class="text-[#9be15d] font-bold">ALLOCATED</span>. Delivery request ticket generated for Route A.</p>
                </div>
              </div>

              <div class="relative">
                <div class="absolute -left-[32px] top-1 w-6 h-6 rounded-full bg-[#9be15d] border-[3px] border-[#1d2f0d] flex items-center justify-center"></div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p class="text-xs text-[#9be15d] font-semibold mb-1 font-candy">15 mins ago &nbsp;|&nbsp; Trigger 3 (Production)</p>
                  <p class="text-base font-bold mb-1.5">Production run completed</p>
                  <p class="text-xs text-white/55 leading-relaxed">Raw stock deducted from WIP. Outbound clearance task sent to Module 3.2.</p>
                </div>
              </div>

              <div class="relative">
                <div class="absolute -left-[32px] top-1 w-6 h-6 rounded-full bg-[#9be15d] border-[3px] border-[#1d2f0d] flex items-center justify-center"></div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p class="text-xs text-[#9be15d] font-semibold mb-1 font-candy">1 hour ago &nbsp;|&nbsp; Trigger 2 (QA)</p>
                  <p class="text-base font-bold mb-1.5">Inbound QA check: passed</p>
                  <p class="text-xs text-white/55 leading-relaxed">Packaging pouch stock changed to <span class="text-[#9be15d] font-bold">AVAILABLE_RAW</span>. Yield recalculated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CANDIES & ROCKET SPILLING OVER THE PANEL EDGES ========== -->

      <!-- Rocket: flies over the top edge, top-right -->
      <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[24%] w-24 pointer-events-none candy-shadow">
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
export class DashboardComponent {
  currentYield = signal<number>(150);
  sellableStock = signal<number>(0);
}