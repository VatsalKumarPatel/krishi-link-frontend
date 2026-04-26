import { Component, signal } from '@angular/core';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';

interface InventoryItem {
  id: string; product: string; store: string; qty: number;
  reserved: number; available: number; restock: string;
}

@Component({
  selector: 'app-inventory-list',
  imports: [KlCardComponent, BadgeComponent],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent {
  storeFilter = signal('All');
  openFilter = signal<string | null>(null);

  readonly items: InventoryItem[] = [
    { id: '1', product: 'Hybrid Rice Seed',       store: 'Bharatpur Hub',     qty: 420, reserved: 50,  available: 370, restock: '12 Apr 2026' },
    { id: '2', product: 'NPK Fertilizer 20-20-0', store: 'Pokhara Depot',     qty: 85,  reserved: 10,  available: 75,  restock: '8 Apr 2026' },
    { id: '3', product: 'Maize Seed BH-540',       store: 'Damak Collection',  qty: 310, reserved: 0,   available: 310, restock: '15 Apr 2026' },
    { id: '4', product: 'Hand Sprayer 16L',        store: 'Bharatpur Hub',     qty: 44,  reserved: 5,   available: 39,  restock: '10 Apr 2026' },
    { id: '5', product: 'Urea 46%',                store: 'Besisahar Centre',  qty: 12,  reserved: 2,   available: 10,  restock: '2 Apr 2026' },
    { id: '6', product: 'Wheat Seed HD-2967',      store: 'Butwal Warehouse',  qty: 560, reserved: 100, available: 460, restock: '18 Apr 2026' },
    { id: '7', product: 'Soil Test Kit',           store: 'Gulariya Store',    qty: 8,   reserved: 0,   available: 8,   restock: '1 Apr 2026' },
    { id: '8', product: 'DAP Fertilizer',          store: 'Pokhara Depot',     qty: 230, reserved: 30,  available: 200, restock: '20 Apr 2026' },
  ];

  get stores() {
    return ['All', ...new Set(this.items.map(i => i.store))];
  }

  get filteredItems() {
    const store = this.storeFilter();
    return this.items.filter(i => store === 'All' || i.store === store);
  }

  toggleFilter(name: string) {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  stockVariant(available: number): 'danger' | 'warning' | 'success' {
    if (available < 10) return 'danger';
    if (available < 50) return 'warning';
    return 'success';
  }
}
