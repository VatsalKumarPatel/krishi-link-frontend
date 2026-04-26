import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../../shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '../../../../shared/badge/badge.component';
import { TenantAddComponent } from '../tenant-add/tenant-add.component';
import { KlActivityFeedComponent, FeedGroup, FeedItem } from '../../../../shared/kl-activity-feed/kl-activity-feed.component';
import { TenantService } from '@services/tenant.service';
import { TenantDto, ActivityLogDto, AdminStoreDtoForTenant } from '@models/tenant.model';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent, TenantAddComponent, KlActivityFeedComponent],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss',
})
export class TenantDetailComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id: string;

  // ── Page state ──────────────────────────────────────────────────────────────
  loading = signal(true);
  error = signal<string | null>(null);
  tenant = signal<TenantDto | null>(null);
  feed = signal<FeedGroup[]>([]);
  stores = signal<AdminStoreDtoForTenant[]>([]);
  storesLoading = signal(false);
  storesLoaded = signal(false);

  activeTab = signal<'details' | 'stores' | 'activity' | 'files'>('details');
  drawerOpen = signal(false);

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.loadTenant();
  }

  loadTenant(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      tenant: this.tenantService.getById(this.id),
      activity: this.tenantService.getActivity(this.id, 1, 50),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ tenant, activity }) => {
          this.tenant.set(tenant);
          this.feed.set(this.toFeedGroups(activity.items));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load tenant details.');
          this.loading.set(false);
        },
      });
  }

  loadStores(): void {
    if (this.storesLoaded()) return;
    this.storesLoading.set(true);
    this.tenantService.getStores(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.stores.set(result.items);
          this.storesLoading.set(false);
          this.storesLoaded.set(true);
        },
        error: () => {
          this.storesLoading.set(false);
        },
      });
  }

  setTab(tab: 'details' | 'stores' | 'activity' | 'files'): void {
    this.activeTab.set(tab);
    if (tab === 'stores') this.loadStores();
  }

  reloadAfterSave(): void {
    this.drawerOpen.set(false);
    this.loadTenant();
  }

  // ── Display helpers ─────────────────────────────────────────────────────────

  shortId(id: string): string {
    // Show first 8 chars of a UUID — full value stays in [title] tooltip
    return id.slice(0, 8) + '…';
  }

  initials(name: string | null): string {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).slice(0, 1).join('').toUpperCase();
  }

  statusVariant(isActive: boolean): BadgeVariant {
    return isActive ? 'success' : 'neutral';
  }

  statusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  storeStatusVariant(isActive: boolean): BadgeVariant {
    return isActive ? 'success' : 'neutral';
  }

  formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  location(t: TenantDto): string {
    const parts = [t.city, t.state].filter((v): v is string => !!v);
    return parts.length ? parts.join(', ') : '—';
  }

  addressLine(t: TenantDto): string {
    return [t.addressLine1, t.addressLine2, t.city, t.state, t.pincode]
      .filter((v): v is string => !!v)
      .join(', ');
  }

  storeCityState(s: { city: string | null; state: string | null }): string {
    const parts = [s.city, s.state].filter((v): v is string => !!v);
    return parts.length ? parts.join(', ') : '—';
  }

  // ── Activity log → FeedGroup[] ─────────────────────────────────────────────

  private toFeedGroups(logs: ActivityLogDto[]): FeedGroup[] {
    if (!logs.length) return [];

    const groups = new Map<string, FeedItem[]>();

    for (const log of logs) {
      const day = this.dayLabel(log.createdAt);
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(this.logToFeedItem(log));
    }

    return Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
  }

  private logToFeedItem(log: ActivityLogDto): FeedItem {
    return {
      kind: 'event',
      who: log.actorName ?? 'System',
      tone: this.toneFor(log.eventType),
      time: this.formatDate(log.createdAt),
      text: log.description ?? log.eventType ?? '',
      extra: log.referenceNumber ?? undefined,
    };
  }

  private toneFor(eventType: string | null): string {
    if (!eventType) return 'neutral';
    const t = eventType.toLowerCase();
    if (t.includes('creat') || t.includes('register') || t.includes('activ')) return 'success';
    if (t.includes('delet') || t.includes('deactiv') || t.includes('suspend')) return 'danger';
    if (t.includes('updat') || t.includes('edit') || t.includes('modif')) return 'info';
    if (t.includes('renew') || t.includes('subscri')) return 'brand';
    return 'neutral';
  }

  private dayLabel(iso: string): string {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (sameDay(date, today)) return 'Today';
    if (sameDay(date, yesterday)) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
