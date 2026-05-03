import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';
import { PurchaseService } from '@services/purchase.service';
import { UserService } from '@services/user.service';
import {
  PurchaseDetailDto,
  PurchaseStatus,
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
} from '@models/purchase.model';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe, KlCardComponent, BadgeComponent, PurchaseAddComponent],
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
})
export class PurchaseDetailComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  purchase = signal<PurchaseDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'details' | 'items' | 'allocations'>('details');
  drawerOpen = signal(false);
  purchaseIdForEdit = signal<string | null>(null);

  // Cancel dialog
  showCancelDialog = signal(false);
  cancelReason = signal('');
  cancelling = signal(false);
  cancelError = signal<string | null>(null);

  readonly statusLabels = PURCHASE_STATUS_LABELS;
  readonly statusBadge = PURCHASE_STATUS_BADGE;
  readonly PurchaseStatus = PurchaseStatus;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id?: string): void {
    const purchaseId = id ?? this.purchase()?.id;
    if (!purchaseId) return;
    this.loading.set(true);
    this.purchaseService.getById(purchaseId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (p) => { this.purchase.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load purchase.'); this.loading.set(false); },
    });
  }

  reloadAfterSave(): void {
    this.drawerOpen.set(false);
    this.load();
  }

  get p(): PurchaseDetailDto { return this.purchase()!; }

  isDraft(): boolean { return this.purchase()?.status === PurchaseStatus.Draft; }
  isReceived(): boolean { return this.purchase()?.status === PurchaseStatus.Received; }
  isInvoiced(): boolean { return this.purchase()?.status === PurchaseStatus.Invoiced; }
  isPartiallyPaid(): boolean { return this.purchase()?.status === PurchaseStatus.PartiallyPaid; }
  isPaid(): boolean { return this.purchase()?.status === PurchaseStatus.Paid; }
  isCancelled(): boolean { return this.purchase()?.status === PurchaseStatus.Cancelled; }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  canReceive(): boolean { return this.isStoreManager() && (this.isDraft() || this.isReceived()); }
  canEdit(): boolean { return this.isDraft(); }
  canCancel(): boolean { return this.isStoreManager() && (this.isDraft() || this.isReceived()); }
  canPayment(): boolean { return this.isInvoiced() || this.isPartiallyPaid(); }
  canReturn(): boolean { return this.isInvoiced() || this.isPartiallyPaid() || this.isPaid(); }

  isOverdue(): boolean {
    const p = this.purchase();
    if (!p?.dueDate) return false;
    return (p.status === PurchaseStatus.Invoiced || p.status === PurchaseStatus.PartiallyPaid)
      && new Date(p.dueDate) < new Date();
  }

  submitCancel(): void {
    if (!this.cancelReason().trim()) { this.cancelError.set('Reason is required.'); return; }
    this.cancelling.set(true); this.cancelError.set(null);
    this.purchaseService.cancel(this.purchase()!.id, { reason: this.cancelReason() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showCancelDialog.set(false);
          this.cancelling.set(false);
          this.load();
        },
        error: (err) => {
          this.cancelling.set(false);
          this.cancelError.set(err.error?.detail ?? 'Failed to cancel purchase.');
        },
      });
  }

  shortId(id: string): string { return id.slice(0, 8) + '…'; }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
