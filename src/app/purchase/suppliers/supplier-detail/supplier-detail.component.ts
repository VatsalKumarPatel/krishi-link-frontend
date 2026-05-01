import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SupplierDto, SupplierBalanceDto } from '@models/supplier.model';
import { PurchaseSummaryDto } from '@models/purchase.model';
import { SupplierPaymentSummaryDto } from '@models/supplier-payment.model';
import {
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_BADGE,
  PurchaseStatus,
} from '@models/purchase.model';
import { PAYMENT_MODE_LABELS, SUPPLIER_PAYMENT_STATUS_LABELS } from '@models/supplier-payment.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, KlCardComponent, BadgeComponent],
  templateUrl: './supplier-detail.component.html',
})
export class SupplierDetailComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  supplierId = signal('');
  supplier = signal<SupplierDto | null>(null);
  balance = signal<SupplierBalanceDto | null>(null);
  purchases = signal<PurchaseSummaryDto[]>([]);
  payments = signal<SupplierPaymentSummaryDto[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'overview' | 'purchases' | 'payments'>('overview');

  readonly statusLabels = PURCHASE_STATUS_LABELS;
  readonly statusBadge = PURCHASE_STATUS_BADGE;
  readonly modeLabels = PAYMENT_MODE_LABELS;
  readonly payStatusLabels = SUPPLIER_PAYMENT_STATUS_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.supplierId.set(id);
    this.loadSupplier(id);
    this.loadBalance(id);
    this.loadPurchases(id);
    this.loadPayments(id);
  }

  private loadSupplier(id: string): void {
    this.supplierService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => { this.supplier.set(s); this.loading.set(false); },
      error: () => { this.error.set('Failed to load supplier.'); this.loading.set(false); },
    });
  }

  private loadBalance(id: string): void {
    this.supplierService.getBalance(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (b) => this.balance.set(b),
    });
  }

  private loadPurchases(id: string): void {
    this.supplierService.getPurchases(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => this.purchases.set(r.items),
    });
  }

  private loadPayments(id: string): void {
    this.supplierService.getPayments(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => this.payments.set(r.items),
    });
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  isTenantAdmin(): boolean {
    return this.userService.profile()?.staffRole === 'TenantAdmin';
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

  isOverdue(p: PurchaseSummaryDto): boolean {
    if (!p.dueDate) return false;
    const s = p.status as number;
    return (s === PurchaseStatus.Invoiced || s === PurchaseStatus.PartiallyPaid)
      && new Date(p.dueDate) < new Date();
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
