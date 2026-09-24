import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
        <div class="p-6 border-b border-gray-200 bg-blue-50">
          <h1 class="text-xl font-bold text-blue-900">Warehouse & Inventory</h1>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <button 
            (click)="activeTab.set('receiver')"
            [class.bg-blue-100]="activeTab() === 'receiver'"
            [class.text-blue-800]="activeTab() === 'receiver'"
            class="w-full text-left px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 font-medium transition-colors flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
            Inbound Shipment
          </button>
          <button 
            (click)="activeTab.set('scanner')"
            [class.bg-blue-100]="activeTab() === 'scanner'"
            [class.text-blue-800]="activeTab() === 'scanner'"
            class="w-full text-left px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 font-medium transition-colors flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            Barcode Scanner
          </button>
          <button 
            (click)="activeTab.set('ledger')"
            [class.bg-blue-100]="activeTab() === 'ledger'"
            [class.text-blue-800]="activeTab() === 'ledger'"
            class="w-full text-left px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 font-medium transition-colors flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Stock Ledger
          </button>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        
        <!-- Inbound Shipment Receiver -->
        @if (activeTab() === 'receiver') {
          <div class="max-w-3xl">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Receive Inbound Shipment</h2>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Generate Goods Receipt Note (GRN)</h3>
              <form class="space-y-5" (submit)="generateGRN($event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Order ID</label>
                    <input type="text" class="block w-full rounded-md border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. PO-4001">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Received By (User)</label>
                    <input type="text" class="block w-full rounded-md border-gray-300 border p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value="Lorenz" readonly>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Visual Inspection Notes</label>
                  <textarea rows="3" class="block w-full rounded-md border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Condition of boxes, seals, etc."></textarea>
                </div>
                
                <div class="pt-4 flex justify-end">
                  <button type="submit" class="bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200">
                    Log Shipment & Proceed to QA
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Recent GRNs -->
            <h3 class="text-lg font-medium text-gray-900 mb-3">Recent Goods Receipts</h3>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GRN ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Received</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received By</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  @for (grn of recentGRNs(); track grn.gm_id) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#GRN-{{ grn.gm_id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ grn.po_id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ grn.received_date }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ grn.received_by_user }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Barcode Scanner UI -->
        @if (activeTab() === 'scanner') {
          <div class="max-w-2xl mx-auto text-center mt-10">
            <h2 class="text-3xl font-semibold text-gray-800 mb-2">Scan Shipment Barcodes</h2>
            <p class="text-gray-500 mb-8">Ensure physical tags match the generated Purchase Order.</p>
            
            <!-- Mock Scanner Area -->
            <div class="bg-gray-900 rounded-2xl h-80 flex flex-col items-center justify-center relative overflow-hidden mb-6 shadow-xl border-4 border-gray-800">
              <!-- Animated Scanning Line -->
              <div class="absolute w-full h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-[scan_2s_ease-in-out_infinite]"></div>
              <svg class="w-32 h-32 text-gray-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
              <p class="text-gray-400 mt-4 font-mono text-sm">Awaiting Scanner Input...</p>
            </div>

            <!-- Manual Override -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2 text-left">Manual PO/Batch Entry</label>
              <div class="flex space-x-3">
                <input type="text" class="flex-1 block w-full rounded-md border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Type barcode ID physically...">
                <button (click)="simulateScan()" class="bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
                  Process
                </button>
              </div>
            </div>
          </div>

          <!-- Add the Tailwind keyframe animation for the scanner line -->
          <style>
            @keyframes scan {
              0%, 100% { top: 10%; }
              50% { top: 90%; }
            }
          </style>
        }

        <!-- Inventory / Stock Ledger Dashboard -->
        @if (activeTab() === 'ledger') {
          <div>
            <div class="flex justify-between items-end mb-6">
              <div>
                <h2 class="text-2xl font-semibold text-gray-800">Stock Ledger</h2>
                <p class="text-gray-500 text-sm mt-1">Real-time tracking of raw materials and finished goods.</p>
              </div>
              <div class="flex space-x-2">
                <select class="block rounded-md border-gray-300 border py-2 pl-3 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>All Items</option>
                  <option>Raw Materials</option>
                  <option>Finished Goods</option>
                </select>
                <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Export CSV
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Quantity Change</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (entry of stockLedger(); track entry.ledger_id) {
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ entry.timestamp }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ entry.batch_id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span 
                            [class.bg-green-100]="entry.transaction_type === 'IN'"
                            [class.text-green-800]="entry.transaction_type === 'IN'"
                            [class.bg-red-100]="entry.transaction_type === 'OUT'"
                            [class.text-red-800]="entry.transaction_type === 'OUT'"
                            class="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-md">
                            {{ entry.transaction_type }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium" 
                            [class.text-green-600]="entry.transaction_type === 'IN'"
                            [class.text-red-600]="entry.transaction_type === 'OUT'">
                          {{ entry.transaction_type === 'IN' ? '+' : '' }}{{ entry.quantity_change }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                          {{ entry.running_balance }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }

      </main>
    </div>
  `
})
export class AppComponent {
  // Navigation State
  activeTab = signal<'receiver' | 'scanner' | 'ledger'>('receiver');

  // ERP Schema Mock Data: goods_receipt_notes
  recentGRNs = signal([
    { gm_id: 801, po_id: 4001, received_date: '2026-09-24 08:15:00', received_by_user: 'Lorenz' },
    { gm_id: 802, po_id: 3998, received_date: '2026-09-23 14:30:00', received_by_user: 'Tristan' }
  ]);

  // ERP Schema Mock Data: stock_ledger
  stockLedger = signal([
    { ledger_id: 1, batch_id: 'BCH-1099', transaction_type: 'IN', quantity_change: 5000, running_balance: 40000, timestamp: '2026-09-24 09:00:21' },
    { ledger_id: 2, batch_id: 'BCH-1100', transaction_type: 'IN', quantity_change: 250, running_balance: 150, timestamp: '2026-09-24 09:30:45' },
    { ledger_id: 3, batch_id: 'BCH-1099', transaction_type: 'OUT', quantity_change: -1200, running_balance: 38800, timestamp: '2026-09-24 11:15:10' }, // Sent to WIP production
    { ledger_id: 4, batch_id: 'FG-882', transaction_type: 'IN', quantity_change: 350, running_balance: 350, timestamp: '2026-09-24 14:00:00' }, // Finished goods clearance
    { ledger_id: 5, batch_id: 'FG-882', transaction_type: 'OUT', quantity_change: -50, running_balance: 300, timestamp: '2026-09-24 15:45:12' }  // Sales order fulfillment
  ]);

  generateGRN(event: Event) {
    event.preventDefault();
    alert('Goods Receipt Note generated and sent for Inbound QA Check.');
    this.activeTab.set('ledger');
  }

  simulateScan() {
    alert('Barcode scanned successfully. Match found in PO database.');
  }
}