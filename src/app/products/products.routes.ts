import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    data: { title: 'Products', subtitle: 'Manage your product catalogue' },
    loadComponent: () => import('./products-list/products-list.component').then(m => m.ProductsListComponent),
  },
  {
    path: ':id',
    data: { title: 'Product detail', subtitle: 'View and edit product info' },
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
];
