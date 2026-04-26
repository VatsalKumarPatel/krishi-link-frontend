import { Component, signal } from '@angular/core';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';

interface Transfer {
  id: string; from: string; to: string; product: string;
  qty: number; status: 'Completed' | 'In transit' | 'Pending' | 'Cancelled'; date: string;
}

@Component({
  selector: 'app-transfers-list',
  imports: [KlCardComponent, BadgeComponent],
  templateUrl: './transfers-list.component.html',
  styleUrl: './transfers-list.component.scss',
})
export class TransfersListComponent {
  statusFilter = signal('All');
  openFilter = signal<string | null>(null);

  readonly statuses = ['All', 'Completed', 'In transit', 'Pending', 'Cancelled'];

  readonly transfers: Transfer[] = [
    { id: 'TR-1041', from: 'Bharatpur Hub',    to: 'Besisahar Centre',  product: 'Hybrid Rice Seed',  qty: 100, status: 'Completed',  date: '23 Apr 2026' },
    { id: 'TR-1040', from: 'Pokhara Depot',    to: 'Damak Collection',  product: 'DAP Fertilizer',    qty: 50,  status: 'In transit', date: '22 Apr 2026' },
    { id: 'TR-1039', from: 'Butwal Warehouse', to: 'Gulariya Store',    product: 'Urea 46%',          qty: 80,  status: 'Pending',    date: '21 Apr 2026' },
    { id: 'TR-1038', from: 'Bharatpur Hub',    to: 'Pokhara Depot',     product: 'Maize Seed BH-540', qty: 200, status: 'Completed',  date: '20 Apr 2026' },
    { id: 'TR-1037', from: 'Damak Collection', to: 'Butwal Warehouse',  product: 'Soil Test Kit',     qty: 5,   status: 'Cancelled',  date: '19 Apr 2026' },
    { id: 'TR-1036', from: 'Gulariya Store',   to: 'Bharatpur Hub',     product: 'Hand Sprayer 16L',  qty: 12,  status: 'Completed',  date: '18 Apr 2026' },
  ];

  get filteredTransfers() {
    const status = this.statusFilter();
    return this.transfers.filter(t => status === 'All' || t.status === status);
  }

  toggleFilter(name: string) {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  statusVariant(s: Transfer['status']): 'success' | 'info' | 'warning' | 'danger' {
    return { Completed: 'success', 'In transit': 'info', Pending: 'warning', Cancelled: 'danger' }[s] as any;
  }
}
