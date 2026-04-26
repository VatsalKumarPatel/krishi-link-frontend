import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KlDrawerComponent } from '../../../../shared/kl-drawer/kl-drawer.component';

export interface StoreFormData {
  id?: string;
  name?: string;
  location?: string;
  tenant?: string;
  manager?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'setup' | 'inactive';
}

@Component({
  selector: 'app-store-add',
  standalone: true,
  imports: [KlDrawerComponent],
  templateUrl: './store-add.component.html',
  styles: [':host { display: contents; }'],
})
export class StoreAddComponent {
  @Input() open = false;
  @Input() store: StoreFormData | null = null;
  @Output() close = new EventEmitter<void>();

  readonly locations = ['Chitwan', 'Kaski', 'Jhapa', 'Lamjung', 'Bardiya', 'Rupandehi', 'Sunsari'];
  readonly tenants = [
    'Terai Fields Co-op',
    'Pokhara Growers',
    'East Plantations',
    'Bardiya Farmers Union',
    'Lumbini Pulses',
    'Kaski Agri Networks',
  ];

  get title(): string {
    return this.store ? 'Edit · ' + this.store.name : 'Add store';
  }

  get subtitle(): string {
    return this.store
      ? 'Store ID ' + this.store.id
      : 'Register a new store location.';
  }
}
