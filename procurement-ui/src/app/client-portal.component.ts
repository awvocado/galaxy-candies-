import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';

declare var L: any; // Declare Leaflet globally for the component

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap');
      
      .portal-page { font-family: 'Fredoka', sans-serif; }
      .theme-panel { background: radial-gradient(circle at 80% 30%, #35521a 0%, #1d2f0d 50%, #101a07 100%); }
      
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71,96,33,0.3); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71,96,33,0.6); }

      @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.2); } }
      .a-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
      
      @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      .a-float { animation: float 4s ease-in-out infinite; }
      
      /* Ensure Leaflet controls don't overlap the autocomplete dropdown */
      .leaflet-top, .leaflet-bottom { z-index: 400 !important; }
    </style>

    <div class="portal-page min-h-screen bg-[#dfe9c6] flex items-center justify-center p-4 md:p-8">
      
      @if (loading()) {
        <div class="flex flex-col items-center justify-center gap-4 text-[#2a3f14] bg-white/60 p-12 rounded-[32px] backdrop-blur-md shadow-2xl border border-white">
          <svg class="animate-spin h-10 w-10 text-[#2a3f14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p class="font-bold text-lg tracking-wide">Locating your secure order file...</p>
        </div>
      } @else if (error()) {
        <div class="bg-white border border-gray-100 p-12 rounded-[36px] shadow-2xl text-center max-w-lg w-full relative overflow-hidden">
           <div class="absolute -top-24 -right-24 w-48 h-48 bg-red-100 blur-[50px] rounded-full pointer-events-none"></div>
           <span class="text-6xl mb-6 block a-float">🚨</span>
           <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Order Not Found</h2>
           <p class="text-gray-500 font-semibold leading-relaxed">This payment link is invalid, expired, or the deposit has already been processed.</p>
        </div>
      } @else if (orderData()) {
        <!-- Main Wrapper -->
        <div class="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row relative overflow-hidden border border-white/40">
          
          <!-- Left Side: Branded Order Summary -->
          <div class="theme-panel w-full md:w-[40%] p-8 md:p-10 text-white relative z-10 flex flex-col overflow-hidden">
             <span class="a-twinkle absolute top-[5%] left-[46%] w-2 h-2 rounded-full bg-[#EAC224] pointer-events-none"></span>
             <span class="a-twinkle absolute bottom-[10%] left-[5%] w-1.5 h-1.5 rounded-full bg-white pointer-events-none" style="animation-delay: 1s"></span>
             <div class="absolute -top-32 -left-32 w-64 h-64 bg-[#9be15d]/10 blur-[60px] rounded-full pointer-events-none"></div>

             <div class="inline-flex items-center gap-2 bg-[#EAC224]/15 border border-[#EAC224]/40 px-4 py-1.5 rounded-full mb-8 w-max">
               <span class="text-base">🏭</span>
               <span class="text-xs font-semibold text-[#EAC224] tracking-wider uppercase">Galaxy Candies Mfg.</span>
             </div>

             <div class="flex-1">
               <div class="bg-white/5 border border-[#EAC224]/30 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
                 <div class="absolute right-0 top-0 bottom-0 w-2 bg-[#EAC224]"></div>
                 <p class="text-[10px] text-[#EAC224] font-bold uppercase tracking-widest mb-1.5">Required Deposit (50%)</p>
                 <p class="text-4xl font-black text-[#EAC224]">₱{{ (orderData().total_amount / 2) | number:'1.2-2' }}</p>
                 <p class="text-xs text-white/50 font-bold mt-2">Total Order Value: ₱{{ orderData().total_amount | number:'1.2-2' }}</p>
               </div>
               
               <div class="space-y-4">
                 <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Selected Products ({{ orderData().total_units }} units)</p>
                 <div class="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                   @for (reqItem of orderData().order_items; track reqItem.sku) {
                     <div class="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                       <span class="bg-[#EAC224]/20 text-[#EAC224] px-2 py-0.5 rounded text-[11px] font-extrabold shrink-0">{{ reqItem.qty | number }}x</span>
                       <div class="truncate">
                         <p class="text-xs font-bold text-white truncate">{{ reqItem.name }}</p>
                       </div>
                     </div>
                   }
                 </div>
               </div>
             </div>
          </div>

          <!-- Right Side: Clean White Form -->
          <div class="w-full md:w-[60%] p-8 md:p-10 bg-[#fbfdf9] relative z-10 flex flex-col justify-center">
             <div class="mb-8">
               <h3 class="text-3xl font-extrabold text-gray-900 mb-2">Complete Your Logistics Profile</h3>
               <p class="text-sm text-gray-500 leading-relaxed font-semibold">Since this is your first order via the automated system, please provide your verified delivery details to proceed to the secure payment gateway.</p>
             </div>

             <div class="space-y-6">
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div>
                   <label class="block text-[11px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Business / Full Name <span class="text-red-500">*</span></label>
                   <input type="text" [(ngModel)]="formData.name" placeholder="Juan Dela Cruz" class="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 shadow-sm outline-none focus:border-[#476021] focus:ring-2 focus:ring-[#476021]/20 transition-all font-bold placeholder-gray-400">
                 </div>
                 <div>
                   <label class="block text-[11px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Contact Number <span class="text-red-500">*</span></label>
                   <input type="text" [(ngModel)]="formData.phone" placeholder="+63 900 000 0000" class="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 shadow-sm outline-none focus:border-[#476021] focus:ring-2 focus:ring-[#476021]/20 transition-all font-bold placeholder-gray-400">
                 </div>
               </div>

               <!-- Interactive Map & Geocoding Section -->
               <div class="relative z-20">
                 <label class="block text-[11px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Verified Delivery Address <span class="text-red-500">*</span></label>
                 
                 <!-- Autocomplete Input -->
                 <div class="relative">
                   <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   </span>
                   <input type="text" [(ngModel)]="formData.address" (ngModelChange)="onAddressSearch($event)" placeholder="Search address or drag the pin on the map..." class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 shadow-sm outline-none focus:border-[#476021] focus:ring-2 focus:ring-[#476021]/20 transition-all font-bold placeholder-gray-400" autocomplete="off">
                 </div>
                 
                 <!-- Dropdown Suggestions -->
                 @if (addressSuggestions().length > 0) {
                   <div class="absolute z-[9999] w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                     @for (addr of addressSuggestions(); track addr.place_id) {
                       <div (click)="selectAddress(addr)" class="px-4 py-3.5 hover:bg-gray-50 cursor-pointer text-sm font-semibold text-gray-700 transition-colors border-b border-gray-100 last:border-0 flex items-start gap-3">
                         <svg class="w-4 h-4 text-[#476021] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                         {{ addr.formatted }}
                       </div>
                     }
                   </div>
                 }
               </div>

               <!-- The Leaflet Map Interface -->
               <div class="relative z-10 rounded-xl overflow-hidden border border-gray-200 shadow-inner h-[220px] bg-gray-100">
                 <div id="client-map" class="w-full h-full z-0"></div>
               </div>

             </div>

             <div class="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
               <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <svg class="w-4 h-4 text-[#476021]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Checkout
               </p>
               <button (click)="submitData()" [disabled]="isSubmitting() || !formData.name || !formData.address || !formData.phone" class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#9be15d] hover:bg-[#b0f07a] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-[#1d2f0d] font-extrabold text-sm transition-all shadow-lg disabled:shadow-none flex justify-center items-center gap-2 cursor-pointer">
                 @if (isSubmitting()) {
                   <svg class="animate-spin h-4 w-4 text-[#1d2f0d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Setting up gateway...
                 } @else {
                   <span>Save & Pay Deposit via PayMongo</span>
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                 }
               </button>
             </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ClientPortalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  
  orderToken = '';
  orderData = signal<any>(null);

  formData = { name: '', phone: '', address: '' };

  // Advanced Geolocation & Map Variables
  apiKey = 'aa2bebe4416f412b972b1378e8e8054a';
  addressSuggestions = signal<any[]>([]);
  private addressTimeout: any;
  
  private map: any;
  private marker: any;

  ngOnInit() {
    this.orderToken = this.route.snapshot.paramMap.get('token') || '';
    if (!this.orderToken) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.apiService.getPendingOrder(this.orderToken).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data.status === 'PENDING_INFO') {
          this.orderData.set(res.data);
          // Wait for DOM to render the order card, then initialize the map
          setTimeout(() => this.loadLeaflet(), 100);
        } else {
          this.error.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  // Inject Leaflet Dynamically so you don't have to alter index.html
  loadLeaflet() {
    if (document.getElementById('leaflet-css')) {
      this.initMap();
      return;
    }

    const css = document.createElement('link');
    css.id = 'leaflet-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.body.appendChild(script);
  }

  initMap() {
    const mapEl = document.getElementById('client-map');
    if (!mapEl) return;

    // Centered locally (Manila/Bulacan baseline)
    this.map = L.map('client-map').setView([14.795, 120.875], 11);

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${this.apiKey}`, {
      attribution: '© Geoapify © OpenStreetMap'
    }).addTo(this.map);

    // Custom Icon bypasses standard CDN pathing issues
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add Draggable Marker
    this.marker = L.marker([14.795, 120.875], { draggable: true, icon: customIcon }).addTo(this.map);

    // Detect Marker Drag
    this.marker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      this.reverseGeocode(pos.lat, pos.lng);
    });

    // Detect Map Click
    this.map.on('click', (e: any) => {
      this.marker.setLatLng(e.latlng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  onAddressSearch(val: string) {
    if (this.addressTimeout) clearTimeout(this.addressTimeout);
    if (!val || val.length < 3) {
      this.addressSuggestions.set([]);
      return;
    }

    this.addressTimeout = setTimeout(() => {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&lang=en&limit=5&filter=countrycode:ph&apiKey=${this.apiKey}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.features) {
            // Save the entire property set (including Lat & Lon)
            this.addressSuggestions.set(data.features.map((f: any) => f.properties));
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }, 300);
  }

  // Update map pin when an address is clicked from the dropdown
  selectAddress(addr: any) {
    this.formData.address = addr.formatted;
    this.addressSuggestions.set([]);

    if (this.map && this.marker && addr.lat && addr.lon) {
      const newLatLng = new L.LatLng(addr.lat, addr.lon);
      this.marker.setLatLng(newLatLng);
      this.map.flyTo(newLatLng, 15, { duration: 1 });
    }
  }

  // Translate a Map Pin click back into a readable address for the input field
  reverseGeocode(lat: number, lon: number) {
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this.apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
           this.formData.address = data.features[0].properties.formatted;
        }
      });
  }

  submitData() {
    this.isSubmitting.set(true);
    
    const payload = {
      token: this.orderToken,
      name: this.formData.name,
      phone: this.formData.phone,
      address: this.formData.address
    };

    this.apiService.submitClientPortal(payload).subscribe({
      next: (res) => {
        if (res.success && res.checkout_url) {
          window.location.href = res.checkout_url;
        } else {
          this.isSubmitting.set(false);
          alert('Failed to connect to payment gateway. Please try again.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Server error occurred. Please contact support.');
      }
    });
  }
}