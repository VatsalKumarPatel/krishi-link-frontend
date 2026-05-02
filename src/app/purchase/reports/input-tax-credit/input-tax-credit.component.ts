import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { environment } from '@app/environment';

interface ItcRow {
  hsnCode: string;
  description: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalItc: number;
}

@Component({
  selector: 'app-input-tax-credit',
  standalone: true,
  imports: [FormsModule, KlCardComponent],
  templateUrl: './input-tax-credit.component.html',
  styleUrls: ['./input-tax-credit.component.scss'],
})
export class InputTaxCreditComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  rows = signal<ItcRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  fromDate = signal(this.financialYearStart());
  toDate = signal(new Date().toISOString().substring(0, 10));
  storeId = signal('');

  readonly totalCgst = computed(() => this.rows().reduce((s, r) => s + r.cgst, 0));
  readonly totalSgst = computed(() => this.rows().reduce((s, r) => s + r.sgst, 0));
  readonly totalIgst = computed(() => this.rows().reduce((s, r) => s + r.igst, 0));
  readonly totalItc = computed(() => this.rows().reduce((s, r) => s + r.totalItc, 0));

  private financialYearStart(): string {
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-04-01`;
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    let params = new HttpParams().set('fromDate', this.fromDate()).set('toDate', this.toDate());
    if (this.storeId()) params = params.set('storeId', this.storeId());
    this.http.get<ItcRow[]>(`${environment.apiBaseUrl}/${environment.version}/reports/input-tax-credit`, { params })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => { this.rows.set(r); this.loading.set(false); },
        error: () => { this.error.set('Failed to load ITC report.'); this.loading.set(false); },
      });
  }

  exportCsv(): void {
    const headers = 'HSN Code,Description,Taxable Amount,CGST,SGST,IGST,Total ITC\n';
    const csv = this.rows().map(r =>
      `"${r.hsnCode}","${r.description}",${r.taxableAmount},${r.cgst},${r.sgst},${r.igst},${r.totalItc}`
    ).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `itc-${this.fromDate()}-to-${this.toDate()}.csv`; a.click();
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
}
