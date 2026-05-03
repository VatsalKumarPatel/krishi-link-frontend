import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { ReturnAddComponent } from '../return-add/return-add.component';
import { PurchaseReturnService } from '@services/purchase-return.service';
import { UserService } from '@services/user.service';
import { PurchaseReturnDetailDto, PurchaseReturnStatus, RETURN_STATUS_LABELS } from '@models/purchase-return.model';

@Component({
  selector: 'app-return-detail',
  standalone: true,
  imports: [RouterLink, SlicePipe, KlCardComponent, BadgeComponent, ReturnAddComponent],
  templateUrl: './return-detail.component.html',
  styleUrls: ['./return-detail.component.scss'],
})
export class ReturnDetailComponent implements OnInit {
  private readonly returnService = inject(PurchaseReturnService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);

  ret = signal<PurchaseReturnDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  acting = signal(false);
  activeTab = signal<'details' | 'items'>('details');
  drawerOpen = signal(false);
  returnIdForEdit = signal<string | null>(null);

  readonly statusLabels = RETURN_STATUS_LABELS;
  readonly PurchaseReturnStatus = PurchaseReturnStatus;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id?: string): void {
    const rid = id ?? this.ret()?.id;
    if (!rid) return;
    this.returnService.getById(rid).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.ret.set(r); this.loading.set(false); },
      error: () => { this.error.set('Failed to load return.'); this.loading.set(false); },
    });
  }

  reloadAfterSave(): void {
    this.drawerOpen.set(false);
    this.load();
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  canDispatch(): boolean { return this.isStoreManager() && this.ret()?.status === PurchaseReturnStatus.Draft; }
  canAcknowledge(): boolean { return this.isStoreManager() && this.ret()?.status === PurchaseReturnStatus.Dispatched; }

  dispatch(): void {
    this.acting.set(true);
    this.returnService.dispatch(this.ret()!.id, { dispatchedAt: new Date().toISOString() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (r) => { this.ret.set(r); this.acting.set(false); }, error: () => this.acting.set(false) });
  }

  acknowledge(): void {
    this.acting.set(true);
    this.returnService.acknowledge(this.ret()!.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (r) => { this.ret.set(r); this.acting.set(false); }, error: () => this.acting.set(false) });
  }

  statusBadge(): 'neutral' | 'warning' | 'success' {
    const s = this.ret()?.status;
    if (s === PurchaseReturnStatus.Draft) return 'neutral';
    if (s === PurchaseReturnStatus.Dispatched) return 'warning';
    return 'success';
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
