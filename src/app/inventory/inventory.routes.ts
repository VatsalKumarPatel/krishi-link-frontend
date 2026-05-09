import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full',
  },
  {
    path: 'stock',
    data: { title: 'Stock', subtitle: 'Current stock levels across all stores' },
    loadComponent: () => import('./stock/stock-list/stock-list.component').then(m => m.StockListComponent),
  },
  {
    path: 'adjustments',
    data: { title: 'Adjustments', subtitle: 'Manual corrections, physical counts and damage write-offs' },
    loadComponent: () => import('./adjustments/adjustment-list/adjustment-list.component').then(m => m.AdjustmentListComponent),
  },
  {
    path: 'adjustments/pending',
    data: { title: 'Pending Approvals', subtitle: 'Adjustments awaiting your approval' },
    loadComponent: () => import('./adjustments/pending-adjustments/pending-adjustments.component').then(m => m.PendingAdjustmentsComponent),
  },
  {
    path: 'transfers',
    data: { title: 'Transfers', subtitle: 'Stock movements between stores' },
    loadComponent: () => import('./transfers/transfer-list/transfer-list.component').then(m => m.TransferListComponent),
  },
  {
    path: 'transfers/new',
    data: { title: 'New Transfer', subtitle: 'Move stock between stores' },
    loadComponent: () => import('./transfers/transfer-create/transfer-create.component').then(m => m.TransferCreateComponent),
  },
  {
    path: 'transfers/:id',
    data: { title: 'Transfer Detail', subtitle: '' },
    loadComponent: () => import('./transfers/transfer-detail/transfer-detail.component').then(m => m.TransferDetailComponent),
  },
  {
    path: 'low-stock',
    data: { title: 'Low Stock', subtitle: 'Products below their reorder level' },
    loadComponent: () => import('./low-stock/low-stock.component').then(m => m.LowStockComponent),
  },
  {
    path: 'thresholds',
    data: { title: 'Reorder Thresholds', subtitle: 'Set reorder levels per product per store' },
    loadComponent: () => import('./thresholds/threshold-list/threshold-list.component').then(m => m.ThresholdListComponent),
  },
];
