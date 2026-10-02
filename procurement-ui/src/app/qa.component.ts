import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      app-qa { display: block; }
      .qa-page { font-family: 'Nunito', sans-serif; }
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

    <div class="qa-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🔬</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy quality lab</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Quality assurance &amp; inspection</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + search -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-candy">
            <div class="flex flex-wrap gap-2">
              <button (click)="subTab.set('q-inbound')" [ngClass]="subTab() === 'q-inbound' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Pending Inspections</button>
              <button (click)="subTab.set('q-finished')" [ngClass]="subTab() === 'q-finished' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Finished Goods Clearance</button>
              <button (click)="subTab.set('q-quarantine')" [ngClass]="subTab() === 'q-quarantine' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Quarantine Log</button>
              <button (click)="subTab.set('q-defect')" [ngClass]="subTab() === 'q-defect' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Defect Reports</button>
            </div>

            <div class="relative w-full md:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search batch IDs, materials..." aria-label="Search batch IDs or materials"
                class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
            </div>
          </div>

          <div class="p-8">

            <!-- 1. PENDING INSPECTIONS -->
            @if (subTab() === 'q-inbound') {
              <div class="space-y-6">
                <h3 class="font-candy text-2xl font-semibold">Inbound QA check &amp; digital sign-off</h3>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Batch ID / Ref</th>
                        <th class="py-4 px-6 font-medium">Source</th>
                        <th class="py-4 px-6 font-medium">Material / Product</th>
                        <th class="py-4 px-6 font-medium">Received qty</th>
                        <th class="py-4 px-6 font-medium">Inspection type</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (r of inbound; track r.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ r.id }}</td>
                          <td class="py-4 px-6 text-xs text-white/65">{{ r.src }}<br><span class="text-[11px] text-white/45 font-bold">{{ r.srcSub }}</span></td>
                          <td class="py-4 px-6 font-bold text-white/85">{{ r.item }}</td>
                          <td class="py-4 px-6 font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + r.typeChip">{{ r.type }}</span></td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + chipGold">{{ r.status }}</span></td>
                          <td class="py-4 px-6 text-right space-x-2">
                            @if (r.fg) {
                              <button [class]="btnDanger">Flag Batch</button>
                              <button [class]="btnGold">Clear to Sellable</button>
                            } @else {
                              <button [class]="btnDanger">Reject</button>
                              <button [class]="btnLime">Sign-off (Pass)</button>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. FINISHED GOODS CLEARANCE -->
            @if (subTab() === 'q-finished') {
              <div class="space-y-6">
                <h3 class="font-candy text-2xl font-semibold">Finished goods clearance</h3>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Batch ID / Ref</th>
                        <th class="py-4 px-6 font-medium">Source line</th>
                        <th class="py-4 px-6 font-medium">Product</th>
                        <th class="py-4 px-6 font-medium">Yield qty</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (r of finished; track r.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ r.id }}</td>
                          <td class="py-4 px-6 text-xs text-white/65">Internal<br><span class="text-[11px] text-white/45 font-bold">{{ r.line }}</span></td>
                          <td class="py-4 px-6 font-bold text-white/85">{{ r.item }}</td>
                          <td class="py-4 px-6 font-extrabold">{{ r.qty }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + (r.cleared ? chipLime : chipGold)">{{ r.cleared ? '✓ CLEARED' : 'PENDING CLEARANCE' }}</span></td>
                          <td class="py-4 px-6 text-right space-x-2">
                            @if (r.cleared) {
                              <span class="text-xs text-white/50 italic font-bold">Sent to Inventory</span>
                            } @else {
                              <button [class]="btnDanger">Flag Batch</button>
                              <button [class]="btnGold">Clear to Sellable</button>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 3. QUARANTINE LOG -->
            @if (subTab() === 'q-quarantine') {
              <div class="space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Quarantine log &amp; disposition</h3>
                  <button class="bg-white/10 border border-white/15 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Export report
                  </button>
                </div>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Batch ID / Ref</th>
                        <th class="py-4 px-6 font-medium">Item &amp; source</th>
                        <th class="py-4 px-6 font-medium">Defect category</th>
                        <th class="py-4 px-6 font-medium">Root cause detail</th>
                        <th class="py-4 px-6 font-medium">Disposition</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (q of quarantine; track q.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td [class]="'py-4 px-6 font-extrabold ' + q.edge">{{ q.id }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">{{ q.item }}<br><span class="text-[11px] text-white/45 font-normal">{{ q.source }}</span></td>
                          <td class="py-4 px-6"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + q.catChip">{{ q.cat }}</span></td>
                          <td class="py-4 px-6 text-xs text-white/65 max-w-xs truncate">{{ q.detail }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + q.dispChip">{{ q.disp }}</span></td>
                          <td class="py-4 px-6 text-right"><button [class]="q.btn">{{ q.action }}</button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 4. DEFECT REPORTS -->
            @if (subTab() === 'q-defect') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Defect analytics &amp; root cause reports</h3>
                  <button class="font-candy tracking-wide px-6 py-2.5 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-sm font-semibold shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Generate summary PDF
                  </button>
                </div>

                <!-- Metric cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-[#22d3ee] flex items-center gap-4">
                    <div class="p-3 bg-[#22d3ee]/20 text-[#7fe7f7] rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-white/55">Overall defect rate</p>
                      <p class="text-2xl font-extrabold">4.2% <span class="text-xs font-bold text-[#9be15d]">↓ 1.1%</span></p>
                    </div>
                  </div>

                  <div class="bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444] flex items-center gap-4">
                    <div class="p-3 bg-[#B4161B]/30 text-[#ffb4b7] rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-[#ffb4b7]">Top defect category</p>
                      <p class="text-lg font-extrabold">Physical Damage</p>
                      <p class="text-xs text-white/55 font-bold">Packaging Pouches</p>
                    </div>
                  </div>

                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224] flex items-center gap-4">
                    <div class="p-3 bg-[#EAC224]/20 text-[#EAC224] rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-[#EAC224]">Supplier alert</p>
                      <p class="text-lg font-extrabold">Plastics Pkg Inc.</p>
                      <p class="text-xs text-white/55 font-bold">12% return rate this month</p>
                    </div>
                  </div>
                </div>

                <!-- Defect reports table -->
                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Report ID</th>
                        <th class="py-4 px-6 font-medium">Material / Product</th>
                        <th class="py-4 px-6 font-medium">Source (vendor/line)</th>
                        <th class="py-4 px-6 font-medium">Primary issue</th>
                        <th class="py-4 px-6 font-medium">Corrective action (CAPA)</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (d of defects; track d.id) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ d.id }}</td>
                          <td class="py-4 px-6 font-bold text-white/85">{{ d.item }}</td>
                          <td class="py-4 px-6 text-xs text-white/65">{{ d.source }}</td>
                          <td class="py-4 px-6"><span [class]="'px-2.5 py-1 rounded-full text-[11px] font-bold border ' + d.chip">{{ d.issue }}</span></td>
                          <td class="py-4 px-6 text-xs text-white/65 max-w-xs truncate">{{ d.capa }}</td>
                          <td class="py-4 px-6 text-right"><button [class]="btnGhost">View Report</button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <!-- Manual defect logger -->
                <div class="mt-8 pt-8 border-t border-white/10">
                  <h4 class="font-candy text-xl font-semibold mb-4">Manual defect / quarantine logger</h4>
                  <form class="max-w-2xl space-y-5 bg-black/20 p-6 rounded-3xl border border-white/10 font-sans">
                    <div>
                      <label class="block text-sm text-white/60 mb-1.5 font-candy">Batch ID</label>
                      <input type="text" placeholder="e.g. BCH-XXXX" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224]">
                    </div>
                    <div>
                      <label class="block text-sm text-white/60 mb-1.5 font-candy">Inspection stage</label>
                      <select class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-sm text-white outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d]">
                        <option>INBOUND_RAW</option>
                        <option>FINISHED_GOODS</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm text-white/60 mb-2 font-candy">Inspection result</label>
                      <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer bg-white/10 px-5 py-2.5 border border-white/15 rounded-full"><input type="radio" name="result" value="pass" class="accent-[#9be15d]"><span class="font-bold text-[#9be15d] text-xs">PASS</span></label>
                        <label class="flex items-center gap-2 cursor-pointer bg-white/10 px-5 py-2.5 border border-white/15 rounded-full"><input type="radio" name="result" value="fail" class="accent-[#ef4444]"><span class="font-bold text-[#ff8a8f] text-xs">FAIL (Quarantine)</span></label>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm text-white/60 mb-1.5 font-candy">Defect reason (if failed)</label>
                      <textarea placeholder="Describe contamination, damage, or metric failure..." class="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 h-24 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224]"></textarea>
                    </div>
                    <button type="button" class="mt-2 font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-8 py-3 rounded-full font-semibold text-sm shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors">Submit QA log</button>
                  </form>
                </div>
              </div>
            }

          </div>
        </div>

        <!-- ========== ROCKET & CANDIES SPILLING OVER THE PANEL EDGES ========== -->

        <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[12%] w-24 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
            <defs><linearGradient id="qRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#qRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="qStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#qStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="qGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="qDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#qDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#qGlz)"/>
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
export class QaComponent {
  subTab = signal<string>('q-inbound');

  // Tab + button + chip styles
  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';
  btnGold = 'px-4 py-1.5 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors';
  btnLime = 'px-4 py-1.5 bg-[#9be15d] hover:bg-[#b0f07a] text-[#1d2f0d] rounded-full text-xs font-bold transition-colors';
  btnDanger = 'px-3 py-1.5 border border-[#ff8a8f]/50 text-[#ffb4b7] hover:bg-[#B4161B]/25 rounded-full text-xs font-bold transition-colors';
  btnGhost = 'px-4 py-1.5 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors';
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';
  chipOrange = 'bg-[#ff9d1c]/15 text-[#ffbe66] border-[#ff9d1c]/35';
  chipRed = 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50';

  inbound = [
    { id: 'BAT-2609-01', src: 'PO-2026-090', srcSub: 'Plastics Packaging Inc.', item: 'Mango Candy Pouches', qty: '300 pcs', type: 'Inbound Raw', typeChip: this.chipCyan, status: 'QUARANTINED', fg: false },
    { id: 'BAT-2609-02', src: 'PO-2026-089', srcSub: 'Sweet Cane Farms Corp.', item: 'Refined Sugar', qty: '500 kg', type: 'Inbound Raw', typeChip: this.chipCyan, status: 'QUARANTINED', fg: false },
    { id: 'FG-RUN-402', src: 'Internal', srcSub: 'Production Line 1', item: 'Mango Candy (Pack)', qty: '150 packs', type: 'Finished Goods', typeChip: this.chipOrange, status: 'PENDING CLEARANCE', fg: true }
  ];

  finished = [
    { id: 'FG-RUN-402', line: 'Production Line 1', item: 'Mango Candy (Pack)', qty: '150 packs', cleared: false },
    { id: 'FG-RUN-403', line: 'Production Line 2', item: 'Tamarind Candy (Box)', qty: '50 boxes', cleared: false },
    { id: 'FG-RUN-400', line: 'Production Line 1', item: 'Mango Candy (Pack)', qty: '200 packs', cleared: true }
  ];

  quarantine = [
    { id: 'BAT-2609-08', edge: 'shadow-[inset_4px_0_0_#ef4444]', item: 'Mango Candy Pouches', source: 'Plastics Packaging Inc.', cat: 'PHYSICAL DAMAGE', catChip: this.chipRed, detail: 'Punctured seals on 45% of the received lot during transit.', disp: '🔄 RETURN TO VENDOR', dispChip: 'bg-white/10 text-white border-white/20', action: 'Generate RTV', btn: this.btnGhost },
    { id: 'FG-RUN-401', edge: 'shadow-[inset_4px_0_0_#EAC224]', item: 'Mango Candy (Pack)', source: 'Production Line 1', cat: 'WEIGHT VARIANCE', catChip: this.chipGold, detail: 'Packs failed random sampling; below minimum net weight of 50g.', disp: '⚠️ REWORK', dispChip: this.chipGold, action: 'Create Work Order', btn: this.btnGold },
    { id: 'FG-RUN-399', edge: 'shadow-[inset_4px_0_0_#ef4444]', item: 'Tamarind Candy (Box)', source: 'Production Line 2', cat: 'CONTAMINATION', catChip: this.chipRed, detail: 'Foreign particulate matter found during final visual clearance.', disp: '❌ SCRAP', dispChip: this.chipRed, action: 'Execute Disposal', btn: this.btnDanger }
  ];

  defects = [
    { id: 'DEF-2026-042', item: 'Mango Candy Pouches', source: 'Plastics Packaging Inc.', issue: 'SEAL PUNCTURE', chip: this.chipRed, capa: 'Issued formal warning to vendor; requested thicker micron film for next PO.' },
    { id: 'DEF-2026-041', item: 'Mango Candy (Pack)', source: 'Internal (Line 1)', issue: 'WEIGHT VARIANCE', chip: this.chipGold, capa: 'Recalibrated filling machine hopper. Maintenance scheduled for Sept 22.' }
  ];
}