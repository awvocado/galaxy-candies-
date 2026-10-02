import { Routes } from '@angular/router';
import { ProductionComponent } from './production.component';
import { WarehouseComponent } from './warehouse.component';
import { QaComponent } from './qa.component';
import { ProcurementComponent } from './procurement.component';
import { SalesComponent } from './sales.component';
import { LogisticsComponent } from './logistics.component';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from './settings.component';
import { LoginComponent } from './login.component';

export const routes: Routes = [
  // 2. Change the default redirect from 'production' to 'login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 3. Add the login route
  { path: 'login', component: LoginComponent },

  { path: 'production', component: ProductionComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'qa', component: QaComponent },
  { path: 'procurement', component: ProcurementComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'logistics', component: LogisticsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent }
];