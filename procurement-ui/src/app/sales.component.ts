import { Component, signal, computed, ViewEncapsulation, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      :host { display: block; }
      :host, :host *, .sales-container, .sales-container * { font-family: 'Fredoka', sans-serif !important; font-synthesis: none; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      :host .font-semibold { font-weight: 600 !important; }
      :host .font-bold, :host .font-extrabold, :host .font-black, :host h2, :host h3, :host h4 { font-weight: 700 !important; }
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }

      .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(234, 194, 36, 0.45) rgba(0, 0, 0, 0.2); }
      .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .custom-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(234, 194, 36, 0.45); border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(234, 194, 36, 0.75); }
      
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      
      .sticky-thead { position: sticky; top: 0; z-index: 20; background: #18280b; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.12); }

      @keyframes toast-drop { 0% { opacity: 0; transform: translateY(-40px) scale(0.9); filter: blur(5px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
      .a-toast-new { animation: toast-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .a-bounce-icon { animation: bounce 1s infinite; }
      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @keyframes rocket-float { 0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } 50% { transform: translateY(-10px) translateX(4px) rotate(2deg); } }
      .a-rocket { animation: rocket-float 3.2s ease-in-out infinite; }
      @keyframes flame-flicker { 0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.95; } 50% { transform: scaleY(1.18) scaleX(0.92); opacity: 1; } }
      .a-flame { transform-origin: 60px 150px; animation: flame-flicker 0.35s ease-in-out infinite; }
      @keyframes spark-ping { 0%, 100% { opacity: 0.3; transform: translateY(0) scale(0.8); } 50% { opacity: 1; transform: translateY(5px) scale(1.25); } }
      .a-spark { animation: spark-ping 0.9s ease-in-out infinite; }
      @keyframes bob-a { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-6deg); } }
      .a-bob-a { animation: bob-a 4s ease-in-out infinite; }
      @keyframes bob-b { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
      .a-bob-b { animation: bob-b 4.5s ease-in-out infinite; }
      @keyframes wiggle { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
      .a-wiggle { animation: wiggle 3.2s ease-in-out infinite; }
      @keyframes dash { to { stroke-dashoffset: 0; } }
      .path-anim { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 2.5s ease-out forwards; }
      @keyframes fadeup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .point-anim { opacity: 0; animation: fadeup 0.5s ease-out forwards; }
    </style>

    <!-- FLOATING TOAST NOTIFICATION -->
    @if (toast().show) {
      <div class="fixed top-12 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
        <div [class]="'a-toast-new pointer-events-auto px-8 py-5 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-4 flex items-center gap-5 max-w-lg w-full mx-4 ' + (toast().type === 'success' ? 'bg-[#9be15d] border-white text-[#1d2f0d]' : 'bg-[#B4161B] border-white text-white')">
          <span class="text-5xl a-bounce-icon">{{ toast().type === 'success' ? '✅' : '🚨' }}</span>
          <div>
            <h4 class="text-2xl font-extrabold uppercase tracking-wide">{{ toast().type === 'success' ? 'Success!' : 'Attention Required!' }}</h4>
            <p class="font-bold text-base opacity-95 mt-1">{{ toast().message }}</p>
          </div>
        </div>
      </div>
    }

    <!-- ADD / EDIT CUSTOMER MODAL -->
    @if (customerModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/20 blur-[50px] rounded-full pointer-events-none"></div>
          <div class="relative z-10 border-b border-white/10 pb-4 mb-5">
            <h3 class="text-2xl font-bold text-white mb-1">{{ customerModal.isEdit ? 'Edit Customer Details' : 'Add New Customer' }}</h3>
            <p class="text-white/70 text-sm">Manage client details and billing address.</p>
          </div>
          <form (ngSubmit)="submitCustomer()" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Customer Name <span class="text-[#EAC224]">*</span></label>
              <input type="text" [(ngModel)]="customerModal.name" name="cName" required class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224]">
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Email Address <span class="text-[#EAC224]">*</span></label>
              <input type="email" [(ngModel)]="customerModal.email" name="cEmail" required class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224]">
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Phone Number</label>
              <input type="text" [(ngModel)]="customerModal.phone" name="cPhone" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224]">
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Billing/Delivery Address</label>
              <textarea [(ngModel)]="customerModal.address" name="cAddr" rows="2" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224]"></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
              <button type="button" (click)="closeCustomerModal()" class="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="isSubmitting() || !customerModal.name || !customerModal.email" class="px-6 py-2.5 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#1d2f0d] font-bold text-sm transition-all shadow-md cursor-pointer">
                {{ isSubmitting() ? 'Saving...' : 'Save Customer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- ARCHIVE CUSTOMER MODAL -->
    @if (archiveCustomerModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
          <div class="text-5xl mb-2">📦</div>
          <h3 class="text-2xl font-bold text-white font-candy">Archive Customer?</h3>
          <p class="text-white/70 text-sm">Are you sure you want to remove <strong class="text-[#EAC224]">{{ archiveCustomerModal.name }}</strong> from the active directory?</p>
          <div class="flex justify-center gap-3 pt-4">
            <button (click)="closeArchiveCustomerModal()" class="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-sm cursor-pointer hover:bg-white/20">Cancel</button>
            <button (click)="executeArchiveCustomer()" [disabled]="isSubmitting()" class="px-6 py-2.5 rounded-full font-bold text-sm bg-[#B4161B] text-white cursor-pointer hover:bg-[#8f1115] disabled:opacity-50">Yes, Archive</button>
          </div>
        </div>
      </div>
    }

    <!-- ORDER DETAILS MODAL -->
    @if (selectedOrder(); as ord) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/15 rounded-[32px] p-8 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden">
          <div class="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#EAC224] block">Order Summary</span>
              <h3 class="text-2xl font-bold text-white mt-0.5">{{ ord.id }}</h3>
            </div>
            <button (click)="selectedOrder.set(null)" class="text-white/40 hover:text-white text-xl cursor-pointer">✕</button>
          </div>
          <div class="space-y-3 text-sm">
            <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
              <span class="text-[11px] text-white/50 uppercase font-bold block mb-1">Customer &amp; Delivery Address</span>
              <p class="font-bold text-white text-base">{{ ord.cust }}</p>
              <p class="text-xs text-white/70 mt-0.5">{{ ord.addr }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                <span class="text-[11px] text-white/50 uppercase font-bold block mb-1">Total Quantity</span>
                <p class="font-extrabold text-white text-lg">{{ ord.qty }}</p>
              </div>
              <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                <span class="text-[11px] text-white/50 uppercase font-bold block mb-1">Total Amount</span>
                <p class="font-extrabold text-[#9be15d] text-lg">{{ ord.total }}</p>
              </div>
            </div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-xs text-white/60 font-bold uppercase">Current Status</span>
              <span [class]="'px-3.5 py-1.5 rounded-full text-xs font-bold border ' + chipLime">{{ ord.status }}</span>
            </div>
          </div>
          <div class="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button (click)="selectedOrder.set(null)" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer">Close</button>
            <button (click)="selectedOrder.set(null); subTab.set('s-inv')" class="px-6 py-2.5 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] text-[#1d2f0d] font-bold text-xs cursor-pointer">Go to Invoices →</button>
          </div>
        </div>
      </div>
    }

    <!-- PRODUCT DETAILS MODAL -->
    @if (selectedProductDetail()) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/15 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <div class="flex justify-between items-start border-b border-white/10 pb-4 mb-5 shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-black/40 border border-[#EAC224]/30 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                @if (selectedProductDetail()?.image) {
                  <img [src]="selectedProductDetail()?.image" class="w-full h-full object-contain">
                } @else {
                  <span class="text-3xl">🍬</span>
                }
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-white/50 block">{{ selectedProductDetail()?.sku }}</span>
                <h3 class="text-2xl font-bold text-white mt-0.5">{{ selectedProductDetail()?.name }}</h3>
              </div>
            </div>
            <button (click)="selectedProductDetail.set(null)" class="text-white/40 hover:text-white text-xl cursor-pointer">✕</button>
          </div>
          
          <div class="overflow-y-auto custom-scroll pr-2 flex-1 space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                <span class="text-[10px] text-white/50 uppercase font-bold block mb-1">Sale Price</span>
                <p class="font-extrabold text-[#9be15d] text-lg">{{ selectedProductDetail()?.price }}</p>
              </div>
              <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                <span class="text-[10px] text-white/50 uppercase font-bold block mb-1">Cost Price</span>
                <p class="font-bold text-white text-lg">₱ {{ selectedProductDetail()?.costPrice || '0.00' }}</p>
              </div>
              <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                <span class="text-[10px] text-white/50 uppercase font-bold block mb-1">Current Stock</span>
                <p class="font-bold text-white text-lg">{{ selectedProductDetail()?.rawQty }} units</p>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-bold text-[#EAC224] mb-2 uppercase tracking-wide">Product Description</h4>
              <p class="text-sm text-white/70 bg-black/20 p-4 rounded-xl border border-white/5 leading-relaxed">{{ selectedProductDetail()?.description || 'No description provided for this product. Edit the product to add details.' }}</p>
            </div>

            <div>
              <h4 class="text-sm font-bold text-[#EAC224] mb-3 uppercase tracking-wide">Latest Transactions</h4>
              <div class="bg-black/25 rounded-2xl border border-white/10 overflow-hidden">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
                    <tr><th class="py-2.5 px-4 font-bold">Date</th><th class="py-2.5 px-4 font-bold">Order Ref</th><th class="py-2.5 px-4 font-bold">Qty Sold</th></tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 text-white font-bold">
                    <tr class="hover:bg-white/5"><td class="py-3 px-4 text-xs">Today, 10:45 AM</td><td class="py-3 px-4 text-xs text-[#22d3ee]">ORD-2026-881</td><td class="py-3 px-4 text-xs text-[#9be15d]">+15</td></tr>
                    <tr class="hover:bg-white/5"><td class="py-3 px-4 text-xs">Yesterday, 3:20 PM</td><td class="py-3 px-4 text-xs text-[#22d3ee]">ORD-2026-879</td><td class="py-3 px-4 text-xs text-[#9be15d]">+50</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-4 border-t border-white/10 flex justify-between shrink-0">
            <button (click)="confirmDeleteProduct(selectedProductDetail()); selectedProductDetail.set(null)" class="px-5 py-2.5 rounded-full bg-[#B4161B]/20 text-[#ffb4b7] hover:bg-[#B4161B] hover:text-white font-bold text-xs transition-colors cursor-pointer">Delete Product</button>
            <div class="flex gap-3">
              <button (click)="selectedProductDetail.set(null)" class="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer">Close</button>
              <button (click)="openEditProductModal(selectedProductDetail()); selectedProductDetail.set(null)" class="px-6 py-2.5 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] text-[#1d2f0d] font-bold text-xs transition-colors cursor-pointer">Edit Product</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- CREATE INVOICE MODAL FORM -->
    @if (createInvoiceModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-lg w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          <div class="relative z-10 border-b border-white/10 pb-4">
            <h3 class="text-2xl font-bold text-white mb-1">Create Sales Invoice</h3>
            <p class="text-white/70 text-sm">Generate a manual invoice for bulk or credit sales.</p>
          </div>
          <form (ngSubmit)="submitNewInvoice()" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Customer Name <span class="text-[#EAC224]">*</span></label>
              <input type="text" [(ngModel)]="createInvoiceModal.cust" name="invCust" required placeholder="e.g. Candy Corner PH" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224]">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Invoice Amount (₱) <span class="text-[#EAC224]">*</span></label>
                <input type="number" [(ngModel)]="createInvoiceModal.amount" name="invAmount" required placeholder="0.00" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224]">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase">Payment Terms</label>
                <select [(ngModel)]="createInvoiceModal.terms" name="invTerms" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] appearance-none">
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-white/10">
              <button type="button" (click)="createInvoiceModal.show = false" class="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="!createInvoiceModal.cust || !createInvoiceModal.amount" class="px-6 py-2.5 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#1d2f0d] font-bold text-sm transition-all cursor-pointer">Generate Invoice</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- AUTOMATED PAYMENT LINK MODAL -->
    @if (paymentLinkModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-[#22d3ee]/30 rounded-[32px] p-8 max-w-sm w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#22d3ee]/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div class="relative z-10 text-center mb-6">
            <div class="flex justify-center mb-4">
              <svg class="w-10 h-10 text-[#e2e8f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <h3 class="text-[22px] font-bold text-white mb-1">Send Payment Link</h3>
            <p class="text-gray-400 text-[13px] font-medium tracking-wide">For Invoice {{ paymentLinkModal.refNo }}</p>
          </div>
          <form (ngSubmit)="generatePaymentLink()" class="space-y-5 relative z-10">
            <div>
              <label class="block text-[11px] text-[#22d3ee] mb-2 font-bold uppercase tracking-wider">Amount to Collect (₱)</label>
              <div class="w-full px-5 py-3.5 rounded-[14px] bg-[#1e293b] text-base text-white font-bold">{{ paymentLinkModal.amount }}</div>
            </div>
            
            <div class="bg-[#0f172a] p-5 rounded-[16px] border border-[#1e293b] shadow-inner">
              <label class="block text-[11px] text-[#22d3ee] mb-2 font-bold uppercase tracking-wider">Automated Sending</label>
              <input type="text" placeholder="Customer Email or Phone" class="w-full px-4 py-3 rounded-[12px] bg-[#1e293b] text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#22d3ee] transition-shadow mb-3 border-none">
              <p class="text-[10px] text-gray-400 leading-tight">System will automatically send the payment portal link to this contact and notify you when paid.</p>
            </div>

            <div class="pt-4 flex flex-col gap-3">
              <button type="submit" class="w-full py-3.5 rounded-full bg-[#22d3ee] hover:bg-[#1bbace] text-[#083344] font-bold text-[15px] transition-all shadow-[0_8px_20px_-8px_rgba(34,211,238,0.5)] cursor-pointer">Generate &amp; Send Automatically</button>
              <button type="button" (click)="paymentLinkModal.show = false" class="w-full py-3 rounded-full bg-transparent hover:bg-white/5 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- ADD / EDIT PRODUCT MODAL -->
    @if (addProductModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-xl w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/20 blur-[50px] rounded-full pointer-events-none"></div>
          <div class="relative z-10 border-b border-white/10 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-2xl border border-[#EAC224]/30 shadow-inner">🍬</div>
              <h3 class="text-3xl font-bold text-white">{{ addProductModal.isEdit ? 'Edit Product Details' : 'Register New Product' }}</h3>
            </div>
          </div>
          <form (ngSubmit)="submitNewProduct()" class="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto custom-scroll pr-2">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Product SKU <span class="text-[#EAC224]">*</span></label>
                <input type="text" [(ngModel)]="addProductModal.sku" name="sku" required placeholder="e.g. FG-NEW-001" [disabled]="addProductModal.isEdit" [class.opacity-50]="addProductModal.isEdit" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-black/60 transition-colors font-bold disabled:cursor-not-allowed">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Product Name <span class="text-[#EAC224]">*</span></label>
                <input type="text" [(ngModel)]="addProductModal.name" name="pname" required class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] font-bold">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Cost Price (Optional)</label>
                <input type="number" [(ngModel)]="addProductModal.costPrice" name="cprice" placeholder="0.00" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] font-bold">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Sale Price (₱) <span class="text-[#EAC224]">*</span></label>
                <input type="number" [(ngModel)]="addProductModal.price" name="price" required placeholder="0.00" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] font-bold">
              </div>
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Product Description</label>
              <textarea [(ngModel)]="addProductModal.description" name="desc" rows="2" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] font-bold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Total Stock Units</label>
                <input type="number" [(ngModel)]="addProductModal.stock" name="stock" placeholder="0" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] font-bold">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Product Photo</label>
                <div class="flex items-center gap-3">
                  <label class="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none cursor-pointer group">
                    <span class="truncate font-bold text-white/70">{{ addProductModal.image_name || 'Upload...' }}</span>
                    <input type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden">
                  </label>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-6 relative z-10 border-t border-white/10 mt-2">
              <button type="button" (click)="closeAddProductModal()" class="px-6 py-3 rounded-full bg-white/5 text-white font-bold text-sm cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="isSubmitting() || !addProductModal.sku || !addProductModal.name || !addProductModal.price" class="px-6 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] text-[#1d2f0d] font-bold text-sm cursor-pointer disabled:opacity-50">
                {{ isSubmitting() ? 'Saving...' : (addProductModal.isEdit ? 'Save Changes' : 'Register Product') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- DELETE CONFIRMATION MODAL -->
    @if (deleteConfirmModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#1d2f0d] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
          <div class="text-5xl mb-2">🗑️</div>
          <h3 class="text-2xl font-bold text-white font-candy">Delete Product?</h3>
          <p class="text-white/70 text-sm">Are you sure you want to completely remove <strong class="text-[#ffb4b7]">{{ deleteConfirmModal.name }}</strong>?</p>
          <div class="flex justify-center gap-3 pt-4">
            <button (click)="closeDeleteConfirmModal()" class="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-sm cursor-pointer">Cancel</button>
            <button (click)="executeDeleteProduct()" [disabled]="isSubmitting()" class="px-6 py-2.5 rounded-full font-bold text-sm bg-[#B4161B] text-white cursor-pointer disabled:opacity-50">Yes, Delete</button>
          </div>
        </div>
      </div>
    }

    <div class="sales-container min-h-screen bg-[#dfe9c6] px-4 md:px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">
        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <!-- HEADER + TOP SALES SUMMARY BANNER -->
        <div class="relative z-10 mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-4xl md:text-5xl font-bold tracking-wide">Sales &amp; POS management</h2>
            </div>
            <div class="bg-white/10 border border-white/15 px-5 py-3 rounded-full flex items-center gap-3 shadow-inner self-start lg:self-auto">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9be15d] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9be15d]"></span>
              </span>
              <div>
                <p class="text-[11px] font-bold text-white/60 uppercase tracking-wider">Available sellable stock</p>
                <p class="text-sm font-bold text-[#9be15d]">{{ sellableStock() | number }} items <span class="text-xs text-white/55 font-bold">(Entire Catalog)</span></p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div (click)="subTab.set('s-overview')" class="cursor-pointer hover:-translate-y-0.5 transition-all glass-panel p-5 rounded-3xl border-b-4 border-b-[#9be15d] flex items-center justify-between">
              <div>
                <p class="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Upfront Cash Sales</p>
                <p class="text-2xl md:text-3xl font-extrabold text-white">{{ salesMetrics().upfrontCash }}</p>
              </div>
              <div class="text-3xl opacity-80">💵</div>
            </div>
            <div (click)="subTab.set('s-overview')" class="cursor-pointer hover:-translate-y-0.5 transition-all glass-panel p-5 rounded-3xl border-b-4 border-b-[#22d3ee] flex items-center justify-between">
              <div>
                <p class="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Credit Sales (Terms)</p>
                <p class="text-2xl md:text-3xl font-extrabold text-[#7fe7f7]">{{ salesMetrics().creditSales }}</p>
              </div>
              <div class="text-3xl opacity-80">💳</div>
            </div>
            <div (click)="subTab.set('s-customers')" class="cursor-pointer hover:-translate-y-0.5 transition-all glass-panel p-5 rounded-3xl border-b-4 border-b-[#EAC224] flex items-center justify-between">
              <div>
                <p class="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Pending Collection</p>
                <p class="text-2xl md:text-3xl font-extrabold text-[#EAC224]">{{ salesMetrics().pendingCollection }}</p>
              </div>
              <div class="text-3xl opacity-80">📅</div>
            </div>
            <div (click)="subTab.set('s-reports')" class="cursor-pointer hover:-translate-y-0.5 transition-all bg-white/10 border border-white/25 p-5 rounded-3xl border-b-4 border-b-white shadow-lg flex items-center justify-between">
              <div>
                <p class="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue YTD</p>
                <p class="text-2xl md:text-3xl font-extrabold text-white">{{ totalRevenue() }}</p>
              </div>
              <div class="text-3xl">💰</div>
            </div>
          </div>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- SLIDING PILL TABS NAV + SEARCH -->
          <div class="border-b border-white/10 px-6 md:px-8 pt-6 pb-6 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
            <div class="w-full xl:flex-1 overflow-x-auto no-scrollbar">
              <div class="relative grid grid-cols-7 items-center bg-black/35 p-1.5 rounded-full border border-white/10 w-full min-w-[760px]">
                <!-- Animated Sliding Background Pill -->
                <div class="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-[#EAC224] shadow-[0_2px_12px_rgba(234,194,36,0.35)] transition-all duration-300 ease-out pointer-events-none"
                     [style.width]="'calc((100% - 0.75rem) / 7)'"
                     [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'">
                </div>

                <button (click)="subTab.set('s-overview')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-overview' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Sales Overview
                </button>
                <button (click)="subTab.set('s-pos')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-pos' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  POS Terminal
                </button>
                <button (click)="subTab.set('s-products')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-products' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Products
                </button>
                <button (click)="subTab.set('s-customers')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-customers' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Customers
                </button>
                <button (click)="subTab.set('s-payments')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-payments' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Online Payments
                </button>
                <button (click)="subTab.set('s-reports')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-reports' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Reports
                </button>
                <button (click)="subTab.set('s-inv')"
                  class="relative z-10 py-2 px-2 text-[12px] md:text-[13px] font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap text-center rounded-full"
                  [class]="subTab() === 's-inv' ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'">
                  Invoice
                </button>
              </div>
            </div>

            <!-- SEARCH -->
            <div class="relative w-full xl:w-72 shrink-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Global Search..." aria-label="Search"
                class="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors font-bold">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white cursor-pointer">✕</button>
              }
            </div>
          </div>

          <div class="p-6 md:p-8">

            <!-- 1. SALES OVERVIEW -->
            @if (subTab() === 's-overview') {
              <div class="space-y-8 animate-in fade-in duration-300">
                <section>
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <h3 class="text-2xl font-bold">Active Sales Orders</h3>
                    <div class="flex items-center gap-3">
                      <button (click)="subTab.set('s-pos')" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer">+ New POS Sale</button>
                      <button (click)="subTab.set('s-reports')" [class]="btnGhost + ' py-2.5 cursor-pointer'">📊 View Sales Reports →</button>
                    </div>
                  </div>
                  <div class="max-h-[480px] overflow-y-auto overflow-x-auto bg-black/25 rounded-2xl border border-white/10 custom-scroll relative">
                    <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead class="text-white text-[14px] font-bold sticky-thead">
                        <tr><th class="py-4 px-5">Order ID</th><th class="py-4 px-5">Customer details</th><th class="py-4 px-5">Order qty</th><th class="py-4 px-5">Total amount</th><th class="py-4 px-5">Stock status</th><th class="py-4 px-5 text-right">Action</th></tr>
                      </thead>
                      <tbody class="divide-y divide-white/10 font-bold text-white">
                        @for (o of filteredOrders(); track o.id) {
                          <tr class="hover:bg-white/10 transition-colors">
                            <td class="py-4 px-5 font-extrabold text-[#EAC224]">{{ o.id }}</td>
                            <td class="py-4 px-5 text-xs font-bold">{{ o.cust }}<br><span class="text-[11px] text-white/50 font-semibold">{{ o.addr }}</span></td>
                            <td class="py-4 px-5 font-bold text-white/85">{{ o.qty }}</td>
                            <td class="py-4 px-5 font-extrabold text-[#9be15d]">{{ o.total }}</td>
                            <td class="py-4 px-5"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + chipLime">{{ o.status }}</span></td>
                            <td class="py-4 px-5 text-right"><button (click)="selectedOrder.set(o)" [class]="btnGhost + ' cursor-pointer'">View Order</button></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            }

            <!-- 2. POS TERMINAL -->
            @if (subTab() === 's-pos') {
              <div class="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-6 gap-4">
                    <h3 class="text-2xl font-bold">Point of sale (POS)</h3>
                    <div class="flex gap-2 text-xs font-bold items-center">
                      <button (click)="posCategoryFilter.set('all')" [class]="posCategoryFilter() === 'all' ? 'px-4 py-2 bg-[#EAC224] text-[#2d3e15] rounded-full shadow-md cursor-pointer' : 'px-4 py-2 bg-white/10 text-white/70 border border-white/15 rounded-full cursor-pointer'">All</button>
                      <button (click)="posCategoryFilter.set('instock')" [class]="posCategoryFilter() === 'instock' ? 'px-4 py-2 bg-[#EAC224] text-[#2d3e15] rounded-full shadow-md cursor-pointer' : 'px-4 py-2 bg-white/10 text-white/70 border border-white/15 rounded-full cursor-pointer'">In Stock</button>
                    </div>
                  </div>
                  <div class="max-h-[620px] overflow-y-auto pr-2 custom-scroll">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      @for (p of filteredProducts(); track p.sku) {
                        <div (click)="!p.out && addToCart(p)" [class]="'glass-panel p-5 rounded-3xl flex flex-col justify-between relative transition-all group ' + (p.out ? 'opacity-60' : 'hover:border-[#EAC224]/60 hover:-translate-y-0.5 cursor-pointer')">
                          <span [class]="'absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold border ' + (p.out ? chipRed : chipLime)">{{ p.stock }}</span>
                          <div>
                            <div class="h-24 w-full flex items-center justify-center mb-3 mt-6 rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative p-2 shadow-inner">
                              @if (p.image) { <img [src]="p.image" [alt]="p.name" class="w-full h-full object-contain relative z-10" (error)="onImageError($event, p.name)"> }
                              <div [style.display]="p.image ? 'none' : 'flex'" class="absolute inset-0 flex-col items-center justify-center text-white/50 text-xs font-bold gap-1 bg-black/20"><span class="text-2xl">🍬</span></div>
                            </div>
                            <p class="font-bold text-sm">{{ p.name }}</p>
                            <p class="text-[11px] text-white/45 mb-2 font-bold tracking-wide">{{ p.sku }}</p>
                          </div>
                          <div class="flex justify-between items-center pt-3 border-t border-white/10">
                            <span class="font-bold text-base text-[#9be15d]">{{ p.price }}</span>
                            <button (click)="$event.stopPropagation(); addToCart(p)" [disabled]="p.out" [class]="p.out ? 'w-8 h-8 bg-white/10 text-white/30 rounded-full flex items-center justify-center font-bold text-lg cursor-not-allowed' : 'w-8 h-8 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full flex items-center justify-center font-bold text-lg transition-colors cursor-pointer'">+</button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <div class="glass-panel w-full lg:w-96 p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-center mb-4">
                      <input type="text" [(ngModel)]="posCustomerName" placeholder="Walk-in customer" class="bg-transparent border-b border-white/20 focus:border-[#EAC224] text-[#EAC224] font-bold text-sm outline-none pb-1 w-2/3">
                      @if (cart().length > 0) { <button (click)="clearCart()" class="text-xs text-[#ffb4b7] font-bold hover:underline cursor-pointer">Clear</button> }
                    </div>
                    <div class="space-y-3 max-h-[320px] overflow-y-auto custom-scroll pr-1 mb-6">
                      @if (cart().length === 0) {
                        <div class="h-full flex flex-col items-center justify-center text-white/30 space-y-4 pt-10 pb-10">
                          <span class="text-6xl">🛒</span>
                          <p class="font-bold tracking-wide text-sm">Cart is empty. Add items.</p>
                        </div>
                      }
                      @for (item of cart(); track item.sku) {
                        <div class="bg-black/25 p-4 rounded-2xl border border-white/10">
                          <div class="flex justify-between items-start mb-2"><p class="font-bold text-sm">{{ item.name }}</p><span class="font-bold text-sm text-[#9be15d]">₱ {{ (item.price * item.qty) | number:'1.2-2' }}</span></div>
                          <div class="flex items-center justify-between"><p class="text-[11px] text-white/50 font-bold">₱ {{ item.price | number:'1.2-2' }} / ea</p>
                            <div class="flex items-center gap-2.5">
                              <button (click)="updateCartQty(item.sku, -1)" class="bg-white/10 w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path></svg></button>
                              <span class="font-bold text-sm min-w-[24px] text-center">{{ item.qty }}</span>
                              <button (click)="updateCartQty(item.sku, 1)" class="bg-white/10 w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg></button>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    <div class="space-y-2 text-xs text-white/65 font-bold pt-3 border-t border-white/10">
                      <div class="flex justify-between"><span>Subtotal</span><span>₱ {{ cartSubtotal() | number:'1.2-2' }}</span></div>
                      <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-white/15"><span>Total</span><span class="text-[#EAC224]">₱ {{ cartTotal() | number:'1.2-2' }}</span></div>
                    </div>
                  </div>
                  <div class="mt-6">
                    <button (click)="checkoutPos()" [disabled]="cart().length === 0 || isSubmitting()" class="w-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-40 text-[#2d3e15] py-3.5 rounded-full font-bold text-base shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                      Pay &amp; Allocate
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- 3. PRODUCTS / INVENTORIES DIRECTORY TAB -->
            @if (subTab() === 's-products') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                  <h3 class="text-2xl font-bold">Existing Products/Inventories</h3>
                  <button (click)="openAddProductModal()" class="bg-[#9be15d] hover:bg-[#b0f07a] text-[#1d2f0d] px-5 py-2.5 rounded-full font-bold text-xs shadow-[0_4px_12px_-4px_rgba(155,225,93,0.6)] transition-colors cursor-pointer">
                    + Add New Product
                  </button>
                </div>
                
                <div class="max-h-[550px] overflow-y-auto overflow-x-auto bg-black/25 rounded-2xl border border-white/10 custom-scroll relative">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[13px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5">Code (SKU)</th>
                        <th class="py-4 px-5">Product Name</th>
                        <th class="py-4 px-5">Cost Price</th>
                        <th class="py-4 px-5">Sale Price</th>
                        <th class="py-4 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-bold text-white">
                      @for (p of filteredProducts(); track p.sku) {
                        <tr (click)="selectedProductDetail.set(p)" class="hover:bg-white/10 transition-colors cursor-pointer group">
                          <td class="py-4 px-5 font-bold text-white/60 group-hover:text-white">{{ p.sku }}</td>
                          <td class="py-4 px-5 font-bold flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                              @if (p.image) { <img [src]="p.image" class="w-full h-full object-cover"> } @else { <span class="text-xs">🍬</span> }
                            </div>
                            {{ p.name }}
                          </td>
                          <td class="py-4 px-5 text-white/50">₱ {{ p.costPrice || '0.00' }}</td>
                          <td class="py-4 px-5 text-[#9be15d]">{{ p.price }}</td>
                          <td class="py-4 px-5 text-right">
                            <button class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white hover:bg-[#EAC224] hover:text-[#1d2f0d] hover:border-[#EAC224] transition-colors cursor-pointer">Details</button>
                          </td>
                        </tr>
                      }
                      @if (filteredProducts().length === 0) {
                        <tr><td colspan="5" class="py-12 text-center text-white/50">No products match your search.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 4. CUSTOMERS DIRECTORY TAB -->
            @if (subTab() === 's-customers') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                  <h3 class="text-2xl font-bold">Customers Directory</h3>
                  <button (click)="openCustomerModal()" [class]="btnGhost + ' py-2.5 cursor-pointer'">+ Add Customer</button>
                </div>
                
                <div class="max-h-[550px] overflow-y-auto overflow-x-auto bg-black/25 rounded-2xl border border-white/10 custom-scroll relative">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[13px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5">Name</th>
                        <th class="py-4 px-5">Address</th>
                        <th class="py-4 px-5">Contact Details</th>
                        <th class="py-4 px-5">Pending Payment</th>
                        <th class="py-4 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-bold text-white">
                      @for (c of filteredCustomers(); track c.id) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 font-bold">{{ c.name }}</td>
                          <td class="py-4 px-5 text-xs text-white/70">{{ c.address }}</td>
                          <td class="py-4 px-5 text-xs">
                            <span class="block">{{ c.contact }}</span>
                            <span class="text-white/50 block font-semibold">{{ c.email }}</span>
                          </td>
                          <td class="py-4 px-5">
                            @if (c.pending !== '0.00') {
                              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#B4161B]/50 bg-[#B4161B]/20 text-[#ffb4b7]">₱ {{ c.pending }}</span>
                            } @else {
                              <span class="text-white/40 text-xs">Cleared</span>
                            }
                          </td>
                          <td class="py-4 px-5 text-right space-x-2">
                            <button (click)="openCustomerModal(c)" [class]="btnGhost + ' cursor-pointer'">Edit</button>
                            <button (click)="confirmArchiveCustomer(c)" class="px-4 py-1.5 border border-white/10 text-white/40 hover:bg-[#B4161B] hover:text-white rounded-full text-xs font-bold transition-colors cursor-pointer">Archive</button>
                          </td>
                        </tr>
                      }
                      @if (filteredCustomers().length === 0) {
                        <tr><td colspan="5" class="py-12 text-center text-white/50">No customers match your search.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 5. ONLINE PAYMENTS (VERIFICATION) TAB -->
            @if (subTab() === 's-payments') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                  <div>
                    <h3 class="text-2xl font-bold">Online Payments (Verification)</h3>
                  </div>
                  <div class="flex items-center gap-2">
                  </div>
                </div>
                
                <div class="max-h-[550px] overflow-y-auto overflow-x-auto bg-black/25 rounded-2xl border border-white/10 custom-scroll relative">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[13px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5">Ref / Trace No.</th>
                        <th class="py-4 px-5">Method</th>
                        <th class="py-4 px-5">Date & Time</th>
                        <th class="py-4 px-5">Amount</th>
                        <th class="py-4 px-5">Status / Notes</th>
                        <th class="py-4 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-bold text-white">
                      @for (pay of filteredPayments(); track pay.ref) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 font-bold text-[#22d3ee]">{{ pay.ref }}<br><span class="text-[10px] text-white/50">{{ pay.customer }}</span></td>
                          <td class="py-4 px-5">
                            @if (pay.method === 'GCash') { <span class="text-[#007DFE] bg-[#007DFE]/10 px-2.5 py-1 rounded font-black text-xs border border-[#007DFE]/30">GCash</span> }
                            @else if (pay.method === 'PayMongo') { <span class="text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded font-black text-xs border border-[#10b981]/30">PayMongo</span> }
                            @else { <span class="text-white/70 bg-white/10 px-2.5 py-1 rounded font-bold text-xs border border-white/20">{{ pay.method || 'Online Portal' }}</span> }
                          </td>
                          <td class="py-4 px-5 text-xs text-white/70">{{ pay.date }}</td>
                          <td class="py-4 px-5 text-[#9be15d] font-bold">{{ pay.amount }}</td>
                          <td class="py-4 px-5">
                            <span [class]="'px-2.5 py-1 rounded-full text-[10px] font-bold border ' + (pay.status === 'Verified' ? chipLime : chipGold)">{{ pay.status || 'Pending' }}</span>
                            @if (pay.notes) { <span class="block text-[10px] text-white/40 mt-1 italic max-w-[150px] truncate" [title]="pay.notes">{{ pay.notes }}</span> }
                          </td>
                          <td class="py-4 px-5 text-right">
                            @if (pay.status !== 'Verified') {
                              <button (click)="verifyPayment(pay.ref)" class="px-4 py-1.5 bg-[#9be15d] hover:bg-[#b0f07a] text-[#1d2f0d] rounded-full text-xs font-bold transition-colors cursor-pointer">Verify</button>
                            } @else {
                              <span class="text-white/30 text-xs px-4">Done</span>
                            }
                          </td>
                        </tr>
                      }
                      @if (filteredPayments().length === 0) {
                        <tr><td colspan="6" class="py-12 text-center text-white/50">No online payments found.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 6. HIGH-END REPORTS TAB -->
            @if (subTab() === 's-reports') {
              <div class="space-y-8 animate-in fade-in duration-300">
                <section>
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 class="text-3xl font-bold tracking-wide">Sales Analytics</h3>
                    </div>
                    
                    <!-- Sliding Pill Tabs for Report Periods -->
                    <div class="relative grid grid-cols-5 items-center bg-black/40 p-1.5 rounded-full border border-white/10 min-w-[380px]">
                      <div class="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-[#EAC224] shadow-[0_2px_12px_rgba(234,194,36,0.35)] transition-all duration-300 ease-out pointer-events-none"
                           [style.width]="'calc((100% - 0.75rem) / 5)'"
                           [style.transform]="'translateX(' + (getReportTabIndex() * 100) + '%)'">
                      </div>
                      @for (period of reportPeriods; track period) {
                        <button (click)="reportPeriod.set(period)" 
                                [class]="reportPeriod() === period ? 'text-[#1d2f0d]' : 'text-white hover:bg-white/10'" 
                                class="relative z-10 px-4 py-2 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer text-center whitespace-nowrap">
                          {{ period }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Professional KPI Cards -->
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div class="glass-panel p-6 rounded-[24px] border-t-4 border-t-[#9be15d] relative overflow-hidden group">
                      <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">📈</div>
                      <p class="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-2">Gross Revenue</p>
                      <p class="text-3xl font-extrabold text-white tracking-tight">₱ {{ currentReportData().revenue }}</p>
                      <div class="flex items-center gap-2 mt-3">
                        <span class="bg-[#9be15d]/20 text-[#9be15d] text-[10px] px-2 py-0.5 rounded font-bold">↑ {{ currentReportData().revGrowth || '5%' }}</span>
                        <span class="text-[10px] text-white/40 font-bold">vs previous period</span>
                      </div>
                    </div>
                    
                    <div class="glass-panel p-6 rounded-[24px] border-t-4 border-t-[#22d3ee] relative overflow-hidden group">
                      <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">📦</div>
                      <p class="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-2">Total Orders</p>
                      <p class="text-3xl font-extrabold text-white tracking-tight">{{ currentReportData().orders || '0' }}</p>
                      <div class="flex items-center gap-2 mt-3">
                        <span class="bg-[#22d3ee]/20 text-[#22d3ee] text-[10px] px-2 py-0.5 rounded font-bold">↑ {{ currentReportData().orderGrowth || '8%' }}</span>
                        <span class="text-[10px] text-white/40 font-bold">vs previous period</span>
                      </div>
                    </div>
                    
                    <div class="glass-panel p-6 rounded-[24px] border-t-4 border-t-[#EAC224] relative overflow-hidden group">
                      <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">⭐</div>
                      <p class="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-2">Avg Order Value</p>
                      <p class="text-3xl font-extrabold text-white tracking-tight">₱ {{ currentReportData().aov || '0.00' }}</p>
                      <div class="flex items-center gap-2 mt-3">
                        <span class="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded font-bold">- Stable</span>
                      </div>
                    </div>
                    
                    <div class="glass-panel p-6 rounded-[24px] border-t-4 border-t-[#ffb4b7] relative overflow-hidden group">
                      <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">🏆</div>
                      <p class="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-2">Top Product</p>
                      <p class="text-xl font-bold text-white leading-tight mt-1 truncate">{{ currentReportData().topProduct || 'Galaxy Assorted' }}</p>
                      <div class="flex items-center gap-2 mt-3">
                        <span class="text-[10px] text-[#ffb4b7] font-bold">Leading by volume</span>
                      </div>
                    </div>
                  </div>

                  <!-- Professional Spline Area Chart Section -->
                  <div class="glass-panel p-8 rounded-[32px] mb-6 relative overflow-hidden">
                    <div class="flex justify-between items-center mb-8 relative z-10">
                      <div>
                        <h4 class="text-xl font-bold tracking-wide">Revenue Trend</h4>
                        <p class="text-[11px] text-white/50 uppercase tracking-widest mt-1 font-bold">Showing {{ reportPeriod() }} data curve</p>
                      </div>
                    </div>

                    <!-- Stunning SVG Chart -->
                    <div class="relative w-full h-[220px] pt-4">
                      <!-- Grid lines -->
                      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                        <div class="border-b border-white border-dashed w-full h-0"></div>
                        <div class="border-b border-white border-dashed w-full h-0"></div>
                        <div class="border-b border-white border-dashed w-full h-0"></div>
                        <div class="border-b border-white border-dashed w-full h-0"></div>
                      </div>

                      <svg viewBox="0 0 1000 200" preserveAspectRatio="none" class="w-full h-full drop-shadow-[0_15px_15px_rgba(234,194,36,0.2)] z-10 relative overflow-visible">
                         <defs>
                             <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stop-color="#EAC224" stop-opacity="0.5" />
                                 <stop offset="100%" stop-color="#EAC224" stop-opacity="0.0" />
                             </linearGradient>
                             <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                             </filter>
                         </defs>
                         <!-- Smooth Curve Area -->
                         <path d="M0,200 L0,150 C150,180 250,60 400,90 C550,120 700,30 850,70 C950,100 980,40 1000,50 L1000,200 Z" fill="url(#areaGrad)" />
                         <!-- Smooth Curve Line with drawing animation -->
                         <path class="path-anim" d="M0,150 C150,180 250,60 400,90 C550,120 700,30 850,70 C950,100 980,40 1000,50" fill="none" stroke="#EAC224" stroke-width="4" stroke-linecap="round" filter="url(#glow)" />
                         
                         <!-- Interactive/Stylized Points -->
                         <circle class="point-anim" cx="200" cy="130" r="5" fill="#18280b" stroke="#EAC224" stroke-width="3" style="animation-delay: 0.5s;" />
                         <circle class="point-anim" cx="400" cy="90" r="6" fill="#EAC224" stroke="#ffffff" stroke-width="2" style="animation-delay: 1.0s;" />
                         <circle class="point-anim" cx="600" cy="80" r="5" fill="#18280b" stroke="#EAC224" stroke-width="3" style="animation-delay: 1.5s;" />
                         <circle class="point-anim" cx="850" cy="70" r="7" fill="#9be15d" stroke="#ffffff" stroke-width="2" style="animation-delay: 2.0s;" />
                      </svg>
                    </div>
                    
                    <div class="flex justify-between text-[11px] text-white/50 mt-4 uppercase font-bold tracking-widest px-2">
                      <span>Start</span>
                      <span class="ml-12">Q1/Mid</span>
                      <span class="mr-12">Peak Volume</span>
                      <span>Current</span>
                    </div>
                  </div>

                </section>
              </div>
            }

            <!-- 7. INVOICE -->
            @if (subTab() === 's-inv') {
              <div class="space-y-6 animate-in fade-in duration-300">
                <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                  <h3 class="text-2xl font-bold">Billing &amp; Invoicing</h3>
                  <div class="flex items-center gap-3 flex-wrap">
                    <button (click)="triggerImportInvoice()" [class]="btnGhost + ' py-2.5 flex items-center gap-2 cursor-pointer'">Import Invoice</button>
                    <button (click)="triggerExportInvoice()" [class]="btnGhost + ' py-2.5 flex items-center gap-2 cursor-pointer'">Export Data</button>
                    <button (click)="createInvoiceModal.show = true" class="px-5 py-2.5 bg-[#EAC224] hover:bg-[#f5d34a] text-[#1d2f0d] rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md">+ Create Invoice</button>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div class="lg:col-span-2">
                    <h4 class="text-lg font-bold mb-4">Invoice History</h4>
                    <div class="max-h-[500px] overflow-y-auto bg-black/25 rounded-2xl border border-white/10 custom-scroll relative">
                      <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                        <thead class="text-white text-[14px] font-bold sticky-thead">
                          <tr><th class="py-4 px-5">Document no.</th><th class="py-4 px-5">Customer</th><th class="py-4 px-5">Amount</th><th class="py-4 px-5 text-right">Status</th></tr>
                        </thead>
                        <tbody class="divide-y divide-white/10 font-bold text-white">
                          @for (i of filteredInvoices(); track i.no) {
                            <tr (click)="selectInvoice(i)" [class]="(selectedInvoice()?.no === i.no) ? 'bg-white/15 cursor-pointer' : 'hover:bg-white/10 cursor-pointer'">
                              <td [class]="'py-4 px-5 font-extrabold text-[#EAC224] ' + ((selectedInvoice()?.no === i.no) ? 'shadow-[inset_4px_0_0_#9be15d]' : '')">{{ i.no }}</td>
                              <td class="py-4 px-5 text-xs">{{ i.cust }}</td>
                              <td class="py-4 px-5 text-[#9be15d]">{{ i.amount }}</td>
                              <td class="py-4 px-5 text-right"><span [class]="'px-3 py-1.5 rounded-full text-xs font-bold border ' + i.chip">{{ i.status }}</span></td>
                            </tr>
                          }
                          @if (filteredInvoices().length === 0) {
                            <tr><td colspan="4" class="py-12 text-center text-white/50">No invoices match your search.</td></tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-lg font-bold mb-4 text-white/80">Document Preview</h4>
                    <div class="bg-[#fcfbee] p-6 rounded-[24px] shadow-lg flex flex-col justify-between border border-white/20 relative w-full">
                        
                        <button (click)="openPaymentLinkModal()" class="w-full mb-6 py-3 bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#083344] rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            Create Automated Payment Link
                        </button>

                        <div class="bg-white p-6 rounded-[20px] border border-gray-200 text-xs shadow-sm w-full">
                            <div class="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                                <h4 class="font-extrabold text-[#991b1b] text-[15px]">Galaxy Candies</h4>
                                <p class="font-extrabold text-[#1f2937] text-sm tracking-widest">INVOICE</p>
                            </div>
                            
                            <div class="mb-3 space-y-1">
                                <span class="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">BILL TO:</span>
                                <span class="font-extrabold text-[#1f2937] text-[13px] block">{{ selectedInvoice()?.cust || 'Walk-in customer' }}</span>
                            </div>

                            <div class="flex items-center gap-1.5 mt-4">
                                <span class="font-extrabold text-[#4d7c0f] text-[15px]">Total:</span>
                                <span class="font-extrabold text-[#4d7c0f] text-[15px]">{{ selectedInvoice()?.amount || '₱ 0.00' }}</span>
                            </div>
                        </div>

                        <div class="flex justify-center gap-4 mt-6">
                            <button (click)="showToast('Sending to printer...', 'success')" class="text-[11px] text-gray-500 font-bold hover:text-gray-800 transition-colors cursor-pointer">🖨️ Print Document</button>
                            <button (click)="showToast('PDF Downloaded', 'success')" class="text-[11px] text-gray-500 font-bold hover:text-gray-800 transition-colors cursor-pointer">📥 Download PDF</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>

        <!-- BACKGROUND ANIMATIONS -->
        <div class="a-rocket hidden lg:block absolute z-20 -top-10 left-[54%] w-16 pointer-events-none candy-shadow"><svg viewBox="0 0 120 215" class="rotate-[18deg]" fill="none"><defs><linearGradient id="slRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs><circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/><circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/><g class="a-flame"><path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/><path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/></g><path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/><path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/><path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#slRBody)" stroke="#94a3b8" stroke-width="2"/><path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/><path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475569" stroke-width="3"/><circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/><path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/></svg></div>
        <div class="a-bob-a hidden lg:block absolute z-20 -top-8 left-[49%] w-12 pointer-events-none candy-shadow"><svg viewBox="0 0 120 120" fill="none"><defs><linearGradient id="slStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs><polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#slStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/><path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg></div>
        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow"><svg viewBox="0 0 220 190" fill="none"><defs><linearGradient id="slGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient><mask id="slDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask></defs><g mask="url(#slDonut)"><ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/><ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/><ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#slGlz)"/><ellipse cx="110" cy="86" rx="42" ry="30" fill="#e8a33d"/></g><path d="M38 78 C52 46 88 32 122 32" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".55"/><rect x="66" y="52" width="16" height="6" rx="3" fill="#EAC224" transform="rotate(-40 74 55)"/><rect x="150" y="50" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(50 158 53)"/><rect x="172" y="84" width="16" height="6" rx="3" fill="#22b8e0" transform="rotate(-20 180 87)"/><rect x="112" y="128" width="16" height="6" rx="3" fill="#B4161B" transform="rotate(-25 120 131)"/><rect x="60" y="112" width="16" height="6" rx="3" fill="white" transform="rotate(40 68 115)"/></svg></div>
        <div class="hidden md:block absolute z-20 -bottom-14 -left-6 w-[70px] pointer-events-none candy-shadow"><svg class="a-wiggle" viewBox="0 0 90 150" fill="none"><rect x="41" y="62" width="8" height="86" rx="4" fill="#f4fbe4"/><circle cx="45" cy="42" r="38" fill="#EAC224"/><path d="M45 42 m0 -30 a30 30 0 1 1 -30 30 M45 42 m0 -16 a16 16 0 1 1 -16 16" stroke="#B4161B" stroke-width="8" stroke-linecap="round"/><path d="M20 22 Q26 12 36 9" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg></div>
        <div class="hidden md:block absolute z-20 -bottom-8 left-[14%] w-20 pointer-events-none candy-shadow"><svg class="a-wiggle" viewBox="0 0 100 60" fill="none"><path d="M22 30 L0 8 L8 30 L0 52 Z" fill="#fff" opacity=".9"/><path d="M78 30 L100 8 L92 30 L100 52 Z" fill="#fff" opacity=".9"/><rect x="20" y="8" width="60" height="44" rx="22" fill="#8fd14f"/><path d="M30 20 Q50 12 70 20" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".7"/></svg></div>
      </div>
    </div>
  `
})
export class SalesComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  
  subTab = signal<'s-overview' | 's-pos' | 's-products' | 's-customers' | 's-payments' | 's-reports' | 's-inv'>('s-overview'); 
  
  sellableStock = signal<number>(0);
  products = signal<any[]>([]);
  orders = signal<any[]>([]);
  invoices = signal<any[]>([]);
  
  customers = signal<any[]>([]);
  payments = signal<any[]>([]);
  
  selectedOrder = signal<any | null>(null);
  selectedInvoice = signal<any | null>(null);
  selectedProductDetail = signal<any | null>(null);

  searchQuery = signal<string>('');
  posCategoryFilter = signal<'all' | 'instock'>('all');

  posCustomerName = 'Walk-in customer';
  cart = signal<{sku: string, name: string, price: number, qty: number, maxStock: number}[]>([]);

  getTabIndex(): number { return ['s-overview', 's-pos', 's-products', 's-customers', 's-payments', 's-reports', 's-inv'].indexOf(this.subTab()); }
  getReportTabIndex(): number { return this.reportPeriods.indexOf(this.reportPeriod()); }

  btnGold = 'px-4 py-2 bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] rounded-full text-xs font-bold transition-colors';
  btnGhost = 'px-4 py-1.5 border border-white/25 text-white hover:bg-white/10 rounded-full text-xs font-bold transition-colors';
  chipGold = 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35';
  chipLime = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';
  chipCyan = 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35';
  chipRed = 'bg-[#B4161B]/25 text-[#ffb4b7] border-[#B4161B]/50';

  reportPeriod = signal<string>('Daily');
  reportPeriods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'];

  salesMetrics = computed(() => {
    let upfront = 0;
    let credit = 0;
    let pending = 0;
    
    this.invoices().forEach(i => {
      const amt = i.rawAmount || 0;
      if (i.status === 'PAID') {
        upfront += amt;
      } else {
        pending += amt;
        credit += amt;
      }
    });

    return {
      upfrontCash: '₱ ' + upfront.toLocaleString('en-US', {minimumFractionDigits: 2}),
      creditSales: '₱ ' + credit.toLocaleString('en-US', {minimumFractionDigits: 2}),
      pendingCollection: '₱ ' + pending.toLocaleString('en-US', {minimumFractionDigits: 2})
    };
  });

  totalRevenue = computed(() => {
    const total = this.invoices().reduce((sum, i) => sum + (i.rawAmount || 0), 0);
    return '₱ ' + total.toLocaleString('en-US', {minimumFractionDigits: 2});
  });

  currentReportData = computed(() => {
    const totalRev = this.invoices().reduce((sum, i) => sum + (i.rawAmount || 0), 0);
    const totalOrd = this.orders().length;
    const aov = totalOrd > 0 ? (totalRev / totalOrd) : 0;
    
    return {
      revenue: totalRev.toLocaleString('en-US', {minimumFractionDigits: 2}),
      revGrowth: '12%',
      orders: totalOrd,
      orderGrowth: '5%',
      aov: aov.toLocaleString('en-US', {minimumFractionDigits: 2}),
      topProduct: 'Mega Pastillas' 
    };
  });

  filteredOrders = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.orders().filter(o => !q || o.id.toLowerCase().includes(q) || o.cust.toLowerCase().includes(q));
  });

  filteredProducts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.products().filter(p => (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) && (this.posCategoryFilter() === 'all' || !p.out));
  });

  filteredInvoices = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.invoices().filter(i => !q || i.no.toLowerCase().includes(q) || i.cust.toLowerCase().includes(q));
  });

  filteredCustomers = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const invs = this.invoices();
    
    return this.customers().map(c => {
      const pendingTotal = invs
        .filter(i => i.status === 'PENDING' && i.cust.toLowerCase() === c.name.toLowerCase())
        .reduce((sum, i) => sum + i.rawAmount, 0);
        
      return {
        ...c,
        pending: pendingTotal > 0 ? pendingTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'
      };
    }).filter(c => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  });

  filteredPayments = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.payments().filter(p => !q || p.ref.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q));
  });

  cartSubtotal = computed(() => this.cart().reduce((sum, item) => sum + (item.price * item.qty), 0));
  cartTax = computed(() => this.cartSubtotal() * 0.12);
  cartTotal = computed(() => this.cartSubtotal() + this.cartTax());

  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  
  addProductModal = { show: false, isEdit: false, sku: '', name: '', price: null as any, costPrice: null as any, description: '', stock: 0, image_url: '', image_name: '' };
  deleteConfirmModal = { show: false, sku: '', name: '' };
  createInvoiceModal = { show: false, cust: '', amount: null as any, terms: 'Net 30', addr: '' };
  paymentLinkModal = { show: false, refNo: '', amount: '' };

  customerModal = { show: false, isEdit: false, originalEmail: '', email: '', name: '', phone: '', address: '' };
  archiveCustomerModal = { show: false, email: '', name: '' };

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    this.cdr.markForCheck();
    setTimeout(() => { this.toast.update(t => ({ ...t, show: false })); this.cdr.markForCheck(); }, 4000);
  }

  ngOnInit() {
    fetch('http://localhost:3000/api/seed-products')
      .then(() => { this.loadProducts(); this.loadSalesData(); })
      .catch(() => { this.loadProducts(); this.loadSalesData(); });
  }

  verifyPayment(ref: string) {
    this.apiService.verifySalesPayment(ref).subscribe({
      next: (res) => {
        if (res.success) {
          this.payments.update(list => list.map(p => p.ref === ref ? { ...p, status: 'Verified' } : p));
          this.showToast(`Payment ${ref} marked as Verified!`, 'success');
        }
      }
    });
  }

  loadSalesData() {
    this.apiService.getCrmClients().subscribe(res => {
      this.customers.set(res.map(c => ({
        id: c.email,
        name: c.name,
        address: c.address,
        contact: c.phone,
        email: c.email
      })));
      this.cdr.markForCheck();
    });

    this.apiService.getSalesPayments().subscribe(res => {
      this.payments.set(res.map(p => ({
        ref: p.transaction_id,
        customer: p.customer_name,
        date: new Date(p.created_at).toLocaleString(),
        amount: '₱ ' + parseFloat(p.amount).toLocaleString('en-US', {minimumFractionDigits: 2}),
        method: p.payment_method,
        status: p.verification_status,
        notes: p.notes
      })));
      this.cdr.markForCheck();
    });

    this.apiService.getSalesOrders().subscribe((res: any[]) => {
      this.orders.set(res.map((o: any) => ({ 
        id: o.order_id, 
        cust: o.customer_name, 
        addr: o.address, 
        qty: o.total_qty, 
        total: '₱ ' + parseFloat(o.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2}), 
        status: o.order_status 
      })));
      this.cdr.markForCheck();
    });

    this.apiService.getSalesInvoices().subscribe((res: any[]) => {
      const formatted = res.map((i: any) => ({ 
        no: i.invoice_no, 
        order: i.order_id, 
        cust: i.customer_name || 'Walk-in customer', 
        date: new Date(i.generated_at).toLocaleDateString(), 
        amount: '₱ ' + parseFloat(i.amount).toLocaleString('en-US', {minimumFractionDigits: 2}), 
        rawAmount: parseFloat(i.amount),
        status: i.status === 'PAID' ? 'PAID' : 'PENDING', 
        chip: i.status === 'PAID' ? this.chipLime : this.chipGold 
      }));
      this.invoices.set(formatted);
      if (formatted.length > 0 && !this.selectedInvoice()) this.selectedInvoice.set(formatted[0]);
      this.cdr.markForCheck();
    });
  }

  resolveImageUrl(url: string): string {
    if (!url || typeof url !== 'string' || url.trim() === '') return '';
    let cleanUrl = url.trim();
    if (cleanUrl.toLowerCase().endsWith('.jpg')) cleanUrl = cleanUrl.substring(0, cleanUrl.length - 4) + '.png';
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    return !cleanUrl.startsWith('/') ? '/' + cleanUrl : cleanUrl;
  }
  onImageError(event: any, productName: string) { event.target.style.display = 'none'; if (event.target.nextElementSibling) event.target.nextElementSibling.style.display = 'flex'; }

  loadProducts() {
    this.apiService.getPosCatalog().subscribe((catalog: any[]) => {
      this.apiService.getWarehouseStock().subscribe((stock: any[]) => {
         const merged = catalog.map((c: any) => {
            const whItem = stock.find((s: any) => s.sku === c.sku);
            const qty = whItem ? parseFloat(whItem.qty) : 0;
            return {
              name: c.name, sku: c.sku, description: c.description || '', costPrice: c.cost_price || 0,
              price: '₱ ' + parseFloat(c.price).toFixed(2), stock: qty > 0 ? qty + ' In Stock' : 'Out of Stock',
              out: qty <= 0, rawQty: qty, rawPrice: parseFloat(c.price), image: this.resolveImageUrl(c.image_url)
            };
         });
         this.sellableStock.set(stock.filter((s: any) => s.category === 'FINISHED_GOOD').reduce((sum: number, s: any) => sum + parseFloat(s.qty), 0));
         this.products.set(merged);
         this.cdr.markForCheck();
      });
    });
  }

  addToCart(product: any) {
    if (product.out) return;
    this.cart.update(items => {
      const existing = items.find(i => i.sku === product.sku);
      if (existing) {
        if (existing.qty >= product.rawQty) { this.showToast(`Max stock reached.`, 'error'); return items; }
        return items.map(i => i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...items, { sku: product.sku, name: product.name, price: product.rawPrice, qty: 1, maxStock: product.rawQty }];
    });
  }
  updateCartQty(sku: string, delta: number) {
    this.cart.update(items => items.map(item => {
      if (item.sku !== sku) return item;
      const nextQty = item.qty + delta;
      if (nextQty > item.maxStock) { this.showToast(`Max stock reached.`, 'error'); return item; }
      return { ...item, qty: nextQty };
    }).filter(item => item.qty > 0));
  }
  clearCart() { this.cart.set([]); }

  checkoutPos() {
    if (this.cart().length === 0) return;
    this.isSubmitting.set(true);
    const totalUnits = this.cart().reduce((sum, i) => sum + i.qty, 0);
    const rawTotal = this.cartTotal();
    const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const invNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      orderId,
      invoiceNo: invNo,
      customerName: this.posCustomerName.trim() || 'Walk-in customer',
      totalUnits,
      totalAmount: rawTotal,
      userName: 'System User',
      status: 'PAID'
    };

    fetch('http://localhost:3000/api/pos-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(res => {
       if (res.success) {
         this.loadSalesData();
         
         this.cart().forEach(cartItem => {
           this.products.update(list => list.map(p => {
             if (p.sku === cartItem.sku) {
               const newQty = p.rawQty - cartItem.qty;
               return { ...p, rawQty: newQty, stock: newQty > 0 ? newQty + ' Left' : 'Out', out: newQty <= 0 };
             }
             return p;
           }));
         });
         
         this.sellableStock.update(s => Math.max(0, s - totalUnits));
         this.cart.set([]);
         this.posCustomerName = '';
         this.showToast(`Order ${orderId} completed successfully!`, 'success');
         this.subTab.set('s-overview');
       } else {
         this.showToast(res.error || 'Failed to process POS checkout.', 'error');
       }
       this.isSubmitting.set(false);
       this.cdr.markForCheck();
    }).catch(() => {
       this.isSubmitting.set(false);
       this.showToast('Server error processing POS transaction.', 'error');
       this.cdr.markForCheck();
    });
  }

  selectInvoice(inv: any) { this.selectedInvoice.set(inv); }
  triggerImportInvoice() { this.showToast('Please select a file to import.', 'success'); }
  triggerExportInvoice() { this.showToast('Exporting data to CSV...', 'success'); }

  submitNewInvoice() {
    this.isSubmitting.set(true);
    const invNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const rawAmount = parseFloat(this.createInvoiceModal.amount);
    const status = this.createInvoiceModal.terms === 'Due on Receipt' ? 'PAID' : 'PENDING';
    
    const payload = {
      orderId: 'MANUAL',
      invoiceNo: invNo,
      customerName: this.createInvoiceModal.cust,
      totalUnits: 0,
      totalAmount: rawAmount,
      userName: 'System User',
      status: status
    };

    fetch('http://localhost:3000/api/pos-checkout', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload)
    }).then(r => r.json()).then(res => {
       this.isSubmitting.set(false);
       if(res.success) {
         this.createInvoiceModal.show = false;
         this.loadSalesData();
         this.showToast(`Invoice ${invNo} generated successfully!`, 'success');
       } else {
         this.showToast(res.error || 'Failed to generate invoice.', 'error');
       }
       this.cdr.markForCheck();
    });
  }

  openPaymentLinkModal() {
    if (!this.selectedInvoice()) return;
    this.paymentLinkModal = { show: true, refNo: this.selectedInvoice().no, amount: this.selectedInvoice().amount };
  }
  generatePaymentLink() {
    this.paymentLinkModal.show = false;
    this.showToast('Payment link generated and sent to customer automatically!', 'success');
  }

  openAddProductModal() { this.addProductModal = { show: true, isEdit: false, sku: '', name: '', price: null as any, costPrice: null as any, description: '', stock: 0, image_url: '', image_name: '' }; this.cdr.markForCheck(); }
  openEditProductModal(p: any) { this.addProductModal = { show: true, isEdit: true, sku: p.sku, name: p.name, price: p.rawPrice, costPrice: p.costPrice, description: p.description, stock: p.rawQty, image_url: p.image, image_name: 'Existing Image' }; this.cdr.markForCheck(); }
  closeAddProductModal() { this.addProductModal.show = false; this.cdr.markForCheck(); }
  confirmDeleteProduct(p: any) { this.deleteConfirmModal = { show: true, sku: p.sku, name: p.name }; this.cdr.markForCheck(); }
  closeDeleteConfirmModal() { this.deleteConfirmModal = { show: false, sku: '', name: '' }; this.cdr.markForCheck(); }

  executeDeleteProduct() {
    this.isSubmitting.set(true);
    this.apiService.deleteProduct(this.deleteConfirmModal.sku).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) { this.showToast('Product deleted.', 'success'); this.closeDeleteConfirmModal(); this.loadProducts(); }
        else { this.showToast(res.error || 'Failed to delete.', 'error'); }
        this.cdr.markForCheck();
      }, error: () => { this.isSubmitting.set(false); this.showToast('Server error.', 'error'); this.cdr.markForCheck(); }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.addProductModal.image_name = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.addProductModal.image_url = e.target.result; this.cdr.markForCheck(); };
      reader.readAsDataURL(file);
    }
  }

  submitNewProduct() {
    this.isSubmitting.set(true);
    const req = this.addProductModal.isEdit ? this.apiService.updateProduct(this.addProductModal.sku, this.addProductModal) : this.apiService.addProduct(this.addProductModal);
    req.subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) { this.showToast('Product saved!', 'success'); this.closeAddProductModal(); this.loadProducts(); }
        else { this.showToast(res.error || 'Failed to save.', 'error'); }
        this.cdr.markForCheck();
      }, error: () => { this.isSubmitting.set(false); this.showToast('Server error.', 'error'); this.cdr.markForCheck(); }
    });
  }

  openCustomerModal(c?: any) {
    if (c) {
      this.customerModal = { show: true, isEdit: true, originalEmail: c.email, email: c.email, name: c.name, phone: c.contact, address: c.address };
    } else {
      this.customerModal = { show: true, isEdit: false, originalEmail: '', email: '', name: '', phone: '', address: '' };
    }
    this.cdr.markForCheck();
  }

  closeCustomerModal() {
    this.customerModal.show = false;
    this.cdr.markForCheck();
  }

  submitCustomer() {
    this.isSubmitting.set(true);
    const payload = { email: this.customerModal.email, name: this.customerModal.name, phone: this.customerModal.phone, address: this.customerModal.address };
    
    const req = this.customerModal.isEdit 
      ? this.apiService.updateCrmClient(this.customerModal.originalEmail, payload)
      : this.apiService.addCrmClient(payload);

    req.subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast('Customer saved successfully!', 'success');
          this.closeCustomerModal();
          this.loadSalesData();
        } else {
          this.showToast(res.error || 'Failed to save customer.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Server error.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  confirmArchiveCustomer(c: any) {
    this.archiveCustomerModal = { show: true, email: c.email, name: c.name };
    this.cdr.markForCheck();
  }

  closeArchiveCustomerModal() {
    this.archiveCustomerModal.show = false;
    this.cdr.markForCheck();
  }

  executeArchiveCustomer() {
    this.isSubmitting.set(true);
    this.apiService.deleteCrmClient(this.archiveCustomerModal.email).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast('Customer archived successfully!', 'success');
          this.closeArchiveCustomerModal();
          this.loadSalesData();
        } else {
          this.showToast(res.error || 'Failed to archive.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Server error.', 'error');
        this.cdr.markForCheck();
      }
    });
  }
}