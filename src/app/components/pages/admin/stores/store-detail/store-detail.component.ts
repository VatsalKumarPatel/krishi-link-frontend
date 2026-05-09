import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { BadgeComponent } from '@shared/badge/badge.component';
import { StoreAddComponent } from '../store-add/store-add.component';
import { KlActivityFeedComponent, FeedGroup } from '@shared/kl-activity-feed/kl-activity-feed.component';
import { KlEmptyStateComponent } from '@shared/kl-empty-state/kl-empty-state.component';
import { KlDetailHeaderComponent } from '@shared/kl-detail-header/kl-detail-header.component';
import { StoreService } from '@services/store.service';
import { StoreDto } from '@models/store.model';
import {
  getInitials, statusVariant, statusLabel,
  formatLocation, formatAddress, toFeedGroups,
} from '@app/utils/entity-helpers';
import { formatShortId } from '@app/utils/format';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent, StoreAddComponent,
            KlActivityFeedComponent, KlEmptyStateComponent, KlDetailHeaderComponent],
  templateUrl: './store-detail.component.html',
  styleUrl: './store-detail.component.scss',
})
export class StoreDetailComponent implements OnInit {
  private readonly storeService = inject(StoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id: string;

  loading = signal(true);
  error = signal<string | null>(null);
  store = signal<StoreDto | null>(null);
  feed = signal<FeedGroup[]>([]);

  activeTab = signal<'details' | 'activity' | 'files'>('details');
  drawerOpen = signal(false);

  readonly initials = getInitials;
  readonly statusVariant = statusVariant;
  readonly statusLabel = statusLabel;
  readonly shortId = formatShortId;

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.loadStore();
  }

  loadStore(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      store: this.storeService.getById(this.id),
      activity: this.storeService.getActivity(this.id, 1, 50),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ store, activity }) => {
          this.store.set(store);
          this.feed.set(toFeedGroups(activity.items));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load store details.');
          this.loading.set(false);
        },
      });
  }

  reloadAfterSave(): void {
    this.drawerOpen.set(false);
    this.loadStore();
  }

  location(s: StoreDto): string { return formatLocation(s.city, s.state); }
  addressLine(s: StoreDto): string { return formatAddress(s); }
}
