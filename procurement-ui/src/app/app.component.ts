import { ChangeDetectionStrategy, Component, signal, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './api.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
      
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        background-color: #f4f7f6;
        background-image: radial-gradient(at 0% 0%, hsla(333,83%,86%,0.4) 0px, transparent 50%),
                          radial-gradient(at 96% 11%, hsla(140,43%,82%,0.4) 0px, transparent 50%),
                          radial-gradient(at 100% 95%, hsla(43,89%,83%,0.4) 0px, transparent 50%),
                          radial-gradient(at 5% 96%, hsla(199,84%,84%,0.4) 0px, transparent 50%);
        font-family: 'Nunito', sans-serif;
      }

      .font-candy { font-family: 'Fredoka', sans-serif; }
      
      .glass-panel {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.6);
      }
      
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      @keyframes pageFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes shimmer { to { background-position: 200% center; } }
      @keyframes logo-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
      @keyframes glow-pulse { 0%,100% { opacity: .4; transform: scale(.85); } 50% { opacity: .8; transform: scale(1.1); } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }

      .page-animate { animation: pageFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .a-shimmer { background: linear-gradient(100deg, #EAC224 0%, #fff3b0 35%, #EAC224 55%, #ff9d1c 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: shimmer 4s linear infinite; }
      .a-logo { animation: logo-float 4s ease-in-out infinite; }
      .a-glow { animation: glow-pulse 3.5s ease-in-out infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
    </style>

    <!-- LOGOUT CONFIRMATION MODAL (For Manager Dashboard) -->
    @if (logoutModalShow()) {
      <div class="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4 font-candy">
          <div class="w-16 h-16 bg-[#B4161B]/20 text-[#ffb4b7] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B4161B]/50">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-white">Sign Out?</h3>
          <p class="text-white/70 text-sm font-medium">Are you sure you want to end your current session?</p>
          <div class="flex justify-center gap-3 pt-4">
            <button (click)="logoutModalShow.set(false)" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer w-full">Cancel</button>
            <button (click)="executeLogout()" class="px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-lg bg-[#B4161B] text-white hover:bg-[#8f1115] w-full">Yes, Sign Out</button>
          </div>
        </div>
      </div>
    }

    <!-- Hide Nav globally for standalone/terminal apps (including the new owner dashboard) -->
    @if (!isStandaloneRoute) {
      <div class="min-h-screen p-4 md:p-6 lg:p-8">
        
        <nav class="bg-[#476021] text-white rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-green-900/10 mb-8 max-w-[1400px] mx-auto">
          <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center mr-1 ml-1">
              <span class="a-glow absolute -inset-2 rounded-full bg-[#EAC224] blur-md"></span>
              <img src="logo.png" alt="Galaxy Candies Logo" class="a-logo relative w-10 h-10 object-contain drop-shadow-lg">
              <svg class="a-twinkle absolute -top-1 -right-2 w-3.5" viewBox="0 0 24 24" fill="#EAC224"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>
            </div>
            <h1 class="font-candy text-xl md:text-2xl font-extrabold tracking-wide text-white drop-shadow-sm">
              <span class="a-shimmer">Galaxy</span> Candies and Snacks
            </h1>
          </div>
          
          <div class="hidden lg:flex items-center gap-1 font-candy font-extrabold text-[15px]">
            <a routerLink="/dashboard" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">Dashboard</a>
            <a routerLink="/procurement" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">Procurement</a>
            <a routerLink="/warehouse" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">Warehouse</a>
            <a routerLink="/qa" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">QA</a>
            <a routerLink="/sales" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">Sales</a>
            <a routerLink="/logistics" routerLinkActive="!bg-white !text-[#476021] shadow-md pointer-events-none" class="px-5 py-2 rounded-full text-white transition-all duration-200 hover:bg-white/20">Logistics</a>
          </div>

          <div class="flex items-center gap-4 ml-8">
            <div class="hidden md:flex items-center gap-3 bg-[#364a19] px-4 py-1.5 rounded-full">
              <div class="w-8 h-8 bg-[#EAC224] rounded-full flex items-center justify-center text-lg border-2 border-white">👨‍💼</div>
              <span class="font-candy font-semibold">{{ userName() }}</span>
            </div>

            <div class="relative">
              <button (click)="showNotifications.set(!showNotifications())" class="w-10 h-10 bg-[#364a19] rounded-full flex items-center justify-center hover:bg-[#2b3a14] transition-colors relative cursor-pointer" title="Notifications">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                @if (unreadCount() > 0) {
                  <span class="absolute -top-1 -right-1 bg-[#B4161B] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#476021]">{{ unreadCount() }}</span>
                }
              </button>

              @if (showNotifications()) {
                <div class="absolute right-0 mt-2 w-96 bg-[#2d3e15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div class="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1d2f0d]">
                    <div class="flex items-center gap-2">
                      <span class="text-[#EAC224]">🔔</span>
                      <span class="font-candy font-bold text-white">Notifications</span>
                      @if (unreadCount() > 0) {
                        <span class="bg-[#EAC224]/20 text-[#EAC224] text-[10px] font-bold px-2 py-0.5 rounded-full">{{ unreadCount() }} new</span>
                      }
                    </div>
                    <button (click)="markAllRead($event)" class="text-xs text-white/50 hover:text-white transition-colors cursor-pointer">Mark all read</button>
                  </div>

                  <div class="max-h-[26rem] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                    @for (notif of notifications(); track notif.id) {
                      <div [class]="'p-5 transition-colors hover:bg-white/5 ' + (notif.is_read ? 'opacity-60' : 'bg-white/[0.02]')">
                        <div class="flex items-start gap-4">
                          <div class="mt-1 text-lg">{{ getIcon(notif.type) }}</div>
                          <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                              <h4 [class]="'font-bold text-sm ' + (notif.type === 'success' ? 'text-[#9be15d]' : notif.type === 'error' ? 'text-red-400' : 'text-[#EAC224]')">
                                {{ notif.title }}
                              </h4>
                              <span class="text-[10px] text-white/40 whitespace-nowrap">{{ timeAgo(notif.created_at) }}</span>
                            </div>
                            <p class="text-xs text-white/70 leading-relaxed mb-2">{{ notif.message }}</p>
                            
                            <div class="flex gap-4 mt-2">
                              <button (click)="viewDetails(notif, $event)" class="text-[11px] font-bold text-[#9be15d] hover:text-white transition-colors cursor-pointer">View Details →</button>
                              @if (!notif.is_read) {
                                <button (click)="markRead(notif.id, $event)" class="text-[11px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Mark read</button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    @if (notifications().length === 0) {
                      <div class="p-8 text-center text-white/40 text-sm"><span class="text-3xl block mb-2 opacity-50">📭</span>You're all caught up!</div>
                    }
                  </div>

                  @if (notifications().length > 0) {
                    <div class="border-t border-white/10 bg-[#1d2f0d]">
                      <button (click)="clearAll($event)" class="w-full py-3 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors font-bold cursor-pointer">Clear all</button>
                    </div>
                  }
                </div>
              }
            </div>

            <button routerLink="/settings" routerLinkActive="bg-[#2b3a14] shadow-inner" class="w-10 h-10 bg-[#364a19] rounded-full flex items-center justify-center hover:bg-[#2b3a14] transition-colors cursor-pointer" title="Settings">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
            <button (click)="confirmLogout()" class="w-10 h-10 bg-[#B4161B] text-white rounded-full flex items-center justify-center hover:bg-[#8f1115] transition-colors shadow-md cursor-pointer" title="Logout">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </nav>

        <main [id]="router.url" class="max-w-[1400px] mx-auto page-animate">
          <router-outlet></router-outlet>
        </main>
      </div>
    } @else {
      <!-- Login, Terminals, and Owner Dashboard rendering here (Fullscreen) -->
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent implements OnInit, OnDestroy {
  router = inject(Router);
  private apiService = inject(ApiService); 
  private cdr = inject(ChangeDetectorRef);

  currentYield = signal<number>(150);
  sellableStock = signal<number>(0);

  notifications = signal<any[]>([]);
  unreadCount = signal<number>(0);
  showNotifications = signal<boolean>(false);
  private pollingInterval: any;

  // LAYOUT TOGGLE FOR STANDALONE ROUTES
  isStandaloneRoute = false;

  // USER AND LOGOUT MODAL
  userName = signal<string>('User');
  logoutModalShow = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects.split('?')[0];
      
      // Determine if we are on a route that requires the fullscreen layout without the global navbar
      this.isStandaloneRoute = [
        '/login', 
        '/pos', 
        '/qa-terminal', 
        '/driver-terminal', 
        '/production-terminal', 
        '/client-portal', 
        '/payment',
        '/owner-dashboard' // Ensures owner dashboard hides the old nav
      ].some(route => url.includes(route));
    });
  }

  ngOnInit() {
    this.updateUser();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateUser();
    });

    this.fetchNotifications();
    this.pollingInterval = setInterval(() => this.fetchNotifications(), 10000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  updateUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try { 
          const parsed = JSON.parse(userStr);
          this.userName.set(parsed.name || parsed.full_name || 'User'); 
        } catch(e) {}
      } else {
        this.userName.set('User');
      }
    }
  }

  fetchNotifications() {
    this.apiService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.unreadCount.set(data.filter(n => !n.is_read).length); 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed to fetch notifications', err)
    });
  }

  viewDetails(notif: any, event: Event) {
    event.stopPropagation(); 
    
    if (!notif.is_read) {
      this.apiService.markNotificationRead(notif.id).subscribe(() => this.fetchNotifications());
    }
    
    this.showNotifications.set(false);

    const title = notif.title.toLowerCase();
    let route = '/dashboard';
    
    if (title.includes('purchase') || title.includes('supplier') || title.includes('grn') || title.includes('requisition')) {
      route = '/procurement';
    } else if (title.includes('qa') || title.includes('defect') || title.includes('clearance')) {
      route = '/qa';
    } else if (title.includes('stock') || title.includes('yield') || title.includes('bottleneck') || title.includes('allocation')) {
      route = '/warehouse';
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([route]);
    });
  }

  markRead(id: number, event: Event) {
    event.stopPropagation();
    this.apiService.markNotificationRead(id).subscribe(() => this.fetchNotifications());
  }

  markAllRead(event?: Event) {
    if (event) event.stopPropagation();
    this.apiService.markAllNotificationsRead().subscribe(() => this.fetchNotifications());
  }

  clearAll(event?: Event) {
    if (event) event.stopPropagation();
    this.apiService.clearNotifications().subscribe(() => {
      this.notifications.set([]);
      this.unreadCount.set(0);
      this.showNotifications.set(false);
      this.cdr.detectChanges();
    });
  }

  timeAgo(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
  
  getIcon(type: string) {
    if (type === 'success') return '✅';
    if (type === 'error' || type === 'warning') return '⚠️';
    return 'ℹ️';
  }

  confirmLogout(): void {
    this.logoutModalShow.set(true);
  }

  executeLogout(): void {
    this.logoutModalShow.set(false);
    this.apiService.logout(this.userName()).subscribe({
      next: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }
}