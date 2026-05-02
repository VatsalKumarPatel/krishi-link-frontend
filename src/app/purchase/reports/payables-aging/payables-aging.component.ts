import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { environment } from '@app/environment';

interface PayablesAgingRow {
  supplierName: string;
  bucket0to30: number;
  bucket31to60: number;
  bucket61to90: number;
  bucket90plus: number;
  total: number;
}

@Component({
  selector: 'app-payables-aging',
  standalone: true,
  imports: [FormsModule, KlCardComponent],
  templateUrl: './payables-aging.component.html',
  styleUrls: ['./payables-aging.component.scss'],
})
export class PayablesAgingComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  rows = signal<PayablesAgingRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  asOfDate = signal(new Date().toISOString().substring(0, 10));
  storeId = signal('');

  get grandTotal(): number { return this.rows().reduce((s, r) => s + r.total, 0); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    let params = new HttpParams().set('asOfDate', this.asOfDate());
    if (this.storeId()) params = params.set('storeId', this.storeId());
    this.http.get<PayablesAgingRow[]>(`${environment.apiBaseUrl}/${environment.version}/reports/payables-aging`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => { this.rows.set(r); this.loading.set(false); },
        error: () => { this.error.set('Failed to load report.'); this.loading.set(false); },
      });
  }

  exportCsv(): void {
    const headers = 'Supplier,0-30 Days,31-60 Days,61-90 Days,90+ Days,Total\n';
    const csvRows = this.rows().map(r =>
      `"${r.supplierName}",${r.bucket0to30},${r.bucket31to60},${r.bucket61to90},${r.bucket90plus},${r.total}`
    ).join('\n');
    const blob = new Blob([headers + csvRows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `payables-aging-${this.asOfDate()}.csv`; a.click();
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
