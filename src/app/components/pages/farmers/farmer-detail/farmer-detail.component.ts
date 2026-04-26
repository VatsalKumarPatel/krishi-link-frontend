import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { FarmerAddComponent } from '../farmer-add/farmer-add.component';
import { KlActivityFeedComponent } from '../../../shared/kl-activity-feed/kl-activity-feed.component';
import { FARMERS, PLOTS_BY_FARMER, FEED, STATUS_VARIANT, STAGE_VARIANT, HEALTH_VARIANT, Farmer, Plot } from '../farmer.data';

type Tab = 'overview' | 'plots' | 'activity' | 'files';

@Component({
  selector: 'app-farmer-detail',
  imports: [RouterLink, KlCardComponent, BadgeComponent, FarmerAddComponent, KlActivityFeedComponent],
  templateUrl: './farmer-detail.component.html',
  styleUrl: './farmer-detail.component.scss',
})
export class FarmerDetailComponent {
  readonly farmer: Farmer;
  readonly plots: Plot[];
  readonly feed = FEED;

  activeTab = signal<Tab>('overview');
  drawerOpen = signal(false);

  readonly totalArea: number;
  readonly cropCount: number;

  readonly cropsByArea = computed(() => {
    const map: Record<string, number> = {};
    this.plots.forEach(p => { map[p.crop] = (map[p.crop] ?? 0) + p.area; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  });

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id') ?? 'KL-0442';
    this.farmer = FARMERS.find(f => f.id === id) ?? FARMERS[0];
    this.plots = PLOTS_BY_FARMER[this.farmer.id] ?? [];
    this.totalArea = this.plots.reduce((s, p) => s + p.area, 0);
    this.cropCount = new Set(this.plots.map(p => p.crop)).size;
  }

  initials(name: string) { return name.split(' ').map(p => p[0]).slice(0, 2).join(''); }
  statusVariant(s: Farmer['status']) { return STATUS_VARIANT[s]; }
  stageVariant(s: Plot['stage']) { return STAGE_VARIANT[s] ?? 'neutral'; }
  healthVariant(h: Plot['health']) { return HEALTH_VARIANT[h] ?? 'neutral'; }
}
