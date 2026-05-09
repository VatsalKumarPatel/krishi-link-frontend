import { Routes } from '@angular/router';

export const collectionsRoutes: Routes = [
  {
    path: '',
    data: { title: 'Collections', subtitle: 'Outstanding farmer receivables' },
    loadComponent: () =>
      import('../components/pages/collections/collections-queue/collections-queue.component').then(
        m => m.CollectionsQueueComponent,
      ),
  },
  {
    path: 'targets',
    data: { title: 'Collection Targets', subtitle: 'Daily and weekly collection goals' },
    loadComponent: () =>
      import('../components/pages/collections/collection-targets/collection-targets.component').then(
        m => m.CollectionTargetsComponent,
      ),
  },
  {
    path: ':farmerId',
    data: { title: 'Farmer Outstanding', subtitle: 'Unpaid dues and follow-up history' },
    loadComponent: () =>
      import('../components/pages/collections/collection-farmer-detail/collection-farmer-detail.component').then(
        m => m.CollectionFarmerDetailComponent,
      ),
  },
];
