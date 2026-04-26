import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { userResolver } from './resolvers/user.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./components/pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    resolve: { user: userResolver },
    loadComponent: () =>
      import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'farmers',
        data: { title: 'Farmers', subtitle: 'All regions · 12,480 registered' },
        loadComponent: () =>
          import('./components/pages/farmers/farmers-list/farmers-list.component').then(m => m.FarmersListComponent),
      },
      {
        path: 'farmers/:id',
        data: { title: 'Farmer detail', subtitle: '' },
        loadComponent: () =>
          import('./components/pages/farmers/farmer-detail/farmer-detail.component').then(m => m.FarmerDetailComponent),
      },
      {
        path: 'dashboard',
        data: { title: 'Dashboard', subtitle: 'Kharif 2026 · All regions' },
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'products',
        data: { title: 'Products', subtitle: 'Manage your product catalogue' },
        loadComponent: () =>
          import('./components/pages/products/products-list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'products/create',
        data: { title: 'Add product', subtitle: 'Create a new product entry' },
        loadComponent: () =>
          import('./components/pages/products/product-create/product-create.component').then(m => m.ProductCreateComponent),
      },
      {
        path: 'products/:id',
        data: { title: 'Product detail', subtitle: 'View and edit product info' },
        loadComponent: () =>
          import('./components/pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'inventory',
        data: { title: 'Inventory', subtitle: 'Stock levels across all stores' },
        loadComponent: () =>
          import('./components/pages/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
      },
      {
        path: 'transfers',
        data: { title: 'Transfers', subtitle: 'Inter-store stock movements' },
        loadComponent: () =>
          import('./components/pages/transfers/transfers-list/transfers-list.component').then(m => m.TransfersListComponent),
      },
      {
        path: 'settings',
        data: { title: 'Settings', subtitle: 'Account and platform preferences' },
        loadComponent: () =>
          import('./components/pages/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'admin/tenants',
        data: { title: 'Tenants', subtitle: 'Manage organisations on the platform' },
        loadComponent: () =>
          import('./components/pages/admin/tenants/tenants-list/tenants-list.component').then(m => m.TenantsListComponent),
      },
      {
        path: 'admin/tenants/:id',
        data: { title: 'Tenant detail', subtitle: 'Organisation profile and settings' },
        loadComponent: () =>
          import('./components/pages/admin/tenants/tenant-detail/tenant-detail.component').then(m => m.TenantDetailComponent),
      },
      {
        path: 'admin/stores',
        data: { title: 'Stores', subtitle: 'Manage warehouses and collection centres' },
        loadComponent: () =>
          import('./components/pages/admin/stores/stores-list/stores-list.component').then(m => m.StoresListComponent),
      },
    ],
  },
];
