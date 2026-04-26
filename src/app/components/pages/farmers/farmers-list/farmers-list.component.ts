import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FARMERS, STATUS_VARIANT, Farmer, FarmerStatus } from '../farmer.data';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { FarmerAddComponent } from '../farmer-add/farmer-add.component';

type SortCol = 'id' | 'name' | 'region' | 'crop' | 'area' | 'status' | 'updated';
type TabCounts = { All: number; Active: number; 'Needs review': number; Overdue: number; Draft: number };

@Component({
  selector: 'app-farmers-list',
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent, FarmerAddComponent],
  templateUrl: './farmers-list.component.html',
  styleUrl: './farmers-list.component.scss',
})
export class FarmersListComponent {
  readonly allFarmers = FARMERS;

  search = signal('');
  regionFilter = signal('All regions');
  cropFilter = signal('All crops');
  statusFilter = signal('All status');
  activeTab = signal<FarmerStatus | 'All'>('All');
  openFilter = signal<string | null>(null);
  sortCol = signal<SortCol>('id');
  sortDir = signal<'asc' | 'desc'>('desc');

  drawerOpen = signal(false);
  editFarmer = signal<Farmer | null>(null);

  readonly regions = ['All regions', 'Chitwan', 'Kaski', 'Jhapa', 'Lamjung', 'Bardiya', 'Rupandehi'];
  readonly crops = ['All crops', 'Rice', 'Maize', 'Tea', 'Millet', 'Wheat', 'Lentil', 'Vegetable'];
  readonly statuses: (FarmerStatus | 'All status')[] = ['All status', 'Active', 'Needs review', 'Overdue', 'Draft'];

  readonly tabCounts = computed(() => ({
    All: this.allFarmers.length,
    Active: this.allFarmers.filter(f => f.status === 'Active').length,
    'Needs review': this.allFarmers.filter(f => f.status === 'Needs review').length,
    Overdue: this.allFarmers.filter(f => f.status === 'Overdue').length,
    Draft: this.allFarmers.filter(f => f.status === 'Draft').length,
  }));

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    const region = this.regionFilter();
    const crop = this.cropFilter();
    const status = this.statusFilter();
    const tab = this.activeTab();
    const col = this.sortCol();
    const dir = this.sortDir();

    return [...this.allFarmers]
      .filter(f =>
        (!q || (f.name + f.id + f.region + f.crop).toLowerCase().includes(q)) &&
        (region === 'All regions' || f.region === region) &&
        (crop === 'All crops' || f.crop === crop) &&
        (status === 'All status' || f.status === status) &&
        (tab === 'All' || f.status === tab)
      )
      .sort((a, b) => {
        const va = a[col as keyof Farmer], vb = b[col as keyof Farmer];
        const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
        return dir === 'asc' ? cmp : -cmp;
      });
  });

  tabCount(tab: string): number {
    return (this.tabCounts() as Record<string, number>)[tab] ?? 0;
  }

  statusVariant(s: FarmerStatus) { return STATUS_VARIANT[s]; }

  initials(name: string) { return name.split(' ').map(p => p[0]).slice(0, 2).join(''); }

  toggleSort(col: SortCol) {
    if (this.sortCol() === col) this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    else { this.sortCol.set(col); this.sortDir.set('asc'); }
  }

  toggleFilter(name: string) {
    this.openFilter.set(this.openFilter() === name ? null : name);
  }

  openAdd() { this.editFarmer.set(null); this.drawerOpen.set(true); }
  openEdit(f: Farmer, e: Event) { e.stopPropagation(); this.editFarmer.set(f); this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }
}
