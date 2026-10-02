import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      app-logistics { display: block; }
      .lg-page { font-family: 'Nunito', sans-serif; }
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
      @keyframes dash-flow { to { stroke-dashoffset: -32; } }

      .a-bob-a { animation: bob-a 5s ease-in-out infinite; }
      .a-bob-b { animation: bob-b 4.2s ease-in-out infinite .4s; }
      .a-rocket { animation: rocket-fly 4s ease-in-out infinite; }
      .a-flame { animation: flame .12s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0%; }
      .a-spark { animation: spark .7s ease-out infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .a-wiggle { animation: wiggle 2s ease-in-out infinite; transform-origin: 50% 100%; }
      .a-dash { stroke-dasharray: 10 8; animation: dash-flow 1.2s linear infinite; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <div class="lg-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🚚</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy fleet</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Logistics &amp; fleet management</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + search -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-candy">
            <div class="flex flex-wrap gap-2">
              <button (click)="subTab.set('l-routes')" [ngClass]="subTab() === 'l-routes' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Delivery Routes</button>
              <button (click)="subTab.set('l-dispatch')" [ngClass]="subTab() === 'l-dispatch' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Pending Dispatch</button>
              <button (click)="subTab.set('l-epod')" [ngClass]="subTab() === 'l-epod' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">e-POD Uploads</button>
              <button (click)="subTab.set('l-status')" [ngClass]="subTab() === 'l-status' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Fleet Status</button>
            </div>

            <div class="relative w-full md:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search DR, driver, destination..." aria-label="Search DR, driver or destination"
                class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
            </div>
          </div>

          <div class="p-8">

            <!-- 1. DELIVERY ROUTES -->
            @if (subTab() === 'l-routes') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Fleet routing &amp; e-POD capture</h3>
                  <div class="flex gap-3 flex-wrap">
                    <button [class]="btnGhost + ' font-candy flex items-center gap-2'">🗺️ View live map</button>
                    <button [class]="btnGold + ' font-candy flex items-center gap-2'">🚚 Dispatch 3rd-party courier</button>
                  </div>
                </div>

                <!-- Live tracker map -->
                <div class="w-full bg-black/20 rounded-[28px] p-2 border border-white/10">
                  <div class="w-full h-[350px] rounded-[22px] relative overflow-hidden flex items-center justify-center" style="background: #14240a;">
                    <div class="absolute inset-0 opacity-60" style="background-image: radial-gradient(rgba(255,255,255,.14) 1px, transparent 1px); background-size: 20px 20px;"></div>
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 350" preserveAspectRatio="xMidYMid slice">
                      <path d="M 200 80 Q 400 80, 500 150 T 800 250" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-linecap="round"/>
                      <path d="M 350 300 Q 450 200, 500 150" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-linecap="round"/>
                      <path d="M 200 80 Q 400 80, 500 150 T 800 250" fill="none" stroke="#9be15d" stroke-width="4" class="a-dash" stroke-linecap="round"/>

                      <g transform="translate(200, 80)">
                        <circle cx="0" cy="0" r="25" fill="#EAC224" opacity="0.25" class="animate-pulse"/>
                        <circle cx="0" cy="0" r="12" fill="#14240a" stroke="#EAC224" stroke-width="3"/>
                        <circle cx="0" cy="0" r="4" fill="#EAC224"/>
                        <text x="0" y="-22" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#EAC224">Bocaue HQ</text>
                      </g>

                      <g transform="translate(800, 250)">
                        <circle cx="0" cy="0" r="12" fill="#14240a" stroke="#ff8a8f" stroke-width="3"/>
                        <circle cx="0" cy="0" r="4" fill="#ff8a8f"/>
                        <text x="0" y="28" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#ffb4b7">Quezon City</text>
                      </g>

                      <!-- Van drives from HQ to Quezon City -->
                      <g>
                        <animateMotion dur="14s" repeatCount="indefinite" path="M 200 80 Q 400 80, 500 150 T 800 250"/>
                        <circle cx="0" cy="0" r="17" fill="#EAC224" stroke="#fff" stroke-width="2"/>
                        <svg x="-9" y="-9" width="18" height="18" fill="none" stroke="#2d3e15" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7.5" cy="17.5" r="1.5" fill="#2d3e15"/><circle cx="16.5" cy="17.5" r="1.5" fill="#2d3e15"/></svg>
                        <rect x="-30" y="-42" width="60" height="20" rx="10" fill="#9be15d"/>
                        <text x="0" y="-28" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="10" fill="#1d2f0d">DSP-402</text>
                      </g>
                    </svg>

                    <div class="absolute top-4 right-4 glass-panel px-4 py-2.5 rounded-2xl">
                      <p class="text-[11px] font-semibold text-white/55 font-candy">Live fleet status</p>
                      <p class="text-sm font-bold text-[#9be15d] flex items-center font-sans">
                        <span class="relative flex h-2 w-2 mr-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-[#9be15d]"></span></span>
                        1 active route
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Routes table -->
                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">DR number</th>
                        <th class="py-4 px-6 font-medium">Order ref</th>
                        <th class="py-4 px-6 font-medium">Destination</th>
                        <th class="py-4 px-6 font-medium">Courier / driver</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (r of routes; track r.dr) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ r.dr }}</td>
                          <td class="py-4 px-6 text-xs text-white/55 font-mono font-bold">{{ r.order }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">{{ r.dest }}<br><span class="text-[11px] text-white/45 font-normal">{{ r.addr }}</span></td>
                          <td class="py-4 px-6 text-xs font-bold text-white/75">{{ r.courier }}<br>
                            @if (r.track) { <a href="#" class="text-[11px] text-[#9be15d] underline font-bold">Track link</a> }
                            @else { <span class="text-[11px] text-white/45 font-normal">{{ r.courierSub }}</span> }
                          </td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + r.chip">{{ r.status }}</span></td>
                          <td class="py-4 px-6 text-right">
                            @if (r.done) { <button [class]="btnGhost">View e-POD</button> }
                            @else { <button [class]="btnGold">Upload e-POD</button> }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 2. PENDING DISPATCH -->
            @if (subTab() === 'l-dispatch') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Pending dispatch queue</h3>
                  <button [class]="btnGold + ' font-candy'">Batch assign routes</button>
                </div>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">DR number</th>
                        <th class="py-4 px-6 font-medium">Order ref</th>
                        <th class="py-4 px-6 font-medium">Customer / destination</th>
                        <th class="py-4 px-6 font-medium">Allocated qty</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Assign action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (d of dispatch; track d.dr) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 font-extrabold">{{ d.dr }}</td>
                          <td class="py-4 px-6 text-xs text-white/55 font-mono font-bold">{{ d.order }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">{{ d.dest }}<br><span class="text-[11px] text-white/45 font-normal">{{ d.addr }}</span></td>
                          <td class="py-4 px-6 font-extrabold">{{ d.qty }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + chipGold">AWAITING DISPATCH</span></td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <button [class]="btnGhost">3rd-Party Courier</button>
                            <button [class]="btnGold">Assign In-House</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 3. E-POD UPLOADS -->
            @if (subTab() === 'l-epod') {
              <div class="space-y-6">
                <h3 class="font-candy text-2xl font-semibold">Electronic proof of delivery (e-POD) portal</h3>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div class="lg:col-span-2 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                        <tr>
                          <th class="py-4 px-6 font-medium">DR number</th>
                          <th class="py-4 px-6 font-medium">Destination</th>
                          <th class="py-4 px-6 font-medium">Courier / driver</th>
                          <th class="py-4 px-6 font-medium">POD status</th>
                          <th class="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-sans font-medium">
                        @for (e of pods; track e.dr) {
                          <tr [class]="e.action === 'active' ? 'bg-white/5 hover:bg-white/10 transition-colors' : 'hover:bg-white/5 transition-colors'">
                            <td [class]="'py-4 px-6 font-extrabold ' + (e.action === 'active' ? 'shadow-[inset_4px_0_0_#9be15d]' : '')">{{ e.dr }}<br><span class="text-[11px] text-white/45 font-mono font-bold">{{ e.order }}</span></td>
                            <td class="py-4 px-6 text-xs font-bold text-white/85">{{ e.dest }}<br><span class="text-[11px] text-white/45 font-normal">{{ e.addr }}</span></td>
                            <td class="py-4 px-6 text-xs font-bold text-white/75">{{ e.courier }}<br>
                              @if (e.track) { <a href="#" class="text-[11px] text-[#9be15d] underline font-bold">Track link</a> }
                              @else { <span class="text-[11px] text-white/45 font-normal">{{ e.courierSub }}</span> }
                            </td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + (e.uploaded ? chipLime : chipGold)">{{ e.uploaded ? '✓ UPLOADED' : 'PENDING UPLOAD' }}</span></td>
                            <td class="py-4 px-6 text-right">
                              @if (e.action === 'active') { <span class="text-[#9be15d] font-bold">&gt; Active</span> }
                              @else if (e.action === 'select') { <button [class]="btnGhost">Select</button> }
                              @else { <span class="text-xs text-white/50 italic font-bold">Fulfilled</span> }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Upload panel -->
                  <div class="glass-panel p-6 rounded-3xl flex flex-col justify-between font-sans">
                    <div>
                      <div class="flex justify-between items-center mb-3 gap-2">
                        <h4 class="font-candy text-base font-semibold">Upload e-POD for DR-2026-088</h4>
                        <span [class]="'px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ' + chipLime">Trigger 5 hand-off</span>
                      </div>
                      <p class="text-xs text-white/65 font-bold mb-4 font-candy">Supermart Downtown • 30 packs</p>

                      <div class="bg-black/20 border border-dashed border-white/25 rounded-2xl p-6 flex flex-col items-center justify-center mb-4 text-center">
                        <svg class="w-8 h-8 text-[#EAC224] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3-3m3-3v12"></path></svg>
                        <p class="text-xs font-bold text-white/85">Drag &amp; drop photo or signature file here</p>
                        <p class="text-[10px] text-white/45 mb-3 font-medium">Supports JPG, PNG, PDF (Max 10MB)</p>
                        <button [class]="btnGhost">Browse files</button>
                      </div>

                      <div class="space-y-3 text-xs mb-6">
                        <div>
                          <label class="block text-xs text-white/55 mb-1.5 font-candy">Received by (customer name)</label>
                          <input type="text" value="Juan Dela Cruz (Store Supervisor)" class="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-[#EAC224]">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          <div>
                            <label class="block text-xs text-white/55 mb-1.5 font-candy">Delivery date</label>
                            <input type="text" value="2026-09-19" class="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-[#EAC224]">
                          </div>
                          <div>
                            <label class="block text-xs text-white/55 mb-1.5 font-candy">Time</label>
                            <input type="text" value="11:30 AM" class="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-[#EAC224]">
                          </div>
                        </div>
                      </div>
                    </div>

                    <button class="w-full py-3 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full font-semibold text-sm shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors font-candy">Complete &amp; submit e-POD</button>
                  </div>
                </div>

                <!-- Driver mobile app simulator (stays a light phone UI) -->
                <div class="mt-12 pt-8 border-t border-white/10">
                  <h4 class="font-candy text-xl font-semibold mb-2 text-center">Driver mobile app (e-POD) simulator</h4>
                  <p class="text-sm text-white/55 mb-8 text-center font-semibold font-sans">Simulated mobile view for electronic proof of delivery.</p>

                  <div class="w-[340px] h-[650px] bg-[#fbfdf9] text-gray-800 border-[14px] border-[#0b1405] ring-1 ring-white/15 rounded-[3rem] mx-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col font-sans">
                    <div class="w-32 h-6 bg-[#0b1405] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50"></div>
                    <div class="bg-[#EAC224] p-6 pt-10 pb-4 shadow-md font-candy">
                      <p class="text-xs font-bold text-[#476021] uppercase">Delivery order</p>
                      <p class="text-xl font-black text-gray-900">SO-1042</p>
                      <p class="text-sm text-gray-800 font-bold mt-1">Candy Corner PH - Quezon City</p>
                    </div>
                    <div class="flex-1 p-5 overflow-y-auto space-y-5">
                      <div>
                        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider font-candy">Recipient photo (recipient_photo_url)</label>
                        <div class="w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition shadow-sm">
                          <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          <span class="text-xs font-bold">Tap to open camera</span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider font-candy">Recipient signature (signature_url)</label>
                        <div class="w-full h-32 bg-white border border-gray-200 rounded-2xl shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                          <span class="text-gray-200 font-bold text-xl select-none absolute">SIGN HERE</span>
                          <div class="w-full border-b-2 border-gray-100 absolute bottom-6"></div>
                        </div>
                      </div>
                    </div>
                    <div class="p-5 bg-white border-t border-gray-100">
                      <button class="w-full bg-[#598E18] hover:bg-[#476021] text-white py-3.5 rounded-full font-bold font-candy tracking-wide shadow-lg text-base transition-all">Submit e-POD</button>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- 4. FLEET STATUS -->
            @if (subTab() === 'l-status') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Fleet &amp; driver status</h3>
                  <button [class]="btnGold + ' font-candy flex items-center gap-2'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    Add vehicle
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40 flex items-center gap-4">
                    <div class="p-3 bg-white/10 text-white rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-white/55">Active fleet</p>
                      <p class="text-2xl font-extrabold">4 units</p>
                    </div>
                  </div>

                  <div class="bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee] flex items-center gap-4">
                    <div class="p-3 bg-[#22d3ee]/20 text-[#7fe7f7] rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-[#7fe7f7]">On delivery run</p>
                      <p class="text-2xl font-extrabold">2 vans</p>
                    </div>
                  </div>

                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d] flex items-center gap-4">
                    <div class="p-3 bg-[#9be15d]/20 text-[#b7f27c] rounded-xl">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-[#b7f27c]">Available at depot</p>
                      <p class="text-2xl font-extrabold">2 units</p>
                    </div>
                  </div>
                </div>

                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Vehicle unit</th>
                        <th class="py-4 px-6 font-medium">Assigned driver</th>
                        <th class="py-4 px-6 font-medium">Current active trip</th>
                        <th class="py-4 px-6 font-medium">Capacity</th>
                        <th class="py-4 px-6 font-medium">Status</th>
                        <th class="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium">
                      @for (v of fleet; track v.unit) {
                        <tr [class]="v.onRoute && v.action === 'gps' ? 'bg-white/5 hover:bg-white/10 transition-colors' : 'hover:bg-white/5 transition-colors'">
                          <td [class]="'py-4 px-6 font-extrabold ' + (v.action === 'gps' ? 'shadow-[inset_4px_0_0_#9be15d]' : '')">{{ v.unit }}</td>
                          <td class="py-4 px-6 text-xs font-bold text-white/85">{{ v.driver }}<br><span class="text-[11px] text-white/45 font-normal">{{ v.driverSub }}</span></td>
                          <td [class]="'py-4 px-6 text-xs ' + (v.trip ? 'font-bold text-[#7fe7f7]' : 'text-white/40 italic font-semibold')">{{ v.trip || v.idle }}</td>
                          <td class="py-4 px-6 text-xs text-white/55 font-bold">{{ v.capacity }}</td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + (v.onRoute ? chipCyan : chipLime)">{{ v.onRoute ? 'ON ROUTE' : 'AVAILABLE' }}</span></td>
                          <td class="py-4 px-6 text-right">
                            @if (v.action === 'gps') { <button [class]="btnGhost">🎯 Track GPS</button> }
                            @else if (v.action === 'courier') { <button [class]="btnGhost">🔗 Courier link</button> }
                            @else { <button [class]="btnGold">Assign Trip</button> }
                          </td>
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
            <defs><linearGradient id="lgRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#lgRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="lgStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#lgStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="lgGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="lgDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#lgDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#lgGlz)"/>
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
export class LogisticsComponent {
  subTab = signal<string>('l-routes');

  // Tab, button and chip styles (defined before the arrays that use them)
  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';
  btnGold = 'px-4 py-2 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors';
  btnGhost = 'px-4 py-2 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors';
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';

  routes = [
    { dr: 'DR-2026-088', order: 'ORD-2026-102', dest: 'Supermart Downtown', addr: '45 City Center Road', courier: 'In-House Fleet', courierSub: 'Van 1 (Mike D.)', track: false, status: 'DISPATCHED', chip: this.chipCyan, done: false },
    { dr: 'DR-2026-089', order: 'ORD-2026-103', dest: 'Local Grocers Inc.', addr: '88 Suburban Ave', courier: 'Lalamove', courierSub: '', track: true, status: 'DISPATCHED', chip: this.chipCyan, done: false },
    { dr: 'DR-2026-085', order: 'ORD-2026-095', dest: 'Sweet Shop Metro', addr: '123 Retail Ave', courier: 'In-House Fleet', courierSub: 'Van 2 (Sarah J.)', track: false, status: '✓ FULFILLED', chip: this.chipLime, done: true }
  ];

  dispatch = [
    { dr: 'DR-2026-090', order: 'ORD-2026-104', dest: 'Sweet Shop Metro', addr: '123 Retail Ave, City', qty: '50 packs' },
    { dr: 'DR-2026-091', order: 'ORD-2026-105', dest: 'Candy Corner Central', addr: 'Level 2, Main Mall', qty: '120 packs' }
  ];

  pods = [
    { dr: 'DR-2026-088', order: 'ORD-2026-102', dest: 'Supermart Downtown', addr: '45 City Center Road', courier: 'In-House Fleet', courierSub: 'Van 1 (Mike D.)', track: false, uploaded: false, action: 'active' },
    { dr: 'DR-2026-089', order: 'ORD-2026-103', dest: 'Local Grocers Inc.', addr: '88 Suburban Ave', courier: 'Lalamove', courierSub: '', track: true, uploaded: false, action: 'select' },
    { dr: 'DR-2026-085', order: 'ORD-2026-095', dest: 'Sweet Shop Metro', addr: '123 Retail Ave', courier: 'In-House Fleet', courierSub: 'Van 2 (Sarah J.)', track: false, uploaded: true, action: 'done' }
  ];

  fleet = [
    { unit: 'Van 1 (Plate: NCV-881)', driver: 'Mike D.', driverSub: '+63 917 555 0192', trip: 'DR-2026-088 (Supermart)', idle: '', capacity: '500 kg max', onRoute: true, action: 'gps' },
    { unit: 'Van 2 (Plate: NCV-882)', driver: 'Sarah J.', driverSub: '+63 918 555 0193', trip: '', idle: 'None (Returned)', capacity: '500 kg max', onRoute: false, action: 'assign' },
    { unit: 'Motorcycle 1 (Plate: MC-104)', driver: 'Third-Party (Lalamove)', driverSub: 'Partner Courier', trip: 'DR-2026-089 (Local Grocers)', idle: '', capacity: '50 kg max', onRoute: true, action: 'courier' },
    { unit: 'Truck 1 (Plate: TCK-301)', driver: 'Mario B.', driverSub: '+63 919 555 0194', trip: '', idle: 'None (Depot)', capacity: '2,000 kg max', onRoute: false, action: 'assign' }
  ];
}