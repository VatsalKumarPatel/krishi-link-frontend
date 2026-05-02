import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { SupplierService } from '@services/supplier.service';
import { SupplierDto, SupplierLedgerEntryDto } from '@models/supplier.model';

interface LedgerRowWithBalance extends SupplierLedgerEntryDto {
  runningBalance: number;
}

@Component({
  selector: 'app-supplier-ledger',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe, KlCardComponent],
  templateUrl: './supplier-ledger.component.html',
  styleUrls: ['./supplier-ledger.component.scss'],
})
export class SupplierLedgerComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  supplierId = signal('');
  supplier = signal<SupplierDto | null>(null);
  entries = signal<SupplierLedgerEntryDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalCount = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);
  readonly pageSize = 50;

  // Date range — defaults to current financial year
  fromDate = signal(this.financialYearStart());
  toDate = signal(new Date().toISOString().substring(0, 10));

  readonly rows = computed<LedgerRowWithBalance[]>(() => {
    let balance = 0;
    return this.entries().map(e => {
      balance += (e.debitAmount ?? 0) - (e.creditAmount ?? 0);
      return { ...e, runningBalance: balance };
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.supplierId.set(id);
    this.supplierService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => this.supplier.set(s),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.supplierService.getLedger(
      this.supplierId(), this.fromDate(), this.toDate(),
      this.currentPage(), this.pageSize,
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.entries.set(r.items);
        this.totalCount.set(r.totalCount);
        this.totalPages.set(r.totalPages);
        this.hasPreviousPage.set(r.hasPreviousPage);
        this.hasNextPage.set(r.hasNextPage);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load ledger.'); this.loading.set(false); },
    });
  }

  applyFilter(): void { this.currentPage.set(1); this.load(); }

  prevPage(): void { if (this.hasPreviousPage()) { this.currentPage.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.hasNextPage()) { this.currentPage.update(p => p + 1); this.load(); } }

  private financialYearStart(): string {
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-04-01`;
  }

  abs(n: number): number { return Math.abs(n); }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }

  rowClass(row: LedgerRowWithBalance): string {
    if (row.debitAmount && row.debitAmount > 0) return 'kl-ledger-debit';
    if (row.creditAmount && row.creditAmount > 0) return 'kl-ledger-credit';
    return '';
  }
}
