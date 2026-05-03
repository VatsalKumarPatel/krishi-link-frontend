import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { premiumGuard } from '../guards/premium.guard';

export const purchaseRoutes: Routes = [

  // ── Suppliers ─────────────────────────────────────────────────────────────
  {
    path: 'suppliers',
    canActivate: [authGuard],
    data: { title: 'Suppliers', subtitle: 'Manage your supplier directory', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./suppliers/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
  },
  {
    path: 'suppliers/:id',
    canActivate: [authGuard],
    data: { title: 'Supplier Detail', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./suppliers/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent),
  },
  {
    path: 'suppliers/:id/ledger',
    canActivate: [authGuard],
    data: { title: 'Supplier Ledger', subtitle: 'Statement of account', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./suppliers/supplier-ledger/supplier-ledger.component').then(m => m.SupplierLedgerComponent),
  },

  // ── Purchases ──────────────────────────────────────────────────────────────
  {
    path: 'purchases',
    canActivate: [authGuard],
    data: { title: 'Purchases', subtitle: 'Purchase orders and GRNs', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./purchases/purchase-list/purchase-list.component').then(m => m.PurchaseListComponent),
  },
  {
    path: 'purchases/:id',
    canActivate: [authGuard],
    data: { title: 'Purchase Detail', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./purchases/purchase-detail/purchase-detail.component').then(m => m.PurchaseDetailComponent),
  },
  {
    path: 'purchases/:id/receive',
    canActivate: [authGuard],
    data: { title: 'Receive & Invoice', subtitle: 'Record stock receipt and supplier invoice', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./purchases/purchase-receive-invoice/purchase-receive-invoice.component').then(m => m.PurchaseReceiveInvoiceComponent),
  },

  // ── Purchase Returns ───────────────────────────────────────────────────────
  {
    path: 'purchase-returns',
    canActivate: [authGuard],
    data: { title: 'Purchase Returns', subtitle: 'Debit notes sent to suppliers', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./purchase-returns/return-list/return-list.component').then(m => m.ReturnListComponent),
  },
  {
    path: 'purchase-returns/:id',
    canActivate: [authGuard],
    data: { title: 'Return Detail', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./purchase-returns/return-detail/return-detail.component').then(m => m.ReturnDetailComponent),
  },

  // ── Supplier Payments ──────────────────────────────────────────────────────
  {
    path: 'supplier-payments',
    canActivate: [authGuard],
    data: { title: 'Supplier Payments', subtitle: 'Payments made to suppliers', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./supplier-payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
  },
  {
    path: 'supplier-payments/:id',
    canActivate: [authGuard],
    data: { title: 'Payment Detail', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./supplier-payments/payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent),
  },
  {
    path: 'supplier-payments/:id/allocate',
    canActivate: [authGuard],
    data: { title: 'Allocate Payment', subtitle: 'Apply payment to invoices', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./supplier-payments/payment-allocate/payment-allocate.component').then(m => m.PaymentAllocateComponent),
  },

  // ── Batches — PREMIUM ──────────────────────────────────────────────────────
  {
    path: 'batches',
    canActivate: [authGuard, premiumGuard],
    data: { title: 'Batch Tracking', subtitle: 'Lot and expiry management', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./batches/batch-list/batch-list.component').then(m => m.BatchListComponent),
  },
  {
    path: 'batches/:id',
    canActivate: [authGuard, premiumGuard],
    data: { title: 'Batch Detail', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./batches/batch-detail/batch-detail.component').then(m => m.BatchDetailComponent),
  },

  // ── Reports ────────────────────────────────────────────────────────────────
  {
    path: 'reports/payables-aging',
    canActivate: [authGuard],
    data: { title: 'Payables Aging', subtitle: 'Outstanding amounts by age bucket', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./reports/payables-aging/payables-aging.component').then(m => m.PayablesAgingComponent),
  },
  {
    path: 'reports/purchase-summary',
    canActivate: [authGuard],
    data: { title: 'Purchase Summary', subtitle: 'Aggregated purchase analytics', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./reports/purchase-summary/purchase-summary.component').then(m => m.PurchaseSummaryReportComponent),
  },
  {
    path: 'reports/input-tax-credit',
    canActivate: [authGuard],
    data: { title: 'Input Tax Credit', subtitle: 'GST ITC summary', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./reports/input-tax-credit/input-tax-credit.component').then(m => m.InputTaxCreditComponent),
  },
  {
    path: 'reports/stock-valuation',
    canActivate: [authGuard, premiumGuard],
    data: { title: 'Stock Valuation', subtitle: 'Inventory value at cost', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./reports/stock-valuation/stock-valuation.component').then(m => m.StockValuationComponent),
  },

  // ── Premium upgrade prompt ─────────────────────────────────────────────────
  {
    path: 'upgrade',
    canActivate: [authGuard],
    data: { title: 'Upgrade to Premium', subtitle: '', excludeSuperAdmin: true },
    loadComponent: () =>
      import('./upgrade-prompt/upgrade-prompt.component').then(m => m.UpgradePromptComponent),
  },
];
