import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { QaComponent } from './qa.component';
import { ProcurementComponent } from './procurement.component';
import { SalesComponent } from './sales.component';
import { LogisticsComponent } from './logistics.component';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from './settings.component';
import { LoginComponent } from './login.component';
import { ClientPortalComponent } from './client-portal.component';
import { PaymentStatusComponent } from './payment-status.component'; 
import { PosComponent } from './pos.component'; 
import { DriverLogisticsComponent } from './drivers.component'; 
import { ProductionTerminalComponent } from './production-terminal.component';
import { QaTerminalComponent } from './qa-terminal.component';
import { OwnerDashboardComponent } from './owner-dashboard.component'; // Import the new file

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'qa', component: QaComponent }, 
  { path: 'procurement', component: ProcurementComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'logistics', component: LogisticsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  
  // NEW: Secure Owner Dashboard
  { path: 'owner-dashboard', component: OwnerDashboardComponent },
  
  // TERMINALS (Standalone screens)
  { path: 'pos', component: PosComponent }, 
  { path: 'qa-terminal', component: QaTerminalComponent }, 
  { path: 'driver-terminal', component: DriverLogisticsComponent }, 
  { path: 'production-terminal', component: ProductionTerminalComponent },
  
  // CLIENT FACING ROUTES
  { path: 'client-portal/:token', component: ClientPortalComponent },
  { path: 'payment/:status', component: PaymentStatusComponent }
];