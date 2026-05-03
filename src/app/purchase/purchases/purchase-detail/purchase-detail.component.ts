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
  AddPurchaseItemCommand,
  PurchaseDetailDto,
  PurchaseItemDto,
  PurchaseStatus,
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
} from '@models/purchase.model';

const GST_RATES = [0, 5, 12, 18, 28];

interface PurchaseItemForm {
  productId: string;
  unitId: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  hsnCode: string;
  taxRatePercent: number;
  batchNumber: string;
  expiryDate: string;
}

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
  itemForm = signal<PurchaseItemForm>(this.blankItemForm());
  savingItem = signal(false);
  itemError = signal<string | null>(null);
  removingItemId = signal<string | null>(null);
  readonly gstRates = GST_RATES;

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
    if (this.route.snapshot.queryParamMap.get('tab') === 'items') {
      this.activeTab.set('items');
    }
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

  updateItemForm(field: keyof PurchaseItemForm, value: string | number): void {
    this.itemForm.update(form => ({ ...form, [field]: value }));
  }

  addItem(): void {
    const purchase = this.purchase();
    if (!purchase) return;

    const form = this.itemForm();
    if (!form.productId || !form.unitId || form.quantity <= 0) {
      this.itemError.set('Product, Unit and Quantity are required.');
      return;
    }

    const cmd: AddPurchaseItemCommand = {
      productId: form.productId,
      unitId: form.unitId,
      quantity: form.quantity,
      ratePerUnit: form.ratePerUnit,
      discountPercent: form.discountPercent,
      hsnCode: form.hsnCode,
      taxRatePercent: form.taxRatePercent,
      batchNumber: form.batchNumber || null,
      expiryDate: form.expiryDate || null,
    };

    this.savingItem.set(true);
    this.itemError.set(null);
    this.purchaseService.addItem(purchase.id, cmd)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.savingItem.set(false);
          this.itemForm.set(this.blankItemForm());
          this.activeTab.set('items');
          this.load(purchase.id);
        },
        error: (err) => {
          this.savingItem.set(false);
          this.itemError.set(err.error?.detail ?? 'Failed to add item.');
        },
      });
  }

  removeItem(item: PurchaseItemDto): void {
    const purchase = this.purchase();
    if (!purchase || !this.isDraft()) return;

    this.removingItemId.set(item.id);
    this.itemError.set(null);
    this.purchaseService.removeItem(purchase.id, item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.removingItemId.set(null);
          this.activeTab.set('items');
          this.load(purchase.id);
        },
        error: (err) => {
          this.removingItemId.set(null);
          this.itemError.set(err.error?.detail ?? 'Failed to remove item.');
        },
      });
  }

  itemPreviewTotal(): number {
    const form = this.itemForm();
    const gross = form.quantity * form.ratePerUnit;
    const discount = gross * (form.discountPercent / 100);
    const taxable = gross - discount;
    const tax = taxable * (form.taxRatePercent / 100);
    return +(taxable + tax).toFixed(2);
  }

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

  private blankItemForm(): PurchaseItemForm {
    return {
      productId: '',
      unitId: '',
      quantity: 1,
      ratePerUnit: 0,
      discountPercent: 0,
      hsnCode: '',
      taxRatePercent: 5,
      batchNumber: '',
      expiryDate: '',
    };
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
