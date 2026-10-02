import { Component, ChangeDetectionStrategy, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&family=Nunito:wght@400;600;700;800&display=swap');

      app-production { display: block; }
      .prod-page { font-family: 'Nunito', sans-serif; }
      .font-candy { font-family: 'Fredoka', sans-serif !important; }

      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }

      @keyframes bob-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
      @keyframes bob-b { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
      @keyframes rocket-fly { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(8px,-16px) rotate(2deg); } }
      @keyframes flame { from { transform: scale(1,1); } to { transform: scale(.88,1.28); } }
      @keyframes spark { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0); opacity: 0; } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <div class="prod-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🍭</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy candy kitchen</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Production management</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + search -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-candy">
            <div class="flex flex-wrap gap-2">
              <button (click)="activeTab.set('runs')" [ngClass]="activeTab() === 'runs' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Run Manager</button>
              <button (click)="activeTab.set('bom')" [ngClass]="activeTab() === 'bom' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">BOM Viewer</button>
            </div>

            <div class="relative w-full md:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search runs, BOMs..." aria-label="Search runs or BOMs"
                class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
            </div>
          </div>

          <div class="p-8">

            <!-- 1. RUN MANAGER -->
            @if (activeTab() === 'runs') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 class="text-2xl font-semibold">Production run manager</h2>
                  <button class="font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-semibold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    Start new run
                  </button>
                </div>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Run ID</th>
                        <th class="py-4 px-6 font-medium">BOM ID</th>
                        <th class="py-4 px-6 font-medium">Planned units</th>
                        <th class="py-4 px-6 font-medium">Actual units</th>
                        <th class="py-4 px-6 font-medium">Started at</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (r of runs; track r.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ r.id }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">{{ r.bom }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/65">{{ r.planned }}</td>
                          <td [class]="'py-4 px-6 text-xs font-extrabold ' + (r.actual === '--' ? 'text-white/35' : 'text-[#9be15d]')">{{ r.actual }}</td>
                          <td class="py-4 px-6 text-xs text-white/55">{{ r.started }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border ' + r.chip">{{ r.status }}</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. BOM VIEWER -->
            @if (activeTab() === 'bom') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <h2 class="text-2xl font-semibold">Bill of materials (BOM)</h2>

                <div class="bg-black/20 rounded-3xl p-6 border border-white/10 max-w-4xl">
                  <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div class="bg-white/10 px-6 py-4 flex justify-between items-center border-b border-white/10">
                      <span class="font-semibold text-lg">BOM-MGC: Mango Candy</span>
                      <span class="px-3 py-1 bg-[#9be15d]/15 text-[#b7f27c] border border-[#9be15d]/30 rounded-full text-xs font-bold">Active</span>
                    </div>
                    <div class="divide-y divide-white/10 font-sans">
                      @for (b of bom; track b.name) {
                        <div class="px-6 py-4 flex justify-between items-center text-sm font-medium hover:bg-white/5 transition-colors">
                          <span class="font-bold text-white/85">{{ b.name }}</span>
                          <span class="font-extrabold text-[#EAC224]">{{ b.qty }}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>

        <!-- ========== ROCKET & CANDIES SPILLING OVER THE PANEL EDGES ========== -->

        <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[12%] w-24 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
            <defs><linearGradient id="prRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#prRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="prStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#prStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="prGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="prDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#prDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#prGlz)"/>
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

        <div class="hidden md:block absolute z-20 -bottom-14 -left-6 w-[70px] pointer-events-none candy-shadow">
          <svg class="a-wiggle" viewBox="0 0 90 150" fill="none">
            <rect x="41" y="62" width="8" height="86" rx="4" fill="#f4fbe4"/>
            <circle cx="45" cy="42" r="38" fill="#EAC224"/>
            <path d="M45 42 m0 -30 a30 30 0 1 1 -30 30 M45 42 m0 -16 a16 16 0 1 1 -16 16" stroke="#B4161B" stroke-width="8" stroke-linecap="round"/>
            <path d="M20 22 Q26 12 36 9" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/>
          </svg>
        </div>

        <div class="hidden md:block absolute z-20 -bottom-8 left-[14%] w-20 pointer-events-none candy-shadow">
          <svg class="a-wiggle" viewBox="0 0 100 60" fill="none">
            <path d="M22 30 L0 8 L8 30 L0 52 Z" fill="#fff" opacity=".9"/><path d="M78 30 L100 8 L92 30 L100 52 Z" fill="#fff" opacity=".9"/>
            <rect x="20" y="8" width="60" height="44" rx="22" fill="#8fd14f"/>
            <path d="M30 20 Q50 12 70 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".7"/>
          </svg>
        </div>
      </div>
    </div>
  `
})
export class ProductionComponent {
  activeTab = signal<'runs' | 'bom'>('runs');

  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';

  runs = [
    { id: 'PRN-101', bom: 'BOM-MGC (Mango)', planned: '1,000 packs', actual: '1,000 packs', started: '08:00 AM', status: 'COMPLETED', chip: 'bg-white/10 text-white/80 border-white/20' },
    { id: 'PRN-102', bom: 'BOM-MGC (Mango)', planned: '500 packs', actual: '--', started: 'Pending', status: 'SCHEDULED', chip: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35' }
  ];

  bom = [
    { name: 'Refined Sugar', qty: '100g' },
    { name: 'Mango Puree', qty: '250ml' },
    { name: 'Packaging Pouch', qty: '1 pc' }
  ];
}