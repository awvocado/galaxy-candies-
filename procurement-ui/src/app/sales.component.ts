import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      app-sales { display: block; }
      .sales-page { font-family: 'Nunito', sans-serif; }
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

    <div class="sales-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">🛒</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy sweet shop</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Sales &amp; POS management</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + search -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-candy">
            <div class="flex flex-wrap gap-2">
              <button (click)="subTab.set('s-active')" [ngClass]="subTab() === 's-active' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Active Orders</button>
              <button (click)="subTab.set('s-pos')" [ngClass]="subTab() === 's-pos' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">POS Terminal</button>
              <button (click)="subTab.set('s-payment')" [ngClass]="subTab() === 's-payment' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Payment Validation</button>
              <button (click)="subTab.set('s-inv')" [ngClass]="subTab() === 's-inv' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Invoice Generation</button>
            </div>

            <div class="relative w-full md:w-72">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search order ID, customer..." aria-label="Search order ID or customer"
                class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
            </div>
          </div>

          <div class="p-8">

            <!-- 1. ACTIVE ORDERS -->
            @if (subTab() === 's-active') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Order capture &amp; payment validation</h3>
                  <div class="bg-white/10 border border-white/15 px-5 py-3 rounded-full flex items-center gap-3">
                    <span class="relative flex h-2.5 w-2.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
                    </span>
                    <div>
                      <p class="text-[11px] font-semibold text-white/55 font-candy">Available sellable stock</p>
                      <p class="text-sm font-extrabold text-[#9be15d]">{{ sellableStock() }} packs <span class="text-xs text-white/55 font-medium">(Mango Candy)</span></p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div class="lg:col-span-2 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                        <tr>
                          <th class="py-4 px-6 font-medium">Order ID</th>
                          <th class="py-4 px-6 font-medium">Customer details</th>
                          <th class="py-4 px-6 font-medium">Order qty</th>
                          <th class="py-4 px-6 font-medium">Total amount</th>
                          <th class="py-4 px-6 font-medium">Stock status</th>
                          <th class="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-sans font-medium">
                        @for (o of orders; track o.id) {
                          <tr class="hover:bg-white/5 transition-colors">
                            <td class="py-4 px-6 font-extrabold">{{ o.id }}</td>
                            <td class="py-4 px-6 text-xs font-bold text-white/85">{{ o.cust }}<br><span class="text-[11px] text-white/45 font-normal">{{ o.addr }}</span></td>
                            <td class="py-4 px-6 font-bold text-white/75">{{ o.qty }}</td>
                            <td class="py-4 px-6 font-extrabold">{{ o.total }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + chipGold">AWAITING PAYMENT</span></td>
                            <td class="py-4 px-6 text-right"><button [class]="btnGold">Validate Payment</button></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Logistics hand-off -->
                  <div class="glass-panel p-6 rounded-3xl">
                    <div class="flex items-center gap-2 mb-4 font-candy">
                      <svg class="w-5 h-5 text-[#EAC224]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                      <h4 class="font-candy text-lg font-semibold">Logistics hand-off</h4>
                    </div>

                    <div class="space-y-3 font-sans">
                      @for (l of handoffs; track l.id) {
                        <div class="bg-black/20 p-4 rounded-2xl border border-white/10">
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-extrabold">{{ l.id }}</span>
                            <span [class]="'px-2.5 py-1 rounded-full text-[10px] font-bold border ' + chipLime">ALLOCATED</span>
                          </div>
                          <p class="text-[11px] text-white/55 mb-2 font-medium">{{ l.desc }}</p>
                          <div class="flex justify-between items-center pt-2 border-t border-white/10 text-[11px]">
                            <span class="text-white/45 font-mono font-bold">{{ l.dr }}</span>
                            <span class="text-[#9be15d] font-bold">✓ Pushed to Fleet</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- 2. POS TERMINAL -->
            @if (subTab() === 's-pos') {
              <div class="flex flex-col lg:flex-row gap-8 font-candy">
                <div class="flex-1">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 class="text-2xl font-semibold">Point of sale (POS)</h3>
                    <div class="flex gap-2 text-xs font-semibold">
                      <span class="px-4 py-2 bg-[#EAC224] text-[#2d3e15] rounded-full">All Products</span>
                      <span class="px-4 py-2 bg-white/10 text-white/70 border border-white/15 rounded-full">Candies</span>
                      <span class="px-4 py-2 bg-white/10 text-white/70 border border-white/15 rounded-full">Bulk/Wholesale</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                    @for (p of products; track p.sku) {
                      <div [class]="'glass-panel p-5 rounded-3xl flex flex-col justify-between relative transition-all ' + (p.out ? 'opacity-60' : 'hover:border-[#EAC224]/60 hover:-translate-y-0.5 cursor-pointer')">
                        <span [class]="'absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold border ' + (p.out ? chipRed : chipLime)">{{ p.stock }}</span>
                        <div>
                          <div class="h-20 flex items-center justify-center text-white/30 mb-2"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                          <p class="font-semibold text-sm font-candy">{{ p.name }}</p>
                          <p class="text-[11px] text-white/45 font-mono mb-2 font-bold">SKU: {{ p.sku }}</p>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-white/10">
                          <span class="font-extrabold text-base">{{ p.price }}</span>
                          <button [disabled]="p.out" [attr.aria-label]="'Add ' + p.name"
                            [class]="p.out ? 'w-8 h-8 bg-white/10 text-white/30 rounded-full flex items-center justify-center font-bold text-lg cursor-not-allowed' : 'w-8 h-8 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full flex items-center justify-center font-bold text-lg transition-colors'">+</button>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Cart -->
                <div class="glass-panel w-full lg:w-96 p-6 rounded-3xl flex flex-col justify-between font-sans">
                  <div>
                    <div class="flex justify-between items-center mb-4 font-candy">
                      <span class="font-semibold text-[#EAC224] text-sm">Walk-in customer</span>
                      <a href="#" class="text-xs text-[#9be15d] font-bold hover:underline">Add customer</a>
                    </div>

                    <div class="bg-black/20 p-4 rounded-2xl border border-white/10 mb-6">
                      <div class="flex justify-between items-start mb-3">
                        <p class="font-semibold text-sm font-candy">Mango Candy (Single Pack)</p>
                        <span class="font-extrabold text-sm whitespace-nowrap ml-2">₱ 2,500.00</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <p class="text-[11px] text-white/45 font-semibold">₱ 50.00 / ea</p>
                        <div class="flex items-center gap-3">
                          <button aria-label="Decrease quantity" class="bg-white/10 w-7 h-7 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path></svg>
                          </button>
                          <span class="font-extrabold text-sm text-center">50</span>
                          <button aria-label="Increase quantity" class="bg-white/10 w-7 h-7 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-2 text-xs text-white/65 font-semibold pt-2 border-t border-white/10">
                      <div class="flex justify-between"><span>Subtotal</span><span>₱ 2,500.00</span></div>
                      <div class="flex justify-between"><span>Discount</span><span>₱ 0.00</span></div>
                      <div class="flex justify-between"><span>Tax (VAT 12%)</span><span>₱ 300.00</span></div>
                      <div class="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/15">
                        <span>Total</span>
                        <span class="text-[#EAC224]">₱ 2,800.00</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6">
                    <button class="w-full font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] py-3.5 rounded-full font-semibold text-base shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      Pay &amp; Allocate
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- 3. PAYMENT VALIDATION -->
            @if (subTab() === 's-payment') {
              <div class="space-y-6">
                <h3 class="font-candy text-2xl font-semibold">Pending payment verifications</h3>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div class="lg:col-span-2 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                        <tr>
                          <th class="py-4 px-6 font-medium">Order ID</th>
                          <th class="py-4 px-6 font-medium">Customer</th>
                          <th class="py-4 px-6 font-medium">Method</th>
                          <th class="py-4 px-6 font-medium">Amount</th>
                          <th class="py-4 px-6 font-medium">Status</th>
                          <th class="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-sans font-medium">
                        @for (p of payments; track p.id) {
                          <tr [class]="p.selected ? 'bg-white/5 hover:bg-white/10 transition-colors' : 'hover:bg-white/5 transition-colors'">
                            <td [class]="'py-4 px-6 font-extrabold ' + (p.selected ? 'shadow-[inset_4px_0_0_#9be15d]' : '')">{{ p.id }}</td>
                            <td class="py-4 px-6 font-bold text-white/85 text-xs">{{ p.cust }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-xs font-bold border ' + p.methodChip">{{ p.method }}</span></td>
                            <td class="py-4 px-6 font-extrabold">{{ p.amount }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + p.statusChip">{{ p.status }}</span></td>
                            <td class="py-4 px-6 text-right">
                              @if (p.action === 'arrow') {
                                <span class="text-[#EAC224] font-bold text-lg">&gt;</span>
                              } @else if (p.action === 'review') {
                                <button [class]="btnGhost">Review</button>
                              } @else {
                                <span class="text-xs text-white/50 italic font-bold">Allocated</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Verification details -->
                  <div class="glass-panel p-6 rounded-3xl flex flex-col justify-between font-sans">
                    <div>
                      <div class="flex justify-between items-center mb-3">
                        <h4 class="font-candy text-base font-semibold">Verification details</h4>
                        <span [class]="'px-2.5 py-0.5 rounded-full text-[10px] font-bold border ' + chipLime">Trigger 4 payload</span>
                      </div>
                      <p class="text-xs text-white/65 font-bold mb-4 font-candy">ORD-2026-104 • Sweet Shop Metro</p>

                      <div class="bg-black/20 border border-dashed border-white/25 rounded-2xl p-6 flex flex-col items-center justify-center mb-4">
                        <svg class="w-10 h-10 text-white/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p class="text-xs font-bold text-white/85">BDO_Transfer_Receipt.pdf</p>
                        <a href="#" class="text-[11px] text-[#9be15d] underline font-bold mt-1">View full screen</a>
                      </div>

                      <div class="space-y-3 text-xs mb-6">
                        <div class="flex justify-between"><span class="text-white/50 font-bold">Expected amount</span><span class="font-extrabold text-sm">₱ 2,500.00</span></div>
                        <div class="flex justify-between"><span class="text-white/50 font-bold">Payment method</span><span class="font-bold text-white/85">BDO Bank Transfer</span></div>
                        <div class="flex justify-between items-center"><span class="text-white/50 font-bold">Reference no.</span><span [class]="'font-mono px-2 py-0.5 rounded-full font-bold border ' + chipGold">TXN-99812A4</span></div>

                        <div class="pt-2">
                          <label class="block text-xs text-white/55 mb-1.5 font-candy">Verify received amount</label>
                          <input type="text" value="₱ 2500.00" class="w-full px-4 py-3 bg-white/10 border border-[#9be15d]/60 rounded-full text-sm font-extrabold text-white outline-none focus:border-[#9be15d]">
                        </div>
                      </div>
                    </div>

                    <div>
                      <p class="text-[11px] text-[#ffb4b7] font-medium mb-3">⚠️ Validating payment will reserve 50 packs of Mango Candy and automatically push a Delivery Request ticket to Logistics.</p>
                      <div class="flex gap-3">
                        <button [class]="'flex-1 py-3 ' + btnDanger">Reject</button>
                        <button [class]="'flex-1 py-3 ' + btnGold">✓ Validate &amp; Allocate</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- 4. INVOICE GENERATION -->
            @if (subTab() === 's-inv') {
              <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 class="font-candy text-2xl font-semibold">Billing &amp; invoicing</h3>
                  <button class="px-5 py-2.5 bg-white/10 border border-white/15 hover:bg-white/20 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors font-candy">
                    <span class="text-lg leading-none">+</span> Manual draft
                  </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div class="lg:col-span-2 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                        <tr>
                          <th class="py-4 px-6 font-medium">Document no.</th>
                          <th class="py-4 px-6 font-medium">Customer</th>
                          <th class="py-4 px-6 font-medium">Date</th>
                          <th class="py-4 px-6 font-medium">Amount</th>
                          <th class="py-4 px-6 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-sans font-medium">
                        @for (i of invoices; track i.no) {
                          <tr [class]="i.selected ? 'bg-white/5 hover:bg-white/10 transition-colors' : 'hover:bg-white/5 transition-colors'">
                            <td [class]="'py-4 px-6 font-extrabold ' + (i.selected ? 'shadow-[inset_4px_0_0_#9be15d]' : '')">{{ i.no }}</td>
                            <td class="py-4 px-6 text-xs font-bold text-white/85">{{ i.cust }}<br><span class="text-[11px] text-white/45 font-normal">{{ i.order }}</span></td>
                            <td class="py-4 px-6 text-xs text-white/55">{{ i.date }}</td>
                            <td class="py-4 px-6 font-extrabold">{{ i.amount }}</td>
                            <td class="py-4 px-6"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + i.chip">{{ i.status }}</span></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Invoice preview: stays a light "paper" document -->
                  <div class="bg-[#fffdf3] text-gray-800 p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between font-sans">
                    <div>
                      <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 gap-2">
                        <button class="px-3 py-1.5 border border-gray-200 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-gray-50 bg-white">🖨️ Print</button>
                        <button class="px-3 py-1.5 border border-gray-200 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-gray-50 bg-white">📥 PDF</button>
                        <button class="px-3 py-1.5 bg-[#476021] text-white rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-[#364a19]">✉️ Email</button>
                      </div>

                      <div class="bg-white p-5 rounded-2xl border border-gray-100 text-xs space-y-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <h4 class="font-candy font-bold text-[#B4161B] text-sm">Galaxy Candies</h4>
                            <p class="text-[9px] text-gray-500 leading-tight font-medium">123 Industrial Park, Bocaue<br>Bulacan, Philippines 3020<br>TIN: 123-456-789-000</p>
                          </div>
                          <div class="text-right">
                            <p class="font-bold text-gray-800 text-sm font-candy">INVOICE</p>
                            <p class="text-[10px] text-gray-500 font-mono font-bold"># INV-2026-8902</p>
                          </div>
                        </div>

                        <div class="flex justify-between pt-2 border-t border-gray-200/60 text-[10px]">
                          <div>
                            <span class="text-gray-400 block font-bold uppercase font-candy">Bill to:</span>
                            <span class="font-bold text-gray-800">Sweet Shop Metro</span>
                            <p class="text-gray-500 font-medium">123 Retail Ave, City Center<br>contact&#64;sweetshop.com</p>
                          </div>
                          <div class="text-right">
                            <span class="text-gray-400 block font-bold uppercase font-candy">Details:</span>
                            <span class="text-gray-600 font-medium">Date: Sep 19, 2026<br>Order Ref: ORD-2026-104<br>Terms: Due on Receipt</span>
                          </div>
                        </div>

                        <div class="pt-2">
                          <table class="w-full text-left text-[11px] border-collapse">
                            <thead class="border-b border-gray-200 text-gray-400 uppercase text-[9px] font-candy">
                              <tr><th class="pb-1">Item description</th><th class="pb-1 text-right">Qty</th><th class="pb-1 text-right">Price</th><th class="pb-1 text-right">Total</th></tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 font-medium">
                              <tr>
                                <td class="py-2 font-bold text-gray-800">Mango Candy (Pack)<br><span class="text-[9px] text-gray-400 font-normal">SKU: FG-MAN-001</span></td>
                                <td class="py-2 text-right">50</td>
                                <td class="py-2 text-right">₱50.00</td>
                                <td class="py-2 text-right font-black">₱ 2,500.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div class="pt-2 border-t border-gray-200/60 text-right space-y-1 text-[11px] font-semibold">
                          <div class="flex justify-between text-gray-500"><span>Subtotal:</span><span>₱ 2,500.00</span></div>
                          <div class="flex justify-between text-gray-500"><span>VAT (12%):</span><span>₱ 300.00</span></div>
                          <div class="flex justify-between text-sm font-black text-[#476021] pt-1 border-t border-gray-200"><span>Total:</span><span>₱ 2,800.00</span></div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 text-center">
                      <p class="text-[9px] text-gray-400 font-medium">Thank you for your business!</p>
                      <p class="text-[8px] text-gray-300">accounting&#64;galaxycandies.com</p>
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
            <defs><linearGradient id="slRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#slRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="slStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#slStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="slGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="slDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#slDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#slGlz)"/>
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
export class SalesComponent {
  subTab = signal<string>('s-active');
  sellableStock = signal<number>(150);

  // Tab, button and chip styles (defined before the arrays that use them)
  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';
  btnGold = 'px-4 py-2 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors';
  btnDanger = 'border border-[#ff8a8f]/50 text-[#ffb4b7] hover:bg-[#B4161B]/25 rounded-full text-xs font-bold transition-colors';
  btnGhost = 'px-4 py-1.5 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors';
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';
  chipRed = 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50';
  chipNeutral = 'bg-white/10 text-white/80 border-white/20';

  orders = [
    { id: 'ORD-2026-104', cust: 'Sweet Shop Metro', addr: '123 Retail Ave, City', qty: '50 packs', total: '₱ 2,500.00' },
    { id: 'ORD-2026-105', cust: 'Candy Corner Central', addr: 'Level 2, Main Mall', qty: '120 packs', total: '₱ 6,000.00' }
  ];

  handoffs = [
    { id: 'ORD-2026-102', desc: 'Supermart Downtown • 30 packs', dr: 'DR-2026-088' },
    { id: 'ORD-2026-103', desc: 'Local Grocers Inc. • 20 packs', dr: 'DR-2026-089' }
  ];

  products = [
    // Existing Items
    { name: 'Mango Candy (Single Pack)', sku: 'FG-MAN-001', price: '₱ 50.00', stock: '150 In Stock', out: false },
    { name: 'Mango Candy (Box of 10)', sku: 'FG-MAN-010', price: '₱ 480.00', stock: '12 In Stock', out: false },
    { name: 'Tamarind Candy (Pack)', sku: 'FG-TAM-001', price: '₱ 55.00', stock: 'Out of Stock', out: true },
    
    // Items added from promotional material
    { name: 'Mega Ube', sku: 'FG-MUB-001', price: '₱ 45.00', stock: '100 In Stock', out: false },
    { name: 'Cookies Pack', sku: 'FG-CPA-001', price: '₱ 50.00', stock: '120 In Stock', out: false },
    { name: 'Chocolate Chip Cookies', sku: 'FG-CCC-001', price: '₱ 65.00', stock: '80 In Stock', out: false },
    { name: 'Jumbo Roll', sku: 'FG-JRO-001', price: '₱ 40.00', stock: '200 In Stock', out: false },
    { name: 'Jumbo White', sku: 'FG-JWH-001', price: '₱ 40.00', stock: '200 In Stock', out: false },
    { name: 'Pastillas Bar', sku: 'FG-PBA-001', price: '₱ 35.00', stock: '150 In Stock', out: false },
    { name: 'Yema Bar', sku: 'FG-YBA-001', price: '₱ 35.00', stock: '150 In Stock', out: false },
    { name: 'White Ube', sku: 'FG-WUB-001', price: '₱ 45.00', stock: '90 In Stock', out: false },
    { name: 'Macapuno', sku: 'FG-MAC-001', price: '₱ 45.00', stock: '110 In Stock', out: false },
    { name: 'Nidora Cheese', sku: 'FG-NCH-001', price: '₱ 55.00', stock: '60 In Stock', out: false },
    { name: 'Rainbow Pastillas', sku: 'FG-RPA-001', price: '₱ 40.00', stock: '140 In Stock', out: false },
    { name: 'Double Dutch', sku: 'FG-DDU-001', price: '₱ 60.00', stock: '75 In Stock', out: false },
    { name: 'Pandan Cheese', sku: 'FG-PCH-001', price: '₱ 45.00', stock: '85 In Stock', out: false },
    { name: 'Twix Roll', sku: 'FG-TRO-001', price: '₱ 50.00', stock: 'Out of Stock', out: true },
    { name: 'Mega Pandan', sku: 'FG-MPA-001', price: '₱ 45.00', stock: '130 In Stock', out: false },
    { name: 'Cheese Candy', sku: 'FG-CCA-001', price: '₱ 35.00', stock: '210 In Stock', out: false },
    { name: 'Langka', sku: 'FG-LAN-001', price: '₱ 45.00', stock: '140 In Stock', out: false },
    { name: 'Mega White', sku: 'FG-MWH-001', price: '₱ 45.00', stock: '100 In Stock', out: false }
  ];

  payments = [
    { id: 'ORD-2026-104', cust: 'Sweet Shop Metro', method: '🏛️ Bank Transfer', methodChip: this.chipCyan, amount: '₱ 2,500.00', status: 'NEEDS VERIFICATION', statusChip: this.chipGold, action: 'arrow', selected: true },
    { id: 'ORD-2026-105', cust: 'Candy Corner Central', method: '📱 GCash', methodChip: this.chipCyan, amount: '₱ 6,000.00', status: 'NEEDS VERIFICATION', statusChip: this.chipGold, action: 'review', selected: false },
    { id: 'ORD-2026-102', cust: 'Supermart Downtown', method: '💵 Cash', methodChip: this.chipNeutral, amount: '₱ 1,500.00', status: '✓ VERIFIED', statusChip: this.chipLime, action: 'done', selected: false }
  ];

  invoices = [
    { no: 'INV-2026-8902', cust: 'Sweet Shop Metro', order: 'ORD-2026-104', date: 'Today, 10:45 AM', amount: '₱ 2,800.00', status: 'GENERATED', chip: this.chipLime, selected: true },
    { no: 'INV-2026-8901', cust: 'Supermart Downtown', order: 'ORD-2026-102', date: 'Yesterday', amount: '₱ 1,500.00', status: '✈️️ SENT', chip: this.chipCyan, selected: false },
    { no: 'INV-2026-8900', cust: 'Local Grocers Inc.', order: 'ORD-2026-103', date: 'Sep 17, 2026', amount: '₱ 9,250.00', status: '✈️ SENT', chip: this.chipCyan, selected: false }
  ];
}