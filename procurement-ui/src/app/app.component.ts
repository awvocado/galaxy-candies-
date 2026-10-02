import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

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

      .font-candy { 
        font-family: 'Fredoka', sans-serif; 
      }
      
      .glass-panel {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.6);
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.02);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Re-triggerable Page Entrance Animation */
      @keyframes pageFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .page-animate {
        animation: pageFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    </style>

    @if (router.url !== '/login' && router.url !== '/') {
      <div class="min-h-screen p-4 md:p-6 lg:p-8">
        
        <!-- Top Navigation -->
        <nav class="bg-[#476021] text-white rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-green-900/10 mb-8 max-w-[1400px] mx-auto">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
              <img src="logo.png" alt="Galaxy Candies Logo" class="w-8 h-8 object-contain">
            </div>
            <h1 class="font-candy text-xl md:text-2xl font-bold tracking-wide text-[#EAC224]">Galaxy Candies and Snacks</h1>
          </div>
          
          <!-- Navigation links -->
          <div class="hidden lg:flex items-center gap-2 font-candy font-medium">
            <a routerLink="/dashboard" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Dashboard</a>
            <a routerLink="/procurement" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Procurement</a>
            <a routerLink="/warehouse" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Warehouse</a>
            <a routerLink="/qa" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">QA</a>
            <a routerLink="/production" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Production</a>
            <a routerLink="/sales" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Sales</a>
            <a routerLink="/logistics" routerLinkActive="bg-white text-[#476021] shadow-sm font-bold" class="px-4 py-2 rounded-full transition-colors hover:text-[#EAC224]">Logistics</a>
          </div>

          <div class="flex items-center gap-4 ml-8">
            <div class="hidden md:flex items-center gap-3 bg-[#364a19] px-4 py-1.5 rounded-full">
              <div class="w-8 h-8 bg-[#EAC224] rounded-full flex items-center justify-center text-lg border-2 border-white">
                👨‍💼
              </div>
              <span class="font-candy font-semibold">Lorenz</span>
            </div>
            <button routerLink="/settings" routerLinkActive="bg-[#2b3a14] shadow-inner" class="w-10 h-10 bg-[#364a19] rounded-full flex items-center justify-center hover:bg-[#2b3a14] transition-colors cursor-pointer" title="Settings">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
            <button (click)="logout()" class="w-10 h-10 bg-[#B4161B] text-white rounded-full flex items-center justify-center hover:bg-[#8f1115] transition-colors shadow-md cursor-pointer" title="Logout">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </nav>

        <!-- Using [id] bound to router.url forces the element to re-render and replay the animation on every tab change -->
        <main [id]="router.url" class="max-w-[1400px] mx-auto page-animate">
          <router-outlet></router-outlet>
        </main>
      </div>
    } @else {
      <!-- Login page view with no constraints -->
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent {
  currentYield = signal<number>(150);
  sellableStock = signal<number>(0);
  router = inject(Router);

  logout() {
    this.router.navigate(['/login']);
  }
}