import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-procurement',
  standalone: true,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

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

    <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

      <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
      <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
      <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

      <div class="relative z-10 mb-8">
        <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
          <span class="text-base">📦</span>
          <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy supply chain</span>
        </div>
        <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Procurement management</h2>
      </div>

      <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

        <!-- TABS + SEARCH -->
        <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-2">
            <button (click)="subTab.set('p-dash')" [class]="tabClass('p-dash')">PO Dashboard</button>
            <button (click)="subTab.set('p-pr')" [class]="tabClass('p-pr')">Create PR</button>
            <button (click)="subTab.set('p-pending')" [class]="tabClass('p-pending') + ' md:ml-2'">Pending Receipts</button>
            <button (click)="subTab.set('p-dir')" [class]="tabClass('p-dir')">Supplier Directory</button>
            <button (click)="subTab.set('p-log')" [class]="tabClass('p-log')">Incoming Goods Log</button>
          </div>

          <div class="relative min-w-[250px]">
            <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search suppliers, contacts..." aria-label="Search suppliers and contacts"
              class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
          </div>
        </div>

        <div class="p-8">

          <!-- PO DASHBOARD -->
          @if (subTab() === 'p-dash') {
            <h3 class="font-candy text-2xl font-semibold mb-6">Active purchase orders</h3>
            <div class="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-2">
              <table class="w-full text-left text-sm whitespace-nowrap">
                <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                  <tr><th class="py-4 px-4 font-medium">PO number</th><th class="py-4 px-4 font-medium">Supplier</th><th class="py-4 px-4 font-medium">Material</th><th class="py-4 px-4 font-medium">Qty</th><th class="py-4 px-4 font-medium">Status</th></tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  @for (po of pos; track po.no) {
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-4 px-4 font-extrabold">{{ po.no }}</td>
                      <td class="py-4 px-4 font-bold text-white/85">{{ po.supplier }}</td>
                      <td class="py-4 px-4 text-white/65 font-semibold">{{ po.material }}</td>
                      <td class="py-4 px-4 font-extrabold">{{ po.qty }}</td>
                      <td class="py-4 px-4"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + po.chip">{{ po.status }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- CREATE PR -->
          @if (subTab() === 'p-pr') {
            <h3 class="font-candy text-2xl font-semibold mb-4">Purchase requisition (PR) creator</h3>
            <form class="max-w-2xl space-y-4 bg-black/20 p-6 rounded-3xl border border-white/10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm text-white/60 mb-1.5 font-candy">Supplier ID</label>
                  <select class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-white outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d]">
                    <option>SUP-001 (MSCS PrimeGoods)</option>
                    <option>SUP-002 (McCormick Philippines)</option>
                    <option>SUP-003 (Lacto Philippines)</option>
                    <option>SUP-004 (Edelyn's Nuts)</option>
                    <option>SUP-005 (wills.com.ph)</option>
                    <option>SUP-006 (Packaging Depot Manila)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-white/60 mb-1.5 font-candy">Raw material ID</label>
                  <select class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-white outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d]">
                    <option>RM-SUG (Sugar)</option>
                    <option>RM-FLV (Flavor Extracts)</option>
                    <option>RM-MLK (Powdered Milk)</option>
                    <option>RM-NUT (Nuts)</option>
                    <option>RM-CCA (Cocoa)</option>
                    <option>RM-PKG (Packaging)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-white/60 mb-1.5 font-candy">Quantity</label>
                  <input type="number" placeholder="e.g. 500" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/40 outline-none focus:border-[#EAC224]">
                </div>
                <div>
                  <label class="block text-sm text-white/60 mb-1.5 font-candy">Unit cost (₱)</label>
                  <input type="number" placeholder="0.00" class="w-full px-4 py-3 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/40 outline-none focus:border-[#EAC224]">
                </div>
              </div>
              <button type="button" class="mt-3 font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-8 py-3 rounded-full font-semibold shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors">Generate requisition</button>
            </form>
          }

          <!-- SUPPLIER DIRECTORY -->
          @if (subTab() === 'p-dir') {
            <div class="mb-12">
              <h3 class="font-candy text-2xl font-semibold mb-6">Legacy directory view</h3>
              <div class="overflow-x-auto border border-white/10 rounded-2xl bg-black/20">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                    <tr>
                      <th class="py-4 px-6 font-medium">ID</th>
                      <th class="py-4 px-6 font-medium">Supplier name</th>
                      <th class="py-4 px-6 font-medium">Material supplied</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    @for (s of legacy; track s.id) {
                      <tr class="hover:bg-white/5 transition-colors">
                        <td class="py-4 px-6 font-extrabold">{{ s.id }}</td>
                        <td class="py-4 px-6 font-bold">{{ s.name }}</td>
                        <td class="py-4 px-6"><span class="bg-white/10 text-white/75 px-3 py-1 rounded-full text-[11px] font-bold">{{ s.material }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <hr class="border-white/10 mb-10">

            <div>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h3 class="font-candy text-2xl font-semibold">Supplier directory</h3>
                <button class="font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-semibold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                  Add new supplier
                </button>
              </div>

              <div class="overflow-x-auto border border-white/10 rounded-2xl bg-black/20">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                    <tr>
                      <th class="py-4 px-6 font-medium">Supplier name</th>
                      <th class="py-4 px-6 font-medium">Material category</th>
                      <th class="py-4 px-6 font-medium">Primary contact</th>
                      <th class="py-4 px-6 font-medium">Contact info</th>
                      <th class="py-4 px-6 font-medium">Performance rating</th>
                      <th class="py-4 px-6 font-medium text-center">Status</th>
                      <th class="py-4 px-6 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    @for (s of suppliers; track s.name) {
                      <tr class="hover:bg-white/5 transition-colors">
                        <td class="py-4 px-6 font-bold">{{ s.name }}</td>
                        <td class="py-4 px-6"><span class="bg-white/10 text-white/75 px-3 py-1 rounded-full text-[11px] font-bold">{{ s.category }}</span></td>
                        <td class="py-4 px-6 font-medium">{{ s.contact }}<br><span class="text-white/45 text-[11px]">{{ s.role }}</span></td>
                        <td class="py-4 px-6 text-white/65 text-xs">{{ s.email }}<br>{{ s.phone }}</td>
                        <td class="py-4 px-6">
                          <div class="flex items-center gap-0.5" [attr.aria-label]="s.rating + ' out of 5 stars'">
                            @for (n of stars; track n) {
                              <svg class="w-4 h-4" [class]="n <= s.rating ? 'text-[#EAC224]' : 'text-white/20'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            }
                          </div>
                        </td>
                        <td class="py-4 px-6 text-center"><span class="border border-[#9be15d]/30 bg-[#9be15d]/15 text-[#b7f27c] px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                        <td class="py-4 px-6 text-right text-white/50">
                          <button aria-label="Edit supplier" class="hover:text-[#EAC224] mx-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                          <button aria-label="View supplier" class="hover:text-[#EAC224] mx-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- PENDING RECEIPTS -->
          @if (subTab() === 'p-pending') {
            <div>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h3 class="font-candy text-2xl font-semibold">Expected deliveries &amp; material receipt</h3>
                <button class="font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-semibold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                  New purchase order
                </button>
              </div>

              <div class="overflow-x-auto border border-white/10 rounded-2xl bg-black/20">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                    <tr>
                      <th class="py-4 px-6 font-medium">PO number</th>
                      <th class="py-4 px-6 font-medium">Supplier</th>
                      <th class="py-4 px-6 font-medium">Expected materials</th>
                      <th class="py-4 px-6 font-medium">Quantity</th>
                      <th class="py-4 px-6 font-medium">ETA</th>
                      <th class="py-4 px-6 font-medium">Status</th>
                      <th class="py-4 px-6 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-5 px-6 font-extrabold">PO-2026-089</td>
                      <td class="py-5 px-6 text-white/70">Sweet Cane Farms Corp.</td>
                      <td class="py-5 px-6 text-white/70">Refined Sugar</td>
                      <td class="py-5 px-6 text-white/70">500 kg</td>
                      <td class="py-5 px-6 text-white/70">Today, 10:00 AM</td>
                      <td class="py-5 px-6 font-bold text-[#7fe7f7]">In transit</td>
                      <td class="py-5 px-6 text-right">
                        <button class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-5 py-2 rounded-full text-sm font-bold transition-colors inline-flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                          Scan arrival
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- INCOMING GOODS LOG -->
          @if (subTab() === 'p-log') {
            <div>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h3 class="font-candy text-2xl font-semibold">Incoming goods log (GRN history)</h3>
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <select aria-label="Date range" class="appearance-none bg-white/10 border border-white/15 text-white py-2.5 pl-10 pr-8 rounded-full text-sm font-bold outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                    <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <button class="bg-white/10 border border-white/15 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Export CSV
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto border border-white/10 rounded-2xl bg-black/20 mb-6">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                    <tr>
                      <th class="py-4 px-6 font-medium">Timestamp</th>
                      <th class="py-4 px-6 font-medium">GRN number</th>
                      <th class="py-4 px-6 font-medium">PO reference</th>
                      <th class="py-4 px-6 font-medium">Supplier</th>
                      <th class="py-4 px-6 font-medium">Materials received</th>
                      <th class="py-4 px-6 font-medium">Receiver</th>
                      <th class="py-4 px-6 font-medium">Routing status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-5 px-6 text-white/55">2026-09-18 14:30</td>
                      <td class="py-5 px-6 font-extrabold text-[#9be15d]">GRN-2026-0150</td>
                      <td class="py-5 px-6 text-white/45">PO-2026-085</td>
                      <td class="py-5 px-6 font-bold">Tropical Fruits Ltd.</td>
                      <td class="py-5 px-6 text-white/70">Mango Puree (150 L)</td>
                      <td class="py-5 px-6 text-[11px]">Mike D.<br><span class="text-white/45">Loading Dock A</span></td>
                      <td class="py-5 px-6"><span class="border border-[#22d3ee]/35 text-[#7fe7f7] bg-[#22d3ee]/15 px-3 py-1.5 rounded-full text-xs font-bold">Routed to QA</span></td>
                    </tr>
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
          <defs><linearGradient id="pRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
          <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
          <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
          <g class="a-flame">
            <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
            <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
          </g>
          <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
          <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#pRBody)" stroke="#94a3b8" stroke-width="2"/>
          <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
          <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
          <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
          <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
        </svg>
      </div>

      <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
        <svg viewBox="0 0 120 120" fill="none">
          <defs><linearGradient id="pStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
          <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#pStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
          <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        </svg>
      </div>

      <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
        <svg viewBox="0 0 220 190" fill="none">
          <defs>
            <linearGradient id="pGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
            <mask id="pDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
          </defs>
          <g mask="url(#pDonut)">
            <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
            <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
            <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#pGlz)"/>
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
  `
})
export class ProcurementComponent {
  subTab = signal<string>('p-dash');
  stars = [1, 2, 3, 4, 5];

  tabClass(tab: string): string {
    const base = 'px-5 py-2.5 rounded-full text-sm font-semibold font-candy transition-all ';
    return base + (this.subTab() === tab
      ? 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]'
      : 'text-white/70 hover:bg-white/10 hover:text-white');
  }

  pos = [
    { no: 'PO-2026-009', supplier: 'MSCS PrimeGoods, Inc.', material: 'Sugar', qty: '500 kg', status: 'Dispatched', chip: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35' },
    { no: 'PO-2026-010', supplier: 'Packaging Depot Manila', material: 'Packaging', qty: '210 pcs', status: 'Pending Approval', chip: 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35' }
  ];

  legacy = [
    { id: 'SUP-001', name: 'MSCS PrimeGoods, Inc.', material: 'Sugar' },
    { id: 'SUP-002', name: 'McCormick Philippines', material: 'Food Coloring / Flavor Extracts' },
    { id: 'SUP-003', name: 'Lacto Philippines, Inc.', material: 'Powdered Milk' },
    { id: 'SUP-004', name: "Edelyn's Homemade Nuts", material: 'Nuts' },
    { id: 'SUP-005', name: 'wills.com.ph', material: 'Cocoa' },
    { id: 'SUP-006', name: 'Packaging Depot Manila', material: 'Packaging' }
  ];

  suppliers = [
    { name: 'Sweet Cane Farms Corp.', category: 'Raw Ingredients', contact: 'Maria Santos', role: 'Account Manager', email: 'msantos@sweetcane.com', phone: '+63 917 123 4567', rating: 4 },
    { name: 'Plastics Packaging Inc.', category: 'Packaging', contact: 'Robert Chen', role: 'Sales Director', email: 'rchen@plasticspkg.com', phone: '+63 2 8888 1234', rating: 4 }
  ];
}