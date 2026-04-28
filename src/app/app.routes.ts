import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { userResolver } from './resolvers/user.resolver';
import { storeResolver } from './resolvers/store.resolver';

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
    resolve: { user: userResolver, stores: storeResolver },
    loadComponent: () =>
      import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [

      // ── Accessible to all authenticated users ──────────────────────────────
      {
        path: 'unauthorized',
        data: { title: 'Unauthorized', subtitle: '' },
        loadComponent: () =>
          import('./components/pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
      },
      {
        path: 'settings',
        data: { title: 'Settings', subtitle: 'Account and platform preferences' },
        loadComponent: () =>
          import('./components/pages/settings/settings.component').then(m => m.SettingsComponent),
      },

      // ── Tenant / store users only (SuperAdmin is excluded) ─────────────────
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { title: 'Dashboard', subtitle: 'Kharif 2026 · All regions', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'products',
        canActivate: [roleGuard],
        data: { title: 'Products', subtitle: 'Manage your product catalogue', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/products/products-list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'products/create',
        canActivate: [roleGuard],
        data: { title: 'Add product', subtitle: 'Create a new product entry', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/products/product-create/product-create.component').then(m => m.ProductCreateComponent),
      },
      {
        path: 'products/:id',
        canActivate: [roleGuard],
        data: { title: 'Product detail', subtitle: 'View and edit product info', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'inventory',
        canActivate: [roleGuard],
        data: { title: 'Inventory', subtitle: 'Stock levels across all stores', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
      },
      {
        path: 'transfers',
        canActivate: [roleGuard],
        data: { title: 'Transfers', subtitle: 'Inter-store stock movements', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/transfers/transfers-list/transfers-list.component').then(m => m.TransfersListComponent),
      },
      {
        path: 'farmers',
        canActivate: [roleGuard],
        data: { title: 'Farmers', subtitle: 'All regions · 12,480 registered', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/farmers/farmers-list/farmers-list.component').then(m => m.FarmersListComponent),
      },
      {
        path: 'farmers/:id',
        canActivate: [roleGuard],
        data: { title: 'Farmer detail', subtitle: '', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/farmers/farmer-detail/farmer-detail.component').then(m => m.FarmerDetailComponent),
      },

      // ── SuperAdmin only ────────────────────────────────────────────────────
      {
        path: 'admin/tenants',
        canActivate: [roleGuard],
        data: { title: 'Tenants', subtitle: 'Manage organisations on the platform', adminOnly: true },
        loadComponent: () =>
          import('./components/pages/admin/tenants/tenants-list/tenants-list.component').then(m => m.TenantsListComponent),
      },
      {
        path: 'admin/tenants/:id',
        canActivate: [roleGuard],
        data: { title: 'Tenant detail', subtitle: 'Organisation profile and settings', adminOnly: true },
        loadComponent: () =>
          import('./components/pages/admin/tenants/tenant-detail/tenant-detail.component').then(m => m.TenantDetailComponent),
      },
      {
        path: 'admin/stores',
        canActivate: [roleGuard],
        data: { title: 'Stores', subtitle: 'Manage warehouses and collection centres', adminOnly: true },
        loadComponent: () =>
          import('./components/pages/admin/stores/stores-list/stores-list.component').then(m => m.StoresListComponent),
      },
      {
        path: 'admin/stores/:id',
        canActivate: [roleGuard],
        data: { title: 'Store detail', subtitle: 'Store profile and settings', adminOnly: true },
        loadComponent: () =>
          import('./components/pages/admin/stores/store-detail/store-detail.component').then(m => m.StoreDetailComponent),
      },
    ],
  },
];
