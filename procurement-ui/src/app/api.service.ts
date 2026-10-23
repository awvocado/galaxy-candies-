import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  logout(userName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, { userName });
  }

  getAuditLogs(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/audit-logs`); }
  getDashboardStats(): Observable<any> { return this.http.get<any>(`${this.baseUrl}/dashboard-stats`); }
  getSuppliers(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/suppliers`); }
  addSupplier(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/suppliers`, payload); }
  updateSupplier(id: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/suppliers/${id}`, payload); }

  getPurchaseOrders(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/purchase-orders`); }
  createPurchaseOrder(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/purchase-orders`, payload); }
  approvePurchaseOrder(poNumber: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/purchase-orders/${poNumber}/approve`, payload); }
  rejectPurchaseOrder(poNumber: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/purchase-orders/${poNumber}/reject`, payload); }
  receivePurchaseOrder(poNumber: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/purchase-orders/${poNumber}/receive`, payload); }

  getGoodsReceipts(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/goods-receipts`); }
  getWarehouseStock(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/warehouse-stock`); }
  getPosCatalog(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/pos-catalog`); }

  addProduct(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/pos-catalog`, payload); }
  updateProduct(sku: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/pos-catalog/${sku}`, payload); }
  deleteProduct(sku: string): Observable<any> { return this.http.delete<any>(`${this.baseUrl}/pos-catalog/${sku}`); }

  getQaInspections(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/qa-inspections`); }
  passQaInspection(batchId: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/qa-inspections/${batchId}/pass`, payload); }
  failQaInspection(batchId: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/qa-inspections/${batchId}/fail`, payload); }

  getQaDefects(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/qa-defects`); }
  resolveQaDefect(reportId: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/qa-defects/${reportId}/resolve`, payload); }
  getProductionRuns(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/production-runs`); }

  getNotifications(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/notifications`); }
  markNotificationRead(id: number): Observable<any> { return this.http.put<any>(`${this.baseUrl}/notifications/${id}/read`, {}); }
  markAllNotificationsRead(): Observable<any> { return this.http.put<any>(`${this.baseUrl}/notifications/read-all`, {}); }
  clearNotifications(): Observable<any> { return this.http.delete<any>(`${this.baseUrl}/notifications/clear`); }

  autoRestockLowItems(): Observable<any> { return this.http.post<any>(`${this.baseUrl}/auto-restock`, {}); }
  createCheckoutSession(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/create-checkout-session`, payload); }
  confirmPaymentSuccess(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/payment-success`, payload); }
  sendPaymentLinkEmail(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/send-payment-link`, payload); }

  // --- HYBRID CRM ENDPOINTS ---
  generateSmartPaymentLink(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/generate-payment-link`, payload); }
  getPendingOrder(token: string): Observable<any> { return this.http.get<any>(`${this.baseUrl}/pending-orders/${token}`); }
  getSalesOrders(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/sales-orders`); }
  getSalesInvoices(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/sales-invoices`); }
  submitClientPortal(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/submit-client-portal`, payload); }

  // --- CRM & PAYMENTS ENDPOINTS ---
  getCrmClients(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/crm-clients`); }
  addCrmClient(payload: any): Observable<any> { return this.http.post<any>(`${this.baseUrl}/crm-clients`, payload); }
  updateCrmClient(email: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/crm-clients/${email}`, payload); }
  deleteCrmClient(email: string): Observable<any> { return this.http.delete<any>(`${this.baseUrl}/crm-clients/${email}`); }
  
  getSalesPayments(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/sales-payments`); }
  verifySalesPayment(id: string): Observable<any> { return this.http.put<any>(`${this.baseUrl}/sales-payments/${id}/verify`, {}); }
  updateProductionRun(id: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/production-runs/${id}`, payload); }
  // --- DELIVERY ROUTES ---
  getDeliveryRoutes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/delivery-routes`); }
  completeDeliveryRoute(id: string, payload: any): Observable<any> { return this.http.put<any>(`${this.baseUrl}/delivery-routes/${id}/complete`, payload); }

  startDeliveryTrip(routeId: string, userName: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/delivery-routes/${routeId}/dispatch`, { userName });
}
}

