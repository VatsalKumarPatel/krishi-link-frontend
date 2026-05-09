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

      // ── Purchase module (lazy, store users only) ──────────────────────────
      {
        path: 'purchase',
        loadChildren: () =>
          import('./purchase/purchase.routes').then(m => m.purchaseRoutes),
      },

      // ── Products module (lazy, store users only) ──────────────────────────
      {
        path: 'products',
        canActivate: [roleGuard],
        data: { excludeSuperAdmin: true },
        loadChildren: () =>
          import('./products/products.routes').then(m => m.productsRoutes),
      },

      // ── Inventory module (lazy, store users only) ─────────────────────────
      {
        path: 'inventory',
        canActivate: [roleGuard],
        data: { excludeSuperAdmin: true },
        loadChildren: () =>
          import('./inventory/inventory.routes').then(m => m.inventoryRoutes),
      },

      // ── Tenant / store users only (SuperAdmin is excluded) ─────────────────
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { title: 'Dashboard', subtitle: 'Kharif 2026 · All regions', excludeSuperAdmin: true },
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      // ── Farmers module (lazy, store users only) ───────────────────────
      {
        path: 'farmers',
        canActivate: [roleGuard],
        data: { excludeSuperAdmin: true },
        loadChildren: () =>
          import('./farmers/farmers.routes').then(m => m.farmersRoutes),
      },

      // ── Collections module (lazy, store users only) ────────────────────
      {
        path: 'collections',
        canActivate: [roleGuard],
        data: { title: 'Collections', subtitle: 'Outstanding farmer receivables', excludeSuperAdmin: true },
        loadChildren: () =>
          import('./collections/collections.routes').then(m => m.collectionsRoutes),
      },

      // ── Sales module (lazy, store users only) ──────────────────────────
      {
        path: 'sales',
        canActivate: [roleGuard],
        data: { title: 'Sales', subtitle: 'Farmer invoices and receipts', excludeSuperAdmin: true },
        loadChildren: () =>
          import('./sales/sales.routes').then(m => m.salesRoutes),
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
