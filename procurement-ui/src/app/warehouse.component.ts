import { Component, ChangeDetectionStrategy, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&family=Nunito:wght@400;600;700;800&display=swap');

      app-warehouse { display: block; }
      .wh-page { font-family: 'Nunito', sans-serif; }
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

    <!-- Lime backdrop with room around the panel for spilling candies -->
    <div class="wh-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🏭</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy stockroom</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Warehouse &amp; inventory management</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + search -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex flex-wrap gap-2">
              <button (click)="activeTab.set('ledger')"
                [ngClass]="activeTab() === 'ledger' ? activeCls : idleCls"
                class="px-5 py-2.5 rounded-full text-sm font-semibold font-candy transition-all">Raw Material Ledger</button>
              <button (click)="activeTab.set('checker')"
                [ngClass]="activeTab() === 'checker' ? activeCls : idleCls"
                class="px-5 py-2.5 rounded-full text-sm font-semibold font-candy transition-all">Materials Checker</button>
              <button (click)="activeTab.set('finished')"
                [ngClass]="activeTab() === 'finished' ? activeCls : idleCls"
                class="px-5 py-2.5 rounded-full text-sm font-semibold font-candy transition-all">Finished Goods</button>
              <button (click)="activeTab.set('movement')"
                [ngClass]="activeTab() === 'movement' ? activeCls : idleCls"
                class="px-5 py-2.5 rounded-full text-sm font-semibold font-candy transition-all">Stock Movement</button>
            </div>

            <div class="relative w-full md:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search SKU, materials..." aria-label="Search SKU or materials"
                class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
            </div>
          </div>

          <div class="p-8">

            <!-- 1. RAW MATERIAL LEDGER -->
            @if (activeTab() === 'ledger' || activeTab() === 'yield') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <h2 class="text-2xl font-semibold">Available raw stock</h2>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                  <div class="lg:col-span-2 bg-black/20 rounded-2xl border border-white/10 overflow-x-auto">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white/50 text-[13px] border-b border-white/10">
                        <tr>
                          <th class="px-6 py-4 font-medium">Item SKU</th>
                          <th class="px-6 py-4 font-medium">Material</th>
                          <th class="px-6 py-4 font-medium text-right">Available qty</th>
                          <th class="px-6 py-4 font-medium">UOM</th>
                          <th class="px-6 py-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-sans font-medium">
                        @for (r of rawStock; track r.sku) {
                          <tr [class]="r.low ? 'bg-[#B4161B]/20 hover:bg-[#B4161B]/25 transition-colors' : 'hover:bg-white/5 transition-colors'">
                            <td [class]="'px-6 py-4 text-xs font-bold ' + (r.low ? 'text-[#ffb4b7] shadow-[inset_4px_0_0_#ef4444]' : 'text-white/60')">{{ r.sku }}</td>
                            <td [class]="'px-6 py-4 font-bold ' + (r.low ? 'text-[#ffb4b7]' : '')">{{ r.name }}</td>
                            <td [class]="'px-6 py-4 text-right font-extrabold text-base ' + (r.low ? 'text-[#ffb4b7]' : '')">{{ r.qty }}</td>
                            <td [class]="'px-6 py-4 text-xs font-bold ' + (r.low ? 'text-[#ffb4b7]' : 'text-white/50')">{{ r.uom }}</td>
                            <td class="px-6 py-4"><span [class]="'px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border ' + (r.low ? 'bg-[#B4161B] text-white border-transparent' : okChip)">{{ r.status }}</span></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Yield optimizer -->
                  <div class="bg-white/10 rounded-3xl p-6 border-2 border-[#EAC224]/70 relative space-y-4">
                    <div class="absolute -top-3 right-4 bg-[#EAC224] text-[#2d3e15] text-[11px] font-bold px-3 py-1 rounded-full">
                      Limiting ingredient algo
                    </div>

                    <h3 class="text-lg font-semibold">Yield optimizer engine</h3>

                    <div class="bg-black/20 rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs font-sans">
                      <span class="text-white/50 font-bold block">1 pack (Mango Candy) BOM:</span>
                      <div class="flex justify-between text-white/75 font-semibold"><span>Refined Sugar</span><span class="font-bold text-white">100 g</span></div>
                      <div class="flex justify-between text-white/75 font-semibold"><span>Mango Puree</span><span class="font-bold text-white">250 ml</span></div>
                      <div class="flex justify-between text-white/75 font-semibold"><span>Packaging Pouch</span><span class="font-bold text-white">1 pc</span></div>
                    </div>

                    <div class="bg-black/20 rounded-2xl p-5 border border-white/10 text-center">
                      <span class="text-xs font-semibold text-white/50 block mb-1">Max output capacity</span>
                      <div class="flex items-baseline justify-center gap-1.5 mb-3 font-sans">
                        <span class="text-4xl font-extrabold">150</span>
                        <span class="text-sm font-bold text-white/50">packs</span>
                      </div>
                      <div class="bg-[#B4161B]/25 border border-[#B4161B]/50 text-[#ffb4b7] p-3 rounded-xl text-xs font-sans font-medium text-left leading-relaxed">
                        <span class="font-bold block mb-0.5">⚠️ Bottleneck detected: packaging pouches.</span> You have enough sugar for 400 packs and puree for 360 packs, but pouches cap output at 150.
                      </div>
                    </div>

                    <button class="w-full font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] py-3 rounded-full font-semibold text-sm shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors">
                      Push to production planner
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- 2. FINISHED GOODS -->
            @if (activeTab() === 'finished') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <div>
                  <h2 class="text-2xl font-semibold mb-1">Sellable finished goods</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
                    <span class="text-xs font-bold text-white/55 block mb-1">Total sellable value</span>
                    <span class="text-2xl font-extrabold">₱ 45,200.00</span>
                  </div>
                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <span class="text-xs font-bold text-[#b7f27c] block mb-1">Available for sale</span>
                    <span class="text-2xl font-extrabold text-[#9be15d]">850 units</span>
                  </div>
                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224]">
                    <span class="text-xs font-bold text-[#EAC224] block mb-1">Allocated (awaiting dispatch)</span>
                    <span class="text-2xl font-extrabold text-[#EAC224]">120 units</span>
                  </div>
                  <div class="bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444]">
                    <span class="text-xs font-bold text-[#ffb4b7] block mb-1">Low stock alerts</span>
                    <span class="text-2xl font-extrabold text-[#ffb4b7]">1 SKU</span>
                  </div>
                </div>

                <div class="bg-black/20 rounded-2xl border border-white/10 overflow-x-auto">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10">
                      <tr>
                        <th class="px-6 py-4 font-medium">Product SKU</th>
                        <th class="px-6 py-4 font-medium">Product name</th>
                        <th class="px-6 py-4 font-medium text-right">Available stock</th>
                        <th class="px-6 py-4 font-medium text-right">Allocated stock</th>
                        <th class="px-6 py-4 font-medium text-right">Total on-hand</th>
                        <th class="px-6 py-4 font-medium">Status</th>
                        <th class="px-6 py-4 font-medium text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (g of goods; track g.sku) {
                        <tr [class]="g.low ? 'bg-[#B4161B]/20 hover:bg-[#B4161B]/25 transition-colors' : 'hover:bg-white/5 transition-colors'">
                          <td [class]="'px-6 py-4 text-xs font-bold ' + (g.low ? 'text-[#ffb4b7] shadow-[inset_4px_0_0_#ef4444]' : 'text-white/60')">{{ g.sku }}</td>
                          <td [class]="'px-6 py-4 font-bold ' + (g.low ? 'text-[#ffb4b7]' : '')">{{ g.name }}</td>
                          <td [class]="'px-6 py-4 text-right font-extrabold ' + (g.low ? 'text-[#ffb4b7]' : '')">{{ g.avail }}</td>
                          <td [class]="'px-6 py-4 text-right font-bold ' + (g.alloc > 0 ? 'text-[#EAC224]' : 'text-white/40')">{{ g.alloc }}</td>
                          <td class="px-6 py-4 text-right font-extrabold">{{ g.total }}</td>
                          <td class="px-6 py-4"><span [class]="'px-3 py-1.5 rounded-full text-[11px] font-bold border ' + (g.low ? 'bg-[#B4161B] text-white border-transparent' : okChip)">{{ g.status }}</span></td>
                          <td class="px-6 py-4 text-center"><button aria-label="View history" class="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">🕒</button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2b. RAW MATERIALS CHECKER -->
            @if (activeTab() === 'checker') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h2 class="text-2xl font-semibold mb-1">Raw materials checker</h2>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs font-semibold">
                    @for (f of filters; track f.key) {
                      <button (click)="stockFilter.set(f.key)"
                        [ngClass]="stockFilter() === f.key ? activeCls : idleCls"
                        class="px-4 py-2 rounded-full border border-white/15 transition-all">
                        {{ f.label }} <span class="opacity-70">({{ counts[f.key] }})</span>
                      </button>
                    }
                  </div>
                </div>

                <!-- Summary -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
                    <span class="text-xs font-bold text-white/55 block mb-1">Materials tracked</span>
                    <span class="text-2xl font-extrabold">{{ counts.all }}</span>
                  </div>
                  <div class="bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444]">
                    <span class="text-xs font-bold text-[#ffb4b7] block mb-1">Low stock</span>
                    <span class="text-2xl font-extrabold text-[#ffb4b7]">{{ counts.low }}</span>
                  </div>
                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <span class="text-xs font-bold text-[#b7f27c] block mb-1">Healthy</span>
                    <span class="text-2xl font-extrabold text-[#9be15d]">{{ counts.ok }}</span>
                  </div>
                  <div class="bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee]">
                    <span class="text-xs font-bold text-[#7fe7f7] block mb-1">High stock</span>
                    <span class="text-2xl font-extrabold text-[#7fe7f7]">{{ counts.high }}</span>
                  </div>
                </div>

                <!-- Material cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  @for (m of filteredMaterials(); track m.name) {
                    <div [class]="'rounded-3xl p-5 border transition-all hover:-translate-y-0.5 ' + m.card">
                      <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="flex items-center gap-3">
                          <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">{{ m.icon }}</div>
                          <p class="font-semibold text-base leading-tight">{{ m.name }}</p>
                        </div>
                        <span [class]="'px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ' + m.chip">{{ m.label }}</span>
                      </div>

                      <div class="flex items-baseline gap-1.5 mb-3 font-sans">
                        <span class="text-3xl font-extrabold">{{ m.qty | number }}</span>
                        <span class="text-sm text-white/55 font-bold">{{ m.unit }}</span>
                      </div>

                      <!-- Level bar with reorder marker -->
                      <div class="relative h-2.5 rounded-full bg-white/10 mb-2" role="img" [attr.aria-label]="m.name + ' at ' + m.pct + ' percent of capacity'">
                        <div [class]="'h-full rounded-full ' + m.bar" [style.width.%]="m.pct"></div>
                        <span class="absolute -top-[3px] w-0.5 h-4 bg-white/70 rounded" [style.left.%]="m.minPct"></span>
                      </div>
                      <div class="flex justify-between text-[11px] text-white/50 font-sans font-semibold">
                        <span>Reorder at {{ m.min | number }} {{ m.unit }}</span>
                        <span>{{ m.pct }}% of {{ m.max | number }}</span>
                      </div>

                      @if (m.status === 'low') {
                        <button class="mt-4 w-full font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] py-2 rounded-full text-xs font-semibold transition-colors">Create reorder</button>
                      } @else if (m.status === 'high') {
                        <p class="mt-4 text-[11px] text-[#7fe7f7] font-sans font-semibold">Near capacity. Hold new purchase orders.</p>
                      }
                    </div>
                  }
                </div>

                <p class="text-xs text-white/40 font-sans">Quantities, reorder levels and capacities shown here are sample values. Replace them with your real figures.</p>
              </div>
            }

            <!-- 3. STOCK MOVEMENT -->
            @if (activeTab() === 'movement') {
              <div class="animate-in fade-in duration-300 space-y-6 font-candy">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 class="text-2xl font-semibold mb-1">Stock ledger &amp; movement audit trail</h2>
                  </div>
                  <button class="bg-white/10 border border-white/15 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
                    📥 Export audit log
                  </button>
                </div>

                <div class="bg-black/20 rounded-2xl border border-white/10 overflow-x-auto">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] border-b border-white/10">
                      <tr>
                        <th class="px-6 py-4 font-medium">Timestamp</th>
                        <th class="px-6 py-4 font-medium">Movement type</th>
                        <th class="px-6 py-4 font-medium">Item &amp; SKU</th>
                        <th class="px-6 py-4 font-medium text-right">Qty change</th>
                        <th class="px-6 py-4 font-medium">Reference source</th>
                        <th class="px-6 py-4 font-medium">Trigger / actor</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium text-xs">
                      @for (m of moves; track m.time) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="px-6 py-4 text-white/55">{{ m.time }}</td>
                          <td class="px-6 py-4"><span [class]="'px-3 py-1.5 rounded-full font-bold text-[11px] border ' + m.chip">{{ m.type }}</span></td>
                          <td class="px-6 py-4">
                            <span class="font-bold block text-sm">{{ m.item }}</span>
                            <span class="text-[11px] text-white/45 font-bold">{{ m.sku }}</span>
                          </td>
                          <td [class]="'px-6 py-4 text-right font-extrabold text-sm ' + (m.gain ? 'text-[#9be15d]' : 'text-[#ff8a8f]')">{{ m.qty }}</td>
                          <td class="px-6 py-4 font-bold text-white/80">{{ m.ref }}</td>
                          <td class="px-6 py-4 text-white/55">{{ m.trigger }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

          </div>
        </div>

        <!-- ========== ROCKET & CANDIES SPILLING OVER THE PANEL EDGES ========== -->

        <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[12%] w-24 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
            <defs><linearGradient id="wRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#wRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="wStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#wStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="wGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="wDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#wDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#wGlz)"/>
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
export class WarehouseComponent {
  activeTab = signal<'ledger' | 'yield' | 'checker' | 'finished' | 'movement'>('ledger');

  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';
  okChip = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';

  // Raw materials checker
  stockFilter = signal<'all' | 'low' | 'ok' | 'high'>('all');
  filters: { key: 'all' | 'low' | 'ok' | 'high'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low', label: 'Low' },
    { key: 'ok', label: 'Healthy' },
    { key: 'high', label: 'High' }
  ];

  private looks = {
    low:  { label: 'LOW STOCK',  card: 'bg-[#B4161B]/15 border-[#B4161B]/45', bar: 'bg-[#ef4444]', chip: 'bg-[#B4161B] text-white border-transparent' },
    ok:   { label: 'HEALTHY',    card: 'bg-white/5 border-white/10',          bar: 'bg-[#9be15d]', chip: this.okChip },
    high: { label: 'HIGH STOCK', card: 'bg-[#22d3ee]/10 border-[#22d3ee]/30', bar: 'bg-[#22d3ee]', chip: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35' }
  };

  // Sample figures: qty is current stock, min is the reorder level, max is storage capacity
  private stockSeed = [
    { name: 'Sugar',              icon: '🧊', qty: 40000, unit: 'g',      min: 20000, max: 100000 },
    { name: 'Food Coloring',      icon: '🎨', qty: 6,     unit: 'L',      min: 10,    max: 40 },
    { name: 'Powdered Milk',      icon: '🥛', qty: 85,    unit: 'kg',     min: 30,    max: 100 },
    { name: 'Nuts',               icon: '🥜', qty: 18,    unit: 'kg',     min: 25,    max: 120 },
    { name: 'Flavor Extracts',    icon: '🧪', qty: 28,    unit: 'L',      min: 10,    max: 40 },
    { name: 'Butter',             icon: '🧈', qty: 22,    unit: 'kg',     min: 15,    max: 60 },
    { name: 'Condensed Milk',     icon: '🥫', qty: 230,   unit: 'cans',   min: 80,    max: 250 },
    { name: 'Packaging Tape',     icon: '📦', qty: 14,    unit: 'rolls',  min: 20,    max: 100 },
    { name: 'Plastic Containers', icon: '🥡', qty: 950,   unit: 'pcs',    min: 300,   max: 1000 },
    { name: 'Chocolate',          icon: '🍫', qty: 60,    unit: 'kg',     min: 40,    max: 150 },
    { name: 'Chocolate Powder',   icon: '☕', qty: 45,    unit: 'kg',     min: 20,    max: 80 }
  ];

  materials = this.stockSeed.map(m => {
    const pct = Math.min(100, Math.round((m.qty / m.max) * 100));
    const minPct = Math.round((m.min / m.max) * 100);
    const status: 'low' | 'ok' | 'high' = m.qty < m.min ? 'low' : pct >= 90 ? 'high' : 'ok';
    return { ...m, pct, minPct, status, ...this.looks[status] };
  });

  counts = {
    all: this.materials.length,
    low: this.materials.filter(m => m.status === 'low').length,
    ok: this.materials.filter(m => m.status === 'ok').length,
    high: this.materials.filter(m => m.status === 'high').length
  };

  filteredMaterials = computed(() =>
    this.stockFilter() === 'all' ? this.materials : this.materials.filter(m => m.status === this.stockFilter())
  );

  rawStock = [
    { sku: 'RAW-SUG-01', name: 'Refined Sugar', qty: '40,000', uom: 'g', status: 'AVAILABLE', low: false },
    { sku: 'RAW-PUR-02', name: 'Mango Puree', qty: '90,000', uom: 'ml', status: 'AVAILABLE', low: false },
    { sku: 'PKG-PCH-03', name: 'Mango Candy Pouches', qty: '150', uom: 'pcs', status: 'LOW STOCK', low: true }
  ];

  goods = [
    { sku: 'FG-MAN-001', name: 'Mango Candy (Single Pack)', avail: 150, alloc: 50, total: 200, status: 'IN STOCK', low: false },
    { sku: 'FG-MAN-010', name: 'Mango Candy (Box of 10)', avail: 45, alloc: 0, total: 45, status: 'IN STOCK', low: false },
    { sku: 'FG-TAM-001', name: 'Tamarind Candy (Single Pack)', avail: 12, alloc: 70, total: 82, status: 'LOW STOCK', low: true }
  ];

  moves = [
    { time: '2026-09-19 11:00', type: '⇄ ALLOCATION', chip: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35', item: 'Mango Candy (Pack)', sku: 'FG-MAN-001', qty: '-50 packs', gain: false, ref: 'ORD-2026-104', trigger: 'Trigger 4 (Sales Validation)' },
    { time: '2026-09-19 09:30', type: '+ PRODUCTION ADD', chip: 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30', item: 'Mango Candy (Pack)', sku: 'FG-MAN-001', qty: '+150 packs', gain: true, ref: 'FG-RUN-402', trigger: 'Trigger 3 (QA Clearance)' },
    { time: '2026-09-19 09:29', type: '- BOM DEDUCTION', chip: 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50', item: 'Packaging Pouches', sku: 'PKG-PCH-03', qty: '-150 pcs', gain: false, ref: 'FG-RUN-402', trigger: 'Trigger 3 (Production Run)' },
    { time: '2026-09-18 15:00', type: '✓ QA INGESTION', chip: 'bg-[#2dd4bf]/15 text-[#7ff0e0] border-[#2dd4bf]/35', item: 'Refined Sugar', sku: 'RAW-SUG-01', qty: '+40,000 g', gain: true, ref: 'BAT-2609-02', trigger: 'Trigger 2 (QA Pass)' }
  ];
}