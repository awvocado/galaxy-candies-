import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');
      
      .portal-page { font-family: 'Fredoka', sans-serif; }
      
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      
      @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      @keyframes checkmark { 0% { stroke-dashoffset: 50; opacity: 0; } 100% { stroke-dashoffset: 0; opacity: 1; } }
      @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      
      .a-pop { animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .a-float { animation: float 3s ease-in-out infinite; }
      .a-check { stroke-dasharray: 50; stroke-dashoffset: 50; animation: checkmark 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards; }
      .a-spin-slow { animation: spin-slow 10s linear infinite; }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
    </style>

    <div class="portal-page min-h-screen bg-[#dfe9c6] flex items-center justify-center p-4 relative overflow-hidden">
      
      <!-- Decorative Background Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#9be15d]/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EAC224]/20 blur-[100px] rounded-full pointer-events-none"></div>

      <!-- Main Card (Dark Theme) -->
      <div class="theme-panel p-10 md:p-14 rounded-[40px] shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)] text-center max-w-lg w-full a-pop border border-white/10 relative overflow-hidden z-10 text-white">
        
        <!-- Top brand strip -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2a3f14] via-[#9be15d] to-[#EAC224]"></div>

        <!-- Twinkle Stars -->
        <span class="a-twinkle absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#EAC224] pointer-events-none"></span>
        <span class="a-twinkle absolute bottom-[20%] right-[10%] w-2 h-2 rounded-full bg-white pointer-events-none" style="animation-delay: 1s"></span>

        @if (isSuccess()) {
          <!-- Animated Success Icon -->
          <div class="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <!-- Decorative outer ring -->
            <div class="absolute inset-0 border-[3px] border-dashed border-[#9be15d]/40 rounded-full a-spin-slow"></div>
            <!-- Inner floating circle -->
            <div class="absolute inset-2 bg-[#9be15d]/20 rounded-full a-float shadow-[0_0_30px_rgba(155,225,93,0.4)]"></div>
            <!-- Checkmark -->
            <svg class="w-12 h-12 text-[#9be15d] relative z-10" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path class="a-check" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h2 class="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Payment Successful!</h2>
          <p class="text-white/70 font-semibold text-[15px] leading-relaxed mb-8 px-2">
            Thank you! Your deposit has been securely processed. Your order is officially verified and has been transferred to our kitchen for immediate production.
          </p>

          <!-- Order Status Receipt Box -->
          <div class="bg-black/30 border border-white/10 rounded-2xl p-5 mb-8 shadow-inner">
            <div class="flex items-center justify-between text-sm">
              <span class="text-white/50 font-bold uppercase tracking-wider text-[11px]">Order Status</span>
              <span class="flex items-center gap-1.5 text-[#1d2f0d] font-bold bg-[#9be15d] px-4 py-1.5 rounded-full text-xs shadow-[0_0_15px_rgba(155,225,93,0.4)]">
                <span class="w-2 h-2 rounded-full bg-[#1d2f0d] animate-pulse"></span>
                In Production
              </span>
            </div>
          </div>

        } @else {
          <!-- Cancelled Icon -->
          <div class="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div class="absolute inset-0 border-[3px] border-dashed border-[#B4161B]/50 rounded-full a-spin-slow"></div>
            <div class="absolute inset-2 bg-[#B4161B]/20 rounded-full a-float shadow-[0_0_30px_rgba(180,22,27,0.5)]"></div>
            <svg class="w-12 h-12 text-[#ffb4b7] relative z-10" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path class="a-check" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>

          <h2 class="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Payment Cancelled</h2>
          <p class="text-white/70 font-semibold text-[15px] leading-relaxed mb-8 px-2">
            Your secure payment session was closed or cancelled. Your logistics profile was saved, but production will not begin until the deposit is processed.
          </p>
        }

        <!-- Brand Footer -->
        <div class="inline-flex items-center gap-2.5 bg-[#EAC224]/10 border border-[#EAC224]/30 px-5 py-2 rounded-full shadow-inner mt-2">
          <span class="text-lg">🍬</span>
          <span class="text-[11px] font-bold text-[#EAC224] tracking-widest uppercase">Galaxy Candies Mfg.</span>
        </div>
      </div>
    </div>
  `
})
export class PaymentStatusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  isSuccess = signal<boolean>(true);

  ngOnInit() {
    const status = this.route.snapshot.paramMap.get('status');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (status === 'success' && token) {
      this.isSuccess.set(true);
      // Trigger the backend to queue the order in production
      this.apiService.confirmPaymentSuccess({ token, userName: 'Client Portal (PayMongo)' }).subscribe();
    } else {
      this.isSuccess.set(false);
    }
  }
}