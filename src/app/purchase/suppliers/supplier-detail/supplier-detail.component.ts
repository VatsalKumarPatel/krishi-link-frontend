import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent, BadgeVariant } from '../../../components/shared/badge/badge.component';
import { SupplierAddComponent } from '../supplier-add/supplier-add.component';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SupplierDto, SupplierBalanceDto } from '@models/supplier.model';
import {
  PurchaseSummaryDto,
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
  PurchaseStatus,
} from '@models/purchase.model';
import { SupplierPaymentSummaryDto, PAYMENT_MODE_LABELS, SUPPLIER_PAYMENT_STATUS_LABELS } from '@models/supplier-payment.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, SlicePipe, KlCardComponent, BadgeComponent, SupplierAddComponent],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  supplierId = signal('');
  supplier = signal<SupplierDto | null>(null);
  balance = signal<SupplierBalanceDto | null>(null);
  purchases = signal<PurchaseSummaryDto[]>([]);
  payments = signal<SupplierPaymentSummaryDto[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'details' | 'purchases' | 'payments'>('details');
  drawerOpen = signal(false);

  readonly statusLabels = PURCHASE_STATUS_LABELS;
  readonly statusBadge = PURCHASE_STATUS_BADGE;
  readonly modeLabels = PAYMENT_MODE_LABELS;
  readonly payStatusLabels = SUPPLIER_PAYMENT_STATUS_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.supplierId.set(id);
    this.loadAll(id);
  }

  loadAll(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      supplier: this.supplierService.getById(id),
      balance: this.supplierService.getBalance(id),
      purchases: this.supplierService.getPurchases(id),
      payments: this.supplierService.getPayments(id),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ supplier, balance, purchases, payments }) => {
        this.supplier.set(supplier);
        this.balance.set(balance);
        this.purchases.set(purchases.items);
        this.payments.set(payments.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load supplier details.');
        this.loading.set(false);
      },
    });
  }

  reloadAfterSave(): void {
    this.drawerOpen.set(false);
    this.loadAll(this.supplierId());
  }

  // ── Display helpers ─────────────────────────────────────────────────────────

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  shortId(id: string): string {
    return id.slice(0, 8) + '…';
  }

  statusVariant(isActive: boolean): BadgeVariant {
    return isActive ? 'success' : 'neutral';
  }

  statusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  isOverdue(p: PurchaseSummaryDto): boolean {
    if (!p.dueDate) return false;
    const s = p.status as number;
    return (s === PurchaseStatus.Invoiced || s === PurchaseStatus.PartiallyPaid)
      && new Date(p.dueDate) < new Date();
  }

  isTenantAdmin(): boolean {
    return this.userService.profile()?.staffRole === 'TenantAdmin';
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  downloadStatement(): void {
    this.supplierService.downloadStatement(this.supplierId()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `supplier-statement-${this.supplierId()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
