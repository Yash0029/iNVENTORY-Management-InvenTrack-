import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/products/products';
import { Categories } from './pages/categories/categories';
import { Suppliers } from './pages/suppliers/suppliers';
import { Warehouses } from './pages/warehouses/warehouses';
import { InventoryPage } from './pages/inventory/inventory';
import { StockTransfers } from './pages/stock-transfers/stock-transfers';
import { Orders } from './pages/orders/orders';
import { FulfillmentPage } from './pages/fulfillment/fulfillment';
import { Reports } from './pages/reports/reports';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { publicOnlyGuard } from './guards/public-only.guard';
import { Register } from './pages/register/register';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login,
    canActivate: [publicOnlyGuard]
  },

  {
    path: 'register',
    component: Register,
    canActivate: [publicOnlyGuard]
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'products',
    component: Products,
    canActivate: [authGuard]
  },

  {
    path: 'categories',
    component: Categories,
    canActivate: [authGuard]
  },

  {
    path: 'suppliers',
    component: Suppliers,
    canActivate: [authGuard]
  },

  {
    path: 'warehouses',
    component: Warehouses,
    canActivate: [authGuard]
  },

  {
    path: 'inventory',
    component: InventoryPage,
    canActivate: [authGuard]
  },

  {
    path: 'stock-transfers',
    component: StockTransfers,
    canActivate: [authGuard]
  },

  {
    path: 'orders',
    component: Orders,
    canActivate: [authGuard]
  },

  {
    path: 'fulfillment',
    component: FulfillmentPage,
    canActivate: [authGuard]
  },

  {
    path: 'reports',
    component: Reports,
    canActivate: [authGuard]
  }

];
