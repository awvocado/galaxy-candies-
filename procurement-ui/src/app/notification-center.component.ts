import { Component, ChangeDetectionStrategy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService, AppNotification } from './notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative font-candy">
      <!-- Notification Bell Trigger -->
      <button 
        type="button"
        (click)="toggleOpen()" 
        class="w-10 h-10 bg-[#364a19] rounded-full flex items-center justify-center hover:bg-[#2b3a14] transition-colors relative cursor-pointer text-white" 
        title="Notifications">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        @if (service.unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 bg-[#B4161B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#476021] animate-pulse">
            {{ service.unreadCount() }}
          </span>
        }
      </button>

      <!-- Glassmorphic Dropdown Panel -->
      @if (isOpen()) {
        <div class="absolute right-0 mt-3 w-80 sm:w-96 bg-[#1d2f0d]/95 text-white backdrop-blur-md border border-white/15 rounded-3xl shadow-2xl z-50 overflow-hidden text-left">
          
          <div class="p-4 border-b border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm">🔔</span>
              <span class="font-bold text-sm text-[#EAC224]">Notifications</span>
              @if (service.unreadCount() > 0) {
                <span class="bg-[#EAC224]/20 text-[#EAC224] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {{ service.unreadCount() }} new
                </span>
              }
            </div>

            @if (service.notifications().length > 0) {
              <button 
                type="button"
                (click)="service.markAllAsRead()" 
                class="text-[11px] text-white/60 hover:text-[#EAC224] transition-colors cursor-pointer">
                Mark all read
              </button>
            }
          </div>

          <!-- Notification Item Feed -->
          <div class="max-h-80 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            @if (service.notifications().length === 0) {
              <div class="p-6 text-center text-white/40 text-xs">
                No notifications right now.
              </div>
            }

            @for (item of service.notifications(); track item.id) {
              <div 
                [class.bg-white/5]="!item.read" 
                class="p-4 hover:bg-white/10 transition-colors flex items-start gap-3 relative group">
                
                <span class="text-base shrink-0 mt-0.5">
                  @switch (item.type) {
                    @case ('warning') { ⚠️ }
                    @case ('success') { ✅ }
                    @case ('error') { 🚨 }
                    @default { ℹ️ }
                  }
                </span>

                <div class="flex-1 text-xs">
                  <div class="flex items-baseline justify-between mb-0.5">
                    <span class="font-bold" [class.text-[#EAC224]]="!item.read">{{ item.title }}</span>
                    <span class="text-[10px] text-white/40">{{ item.timestamp }}</span>
                  </div>
                  <p class="text-white/70 leading-relaxed font-sans">{{ item.message }}</p>

                  <div class="flex items-center gap-3 mt-2">
                    @if (item.link) {
                      <a 
                        [routerLink]="item.link" 
                        (click)="handleClick(item)" 
                        class="text-[11px] text-[#9be15d] hover:underline font-bold">
                        View Details &rarr;
                      </a>
                    }
                    @if (!item.read) {
                      <button 
                        type="button"
                        (click)="service.markAsRead(item.id)" 
                        class="text-[10px] text-white/40 hover:text-white cursor-pointer">
                        Mark read
                      </button>
                    }
                  </div>
                </div>

                <button 
                  type="button"
                  (click)="service.remove(item.id)" 
                  class="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white text-xs cursor-pointer p-1">
                  ✕
                </button>
              </div>
            }
          </div>

          @if (service.notifications().length > 0) {
            <div class="p-2 border-t border-white/10 text-center bg-black/10">
              <button 
                type="button"
                (click)="service.clearAll()" 
                class="text-[11px] text-white/40 hover:text-[#ff8a8f] transition-colors cursor-pointer">
                Clear all
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class NotificationCenterComponent {
  service = inject(NotificationService);
  isOpen = signal<boolean>(false);
  private hostRef = inject(ElementRef);

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  handleClick(item: AppNotification): void {
    this.service.markAsRead(item.id);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}