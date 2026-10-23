import { Component, ChangeDetectionStrategy, signal, computed, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');

      app-warehouse { display: block; }
      .wh-page { font-family: 'Fredoka', sans-serif; }

      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      .glass-panel {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .candy-shadow { filter: drop-shadow(0 18px 16px rgba(0,0,0,.4)); }

      /* FIXED SCROLLBARS: Added horizontal height + removed white corner square */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(234, 194, 36, 0.45) rgba(0, 0, 0, 0.2);
      }
      .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 194, 36, 0.45); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 194, 36, 0.75); }
      .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }

      /* Hide scrollbar utility for clean tab navigation */
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      /* Flush sticky table header with subtle bottom shadow */
      .sticky-thead {
        position: sticky;
        top: 0;
        z-index: 20;
        background: #18280b;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.12);
      }

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

      /* HIGH-VISIBILITY TOAST ANIMATION */
      @keyframes toast-drop { 
        0% { opacity: 0; transform: translateY(-40px) scale(0.9); filter: blur(5px); } 
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
      }
      .a-toast-new { animation: toast-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .a-bounce-icon { animation: bounce 1s infinite; }

      .d1 { animation-delay: .5s; } .d2 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) { [class*="a-"] { animation: none !important; } }
    </style>

    <!-- HIGH-VISIBILITY FLOATING TOAST NOTIFICATION -->
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

    <!-- START MANUAL PRODUCTION RUN MODAL -->
    @if (newRunModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/20 blur-[50px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 border-b border-white/10 pb-4 flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-2xl border border-[#EAC224]/30 shadow-inner">🍬</div>
              <div>
                <h3 class="text-2xl font-bold text-white">Start Production Run</h3>
                <p class="text-white/60 text-xs font-semibold">Queue a new batch in the candy kitchen</p>
              </div>
            </div>
            <button (click)="closeNewRunModal()" class="text-white/40 hover:text-white transition-colors cursor-pointer text-xl">✕</button>
          </div>

          <form (ngSubmit)="submitNewRun()" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs text-white/70 mb-1.5 font-bold uppercase tracking-wider">Target Product <span class="text-[#EAC224]">*</span></label>
              <select [(ngModel)]="newRunModal.productName" name="runProduct" required class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                <option value="" disabled selected>Select product recipe...</option>
                @for (g of finishedGoods(); track g.sku) {
                  <option [value]="g.name">{{ g.name }} ({{ g.sku }})</option>
                }
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/70 mb-1.5 font-bold uppercase tracking-wider">Planned Yield (Packs) <span class="text-[#EAC224]">*</span></label>
                <input type="number" [(ngModel)]="newRunModal.plannedQty" name="runQty" required min="1" placeholder="100" class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-sm text-white font-bold placeholder-white/40 outline-none focus:border-[#EAC224]">
              </div>
              <div>
                <label class="block text-xs text-white/70 mb-1.5 font-bold uppercase tracking-wider">Initial Status</label>
                <select [(ngModel)]="newRunModal.status" name="runStatus" class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN PROGRESS">In Progress</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="closeNewRunModal()" class="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="isSubmitting() || !newRunModal.productName || newRunModal.plannedQty < 1" class="px-6 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#1d2f0d] font-bold text-sm transition-all shadow-md cursor-pointer">
                {{ isSubmitting() ? 'Queueing...' : 'Launch Run' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- UPDATE RUN MODAL -->
    @if (updateModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/20 blur-[50px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 border-b border-white/10 pb-4">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-xl border border-[#EAC224]/30 shadow-inner font-emoji">⚙️</div>
                  <h3 class="text-2xl font-bold text-white">Update Job Status</h3>
                </div>
                <p class="text-[#EAC224] text-sm font-bold tracking-wider">{{ updateModal.id }}</p>
              </div>
              <button (click)="closeUpdateModal()" class="text-white/40 hover:text-white transition-colors cursor-pointer text-xl">✕</button>
            </div>
          </div>
          
          <form (ngSubmit)="submitRunUpdate()" class="space-y-5 relative z-10">
            <div class="bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
              <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-1">Target Product</span>
              <span class="text-base font-bold text-white">{{ updateModal.bom }}</span>
              
              <div class="mt-3 pt-3 border-t border-white/5">
                <span class="block text-white/50 text-[11px] uppercase font-bold tracking-wider mb-1">Target Yield (Planned)</span>
                <span class="text-sm font-bold text-white">{{ updateModal.planned }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Job Status</label>
              <select [(ngModel)]="updateModal.status" name="status" class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN PROGRESS">In Progress (Cooking)</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            @if (updateModal.status === 'COMPLETED') {
              <div class="animate-in fade-in slide-in-from-top-2 duration-300">
                <label class="block text-xs text-[#9be15d] mb-1.5 font-bold uppercase tracking-wider">Actual Yield (Packs Produced) *</label>
                <input type="number" [(ngModel)]="updateModal.actual" name="actualQty" required min="1" placeholder="Enter final output..." class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-[#9be15d]/50 text-sm text-white placeholder-white/40 font-bold outline-none focus:border-[#9be15d] transition-colors">
              </div>
            }

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="closeUpdateModal()" class="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="isSubmitting() || (updateModal.status === 'COMPLETED' && !updateModal.actual)" class="px-6 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#1d2f0d] font-bold text-sm transition-all shadow-md cursor-pointer">
                {{ isSubmitting() ? 'Updating...' : 'Save Progress' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- ADD NEW MATERIAL / PRODUCT MODAL -->
    @if (addMaterialModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-xl w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#9be15d]/20 blur-[50px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 border-b border-white/10 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-full bg-[#9be15d]/20 flex items-center justify-center text-2xl border border-[#9be15d]/30 shadow-inner font-emoji">✨</div>
              <h3 class="text-3xl font-bold text-white">Register New Material</h3>
            </div>
            <p class="text-white/70 text-sm leading-relaxed mt-2">Add a new raw material or finished product to the warehouse catalog.</p>
          </div>
          
          <form (ngSubmit)="submitNewMaterial()" class="space-y-4 relative z-10">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Item SKU <span class="text-[#EAC224]">*</span></label>
                <input type="text" [(ngModel)]="addMaterialModal.sku" name="sku" required placeholder="e.g. RM-SUG-01" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-black/60 transition-colors font-bold">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Category <span class="text-[#EAC224]">*</span></label>
                <select [(ngModel)]="addMaterialModal.category" name="cat" required class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d] font-bold">
                  <option value="RAW_MATERIAL">Raw Material</option>
                  <option value="FINISHED_GOOD">Finished Good</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Product / Material Name <span class="text-[#EAC224]">*</span></label>
              <input type="text" [(ngModel)]="addMaterialModal.name" name="mname" required placeholder="e.g. Premium White Sugar" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-black/60 transition-colors font-bold">
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">UOM</label>
                <input type="text" [(ngModel)]="addMaterialModal.uom" name="uom" placeholder="kg, L, pcs" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] transition-colors font-bold">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Min Reorder</label>
                <input type="number" [(ngModel)]="addMaterialModal.min_reorder_level" name="min" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] transition-colors font-bold">
              </div>
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Max Capacity</label>
                <input type="number" [(ngModel)]="addMaterialModal.max_capacity" name="max" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] transition-colors font-bold">
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 relative z-10 border-t border-white/10 mt-2">
              <button type="button" (click)="closeAddMaterialModal()" class="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="submit" [disabled]="isSubmitting() || !addMaterialModal.sku || !addMaterialModal.name" class="px-6 py-3 rounded-full bg-[#9be15d] hover:bg-[#b0f07a] disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/5 disabled:cursor-not-allowed text-[#1d2f0d] font-bold text-sm transition-all shadow-[0_8px_20px_-8px_rgba(155,225,93,0.6)] disabled:shadow-none cursor-pointer">
                {{ isSubmitting() ? 'Saving...' : 'Register Item' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- SMART QUICK REORDER MODAL -->
    @if (reorderModal.show) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#EAC224]/20 blur-[50px] rounded-full pointer-events-none"></div>

          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-full bg-[#EAC224]/20 flex items-center justify-center text-2xl border border-[#EAC224]/30 shadow-inner font-emoji">📦</div>
              <h3 class="text-3xl font-bold text-white">Quick Reorder</h3>
            </div>
            <p class="text-white/70 text-sm leading-relaxed mt-2">Generate a new Purchase Requisition to restock <span class="font-bold text-[#EAC224]">{{ reorderModal.material }}</span>.</p>
          </div>
          
          <div class="space-y-4 relative z-10">
            
            @if (reorderModal.supplierId && reorderModal.supplierName) {
              <!-- AUTO-DETECTED SUPPLIER -->
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Designated Supplier</label>
                <div class="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-[#9be15d]/30 text-sm font-bold text-[#9be15d] flex items-center justify-between shadow-inner">
                  <span>✓ {{ reorderModal.supplierName }}</span>
                  <span class="text-[10px] bg-[#9be15d]/20 px-2 py-1 rounded-md">{{ reorderModal.supplierId }}</span>
                </div>
                <p class="text-[11px] text-white/50 mt-2 ml-1">Linked to catalog item: <span class="font-bold text-white">{{ reorderModal.catalogName }}</span></p>
              </div>
            } @else {
              <!-- MANUAL SUPPLIER OVERRIDE -->
              <div class="bg-[#B4161B]/10 border border-[#B4161B]/30 p-4 rounded-2xl space-y-4 shadow-inner">
                <div>
                  <label class="block text-xs text-[#ffb4b7] mb-1.5 font-bold uppercase tracking-wider">⚠️ Unlinked Material - Select Supplier</label>
                  <select [(ngModel)]="reorderModal.supplierId" (ngModelChange)="onManualSupplierChange()" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#B4161B]/50 text-sm text-white outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                    <option value="" disabled selected>Select a supplier to link...</option>
                    @for (s of suppliers(); track s.id) {
                      <option [value]="s.id">{{ s.name }}</option>
                    }
                  </select>
                </div>
                
                @if (reorderModal.supplierId) {
                  <div>
                    <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Select Catalog Material</label>
                    <select [(ngModel)]="reorderModal.catalogName" (ngModelChange)="onManualMaterialChange()" class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white outline-none focus:border-[#EAC224] cursor-pointer [&>option]:bg-[#1d2f0d]">
                      <option value="" disabled selected>Match with catalog item...</option>
                      @for (rm of availableManualMaterials(); track rm.name) { 
                        <option [value]="rm.name">{{ rm.name }}</option> 
                      }
                    </select>
                  </div>
                }
              </div>
            }

            <div class="grid grid-cols-2 gap-4">
              <!-- CAPPED QUANTITY INPUT -->
              <div>
                <div class="flex justify-between items-center mb-1.5">
                  <label class="block text-xs text-white/60 font-bold uppercase tracking-wider">Qty (Order Units) <span class="text-[#EAC224]">*</span></label>
                  <span class="text-[10px] text-[#ffb4b7] font-bold">Max: 500</span>
                </div>
                <input type="number" [(ngModel)]="reorderModal.qty" min="1" max="500" class="w-full px-4 py-3.5 rounded-2xl bg-black/20 border border-white/10 text-sm text-white outline-none focus:border-[#EAC224] focus:bg-black/40 transition-colors font-bold">
              </div>
              
              <!-- AUTO-DETECTED UNIT COST (READ-ONLY) -->
              <div>
                <label class="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wider">Unit Cost (₱)</label>
                <div class="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white/70 cursor-not-allowed font-bold">
                  {{ reorderModal.cost ? (reorderModal.cost | number:'1.2-2') : '0.00' }}
                </div>
              </div>
            </div>

            <!-- LIVE TOTAL COST CALCULATION -->
            <div class="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-[#9be15d]/30 mt-2 shadow-inner">
              <span class="text-xs text-white/70 font-bold uppercase tracking-wider">Total Est. Cost</span>
              <span class="text-xl font-extrabold text-[#9be15d]">₱{{ ((reorderModal.qty || 0) * (reorderModal.cost || 0)) | number:'1.2-2' }}</span>
            </div>

          </div>

          <div class="flex justify-end gap-3 pt-4 relative z-10 border-t border-white/10">
            <button (click)="closeReorderModal()" class="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer">Cancel</button>
            <button (click)="submitReorder()" [disabled]="isSubmitting() || !reorderModal.supplierId || !reorderModal.catalogName || reorderModal.qty <= 0 || reorderModal.qty > 500" class="px-6 py-3 rounded-full bg-[#EAC224] hover:bg-[#f5d34a] disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/5 disabled:cursor-not-allowed text-[#1d2f0d] font-bold text-sm transition-all shadow-[0_8px_20px_-8px_rgba(234,194,36,0.6)] disabled:shadow-none cursor-pointer">
              {{ isSubmitting() ? 'Processing...' : 'Create PR' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- AUTOMATED PAYMENT LINK GENERATOR MODAL -->
    @if (checkoutModal.show && mrpResults(); as results) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-gradient-to-br from-[#2a3f14] to-[#152309] border border-white/10 rounded-[32px] w-full max-w-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col">
          
          <!-- Action Area -->
          <div class="w-full p-8 md:p-10 bg-black/20 relative z-10 flex flex-col">
            <div class="absolute -top-32 -right-32 w-64 h-64 bg-[#9be15d]/10 blur-[60px] rounded-full pointer-events-none"></div>

            <div class="flex justify-between items-center mb-8">
              <h3 class="text-xl font-bold text-white">Payment Link Generator</h3>
              <button (click)="closeCheckoutModal()" class="text-white/40 hover:text-white transition-colors cursor-pointer text-xl bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <!-- Total Breakdown -->
            <div class="bg-white/5 border border-[#9be15d]/30 rounded-2xl p-6 mb-6 shadow-inner relative overflow-hidden">
              <div class="absolute right-0 top-0 bottom-0 w-2 bg-[#9be15d]"></div>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Total Order Value</p>
                  <p class="text-3xl font-extrabold text-[#9be15d]">₱{{ results.totalValue | number:'1.2-2' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[#EAC224] text-[10px] font-bold uppercase tracking-wider mb-1">Required Full Payment</p>
                  <p class="text-xl font-extrabold text-[#EAC224]">₱{{ results.totalValue | number:'1.2-2' }}</p>
                </div>
              </div>
            </div>

            <!-- Generate Action -->
            <div class="flex-1 flex flex-col justify-center">
              @if (checkoutModal.status === 'idle' || checkoutModal.status === 'generating') {
                <div>
                  <label class="block text-[11px] text-white/60 mb-2 font-bold uppercase tracking-wider">Client Email Address <span class="text-[#EAC224]">*</span></label>
                  <input type="email" [(ngModel)]="checkoutModal.clientEmail" placeholder="client@company.com" class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] transition-colors font-bold mb-4">

                  <label class="block text-[11px] text-white/60 mb-2 mt-2 font-bold uppercase tracking-wider">Client Name <span class="text-white/40 lowercase text-[9px]">(Required for new clients)</span></label>
                  <input type="text" [(ngModel)]="checkoutModal.clientName" placeholder="Juan Dela Cruz" class="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] transition-colors font-bold mb-4">
                  
                  <button (click)="generatePaymentLink()" [disabled]="checkoutModal.status === 'generating' || !checkoutModal.clientEmail" class="w-full tracking-wide bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 disabled:cursor-not-allowed text-[#1d2f0d] py-4 rounded-full font-extrabold text-sm shadow-[0_8px_20px_-8px_rgba(155,225,93,0.6)] transition-all flex justify-center items-center gap-2 cursor-pointer">
                    @if (checkoutModal.status === 'generating') {
                      <svg class="animate-spin h-5 w-5 text-[#1d2f0d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 
                      Generating &amp; Sending Email...
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      Generate &amp; Email Link
                    }
                  </button>
                </div>
              } @else {
                <div class="animate-in zoom-in-95 duration-300">
                  <div class="bg-[#1d2f0d] border border-[#9be15d]/50 p-5 rounded-2xl mb-4 text-center shadow-inner">
                    <p class="text-[10px] text-[#9be15d] uppercase font-bold tracking-widest mb-2">Live Link Generated &amp; Sent</p>
                    <input type="text" readonly [value]="checkoutModal.checkoutUrl" class="w-full text-center bg-black/30 border border-white/10 text-white/90 text-sm p-3 rounded-lg font-mono mb-3 outline-none">
                    
                    <div class="flex gap-2 justify-center">
                      <button (click)="copyLink()" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/10 flex items-center gap-2 cursor-pointer">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        Copy Link
                      </button>
                      
                      <button (click)="emailLink()" [disabled]="isSubmitting()" class="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors border border-white/10 flex items-center gap-2 cursor-pointer">
                        @if (isSubmitting()) {
                           <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Sending...
                        } @else {
                           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                           Resend Email
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-4 pt-4 border-t border-white/10 flex flex-col items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-[#EAC224] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm font-bold text-[#EAC224]">Awaiting Client Payment...</p>
                    <p class="text-[10px] text-white/50 mt-1 text-center font-semibold max-w-[250px]">This window will automatically close once the payment is completed via PayMongo.</p>
                  </div>
                </div>
              }
            </div>

          </div>
        </div>
      </div>
    }

    <div class="wh-page min-h-screen bg-[#dfe9c6] px-4 md:px-8 pt-6 pb-[4.5rem] overflow-x-clip">

      <div class="theme-panel relative max-w-[1400px] mx-auto rounded-[36px] p-6 md:p-10 text-white shadow-[0_50px_100px_-25px_rgba(45,62,21,0.6)]">

        <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224]"></span>
        <span class="a-twinkle d1 absolute top-[50%] right-[3%] w-1.5 h-1.5 rounded-full bg-white"></span>
        <span class="a-twinkle d2 absolute bottom-[7%] left-[40%] w-1.5 h-1.5 rounded-full bg-[#EAC224]"></span>

        <div class="relative z-10 mb-8">
          <h2 class="text-4xl md:text-5xl font-semibold tracking-wide">Warehouse &amp; Production Management</h2>
        </div>

        <div class="glass-panel rounded-[32px] relative z-10 border-t-4 border-t-[#EAC224]">

          <!-- Tabs + GLOBAL SEARCH (FIXED: No horizontal scrollbar & exact 6-tab pill math) -->
          <div class="border-b border-white/10 px-6 md:px-8 pt-6 pb-6 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
            
            <div class="w-full xl:flex-1 min-w-0 overflow-x-auto no-scrollbar">
              <!-- SMOOTH ANIMATED TABS NAV -->
              <div class="relative grid grid-cols-6 w-full min-w-[740px] bg-black/25 p-1.5 rounded-full border border-white/10">
                <!-- Sliding Indicator: (100% - 12px) / 6 tabs -->
                <div class="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/6)] bg-[#EAC224] rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)] pointer-events-none"
                     [style.transform]="'translateX(' + (getTabIndex() * 100) + '%)'"></div>
                
                <button (click)="activeTab.set('ledger')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'ledger'" [class.text-white]="activeTab() !== 'ledger'">Raw Material Ledger</button>
                <button (click)="activeTab.set('mrp')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'mrp'" [class.text-white]="activeTab() !== 'mrp'">Order Feasibility</button>
                <button (click)="activeTab.set('received')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'received'" [class.text-white]="activeTab() !== 'received'">Received Stocks</button>
                <button (click)="activeTab.set('finished')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'finished'" [class.text-white]="activeTab() !== 'finished'">Finished Goods</button>
                <button (click)="activeTab.set('runs')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'runs'" [class.text-white]="activeTab() !== 'runs'">Run Manager</button>
                <button (click)="activeTab.set('bom')" class="relative z-10 py-2.5 px-2 text-[13px] 2xl:text-[14px] font-bold transition-colors duration-300 cursor-pointer whitespace-nowrap text-center" [class.text-[#2d3e15]]="activeTab() === 'bom'" [class.text-white]="activeTab() !== 'bom'">BOM Viewer</button>
              </div>
            </div>

            <!-- GLOBAL SEARCH WITH CLEAR BUTTON -->
            <div class="relative w-full xl:w-64 2xl:w-72 shrink-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search SKU, materials, runs..." aria-label="Search items"
                class="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-[#EAC224] focus:bg-white/15 transition-colors">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white cursor-pointer" title="Clear search">✕</button>
              }
            </div>
          </div>

          <div class="p-6 md:p-8">

            <!-- 1. RAW MATERIAL LEDGER -->
            @if (activeTab() === 'ledger') {
              <div class="animate-in fade-in duration-300 space-y-8">
                
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-4">
                  <h2 class="text-2xl font-semibold">Raw Material Ledger &amp; Analytics</h2>
                  <div class="flex flex-wrap gap-3">
                    <button (click)="runAutoRestock()" [disabled]="isSubmitting()" class="bg-[#22d3ee] hover:bg-[#7fe7f7] text-[#083344] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(34,211,238,0.7)] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                      ⚡ Auto-Replenish Low Stock
                    </button>
                    <button (click)="openAddMaterialModal()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg> Add New Material
                    </button>
                  </div>
                </div>

                <!-- Summary Metrics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div (click)="stockFilter.set('all'); ledgerFilter.set('all')" class="cursor-pointer hover:-translate-y-0.5 transition-all bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
                    <span class="text-xs font-bold text-white/65 block mb-1 uppercase tracking-wider">Materials tracked</span>
                    <span class="text-3xl font-extrabold">{{ filteredCounts().all }}</span>
                  </div>
                  <div (click)="stockFilter.set('low'); ledgerFilter.set('LOW STOCK')" class="cursor-pointer hover:-translate-y-0.5 transition-all bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444]">
                    <span class="text-xs font-bold text-[#ffb4b7] block mb-1 uppercase tracking-wider">Low stock alerts</span>
                    <span class="text-3xl font-extrabold text-[#ffb4b7]">{{ filteredCounts().low }}</span>
                  </div>
                  <div (click)="stockFilter.set('ok'); ledgerFilter.set('AVAILABLE')" class="cursor-pointer hover:-translate-y-0.5 transition-all bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <span class="text-xs font-bold text-[#b7f27c] block mb-1 uppercase tracking-wider">Healthy levels</span>
                    <span class="text-3xl font-extrabold text-[#9be15d]">{{ filteredCounts().ok }}</span>
                  </div>
                  <div (click)="stockFilter.set('high'); ledgerFilter.set('AVAILABLE')" class="cursor-pointer hover:-translate-y-0.5 transition-all bg-[#22d3ee]/10 p-5 rounded-2xl border border-[#22d3ee]/25 border-b-4 border-b-[#22d3ee]">
                    <span class="text-xs font-bold text-[#7fe7f7] block mb-1 uppercase tracking-wider">Near capacity</span>
                    <span class="text-3xl font-extrabold text-[#7fe7f7]">{{ filteredCounts().high }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mt-8">

                  <!-- Scrollable Ledger Table -->
                  <div class="lg:col-span-2 bg-black/25 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                    <div class="px-6 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-3 bg-[#1d2f0d]">
                      <h3 class="font-bold text-white">Comprehensive Ledger View</h3>
                      <div class="flex gap-2 text-xs font-semibold">
                        <button (click)="ledgerFilter.set('all')" [ngClass]="ledgerFilter() === 'all' ? activeCls : idleCls" class="px-3.5 py-1.5 rounded-full border border-white/15 transition-all cursor-pointer">All</button>
                        <button (click)="ledgerFilter.set('AVAILABLE')" [ngClass]="ledgerFilter() === 'AVAILABLE' ? activeCls : idleCls" class="px-3.5 py-1.5 rounded-full border border-white/15 transition-all cursor-pointer">Available</button>
                        <button (click)="ledgerFilter.set('LOW STOCK')" [ngClass]="ledgerFilter() === 'LOW STOCK' ? activeCls : idleCls" class="px-3.5 py-1.5 rounded-full border border-white/15 transition-all cursor-pointer">Low Stock</button>
                      </div>
                    </div>
                    <div class="max-h-[360px] overflow-y-auto overflow-x-auto custom-scrollbar">
                      <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                        <thead class="text-white text-[13px] font-bold sticky-thead">
                          <tr>
                            <th class="px-5 py-4">Item SKU</th>
                            <th class="px-5 py-4">Material</th>
                            <th class="px-5 py-4 text-right">Available qty</th>
                            <th class="px-5 py-4">UOM</th>
                            <th class="px-5 py-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10 font-medium">
                          @for (r of filteredLedgerMaterials(); track r.sku) {
                            <tr [class]="r.status === 'low' ? 'bg-[#B4161B]/20 hover:bg-[#B4161B]/30 transition-colors' : 'hover:bg-white/10 transition-colors'">
                              <td [class]="'px-5 py-4 text-xs font-bold ' + (r.status === 'low' ? 'text-[#ffb4b7] shadow-[inset_4px_0_0_#ef4444]' : 'text-white/70')">{{ r.sku }}</td>
                              <td [class]="'px-5 py-4 font-bold ' + (r.status === 'low' ? 'text-[#ffb4b7]' : 'text-white')">{{ r.name }}</td>
                              <td [class]="'px-5 py-4 text-right font-extrabold text-base ' + (r.status === 'low' ? 'text-[#ffb4b7]' : 'text-white')">{{ r.qty | number }}</td>
                              <td [class]="'px-5 py-4 text-xs font-bold ' + (r.status === 'low' ? 'text-[#ffb4b7]' : 'text-white/60')">{{ r.unit }}</td>
                              <td class="px-5 py-4 text-right">
                                <span [class]="'inline-block px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border ' + r.chip">{{ r.status === 'low' ? 'LOW STOCK' : 'AVAILABLE' }}</span>
                              </td>
                            </tr>
                          }
                          @if (filteredLedgerMaterials().length === 0) {
                            <tr><td colspan="5" class="py-12 text-center text-white/50">No materials match your ledger filter.</td></tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Quick Action Panel -->
                  <div class="bg-white/10 rounded-3xl p-6 border-2 border-[#EAC224]/70 relative space-y-4 flex flex-col justify-center items-center text-center">
                    <div class="w-20 h-20 bg-[#EAC224]/20 rounded-full flex items-center justify-center text-4xl shadow-inner mb-2 border border-[#EAC224]/40">
                       ⚙️
                    </div>
                    <h3 class="text-xl font-bold">MRP Integration</h3>
                    <p class="text-sm text-white/75 px-2 font-medium leading-relaxed">Calculate maximum yield based on available raw materials.</p>
                    
                    <button (click)="activeTab.set('mrp')" class="mt-4 w-full tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] py-3.5 rounded-full font-bold shadow-[0_12px_28px_-8px_rgba(234,194,36,0.7)] transition-colors cursor-pointer flex items-center justify-center gap-2">
                      Go to Order Feasibility →
                    </button>
                  </div>
                </div>

                <!-- Materials Tracker Visual Grid -->
                <div class="bg-black/25 rounded-[28px] border border-white/10 p-6 mt-8">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 class="text-xl font-bold">Materials Tracker</h3>
                    <div class="flex flex-wrap gap-2 text-xs font-semibold">
                      @for (f of filters; track f.key) {
                        <button (click)="stockFilter.set(f.key)"
                          [ngClass]="stockFilter() === f.key ? activeCls : idleCls"
                          class="px-4 py-2 rounded-full border border-white/15 transition-all cursor-pointer">
                          {{ f.label }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                    @for (m of filteredMaterials(); track m.sku) {
                      <div [class]="'rounded-3xl p-5 border transition-all hover:-translate-y-0.5 flex flex-col justify-between ' + m.card">
                        <div>
                          <div class="flex items-start justify-between gap-3 mb-4">
                            <div class="flex items-center gap-3">
                              <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl font-emoji shrink-0">{{ m.icon }}</div>
                              <p class="font-semibold text-base leading-tight">{{ m.name }}<br><span class="text-[10px] text-white/45 font-bold tracking-widest">{{ m.sku }}</span></p>
                            </div>
                            <span [class]="'px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ' + m.chip">{{ m.label }}</span>
                          </div>

                          <div class="flex items-baseline gap-1.5 mb-3">
                            <span class="text-3xl font-extrabold">{{ m.qty | number }}</span>
                            <span class="text-sm text-white/60 font-bold">{{ m.unit }}</span>
                          </div>

                          <!-- Dynamic Progress bar -->
                          <div class="relative h-2.5 rounded-full bg-black/30 mb-2 overflow-hidden" role="img" [attr.aria-label]="m.name + ' at ' + m.pct + ' percent of capacity'">
                            <div [class]="'h-full rounded-full ' + m.bar" [style.width.%]="m.pct"></div>
                            <span class="absolute top-0 bottom-0 w-0.5 bg-white/80" [style.left.%]="m.minPct" title="Reorder threshold"></span>
                          </div>
                          <div class="flex justify-between text-[11px] text-white/55 font-semibold">
                            <span>Reorder at {{ m.min | number }} {{ m.unit }}</span>
                            <span>{{ m.pct }}% of {{ m.max | number }}</span>
                          </div>
                        </div>

                        @if (m.status === 'low') {
                          <button (click)="openReorderModal(m)" class="mt-4 w-full tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-md">Create reorder PR</button>
                        } @else if (m.status === 'high') {
                          <p class="mt-4 text-[11px] text-[#7fe7f7] font-semibold text-center bg-black/20 rounded-xl py-2">Near capacity — Hold new POs</p>
                        } @else {
                          <div class="mt-4 flex justify-between items-center text-[11px] text-white/45 bg-black/15 rounded-xl px-3 py-2 font-semibold">
                            <span>Stock buffer healthy</span>
                            <button (click)="openReorderModal(m)" class="text-[#EAC224] hover:underline font-bold cursor-pointer">+ Restock</button>
                          </div>
                        }
                      </div>
                    }
                    @if (filteredMaterials().length === 0) {
                      <div class="col-span-full py-8 text-center text-white/50">No materials match your tracker filter.</div>
                    }
                  </div>
                </div>

              </div>
            }

            <!-- 2. MRP & ORDER FEASIBILITY -->
            @if (activeTab() === 'mrp') {
              <div class="animate-in fade-in duration-300 space-y-6">
                <div>
                  <h2 class="text-3xl font-bold mb-2 text-white">Material Requirements Planning (MRP)</h2>
                </div>

                <div class="bg-black/25 p-6 rounded-3xl border border-white/10 shadow-lg mb-6">
                  <div class="space-y-4">
                    @for (item of mrpItems(); track $index) {
                      <div class="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-5 rounded-2xl border border-white/15 relative">
                        <div class="flex-1 w-full">
                          <div class="flex justify-between items-center mb-2">
                            <label class="block text-xs text-white/70 font-bold uppercase tracking-wider">Target Finished Good</label>
                            @if (catalogPrices()[item.productSku]) {
                              <span class="text-xs font-bold text-[#EAC224] bg-[#EAC224]/15 px-2.5 py-0.5 rounded-full border border-[#EAC224]/30">
                                Unit Price: ₱{{ catalogPrices()[item.productSku] | number:'1.2-2' }}
                              </span>
                            }
                          </div>
                          <select [(ngModel)]="item.productSku" class="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                            <option value="" disabled selected>Select a product to manufacture...</option>
                            @for (g of finishedGoods(); track g.sku) {
                              <option [value]="g.sku" [disabled]="isMrpProductSelected(g.sku, $index)">{{ g.name }}</option>
                            }
                          </select>
                        </div>
                        <div class="w-full md:w-64">
                          <div class="flex justify-between items-center mb-2">
                            <label class="block text-xs text-white/70 font-bold uppercase tracking-wider">Qty (Units)</label>
                            @if (catalogPrices()[item.productSku] && item.qty > 0) {
                              <span class="text-xs font-extrabold text-[#9be15d]">
                                Subtotal: ₱{{ (item.qty * catalogPrices()[item.productSku]) | number:'1.2-2' }}
                              </span>
                            }
                          </div>
                          <input type="number" [(ngModel)]="item.qty" min="1" placeholder="e.g., 100" class="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-sm text-white font-bold placeholder-white/40 outline-none focus:border-[#EAC224]">
                        </div>
                        <div class="pt-6">
                          <button (click)="removeMrpRow($index)" [disabled]="mrpItems().length === 1" class="text-[#ffb4b7] bg-[#B4161B]/15 hover:bg-[#B4161B]/30 p-3 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-[#B4161B]/30" title="Remove Product">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <button (click)="addMrpRow()" [disabled]="mrpItems().length >= finishedGoods().length" class="text-sm font-bold text-[#EAC224] hover:text-[#f5d34a] disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-2">
                      <span class="text-lg">+</span> Add another product
                    </button>
                    <button (click)="calculateMRP()" [disabled]="mrpItems().some(i => !i.productSku || i.qty < 1) || isSubmitting()" class="w-full sm:w-auto tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] disabled:opacity-50 text-[#2d3e15] px-8 py-3 rounded-full font-bold shadow-[0_4px_14px_rgba(234,194,36,0.4)] transition-colors cursor-pointer">
                      {{ isSubmitting() ? 'Analyzing Multi-Order...' : 'Check Feasibility' }}
                    </button>
                  </div>
                </div>

                @if (mrpResults(); as results) {
                  <div class="mt-8 bg-black/25 border border-white/10 rounded-3xl p-6 md:p-8">
                    
                    <!-- CAPACITY BANNER -->
                    <div class="mb-8 flex flex-col bg-white/5 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                      <div class="absolute right-0 top-0 w-32 h-32 bg-[#EAC224]/10 blur-[40px] rounded-full pointer-events-none"></div>
                      
                      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
                        <div class="flex flex-wrap items-center gap-8 justify-between lg:justify-start w-full md:w-auto">
                          <div class="flex items-center gap-5">
                            <div class="w-14 h-14 bg-[#EAC224]/20 border border-[#EAC224]/40 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0">
                              📦
                            </div>
                            <div>
                              <p class="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Target Combined Order</p>
                              <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-extrabold text-[#EAC224]">{{ results.totalUnits | number }}</span>
                                <span class="text-xs text-white/50 font-bold">total items</span>
                              </div>
                            </div>
                          </div>
                          
                          <div class="w-px h-12 bg-white/10 hidden md:block"></div>

                          <div class="flex items-center gap-5">
                            <div class="w-14 h-14 bg-[#9be15d]/20 border border-[#9be15d]/40 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0">
                              💰
                            </div>
                            <div>
                              <p class="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Total Order Value</p>
                              <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-extrabold text-[#9be15d]">₱{{ results.totalValue | number:'1.2-2' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Order Composition Breakdown -->
                      <div class="mt-6 pt-5 border-t border-white/10 relative z-10 w-full">
                        <p class="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-3">Order Composition &amp; Pricing Breakdown</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          @for (reqItem of results.requestedItems; track reqItem.sku) {
                            <div class="bg-black/30 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
                              <div class="flex items-center gap-2.5 min-w-0 pr-2">
                                <span class="bg-[#EAC224]/20 text-[#EAC224] px-2 py-0.5 rounded text-[11px] font-extrabold shrink-0">{{ reqItem.qty | number }}x</span>
                                <div class="truncate">
                                  <p class="text-xs font-bold text-white truncate">{{ reqItem.name }}</p>
                                  <p class="text-[10px] text-white/50">₱{{ reqItem.unitPrice | number:'1.2-2' }} / unit</p>
                                </div>
                              </div>
                              <span class="text-xs font-extrabold text-[#9be15d] whitespace-nowrap">₱{{ reqItem.subtotal | number:'1.2-2' }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                      @if (results.canFulfill) {
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between w-full bg-black/20 p-5 rounded-2xl border border-white/5 gap-4">
                           <div class="flex items-center gap-4">
                              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#9be15d]/20 border border-[#9be15d]/40">✅</div>
                              <div>
                                 <h4 class="text-xl font-bold text-white">Target Order is Feasible!</h4>
                              </div>
                           </div>
                           <button (click)="openCheckoutModal()" [disabled]="isSubmitting()" class="bg-[#9be15d] hover:bg-[#b0f07a] disabled:opacity-50 text-[#1d2f0d] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(155,225,93,0.5)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> 
                             Proceed to Client Checkout
                           </button>
                        </div>
                      } @else {
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between w-full bg-black/20 p-5 rounded-2xl border border-white/5 gap-4">
                           <div class="flex items-center gap-4">
                              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#B4161B]/20 text-[#ffb4b7]">🚨</div>
                              <div>
                                 <h4 class="text-xl font-bold text-white">Material Shortage Detected</h4>
                                 <p class="text-xs text-[#ffb4b7] font-bold mt-0.5">You lack sufficient inventory to complete the target order amount.</p>
                                 <p class="text-xs font-medium text-white/60 mt-1.5">Insufficient stock for: <span class="font-bold underline decoration-[#ffb4b7]/50 underline-offset-2">{{ results.shortIngredients.join(', ') }}</span></p>
                              </div>
                           </div>
                           @if (results.requirements.length > 0) {
                             <button (click)="autoProcureShortfalls()" [disabled]="isSubmitting()" class="bg-[#B4161B] hover:bg-[#8f1115] disabled:opacity-50 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(180,22,27,0.5)] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0">
                               <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> 
                               Auto-Procure Shortfalls
                             </button>
                           }
                        </div>
                      }
                    </div>

                    <div class="overflow-x-auto rounded-2xl border border-white/10 custom-scrollbar">
                      <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                        <thead class="text-white text-[12px] uppercase tracking-wider font-bold sticky-thead">
                          <tr>
                            <th class="px-5 py-4">Ingredient Required (Combined)</th>
                            <th class="px-5 py-4 text-right">Target Needed</th>
                            <th class="px-5 py-4 text-right">In Stock</th>
                            <th class="px-5 py-4 text-right">Shortfall</th>
                            <th class="px-5 py-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10 font-medium">
                          @for (req of results.requirements; track req.material) {
                            <tr [class]="req.shortfall > 0 ? 'bg-[#B4161B]/15 hover:bg-[#B4161B]/25 transition-colors' : 'hover:bg-white/10 transition-colors'">
                              <td class="px-5 py-4 font-bold text-white">{{ req.material }}<br><span class="text-[10px] text-white/45 tracking-widest uppercase font-bold">{{ req.sku }}</span></td>
                              <td class="px-5 py-4 text-right font-extrabold text-[#EAC224]">{{ req.required | number }} {{ req.unit }}</td>
                              <td class="px-5 py-4 text-right font-bold text-white/85">{{ req.available | number }} {{ req.unit }}</td>
                              <td [class]="'px-5 py-4 text-right font-extrabold ' + (req.shortfall > 0 ? 'text-[#ffb4b7]' : 'text-white/25')">
                                {{ req.shortfall > 0 ? (req.shortfall | number) + ' ' + req.unit : '—' }}
                              </td>
                              <td class="px-5 py-4 text-center">
                                <span [class]="'px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ' + (req.shortfall > 0 ? 'bg-[#B4161B] text-white border-transparent' : okChip)">
                                  {{ req.shortfall > 0 ? 'SHORTAGE' : 'READY' }}
                                </span>
                              </td>
                            </tr>
                          }
                          @if (results.requirements.length === 0) {
                            <tr>
                              <td colspan="5" class="py-12 text-center">
                                <p class="text-[#ffb4b7] font-bold text-lg mb-1">Missing BOM Recipe</p>
                                <p class="text-white/50 text-sm">No Bill of Materials recorded for the selected products in the database. Please setup the recipes first.</p>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- 3. CURRENT RECEIVED STOCKS -->
            @if (activeTab() === 'received') {
              <div class="animate-in fade-in duration-300 space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <div>
                    <h2 class="text-2xl font-semibold mb-1">Current Received Stocks (GRN Log)</h2>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                      <label class="text-xs font-bold text-white/80 uppercase tracking-wider">Supplier:</label>
                      <select [ngModel]="receivedSupplierFilter()" (ngModelChange)="receivedSupplierFilter.set($event)" class="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                        <option value="">All Suppliers</option>
                        @for (s of suppliers(); track s.id) {
                          <option [value]="s.name">{{ s.name }}</option>
                        }
                      </select>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-xs font-bold text-white/80 uppercase tracking-wider">Routing Status:</label>
                      <select [ngModel]="receivedStatusFilter()" (ngModelChange)="receivedStatusFilter.set($event)" class="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-semibold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                        <option value="all">All Statuses</option>
                        <option value="Routed to QA">Routed to QA</option>
                        <option value="Cleared to Warehouse">Cleared to Warehouse</option>
                        <option value="Quarantined (Hold)">Quarantined (Hold)</option>
                        <option value="Returned to Vendor">Returned to Vendor</option>
                        <option value="Scrapped">Scrapped</option>
                        <option value="Reworked">Reworked</option>
                      </select>
                    </div>
                    @if (receivedSupplierFilter() || receivedStatusFilter() !== 'all') {
                      <button (click)="receivedSupplierFilter.set(''); receivedStatusFilter.set('all')" class="text-xs font-bold text-[#EAC224] hover:underline px-2 py-1 cursor-pointer">
                        Reset
                      </button>
                    }
                  </div>
                </div>

                <!-- FIXED: Flush sticky header + formatted material receipt without duplicate "(1 units)" -->
                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-y-auto overflow-x-auto max-h-[520px] custom-scrollbar relative">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="px-5 py-4 whitespace-nowrap">Receipt Date</th>
                        <th class="px-5 py-4 whitespace-nowrap">Batch Code</th>
                        <th class="px-5 py-4 whitespace-nowrap">GRN Number</th>
                        <th class="px-5 py-4 whitespace-nowrap">PO Ref</th>
                        <th class="px-5 py-4 whitespace-nowrap">Supplier</th>
                        <th class="px-5 py-4 min-w-[240px]">Material &amp; Qty</th>
                        <th class="px-5 py-4 whitespace-nowrap text-right">Routing Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (r of filteredReceivedStocks(); track r.grn_number) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="px-5 py-4 whitespace-nowrap font-semibold text-white/75">{{ r.exact_date || r.timestamp || 'N/A' }}</td>
                          <td class="px-5 py-4 whitespace-nowrap font-bold text-white/80">{{ r.batch_code || '—' }}</td>
                          <td class="px-5 py-4 whitespace-nowrap font-extrabold text-[#9be15d]">{{ r.grn_number }}</td>
                          <td class="px-5 py-4 whitespace-nowrap font-bold text-[#EAC224]">{{ r.po_number }}</td>
                          <td class="px-5 py-4 whitespace-nowrap font-bold text-white">{{ r.supplier_name }}</td>
                          <td class="px-5 py-4 text-white/90 leading-relaxed">{{ formatMaterialReceipt(r.material_desc, r.qty) }}</td>
                          <td class="px-5 py-4 whitespace-nowrap text-right">
                            <span [class]="'inline-block border px-3.5 py-1.5 rounded-full text-xs font-bold ' + getGrnChipClass(r.routing_status)">
                              {{ r.routing_status || 'Received' }}
                            </span>
                          </td>
                        </tr>
                      }
                      @if (filteredReceivedStocks().length === 0) {
                        <tr><td colspan="7" class="py-12 text-center text-white/50">No receiving logs found matching your filter.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 4. FINISHED GOODS -->
            @if (activeTab() === 'finished') {
              <div class="animate-in fade-in duration-300 space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 class="text-2xl font-semibold">Sellable finished goods</h2>
                  <button (click)="openNewRunModal()" class="bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-5 py-2 rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer">
                    + Schedule Production Run
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="bg-white/10 p-5 rounded-2xl border border-white/15 border-b-4 border-b-white/40">
                    <span class="text-xs font-bold text-white/65 block mb-1 uppercase tracking-wider">Total sellable units</span>
                    <span class="text-2xl font-extrabold">{{ finishedGoodsTotal() | number }} units</span>
                  </div>
                  <div class="bg-[#9be15d]/10 p-5 rounded-2xl border border-[#9be15d]/25 border-b-4 border-b-[#9be15d]">
                    <span class="text-xs font-bold text-[#b7f27c] block mb-1 uppercase tracking-wider">Available for sale</span>
                    <span class="text-2xl font-extrabold text-[#9be15d]">{{ finishedGoodsAvailable() | number }} units</span>
                  </div>
                  <div class="bg-[#EAC224]/10 p-5 rounded-2xl border border-[#EAC224]/25 border-b-4 border-b-[#EAC224]">
                    <span class="text-xs font-bold text-[#EAC224] block mb-1 uppercase tracking-wider">Allocated (awaiting dispatch)</span>
                    <span class="text-2xl font-extrabold text-[#EAC224]">{{ finishedGoodsAllocated() | number }} units</span>
                  </div>
                  <div class="bg-[#B4161B]/15 p-5 rounded-2xl border border-[#B4161B]/35 border-b-4 border-b-[#ef4444]">
                    <span class="text-xs font-bold text-[#ffb4b7] block mb-1 uppercase tracking-wider">Low stock alerts</span>
                    <span class="text-2xl font-extrabold text-[#ffb4b7]">{{ finishedGoodsLow() }} SKUs</span>
                  </div>
                </div>

                <div class="bg-black/25 rounded-2xl border border-white/10 overflow-y-auto overflow-x-auto max-h-[520px] custom-scrollbar">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="px-5 py-4">Product SKU</th>
                        <th class="px-5 py-4">Product name</th>
                        <th class="px-5 py-4 text-right">Available stock</th>
                        <th class="px-5 py-4 text-right">Allocated stock</th>
                        <th class="px-5 py-4 text-right">Total on-hand</th>
                        <th class="px-5 py-4">Status</th>
                        <th class="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (g of filteredFinishedGoods(); track g.sku) {
                        <tr [class]="g.low ? 'bg-[#B4161B]/20 hover:bg-[#B4161B]/30 transition-colors' : 'hover:bg-white/10 transition-colors'">
                          <td [class]="'px-5 py-4 text-xs font-bold ' + (g.low ? 'text-[#ffb4b7] shadow-[inset_4px_0_0_#ef4444]' : 'text-white/70')">{{ g.sku }}</td>
                          <td [class]="'px-5 py-4 font-bold ' + (g.low ? 'text-[#ffb4b7]' : 'text-white')">{{ g.name }}</td>
                          <td [class]="'px-5 py-4 text-right font-extrabold ' + (g.low ? 'text-[#ffb4b7]' : 'text-white')">{{ g.avail | number }}</td>
                          <td [class]="'px-5 py-4 text-right font-bold ' + (g.alloc > 0 ? 'text-[#EAC224]' : 'text-white/40')">{{ g.alloc | number }}</td>
                          <td class="px-5 py-4 text-right font-extrabold">{{ g.total | number }}</td>
                          <td class="px-5 py-4"><span [class]="'px-3 py-1.5 rounded-full text-[11px] font-bold border ' + (g.low ? 'bg-[#B4161B] text-white border-transparent' : okChip)">{{ g.low ? 'LOW STOCK' : 'IN STOCK' }}</span></td>
                          <td class="px-5 py-4 text-right space-x-2">
                            <button (click)="planProductInMrp(g.sku)" class="bg-[#EAC224]/15 hover:bg-[#EAC224] text-[#EAC224] hover:text-[#1d2f0d] border border-[#EAC224]/35 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer" title="Simulate production in MRP">
                              ⚙️ Plan MRP
                            </button>
                            <button (click)="viewProductRuns(g.name)" aria-label="View production runs" class="bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer" title="View production history">
                              🕒 Runs
                            </button>
                          </td>
                        </tr>
                      }
                      @if (filteredFinishedGoods().length === 0) {
                        <tr><td colspan="7" class="py-12 text-center text-white/50">No products match your search.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 5. RUN MANAGER -->
            @if (activeTab() === 'runs') {
              <div class="animate-in fade-in duration-300 space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 class="text-2xl font-semibold">Production run manager</h2>
                  </div>
                  <!-- FIXED: Connected previously dead button to openNewRunModal() -->
                  <button (click)="openNewRunModal()" class="tracking-wide bg-[#EAC224] hover:bg-[#f5d34a] text-[#2d3e15] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-8px_rgba(234,194,36,0.7)] transition-colors flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    Start manual run
                  </button>
                </div>

                <div class="max-h-[520px] overflow-y-auto overflow-x-auto bg-black/25 rounded-2xl border border-white/10 custom-scrollbar">
                  <table class="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead class="text-white text-[14px] font-bold sticky-thead">
                      <tr>
                        <th class="py-4 px-5">Run ID</th>
                        <th class="py-4 px-5">Target Product</th>
                        <th class="py-4 px-5">Planned units</th>
                        <th class="py-4 px-5">Actual units</th>
                        <th class="py-4 px-5">Status</th>
                        <th class="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10 font-medium">
                      @for (r of filteredRuns(); track r.id) {
                        <tr class="hover:bg-white/10 transition-colors">
                          <td class="py-4 px-5 font-extrabold text-[#EAC224]">{{ r.id }}</td>
                          <td class="py-4 px-5 text-sm font-bold text-white">{{ r.bom }}</td>
                          <td class="py-4 px-5 text-xs font-bold text-white/75">{{ r.planned }}</td>
                          <td [class]="'py-4 px-5 text-xs font-extrabold ' + (r.actual === '--' ? 'text-white/35' : 'text-[#9be15d]')">{{ r.actual }}</td>
                          <td class="py-4 px-5"><span [class]="'px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border ' + r.chip">{{ r.status }}</span></td>
                          <td class="py-4 px-5 text-right">
                            <button (click)="openUpdateModal(r)" [disabled]="r.status === 'COMPLETED'" class="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm cursor-pointer inline-flex items-center gap-2">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              Update Progress
                            </button>
                          </td>
                        </tr>
                      }
                      @if (filteredRuns().length === 0) {
                         <tr><td colspan="6" class="py-12 text-center text-white/50">No production runs match your search.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- 6. BOM VIEWER -->
            @if (activeTab() === 'bom') {
              <div class="animate-in fade-in duration-300 space-y-6">
                
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 class="text-2xl font-semibold">Bill of materials (BOM)</h2>
                  
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-semibold text-white/70">Select Catalog Product:</label>
                    <select [ngModel]="selectedProductSku()" (ngModelChange)="onBomProductSelect($event)" class="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm text-white font-bold outline-none focus:border-[#EAC224] [&>option]:bg-[#1d2f0d] cursor-pointer">
                      @for (p of catalogItems(); track p.sku) {
                        <option [value]="p.sku">{{ p.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="bg-black/25 rounded-3xl p-6 border border-white/10 max-w-4xl">
                  <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div class="bg-white/10 px-6 py-4 flex flex-wrap justify-between items-center gap-2 border-b border-white/10">
                      <span class="font-semibold text-lg">{{ getSelectedProductName() }} <span class="text-white/50 text-sm ml-2">({{ selectedProductSku() }})</span></span>
                      <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-[#9be15d]/15 text-[#b7f27c] border border-[#9be15d]/30 rounded-full text-xs font-bold">Standard Recipe (Per 1 Unit)</span>
                        <button (click)="planProductInMrp(selectedProductSku())" class="text-xs font-bold text-[#EAC224] hover:underline cursor-pointer">Simulate in MRP →</button>
                      </div>
                    </div>
                    <div class="divide-y divide-white/10">
                      @for (b of currentBom(); track b.name) {
                        <div class="px-6 py-4 flex justify-between items-center text-sm font-medium hover:bg-white/5 transition-colors">
                          <span class="font-bold text-white/90">{{ b.name }}</span>
                          <span class="font-extrabold text-[#EAC224]">{{ b.qty }}</span>
                        </div>
                      }
                      @if (currentBom().length === 0) {
                         <div class="px-6 py-8 text-center text-white/50 text-sm">No recipe materials defined for this product.</div>
                      }
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
            <defs><linearGradient id="wRBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e3"/></linearGradient></defs>
            <circle class="a-spark" cx="52" cy="176" r="3" fill="#fef08a"/>
            <circle class="a-spark d1" cx="70" cy="184" r="4" fill="#f97316"/>
            <g class="a-flame">
              <path d="M42 150 C42 192 60 212 60 212 C60 212 78 192 78 150 Z" fill="#f97316"/>
              <path d="M49 150 C49 176 60 190 60 190 C60 190 71 176 71 150 Z" fill="#fef08a"/>
            </g>
            <path d="M32 100 C8 116 4 150 18 165 L44 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M88 100 C112 116 116 150 102 165 L76 138 Z" fill="#B4161B" stroke="#7d0a10" stroke-width="3" stroke-linejoin="round"/>
            <path d="M60 10 C15 48 26 118 38 150 Q60 160 82 150 C94 118 105 48 60 10 Z" fill="url(#wRBody)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M60 10 C38 30 32 52 30 68 Q60 78 90 68 C88 52 82 30 60 10 Z" fill="#B4161B"/>
            <path d="M40 134 Q60 142 80 134" stroke="#EAC224" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="104" r="22" fill="#cbd5e1" stroke="#475559" stroke-width="3"/>
            <circle cx="60" cy="104" r="16" fill="#22d3ee" stroke="#0891b2" stroke-width="2"/>
            <path d="M50 96 A11 11 0 0 1 68 100" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          </svg>
        </div>

        <div class="a-bob-a hidden md:block absolute z-20 -top-7 left-[42%] w-14 pointer-events-none candy-shadow">
          <svg viewBox="0 0 120 120" fill="none">
            <defs><linearGradient id="wStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#eaa10f"/></linearGradient></defs>
            <polygon points="60,8 74.1,40.6 109.5,43.9 82.8,67.4 90.6,102.1 60,84 29.4,102.1 37.2,67.4 10.5,43.9 45.9,40.6" fill="url(#wStar)" stroke="#f3b929" stroke-width="10" stroke-linejoin="round"/>
            <path d="M50 30 L58 22" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>

        <div class="a-bob-b hidden md:block absolute z-20 -bottom-12 -right-8 w-36 pointer-events-none candy-shadow">
          <svg viewBox="0 0 220 190" fill="none">
            <defs>
              <linearGradient id="wGlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6f88f"/><stop offset="1" stop-color="#5fa61a"/></linearGradient>
              <mask id="wDonut"><rect width="220" height="190" fill="white"/><ellipse cx="110" cy="88" rx="34" ry="23" fill="black"/></mask>
            </defs>
            <g mask="url(#wDonut)">
              <ellipse cx="110" cy="102" rx="104" ry="82" fill="#a86414"/>
              <ellipse cx="110" cy="90" rx="104" ry="82" fill="#e8a33d"/>
              <ellipse cx="110" cy="84" rx="93" ry="70" fill="url(#wGlz)"/>
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
export class WarehouseComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  activeTab = signal<'ledger' | 'mrp' | 'received' | 'finished' | 'runs' | 'bom'>('ledger');

  activeCls = 'bg-[#EAC224] text-[#2d3e15] shadow-[0_8px_20px_-8px_rgba(234,194,36,0.7)]';
  idleCls = 'text-white/70 hover:bg-white/10 hover:text-white';
  okChip = 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30';

  // State Signals (Warehouse)
  materials = signal<any[]>([]);
  finishedGoods = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  receivedStocks = signal<any[]>([]);
  catalogPrices = signal<Record<string, number>>({});

  // State Signals (Production)
  runs = signal<any[]>([]);
  catalogItems = signal<any[]>([]);
  selectedProductSku = signal<string>('FG-JWH-001'); 
  currentBom = signal<{name: string, qty: string}[]>([]);

  // MULTI-SELECT MRP State
  mrpItems = signal<{productSku: string, qty: number}[]>([{productSku: '', qty: 1}]);
  mrpResults = signal<any>(null);

  // Address Autocomplete Signals
  addressSuggestions = signal<string[]>([]);
  private addressTimeout: any;

  // Search & Filters
  searchQuery = signal<string>('');
  ledgerFilter = signal<'all' | 'AVAILABLE' | 'LOW STOCK'>('all');
  stockFilter = signal<'all' | 'low' | 'ok' | 'high'>('all');
  receivedSupplierFilter = signal<string>('');
  receivedStatusFilter = signal<string>('all');

  isSubmitting = signal<boolean>(false);
  toast = signal<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  // Add Material Modal State
  addMaterialModal = { show: false, sku: '', name: '', category: 'RAW_MATERIAL', uom: 'kg', min_reorder_level: 100, max_capacity: 1000 };

  // Reorder Modal State
  reorderModal = { show: false, material: '', sku: '', qty: 1, cost: null as any, supplierId: '', supplierName: '', catalogName: '', unit: '' };
  availableManualMaterials = signal<{name: string, price: number}[]>([]);

  // Checkout Modal State
  checkoutModal = { 
    show: false, 
    status: 'idle' as 'idle' | 'generating' | 'done', 
    checkoutUrl: '', 
    clientEmail: '',
    clientName: '',
    token: ''
  };

  // Payment Polling 
  paymentPollInterval: any;

  // Start Manual Run Modal State
  newRunModal = { show: false, productName: '', plannedQty: 100, status: 'SCHEDULED' };

  // Update Run Modal State
  updateModal = { show: false, id: '', bom: '', planned: '', actual: null as number | null, status: '' };

  filters: { key: 'all' | 'low' | 'ok' | 'high'; label: string }[] = [
    { key: 'all', label: 'All Tracked' },
    { key: 'low', label: 'Low Alert' },
    { key: 'ok', label: 'Healthy' },
    { key: 'high', label: 'Near Capacity' }
  ];

  private looks = {
    low:  { label: 'LOW STOCK',  card: 'bg-[#B4161B]/15 border-[#B4161B]/45', bar: 'bg-[#ef4444]', chip: 'bg-[#B4161B] text-white border-transparent' },
    ok:   { label: 'HEALTHY',    card: 'bg-white/5 border-white/10',          bar: 'bg-[#9be15d]', chip: this.okChip },
    high: { label: 'HIGH STOCK', card: 'bg-[#22d3ee]/10 border-[#22d3ee]/30', bar: 'bg-[#22d3ee]', chip: 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35' }
  };

  getTabIndex(): number {
    return ['ledger', 'mrp', 'received', 'finished', 'runs', 'bom'].indexOf(this.activeTab());
  }

  formatMaterialReceipt(desc: string, qty: any): string {
    const cleanDesc = (desc || '').replace(/\(1 units\)/gi, '(1 unit)').trim();
    if (qty === undefined || qty === null || qty === '') return cleanDesc;

    const rawQty = String(qty).trim();
    if (/\(\d+\s*units?\)$/i.test(cleanDesc)) {
      return cleanDesc;
    }

    const numMatch = rawQty.match(/^(\d+(?:\.\d+)?)\s*(units?)?$/i);
    if (numMatch) {
      const count = parseFloat(numMatch[1]);
      return `${cleanDesc} (${count} ${count === 1 ? 'unit' : 'units'})`;
    }
    return `${cleanDesc} (${rawQty.replace(/\b1 units\b/gi, '1 unit')})`;
  }

  isMrpProductSelected(sku: string, currentIndex: number): boolean {
    return this.mrpItems().some((item, idx) => idx !== currentIndex && item.productSku === sku);
  }

  getIconForMaterial(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('sugar')) return '🧊';
    if (n.includes('extract') || n.includes('color')) return '🧪';
    if (n.includes('milk')) return '🥛';
    if (n.includes('nut') || n.includes('peanut')) return '🥜';
    if (n.includes('butter')) return '🧈';
    if (n.includes('pouch') || n.includes('wrapper') || n.includes('film')) return '📦';
    if (n.includes('jar')) return '🥡';
    if (n.includes('puree') || n.includes('pulp')) return '🥭';
    if (n.includes('cocoa') || n.includes('chocolate')) return '🍫';
    if (n.includes('cheese')) return '🧀';
    return '🏭';
  }

  getGrnChipClass(status: string): string {
    if (!status) return 'border-[#22d3ee]/40 text-[#7fe7f7] bg-[#22d3ee]/15';
    if (status === 'Cleared to Warehouse') return 'border-[#9be15d]/40 text-[#b7f27c] bg-[#9be15d]/15';
    if (status.includes('Quarantined')) return 'border-[#B4161B]/40 text-[#ffb4b7] bg-[#B4161B]/15';
    if (status === 'Returned to Vendor') return 'border-[#ff9d1c]/40 text-[#ffbe66] bg-[#ff9d1c]/15';
    if (status === 'Scrapped') return 'border-white/30 text-white/70 bg-white/10';
    if (status === 'Reworked') return 'border-[#EAC224]/40 text-[#EAC224] bg-[#EAC224]/15';
    return 'border-[#22d3ee]/40 text-[#7fe7f7] bg-[#22d3ee]/15'; 
  }

  ngOnInit() {
    fetch('http://localhost:3000/api/seed-bom').catch(() => {});
    
    this.fetchWarehouseData();
    this.fetchReceivedStocks();
    this.fetchProductionRuns();
    
    this.apiService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers.set(data.map(s => ({ id: s.supplier_id, name: s.name, category: s.category || '' })));
        this.cdr.markForCheck();
      }
    });

    this.apiService.getPosCatalog().subscribe({
      next: (data) => {
        const prices: Record<string, number> = {};
        data.forEach((item: any) => {
          prices[item.sku] = parseFloat(item.price);
        });
        this.catalogPrices.set(prices);

        this.catalogItems.set(data);
        if (!data.some((d: any) => d.sku === this.selectedProductSku()) && data.length > 0) {
          this.selectedProductSku.set(data[0].sku);
        }
        this.loadBomForSelectedProduct();
        this.cdr.markForCheck();
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ show: true, message, type });
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toast.update(t => ({ ...t, show: false }));
      this.cdr.markForCheck();
    }, 4000);
  }

  // --- PRODUCTION RUN MANAGER LOGIC ---
  fetchProductionRuns() {
    this.apiService.getProductionRuns().subscribe({
      next: (data) => {
        const dbRuns = data.map(d => ({
          id: d.run_id,
          bom: d.bom_id || 'Unknown Recipe',
          planned: `${d.planned_units} packs`,
          actual: d.actual_units ? `${d.actual_units} packs` : '--',
          started: d.started_at,
          ended: d.ended_at || '',
          status: d.status,
          chip: d.status === 'COMPLETED' ? 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30' 
              : d.status === 'SCHEDULED' ? 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35'
              : 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35'
        }));

        this.runs.set(dbRuns);
        this.cdr.markForCheck();
      }
    });
  }

  openNewRunModal() {
    const defaultProduct = this.finishedGoods().length > 0 ? this.finishedGoods()[0].name : '';
    this.newRunModal = { show: true, productName: defaultProduct, plannedQty: 100, status: 'SCHEDULED' };
    this.cdr.markForCheck();
  }

  closeNewRunModal() {
    this.newRunModal.show = false;
    this.cdr.markForCheck();
  }

  submitNewRun() {
    if (!this.newRunModal.productName || this.newRunModal.plannedQty < 1) return;
    this.isSubmitting.set(true);

    setTimeout(() => {
      const nextNum = this.runs().length + 101;
      const newRun = {
        id: `RUN-2026-${nextNum}`,
        bom: this.newRunModal.productName,
        planned: `${this.newRunModal.plannedQty} packs`,
        actual: '--',
        started: new Date().toISOString(),
        ended: '',
        status: this.newRunModal.status,
        chip: this.newRunModal.status === 'SCHEDULED'
          ? 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35'
          : 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35'
      };

      this.runs.update(r => [newRun, ...r]);
      this.isSubmitting.set(false);
      this.closeNewRunModal();
      this.showToast(`Production run ${newRun.id} queued for ${newRun.bom}!`, 'success');
    }, 500);
  }

  openUpdateModal(run: any) {
    this.updateModal = {
      show: true,
      id: run.id,
      bom: run.bom,
      planned: run.planned,
      actual: run.actual !== '--' ? parseInt(run.actual, 10) : null,
      status: run.status
    };
    this.cdr.markForCheck();
  }

  closeUpdateModal() {
    this.updateModal.show = false;
    this.cdr.markForCheck();
  }

  submitRunUpdate() {
    this.isSubmitting.set(true);
    
    setTimeout(() => {
      this.runs.update(currentRuns => currentRuns.map(r => {
        if (r.id === this.updateModal.id) {
          const isCompleted = this.updateModal.status === 'COMPLETED';
          return {
            ...r,
            actual: this.updateModal.actual ? `${this.updateModal.actual} packs` : '--',
            status: this.updateModal.status,
            ended: isCompleted ? 'Completed just now' : r.ended,
            chip: isCompleted ? 'bg-[#9be15d]/15 text-[#b7f27c] border-[#9be15d]/30'
                : this.updateModal.status === 'IN PROGRESS' ? 'bg-[#EAC224]/15 text-[#EAC224] border-[#EAC224]/35'
                : 'bg-[#22d3ee]/15 text-[#7fe7f7] border-[#22d3ee]/35'
          };
        }
        return r;
      }));

      this.isSubmitting.set(false);
      this.closeUpdateModal();
      this.showToast('Production run progress successfully recorded!', 'success');
    }, 600);
  }

  getSelectedProductName(): string {
    const p = this.catalogItems().find(i => i.sku === this.selectedProductSku());
    return p ? p.name : 'Unknown Product';
  }

  onBomProductSelect(sku: string) {
    this.selectedProductSku.set(sku);
    this.loadBomForSelectedProduct();
  }

  loadBomForSelectedProduct() {
    const payload = { productSku: this.selectedProductSku(), qty: 1 };
    
    fetch('http://localhost:3000/api/calculate-materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(res => {
      if (res.success && res.requirements) {
        this.currentBom.set(res.requirements.map((req: any) => ({
          name: req.material,
          qty: `${req.required} ${req.unit}`
        })));
      } else {
        this.currentBom.set([]);
      }
      this.cdr.markForCheck();
    })
    .catch(() => {
      this.currentBom.set([]);
      this.cdr.markForCheck();
    });
  }

  // Quick actions from Finished Goods & BOM tabs
  planProductInMrp(sku: string) {
    this.mrpItems.set([{ productSku: sku, qty: 100 }]);
    this.activeTab.set('mrp');
    this.calculateMRP();
  }

  viewProductRuns(productName: string) {
    this.searchQuery.set(productName);
    this.activeTab.set('runs');
  }

  // --- WAREHOUSE & MRP LOGIC ---
  runAutoRestock() {
    this.isSubmitting.set(true);
    fetch('http://localhost:3000/api/auto-restock', { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        this.isSubmitting.set(false);
        if (res.success && res.count > 0) {
          this.showToast(`Successfully generated ${res.count} Purchase Requisitions for low-stock items!`, 'success');
        } else if (res.success && res.count === 0) {
          this.showToast('All items are already at healthy capacity.', 'success');
        } else {
          this.showToast('Failed to auto-replenish items.', 'error');
        }
        this.cdr.markForCheck();
      })
      .catch(() => {
        this.isSubmitting.set(false);
        this.showToast('Server error during auto-replenishment.', 'error');
        this.cdr.markForCheck();
      });
  }

  pushToMRP() {
    this.mrpItems.set([{ productSku: 'FG-TAM-001', qty: 150 }]);
    this.activeTab.set('mrp'); 
    setTimeout(() => this.calculateMRP(), 500); 
  }

  addMrpRow() {
    this.mrpItems.update(items => [...items, { productSku: '', qty: 1 }]);
  }

  removeMrpRow(index: number) {
    this.mrpItems.update(items => items.filter((_, i) => i !== index));
  }

  calculateMRP() {
    this.isSubmitting.set(true);
    const items = this.mrpItems().filter(i => i.productSku && i.qty > 0);

    if (items.length === 0) {
      this.showToast('Please select at least one product with a valid quantity.', 'error');
      this.isSubmitting.set(false);
      return;
    }

    const requests = items.map(item => 
      fetch('http://localhost:3000/api/calculate-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).then(r => r.json())
    );

    Promise.all(requests).then(responses => {
      const aggregatedReqs: Record<string, any> = {};
      let hasError = false;

      responses.forEach(res => {
        if (!res.success) hasError = true;
        if (res.requirements) {
          res.requirements.forEach((req: any) => {
            if (!aggregatedReqs[req.material]) {
              aggregatedReqs[req.material] = { ...req };
            } else {
              aggregatedReqs[req.material].required += req.required;
              const diff = aggregatedReqs[req.material].required - aggregatedReqs[req.material].available;
              aggregatedReqs[req.material].shortfall = diff > 0 ? diff : 0;
            }
          });
        }
      });

      if (hasError) {
        this.showToast('Failed to analyze BOM for some products.', 'error');
        this.isSubmitting.set(false);
        this.cdr.markForCheck();
        return;
      }

      const finalRequirements = Object.values(aggregatedReqs);
      const canFulfill = finalRequirements.every((r: any) => r.shortfall === 0);
      
      const prices = this.catalogPrices();
      const totalValue = items.reduce((sum, item) => sum + ((prices[item.productSku] || 0) * item.qty), 0);
      const totalUnits = items.reduce((sum, item) => sum + item.qty, 0);

      const aggregatedRequests = new Map();
      items.forEach(item => {
         const unitPrice = prices[item.productSku] || 0;
         if (aggregatedRequests.has(item.productSku)) {
            const entry = aggregatedRequests.get(item.productSku);
            entry.qty += item.qty;
            entry.subtotal = entry.qty * unitPrice;
         } else {
            const fg = this.finishedGoods().find(g => g.sku === item.productSku);
            aggregatedRequests.set(item.productSku, {
               sku: item.productSku,
               name: fg ? fg.name : item.productSku,
               qty: item.qty,
               unitPrice: unitPrice,
               subtotal: item.qty * unitPrice
            });
         }
      });
      const requestedItemsWithNames = Array.from(aggregatedRequests.values());
      const shortIngredients = finalRequirements.filter((r: any) => r.shortfall > 0).map((r: any) => r.material);

      this.mrpResults.set({
         canFulfill,
         requirements: finalRequirements,
         totalValue,
         totalUnits,
         requestedItems: requestedItemsWithNames,
         shortIngredients
      });

      this.isSubmitting.set(false);
      this.cdr.markForCheck();
    }).catch(() => {
      this.isSubmitting.set(false);
      this.showToast('Network error analyzing materials.', 'error');
      this.cdr.markForCheck();
    });
  }

  openCheckoutModal() {
    this.checkoutModal = { 
      show: true, 
      status: 'idle', 
      checkoutUrl: '', 
      clientEmail: '',
      clientName: '',
      token: ''
    };
    this.cdr.markForCheck();
  }

  closeCheckoutModal() {
    this.checkoutModal.show = false;
    if (this.paymentPollInterval) {
      clearInterval(this.paymentPollInterval);
    }
    this.cdr.markForCheck();
  }

  onAddressSearch(val: string) {
    if (this.addressTimeout) clearTimeout(this.addressTimeout);
    if (!val || val.length < 3) {
      this.addressSuggestions.set([]);
      return;
    }

    this.addressTimeout = setTimeout(() => {
      const apiKey = 'aa2bebe4416f412b972b1378e8e8054a';
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&lang=en&limit=5&filter=countrycode:ph&apiKey=${apiKey}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.features) {
            this.addressSuggestions.set(data.features.map((f: any) => f.properties.formatted));
            this.cdr.markForCheck();
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }, 300);
  }

  generatePaymentLink() {
    this.checkoutModal.status = 'generating';
    this.cdr.markForCheck();
    const results = this.mrpResults();

    const payload = {
      clientEmail: this.checkoutModal.clientEmail,
      clientName: this.checkoutModal.clientName,
      orderItems: results.requestedItems,
      totalAmount: results.totalValue,
      totalUnits: results.totalUnits
    };

    this.apiService.generateSmartPaymentLink(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.checkoutModal.status = 'done';
          this.checkoutModal.checkoutUrl = res.url || res.checkout_url;
          this.checkoutModal.token = res.token; 
          this.showToast(res.message, 'success');
          
          // Start automated polling for the webhook completion
          this.paymentPollInterval = setInterval(() => {
            this.apiService.getPendingOrder(res.token).subscribe({
              next: (orderRes) => {
                if (orderRes.success && orderRes.data.status === 'PAID') {
                  this.showToast('Client payment completed successfully! Production run queued.', 'success');
                  clearInterval(this.paymentPollInterval);
                  this.mrpResults.set(null);
                  this.mrpItems.set([{ productSku: '', qty: 1 }]);
                  this.closeCheckoutModal();
                  this.fetchProductionRuns();
                  this.cdr.markForCheck();
                }
              }
            });
          }, 3000); 

        } else {
          this.checkoutModal.status = 'idle';
          this.showToast(res.error || 'Failed to generate link.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.checkoutModal.status = 'idle';
        this.showToast('Server error connecting to backend.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  copyLink() {
    navigator.clipboard.writeText(this.checkoutModal.checkoutUrl).then(() => {
      this.showToast('Payment link copied to clipboard successfully!', 'success');
    });
  }

  emailLink() {
    if (!this.checkoutModal.clientEmail || !this.checkoutModal.checkoutUrl) {
       this.showToast('Please enter an email address and generate the link first.', 'error');
       return;
    }
    
    this.isSubmitting.set(true);

    const payload = {
      clientEmail: this.checkoutModal.clientEmail,
      clientName: this.checkoutModal.clientName,
      checkoutUrl: this.checkoutModal.checkoutUrl,
      totalAmount: this.mrpResults().totalValue
    };

    this.apiService.sendPaymentLinkEmail(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast(`Email invoice sent successfully to ${this.checkoutModal.clientEmail}!`, 'success');
        } else {
          this.showToast('Failed to send email through system.', 'error');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Server error sending email.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  autoProcureShortfalls() {
    const results = this.mrpResults();
    if (!results) return;

    const shortfalls = results.requirements.filter((r: any) => r.shortfall > 0);
    let completed = 0;
    let hasError = false;

    this.isSubmitting.set(true);

    shortfalls.forEach((item: any) => {
      let foundSupplierId = '';
      let foundCost = 0;
      let foundCatalogName = item.material;

      for (const sup of this.suppliers()) {
        if (!sup.category) continue;
        const catalogItems = sup.category.split(',');
        for (const catItem of catalogItems) {
          const parts = catItem.split('|');
          const catName = parts[0].trim().toLowerCase();
          
          const coreName = item.material.toLowerCase().split('-')[0].trim();
          if (catName.includes(coreName) || coreName.includes(catName)) {
            foundSupplierId = sup.id;
            foundCost = parts.length > 1 ? parseFloat(parts[1].trim()) : 0;
            foundCatalogName = parts[0].trim();
            break;
          }
        }
        if (foundSupplierId) break;
      }

      if (!foundSupplierId) {
          console.warn('No mapped supplier for: ' + item.material);
          completed++;
          if (completed === shortfalls.length) this.finalizeAutoProcure(hasError);
          return;
      }

      this.apiService.createPurchaseOrder({
        supplierId: foundSupplierId,
        materialId: foundCatalogName,
        qty: Math.ceil(item.shortfall), 
        cost: foundCost,
        userName: 'System Auto-MRP',
        status: 'Pending Approval'
      }).subscribe({
         next: () => {
           completed++;
           if (completed === shortfalls.length) this.finalizeAutoProcure(hasError);
         },
         error: () => {
           hasError = true;
           completed++;
           if (completed === shortfalls.length) this.finalizeAutoProcure(hasError);
         }
      });
    });
  }

  finalizeAutoProcure(hasError: boolean) {
    this.isSubmitting.set(false);
    if (hasError) {
      this.showToast('Some automated POs failed to generate.', 'error');
    } else {
      this.showToast('Purchase Requisitions automatically generated for shortfalls!', 'success');
      this.mrpResults.set(null); 
    }
    this.cdr.markForCheck();
  }

  fetchWarehouseData() {
    this.apiService.getWarehouseStock().subscribe({
      next: (data) => {
        const rawMap = new Map();
        data.filter(item => item.category === 'RAW_MATERIAL' && !item.name.toLowerCase().includes('mango'))
          .forEach(m => {
             const key = m.name.toLowerCase().trim();
             if (!rawMap.has(key)) {
                rawMap.set(key, { ...m });
             } else {
                const existing = rawMap.get(key);
                existing.qty = (parseFloat(existing.qty) + parseFloat(m.qty)).toString();
             }
          });

        const raws = Array.from(rawMap.values()).map(m => {
            const qty = parseFloat(m.qty) || 0;
            const min = parseFloat(m.min_reorder_level) || 0;
            const max = parseFloat(m.max_capacity) || 1000;
            
            let pct = Math.round((qty / max) * 100);
            if (pct > 100) pct = 100;
            const minPct = Math.round((min / max) * 100);
            const status: 'low' | 'ok' | 'high' = qty <= min ? 'low' : pct >= 85 ? 'high' : 'ok';
            
            return {
              sku: m.sku,
              name: m.name,
              icon: this.getIconForMaterial(m.name),
              qty: qty,
              unit: m.uom,
              min: min,
              max: max,
              pct: pct,
              minPct: minPct,
              status: status,
              ...this.looks[status]
            };
          }).sort((a, b) => a.name.localeCompare(b.name));
        
        this.materials.set(raws);

        const fgMap = new Map();
        data.filter(item => item.category === 'FINISHED_GOOD' && !item.name.toLowerCase().includes('mango'))
          .forEach(m => {
             const key = m.name.toLowerCase().trim();
             if (!fgMap.has(key)) {
                fgMap.set(key, { ...m });
             } else {
                const existing = fgMap.get(key);
                existing.qty = (parseFloat(existing.qty) + parseFloat(m.qty)).toString();
                existing.allocated_qty = (parseFloat(existing.allocated_qty) + parseFloat(m.allocated_qty)).toString();
             }
          });

        const fgs = Array.from(fgMap.values()).map(m => {
            const total = parseFloat(m.qty) || 0;
            const alloc = parseFloat(m.allocated_qty) || 0;
            const avail = total - alloc;
            const low = avail < parseFloat(m.min_reorder_level);
            
            return {
              sku: m.sku,
              name: m.name,
              total: total,
              alloc: alloc,
              avail: avail,
              low: low,
              status: low ? 'LOW STOCK' : 'AVAILABLE'
            };
          }).sort((a, b) => a.name.localeCompare(b.name));
        
        this.finishedGoods.set(fgs);
        this.cdr.markForCheck();
      }
    });
  }

  fetchReceivedStocks() {
    if (this.apiService.getGoodsReceipts) {
      this.apiService.getGoodsReceipts().subscribe({
        next: (data) => {
          this.receivedStocks.set(data);
          this.cdr.markForCheck();
        },
        error: () => console.warn('Goods receipts fetch not supported or failed.')
      });
    }
  }

  openAddMaterialModal() {
    this.addMaterialModal = { show: true, sku: '', name: '', category: 'RAW_MATERIAL', uom: 'kg', min_reorder_level: 100, max_capacity: 1000 };
    this.cdr.markForCheck();
  }

  closeAddMaterialModal() {
    this.addMaterialModal.show = false;
    this.cdr.markForCheck();
  }

  submitNewMaterial() {
    this.isSubmitting.set(true);
    const { sku, name, category, uom, min_reorder_level, max_capacity } = this.addMaterialModal;

    setTimeout(() => {
      if (category === 'RAW_MATERIAL') {
        const min = Number(min_reorder_level) || 100;
        const max = Number(max_capacity) || 1000;
        const newMat = {
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          icon: this.getIconForMaterial(name),
          qty: 0,
          unit: uom || 'kg',
          min,
          max,
          pct: 0,
          minPct: Math.round((min / max) * 100),
          status: 'low' as const,
          ...this.looks.low
        };
        this.materials.update(list => [newMat, ...list]);
      } else {
        const newFg = {
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          total: 0,
          alloc: 0,
          avail: 0,
          low: true,
          status: 'LOW STOCK'
        };
        this.finishedGoods.update(list => [newFg, ...list]);
      }

      this.isSubmitting.set(false);
      this.closeAddMaterialModal();
      this.showToast(`Item ${sku.toUpperCase()} successfully registered!`, 'success');
    }, 500);
  }

  openReorderModal(m: any) {
    let foundSupplierId = '';
    let foundSupplierName = '';
    let foundCost = 0;
    let foundCatalogName = '';

    const targetName = m.name.toLowerCase();
    
    let searchKey = targetName;
    if (targetName.includes('clear plastic pouch')) searchKey = 'clear plastic pouch';
    else if (targetName.includes('printed plastic pouch')) searchKey = 'printed plastic pouch';
    else if (targetName.includes('pouch') || targetName.includes('film') || targetName.includes('wrapper')) searchKey = 'pouch';
    else if (targetName.includes('sugar')) searchKey = 'sugar';
    else if (targetName.includes('puree') || targetName.includes('pulp')) searchKey = 'puree';
    else if (targetName.includes('color')) searchKey = 'color';
    else if (targetName.includes('milk')) searchKey = 'milk';
    else if (targetName.includes('tamarind')) searchKey = 'tamarind';
    else if (targetName.includes('butter')) searchKey = 'butter';

    for (const sup of this.suppliers()) {
      if (!sup.category) continue;
      const items = sup.category.split(',');
      for (const item of items) {
        const parts = item.split('|');
        const catalogItemName = parts[0].trim().toLowerCase();
        
        if (catalogItemName.includes(searchKey) || targetName.includes(catalogItemName)) {
          foundSupplierId = sup.id;
          foundSupplierName = sup.name;
          foundCost = parts.length > 1 ? parseFloat(parts[1].trim()) : 0;
          foundCatalogName = parts[0].trim();
          break;
        }
      }
      if (foundSupplierId) break;
    }
    
    this.reorderModal = {
      show: true,
      material: m.name,
      catalogName: foundCatalogName,
      sku: m.sku,
      qty: 1, 
      cost: foundCost || null as any,
      supplierId: foundSupplierId,
      supplierName: foundSupplierName,
      unit: m.unit
    };

    this.availableManualMaterials.set([]);
    this.cdr.markForCheck();
  }

  onManualSupplierChange() {
    this.reorderModal.catalogName = '';
    this.reorderModal.cost = null as any;
    
    const sel = this.suppliers().find(s => s.id === this.reorderModal.supplierId);
    if (sel && sel.category) {
      const materials = sel.category.split(',').map((i: string) => {
        const parts = i.split('|');
        return { name: parts[0].trim(), price: parts.length > 1 ? parseFloat(parts[1].trim()) : 0 };
      });
      this.availableManualMaterials.set(materials);
    } else {
      this.availableManualMaterials.set([]);
    }
    this.cdr.markForCheck();
  }

  onManualMaterialChange() {
    const selected = this.availableManualMaterials().find(m => m.name === this.reorderModal.catalogName);
    if (selected) this.reorderModal.cost = selected.price;
    this.cdr.markForCheck();
  }

  closeReorderModal() {
    this.reorderModal.show = false;
    this.cdr.markForCheck();
  }

  submitReorder() {
    this.isSubmitting.set(true);
    const payload = {
      supplierId: this.reorderModal.supplierId, 
      materialId: this.reorderModal.catalogName || this.reorderModal.material, 
      qty: this.reorderModal.qty,
      cost: this.reorderModal.cost,
      userName: 'Lorenz',
      status: 'Pending Approval'
    };

    this.apiService.createPurchaseOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.showToast(`Requisition ${res.poNumber || ''} created and sent for approval!`, 'success');
          this.closeReorderModal();
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.showToast('Failed to create Purchase Requisition.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  filteredLedgerMaterials = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.ledgerFilter();
    
    return this.materials().filter(m => {
      const statusLabel = m.status === 'low' ? 'LOW STOCK' : 'AVAILABLE';
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || statusLabel === filter;
      return matchesSearch && matchesFilter;
    });
  });

  filteredMaterials = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.stockFilter();

    return this.materials().filter(m => {
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || m.status === filter;
      return matchesSearch && matchesFilter;
    });
  });

  filteredFinishedGoods = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.finishedGoods().filter(g => {
      return !q || g.name.toLowerCase().includes(q) || g.sku.toLowerCase().includes(q);
    });
  });

  filteredRuns = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.runs().filter(r => {
      return !q ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.bom && r.bom.toLowerCase().includes(q)) ||
        (r.status && r.status.toLowerCase().includes(q));
    });
  });

  filteredReceivedStocks = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const sFilter = this.receivedSupplierFilter().trim().toLowerCase();
    const statFilter = this.receivedStatusFilter();
    
    return this.receivedStocks().filter(r => {
      const matchSearch = !q || 
             (r.grn_number && r.grn_number.toLowerCase().includes(q)) || 
             (r.po_number && r.po_number.toLowerCase().includes(q)) ||
             (r.supplier_name && r.supplier_name.toLowerCase().includes(q)) ||
             (r.material_desc && r.material_desc.toLowerCase().includes(q));
             
      const matchSup = !sFilter || (r.supplier_name && r.supplier_name.toLowerCase().includes(sFilter));
      const matchStat = statFilter === 'all' || r.routing_status === statFilter;
      
      return matchSearch && matchSup && matchStat;
    });
  });

  filteredCounts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.materials().filter(m => !q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q));
    return {
      all: list.length,
      low: list.filter(m => m.status === 'low').length,
      ok: list.filter(m => m.status === 'ok').length,
      high: list.filter(m => m.status === 'high').length
    };
  });

  finishedGoodsTotal = computed(() => this.filteredFinishedGoods().reduce((sum, g) => sum + g.total, 0));
  finishedGoodsAvailable = computed(() => this.filteredFinishedGoods().reduce((sum, g) => sum + g.avail, 0));
  finishedGoodsAllocated = computed(() => this.filteredFinishedGoods().reduce((sum, g) => sum + g.alloc, 0));
  finishedGoodsLow = computed(() => this.filteredFinishedGoods().filter(g => g.low).length);
}