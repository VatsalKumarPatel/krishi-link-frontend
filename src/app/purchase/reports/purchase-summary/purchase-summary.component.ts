import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { environment } from '@app/environment';

interface PurchaseSummaryRow {
  groupKey: string;
  totalPurchases: number;
  totalGst: number;
  totalDiscount: number;
  netAmount: number;
}

type GroupBy = 'Supplier' | 'Product' | 'Month';

@Component({
  selector: 'app-purchase-summary-report',
  standalone: true,
  imports: [FormsModule, KlCardComponent],
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-summary.component.scss'],
})
export class PurchaseSummaryReportComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly groupOptions: GroupBy[] = ['Supplier', 'Product', 'Month'];

  rows = signal<PurchaseSummaryRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  fromDate = signal(this.financialYearStart());
  toDate = signal(new Date().toISOString().substring(0, 10));
  groupBy = signal<GroupBy>('Supplier');

  private financialYearStart(): string {
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-04-01`;
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    const params = new HttpParams()
      .set('fromDate', this.fromDate()).set('toDate', this.toDate()).set('groupBy', this.groupBy());
    this.http.get<PurchaseSummaryRow[]>(`${environment.apiBaseUrl}/${environment.version}/reports/purchase-summary`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => { this.rows.set(r); this.loading.set(false); },
        error: () => { this.error.set('Failed to load report.'); this.loading.set(false); },
      });
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
  get grandTotal(): number { return this.rows().reduce((s, r) => s + r.netAmount, 0); }
  groupLabel(): string { return this.groupBy(); }
}
