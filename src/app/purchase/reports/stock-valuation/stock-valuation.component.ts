import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { environment } from '@app/environment';

interface StockValuationRow {
  productName: string;
  category: string;
  stockQty: number;
  unitName: string;
  costMethod: string;
  costPerUnit: number;
  totalValue: number;
}

@Component({
  selector: 'app-stock-valuation',
  standalone: true,
  imports: [FormsModule, KlCardComponent],
  templateUrl: './stock-valuation.component.html',
  styleUrls: ['./stock-valuation.component.scss'],
})
export class StockValuationComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  rows = signal<StockValuationRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  asOfDate = signal(new Date().toISOString().substring(0, 10));
  storeId = signal('');

  readonly grandTotal = computed(() => this.rows().reduce((s, r) => s + r.totalValue, 0));

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    let params = new HttpParams().set('asOfDate', this.asOfDate());
    if (this.storeId()) params = params.set('storeId', this.storeId());
    this.http.get<StockValuationRow[]>(`${environment.apiBaseUrl}/${environment.version}/reports/stock-valuation`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => { this.rows.set(r); this.loading.set(false); },
        error: () => { this.error.set('Failed to load stock valuation.'); this.loading.set(false); },
      });
  }

  exportCsv(): void {
    const headers = 'Product,Category,Stock Qty,Unit,Cost Method,Cost/Unit,Total Value\n';
    const csv = this.rows().map(r =>
      `"${r.productName}","${r.category}",${r.stockQty},"${r.unitName}","${r.costMethod}",${r.costPerUnit},${r.totalValue}`
    ).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `stock-valuation-${this.asOfDate()}.csv`; a.click();
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
