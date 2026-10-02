import { Component, ChangeDetectionStrategy, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditEvent {
  time: string;
  user: string;
  module: string;
  action: string;
  record: string;
  details: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      app-settings { display: block; }
      .se-page { font-family: 'Nunito', sans-serif; }
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

    <div class="se-page min-h-screen bg-[#dfe9c6] px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-4">
            <span class="text-base">⚙️</span>
            <span class="font-candy text-xs font-semibold text-[#EAC224] tracking-wider">Galaxy control room</span>
          </div>
          <h2 class="font-candy text-4xl md:text-5xl font-semibold tracking-wide">Settings</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs -->
          <div class="border-b border-white/10 px-8 pt-6 pb-4 flex flex-wrap gap-2 font-candy">
            <button (click)="activeTab.set('audit')" [ngClass]="activeTab() === 'audit' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Audit Trail</button>
            <button (click)="activeTab.set('audit-settings')" [ngClass]="activeTab() === 'audit-settings' ? activeCls : idleCls" class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Audit Settings</button>
          </div>

          <div class="p-8">

            <!-- 1. AUDIT TRAIL -->
            @if (activeTab() === 'audit') {
              <div class="space-y-6">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h3 class="font-candy text-2xl font-semibold mb-1">Audit trail</h3>
                    <p class="text-sm text-white/55 font-sans">A chronological record of who did what, and when, across every module.</p>
                  </div>
                  <button (click)="exportCsv()" class="bg-white/10 border border-white/15 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 font-candy">
                    📥 Export CSV
                  </button>
                </div>

                <!-- Summary -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
                    <span class="text-xs font-bold text-white/55 block mb-1">Events logged</span>
                    <span class="text-2xl font-extrabold">{{ events.length }}</span>
                  </div>
                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224]">
                    <span class="text-xs font-bold text-[#EAC224] block mb-1">Events today</span>
                    <span class="text-2xl font-extrabold text-[#EAC224]">{{ todayCount }}</span>
                  </div>
                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <span class="text-xs font-bold text-[#b7f27c] block mb-1">Active users</span>
                    <span class="text-2xl font-extrabold text-[#9be15d]">{{ userCount }}</span>
                  </div>
                </div>

                <!-- Filters -->
                <div class="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                  <div class="flex flex-wrap gap-2 text-xs font-semibold font-candy">
                    @for (m of modules; track m) {
                      <button (click)="moduleFilter.set(m)" [ngClass]="moduleFilter() === m ? activeCls : idleCls" class="px-4 py-2 rounded-full border border-white/15 transition-all">{{ m === 'all' ? 'All modules' : m }}</button>
                    }
                  </div>
                  <div class="relative w-full xl:w-80">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" [value]="search()" (input)="search.set($any($event.target).value)"
                      placeholder="Search user, record, details..." aria-label="Search audit trail"
                      class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
                  </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white/50 text-[13px] font-candy border-b border-white/10">
                      <tr>
                        <th class="py-4 px-6 font-medium">Timestamp</th>
                        <th class="py-4 px-6 font-medium">User</th>
                        <th class="py-4 px-6 font-medium">Module</th>
                        <th class="py-4 px-6 font-medium">Action</th>
                        <th class="py-4 px-6 font-medium">Record</th>
                        <th class="py-4 px-6 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-sans font-medium text-xs">
                      @for (e of filteredEvents(); track e.time + e.record + e.action) {
                        <tr class="hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6 text-white/55">{{ e.time }}</td>
                          <td class="py-4 px-6 font-bold text-sm">{{ e.user }}</td>
                          <td class="py-4 px-6"><span class="px-3 py-1 rounded-full bg-white/10 text-white/75 text-[11px] font-bold">{{ e.module }}</span></td>
                          <td class="py-4 px-6"><span [class]="'px-3 py-1 rounded-full text-[11px] font-bold border ' + chipFor(e.action)">{{ e.action }}</span></td>
                          <td class="py-4 px-6 font-extrabold">{{ e.record }}</td>
                          <td class="py-4 px-6 text-white/65 max-w-md truncate" [attr.title]="e.details">{{ e.details }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>

                  @if (filteredEvents().length === 0) {
                    <p class="py-10 text-center text-sm text-white/50 font-sans">No events match your filters.</p>
                  }
                </div>

                <p class="text-xs text-white/45 font-sans">Showing {{ filteredEvents().length }} of {{ events.length }} events. Entries are sample data for now.</p>
              </div>
            }

            <!-- 2. AUDIT SETTINGS -->
            @if (activeTab() === 'audit-settings') {
              <div class="space-y-6 max-w-3xl">
                <div>
                  <h3 class="font-candy text-2xl font-semibold mb-1">Audit settings</h3>
                  <p class="text-sm text-white/55 font-sans">Choose what the audit trail records and how long it is kept.</p>
                </div>

                <div class="bg-black/20 rounded-3xl border border-white/10 divide-y divide-white/10">
                  @for (o of options; track o.key) {
                    <div class="flex items-center justify-between gap-6 p-5">
                      <div>
                        <p class="font-candy font-semibold text-base">{{ o.label }}</p>
                        <p class="text-xs text-white/50 font-sans mt-0.5">{{ o.desc }}</p>
                      </div>
                      <button type="button" role="switch" [attr.aria-checked]="toggles()[o.key]" [attr.aria-label]="o.label"
                        (click)="toggle(o.key)"
                        [class]="'relative shrink-0 w-12 h-7 rounded-full transition-colors ' + (toggles()[o.key] ? 'bg-[#9be15d]' : 'bg-white/20')">
                        <span [class]="'absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ' + (toggles()[o.key] ? 'translate-x-5' : '')"></span>
                      </button>
                    </div>
                  }

                  <div class="flex items-center justify-between gap-6 p-5">
                    <div>
                      <p class="font-candy font-semibold text-base">Retention period</p>
                      <p class="text-xs text-white/50 font-sans mt-0.5">Audit entries older than this are archived.</p>
                    </div>
                    <select aria-label="Retention period" (change)="retention.set($any($event.target).value)"
                      class="px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d]">
                      @for (r of retentionOptions; track r) {
                        <option [value]="r" [selected]="retention() === r">{{ r }} days</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <button (click)="save()" class="font-candy tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-8 py-3 rounded-full font-semibold shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors">Save audit settings</button>
                  @if (saved()) {
                    <span class="text-sm text-[#9be15d] font-bold font-sans">✓ Saved</span>
                  }
                </div>
              </div>
            }

          </div>
        </div>

        <!-- ========== ROCKET & CANDIES SPILLING OVER THE PANEL EDGES ========== -->

        <div class="a-rocket hidden md:block absolute z-20 -top-14 right-[12%] w-24 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none">
            <defs><linearGradient id="seRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#seRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="seStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#seStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="seGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="seDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#seDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#seGlz)"/>
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
export class SettingsComponent {
  activeTab = signal<'audit' | 'audit-settings'>('audit');

  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';

  // ---- Audit trail ----
  moduleFilter = signal<string>('all');
  search = signal<string>('');
  modules = ['all', 'Sales', 'QA', 'Production', 'Procurement', 'Warehouse', 'Logistics', 'System'];

  // Sample entries. Replace with data from your backend.
  events: AuditEvent[] = [
    { time: '2026-09-19 11:00', user: 'System (Trigger 4)', module: 'Sales', action: 'ALLOCATE', record: 'ORD-2026-104', details: 'Reserved 50 packs of Mango Candy and generated a delivery request.' },
    { time: '2026-09-19 10:45', user: 'Lorenz', module: 'Sales', action: 'CREATE', record: 'INV-2026-8902', details: 'Invoice generated for Sweet Shop Metro (₱ 2,800.00).' },
    { time: '2026-09-19 09:30', user: 'System (Trigger 3)', module: 'QA', action: 'APPROVE', record: 'FG-RUN-402', details: 'Cleared 150 packs of Mango Candy to sellable stock.' },
    { time: '2026-09-19 09:29', user: 'System (Trigger 3)', module: 'Production', action: 'UPDATE', record: 'FG-RUN-402', details: 'Deducted 150 packaging pouches from raw stock (BOM).' },
    { time: '2026-09-19 08:05', user: 'Lorenz', module: 'Procurement', action: 'CREATE', record: 'PO-2026-010', details: 'Purchase order for 210 packaging pouches submitted for approval.' },
    { time: '2026-09-18 15:00', user: 'System (Trigger 2)', module: 'QA', action: 'APPROVE', record: 'BAT-2609-02', details: 'Inbound QA passed for Refined Sugar (500 kg).' },
    { time: '2026-09-18 14:30', user: 'Mike D.', module: 'Procurement', action: 'CREATE', record: 'GRN-2026-0150', details: 'Received Mango Puree (150 L) at Loading Dock A.' },
    { time: '2026-09-18 13:10', user: 'Lorenz', module: 'QA', action: 'REJECT', record: 'BAT-2609-08', details: 'Quarantined Mango Candy Pouches: punctured seals on 45% of the lot.' },
    { time: '2026-09-18 11:20', user: 'Mike D.', module: 'Logistics', action: 'UPDATE', record: 'DR-2026-088', details: 'Dispatched on Van 1 to Supermart Downtown.' },
    { time: '2026-09-18 09:02', user: 'Lorenz', module: 'System', action: 'LOGIN', record: 'Session', details: 'Signed in from a trusted device.' },
    { time: '2026-09-17 16:40', user: 'Lorenz', module: 'Warehouse', action: 'EXPORT', record: 'Stock ledger', details: 'Exported the stock movement audit log.' }
  ];

  todayCount = this.events.filter(e => e.time.startsWith('2026-09-19')).length;
  userCount = new Set(this.events.map(e => e.user.startsWith('System') ? 'System' : e.user)).size;

  filteredEvents = computed(() => {
    const mod = this.moduleFilter();
    const q = this.search().trim().toLowerCase();
    return this.events.filter(e =>
      (mod === 'all' || e.module === mod) &&
      (!q || `${e.user} ${e.module} ${e.action} ${e.record} ${e.details}`.toLowerCase().includes(q))
    );
  });

  private chips: Record<string, string> = {
    CREATE: 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30',
    UPDATE: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35',
    APPROVE: 'bg-[#2dd4bf]/15 text-[#7ff0e0] border-[#2dd4bf]/35',
    REJECT: 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50',
    ALLOCATE: 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35',
    LOGIN: 'bg-white/10 text-white/80 border-white/20',
    EXPORT: 'bg-white/10 text-white/80 border-white/20'
  };

  chipFor(action: string): string {
    return this.chips[action] ?? 'bg-white/10 text-white/80 border-white/20';
  }

  exportCsv(): void {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ['Timestamp', 'User', 'Module', 'Action', 'Record', 'Details'],
      ...this.filteredEvents().map(e => [e.time, e.user, e.module, e.action, e.record, e.details])
    ];
    const csv = rows.map(r => r.map(esc).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-trail.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- Audit settings ----
  options = [
    { key: 'signins', label: 'Log sign-ins and sign-outs', desc: 'Record when users sign in or out of the system.' },
    { key: 'changes', label: 'Log record changes', desc: 'Record every create, update, approve and reject action.' },
    { key: 'system', label: 'Log automated triggers', desc: 'Record actions performed by system triggers such as allocations and QA clearance.' },
    { key: 'exports', label: 'Log data exports', desc: 'Record whenever a report or CSV is exported.' },
    { key: 'alerts', label: 'Email me on rejected or deleted records', desc: 'Send an alert when a batch is rejected or a record is removed.' }
  ];

  toggles = signal<Record<string, boolean>>({ signins: true, changes: true, system: true, exports: true, alerts: false });
  retentionOptions = ['30', '90', '180', '365'];
  retention = signal<string>('90');
  saved = signal<boolean>(false);

  toggle(key: string): void {
    this.toggles.update(t => ({ ...t, [key]: !t[key] }));
    this.saved.set(false);
  }

  save(): void {
    // Hook this up to your backend when it is ready.
    this.saved.set(true);
  }
}