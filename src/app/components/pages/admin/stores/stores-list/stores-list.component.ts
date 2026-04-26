import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '../../../../shared/badge/badge.component';
import { StoreAddComponent, StoreFormData } from '../store-add/store-add.component';

type StoreStatus = 'active' | 'inactive' | 'setup';
type SortCol = 'id' | 'name' | 'location' | 'tenant' | 'manager' | 'status';

interface Store {
  id: string; name: string; location: string; tenant: string;
  email: string; phone: string; status: StoreStatus; manager: string;
}

const STATUS_VARIANT: Record<StoreStatus, BadgeVariant> = {
  active: 'success', inactive: 'neutral', setup: 'info',
};

const STATUS_LABEL: Record<StoreStatus, string> = {
  active: 'Active', inactive: 'Inactive', setup: 'Setup',
};

@Component({
  selector: 'app-stores-list',
  imports: [FormsModule, KlCardComponent, BadgeComponent, StoreAddComponent],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss',
})
export class StoresListComponent {
  search = signal('');
  statusFilter = signal('All status');
  tenantFilter = signal('All tenants');
  openFilter = signal<string | null>(null);
  activeTab = signal<StoreStatus | 'All'>('All');
  sortCol = signal<SortCol>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  drawerOpen = signal(false);
  editStore = signal<StoreFormData | null>(null);

  readonly statuses = ['All status', 'Active', 'Setup', 'Inactive'];

  readonly allStores: Store[] = [
    { id: 'S-001', name: 'Bharatpur Hub',     location: 'Chitwan',   tenant: 'Terai Fields Co-op',    email: 'bharatpur@teraifields.np',  phone: '+977 56 521 100', status: 'active',   manager: 'Bishal Tamang' },
    { id: 'S-002', name: 'Pokhara Depot',     location: 'Kaski',     tenant: 'Pokhara Growers',        email: 'depot@pokharagrowers.np',   phone: '+977 61 452 200', status: 'active',   manager: 'Sunita Poudel' },
    { id: 'S-003', name: 'Damak Collection',  location: 'Jhapa',     tenant: 'East Plantations',       email: 'damak@eastplant.np',        phone: '+977 23 312 300', status: 'setup',    manager: 'Arjun Rai' },
    { id: 'S-004', name: 'Besisahar Centre',  location: 'Lamjung',   tenant: 'Terai Fields Co-op',    email: 'besi@teraifields.np',       phone: '+977 65 220 400', status: 'active',   manager: 'Maya Gurung' },
    { id: 'S-005', name: 'Gulariya Store',    location: 'Bardiya',   tenant: 'Bardiya Farmers Union',  email: 'gulariya@bfu.np',           phone: '+977 84 221 500', status: 'inactive', manager: 'Dipak Shrestha' },
    { id: 'S-006', name: 'Butwal Warehouse',  location: 'Rupandehi', tenant: 'Kaski Agri Networks',    email: 'butwal@kaskinets.np',       phone: '+977 71 330 600', status: 'active',   manager: 'Kamala Thapa' },
  ];

  get tenantOptions() {
    return ['All tenants', ...new Set(this.allStores.map(s => s.tenant))];
  }

  readonly tabCounts = computed(() => ({
    All: this.allStores.length,
    Active: this.allStores.filter(s => s.status === 'active').length,
    Setup: this.allStores.filter(s => s.status === 'setup').length,
    Inactive: this.allStores.filter(s => s.status === 'inactive').length,
  }));

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    const status = this.statusFilter();
    const tenant = this.tenantFilter();
    const tab = this.activeTab();
    const col = this.sortCol();
    const dir = this.sortDir();

    return [...this.allStores]
      .filter(s =>
        (!q || (s.name + s.id + s.location + s.tenant + s.manager).toLowerCase().includes(q)) &&
        (status === 'All status' || s.status === status.toLowerCase()) &&
        (tenant === 'All tenants' || s.tenant === tenant) &&
        (tab === 'All' || s.status === (tab as string).toLowerCase())
      )
      .sort((a, b) => {
        const va = String(a[col as keyof Store]), vb = String(b[col as keyof Store]);
        return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  });

  tabCount(tab: string): number {
    return (this.tabCounts() as Record<string, number>)[tab] ?? 0;
  }

  statusVariant(s: StoreStatus): BadgeVariant { return STATUS_VARIANT[s]; }
  statusLabel(s: StoreStatus): string { return STATUS_LABEL[s]; }
  initials(name: string) { return name.split(' ').map(p => p[0]).slice(0, 2).join(''); }

  toggleSort(col: SortCol) {
    if (this.sortCol() === col) this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    else { this.sortCol.set(col); this.sortDir.set('asc'); }
  }

  toggleFilter(name: string) {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  openAdd() { this.editStore.set(null); this.drawerOpen.set(true); }
  openEdit(s: StoreFormData, e: Event) { e.stopPropagation(); this.editStore.set(s); this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }
}
