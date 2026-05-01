import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { PurchaseService } from '@services/purchase.service';
import { UserService } from '@services/user.service';
import {
  PurchaseSummaryDto,
  PurchaseStatus,
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
} from '@models/purchase.model';

type ListTab = 'all' | 'pending' | 'overdue';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe, KlCardComponent, BadgeComponent],
  templateUrl: './purchase-list.component.html',
})
export class PurchaseListComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  readonly pageSize = 20;
  readonly statusLabels = PURCHASE_STATUS_LABELS;
  readonly statusBadge = PURCHASE_STATUS_BADGE;
  readonly PurchaseStatus = PurchaseStatus;

  // State
  purchases = signal<PurchaseSummaryDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  // Tabs & filters
  activeTab = signal<ListTab>('all');
  statusFilter = signal<number | undefined>(undefined);
  supplierIdFilter = signal<string | undefined>(undefined);
  storeIdFilter = signal<string | undefined>(undefined);
  fromDate = signal('');
  toDate = signal('');

  readonly statusOptions = [
    { value: undefined, label: 'All Statuses' },
    { value: PurchaseStatus.Draft, label: 'Draft' },
    { value: PurchaseStatus.Received, label: 'Received' },
    { value: PurchaseStatus.Invoiced, label: 'Invoiced' },
    { value: PurchaseStatus.PartiallyPaid, label: 'Partially Paid' },
    { value: PurchaseStatus.Paid, label: 'Paid' },
    { value: PurchaseStatus.Cancelled, label: 'Cancelled' },
  ];

  ngOnInit(): void {
    // Pre-fill supplierId from query param (when navigated from supplier detail)
    const qp = this.route.snapshot.queryParamMap;
    if (qp.get('supplierId')) this.supplierIdFilter.set(qp.get('supplierId')!);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const tab = this.activeTab();

    const req = tab === 'pending'
      ? this.purchaseService.getPendingPayment(this.currentPage(), this.pageSize)
      : tab === 'overdue'
        ? this.purchaseService.getOverdue(this.currentPage(), this.pageSize)
        : this.purchaseService.getAll({
            supplierId: this.supplierIdFilter(),
            storeId: this.storeIdFilter(),
            status: this.statusFilter(),
            fromDate: this.fromDate() || undefined,
            toDate: this.toDate() || undefined,
            page: this.currentPage(),
            pageSize: this.pageSize,
          });

    req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.purchases.set(r.items);
        this.totalCount.set(r.totalCount);
        this.totalPages.set(r.totalPages);
        this.hasPreviousPage.set(r.hasPreviousPage);
        this.hasNextPage.set(r.hasNextPage);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load purchases.'); this.loading.set(false); },
    });
  }

  setTab(tab: ListTab): void { this.activeTab.set(tab); this.currentPage.set(1); this.load(); }
  setStatus(val: string): void { this.statusFilter.set(val ? +val : undefined); this.currentPage.set(1); this.load(); }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  pageRange(): string {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalCount());
    return `${start}–${end} of ${this.totalCount()}`;
  }

  isOverdue(p: PurchaseSummaryDto): boolean {
    if (!p.dueDate) return false;
    const s = p.status as number;
    return (s === PurchaseStatus.Invoiced || s === PurchaseStatus.PartiallyPaid)
      && new Date(p.dueDate) < new Date();
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  canReceive(p: PurchaseSummaryDto): boolean {
    const s = p.status as number;
    return this.isStoreManager() && (s === PurchaseStatus.Draft || s === PurchaseStatus.Received);
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
