import { Routes } from '@angular/router';

export const salesRoutes: Routes = [
  {
    path: '',
    data: { title: 'Sales', subtitle: 'Farmer invoices and receipts' },
    loadComponent: () =>
      import('./sales/sales-list/sales-list.component').then(m => m.SalesListComponent),
  },
  {
    path: 'new',
    data: { title: 'New Sale', subtitle: 'Create a sale for a farmer' },
    loadComponent: () =>
      import('./sales/sale-form/sale-form.component').then(m => m.SaleFormComponent),
  },
  // Static sub-paths before :id to avoid routing conflicts
  {
    path: 'payments',
    data: { title: 'Customer Payments', subtitle: 'Cash, UPI, Cheque, NEFT receipts' },
    loadComponent: () =>
      import('./customer-payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
  },
  {
    path: 'payments/new',
    data: { title: 'Record Payment', subtitle: 'Record payment received from a farmer' },
    loadComponent: () =>
      import('./customer-payments/payment-form/payment-form.component').then(m => m.PaymentFormComponent),
  },
  {
    path: 'payments/:id/allocate',
    data: { title: 'Allocate Payment', subtitle: 'Assign payment to invoices' },
    loadComponent: () =>
      import('./customer-payments/payment-allocate/payment-allocate.component').then(m => m.PaymentAllocateComponent),
  },
  {
    path: 'payments/:id',
    data: { title: 'Payment Detail', subtitle: '' },
    loadComponent: () =>
      import('./customer-payments/payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent),
  },
  {
    path: 'returns',
    data: { title: 'Sale Returns', subtitle: 'Credit notes and return records' },
    loadComponent: () =>
      import('./sale-returns/sale-returns-list/sale-returns-list.component').then(m => m.SaleReturnsListComponent),
  },
  {
    path: 'returns/:id',
    data: { title: 'Credit Note Detail', subtitle: '' },
    loadComponent: () =>
      import('./sale-returns/sale-return-detail/sale-return-detail.component').then(m => m.SaleReturnDetailComponent),
  },
  // Dynamic :id LAST — matches /sales/:id (sale detail)
  {
    path: ':id',
    data: { title: 'Sale Detail', subtitle: '' },
    loadComponent: () =>
      import('./sales/sale-detail/sale-detail.component').then(m => m.SaleDetailComponent),
  },
];
