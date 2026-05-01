import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { PurchaseReturnService } from '@services/purchase-return.service';
import { SupplierService } from '@services/supplier.service';
import { StorePickerService } from '@services/store-picker.service';
import { CreatePurchaseReturnCommand, CreateReturnItemCommand } from '@models/purchase-return.model';
import { SupplierSummaryDto } from '@models/supplier.model';

interface ReturnRow {
  productId: string;
  unitId: string;
  quantity: number;
  ratePerUnit: number;
  hsnCode: string;
  taxRatePercent: number;
  batchId: string;
  taxableAmount: number;
  lineTotal: number;
}

const GST_RATES = [0, 5, 12, 18, 28];

@Component({
  selector: 'app-return-form',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent],
  templateUrl: './return-form.component.html',
})
export class ReturnFormComponent implements OnInit {
  private readonly returnService = inject(PurchaseReturnService);
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly storePicker = inject(StorePickerService);

  readonly gstRates = GST_RATES;

  supplierId = signal('');
  supplierSearch = signal('');
  supplierResults = signal<SupplierSummaryDto[]>([]);
  selectedSupplier = signal<SupplierSummaryDto | null>(null);
  showSupplierDrop = signal(false);
  purchaseId = signal('');
  storeId = signal('');
  returnDate = signal(new Date().toISOString().substring(0, 10));
  reason = signal('');
  items = signal<ReturnRow[]>([]);

  saving = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const store = this.storePicker.selectedStore();
    if (store) this.storeId.set(store.id);
    const purchaseId = this.route.snapshot.queryParamMap.get('purchaseId');
    if (purchaseId) this.purchaseId.set(purchaseId);
    this.addRow();
  }

  searchSupplier(term: string): void {
    this.supplierSearch.set(term);
    if (term.length < 2) { this.supplierResults.set([]); return; }
    this.supplierService.search(term).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.supplierResults.set(r); this.showSupplierDrop.set(true); },
    });
  }

  selectSupplier(s: SupplierSummaryDto): void {
    this.selectedSupplier.set(s); this.supplierId.set(s.id);
    this.supplierSearch.set(s.name); this.showSupplierDrop.set(false);
  }

  addRow(): void {
    this.items.update(rows => [...rows, { productId: '', unitId: '', quantity: 1, ratePerUnit: 0, hsnCode: '', taxRatePercent: 5, batchId: '', taxableAmount: 0, lineTotal: 0 }]);
  }

  removeRow(i: number): void { this.items.update(rows => rows.filter((_, idx) => idx !== i)); }

  updateRow(i: number, field: keyof ReturnRow, val: string | number): void {
    this.items.update(rows => {
      const updated = [...rows];
      (updated[i] as any)[field] = val;
      const r = updated[i];
      const taxable = r.quantity * r.ratePerUnit;
      updated[i] = { ...r, taxableAmount: taxable, lineTotal: +(taxable * (1 + r.taxRatePercent / 100)).toFixed(2) };
      return updated;
    });
  }

  save(): void {
    this.error.set(null);
    if (!this.supplierId() || !this.storeId() || !this.reason().trim()) {
      this.error.set('Supplier, Store and Reason are required.'); return;
    }
    const itemCmds: CreateReturnItemCommand[] = this.items()
      .filter(i => i.productId && i.quantity > 0)
      .map(i => ({ productId: i.productId, unitId: i.unitId, quantity: i.quantity, ratePerUnit: i.ratePerUnit, hsnCode: i.hsnCode, taxRatePercent: i.taxRatePercent, batchId: i.batchId || null }));

    const cmd: CreatePurchaseReturnCommand = {
      supplierId: this.supplierId(),
      storeId: this.storeId(),
      purchaseId: this.purchaseId() || null,
      returnDate: this.returnDate(),
      reason: this.reason().trim(),
      items: itemCmds,
    };
    this.saving.set(true);
    this.returnService.create(cmd).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.saving.set(false); this.router.navigate(['/purchase/purchase-returns', r.id]); },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.detail ?? 'Failed to create return.'); },
    });
  }

  fmt(n: number): string { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); }
  get grandTotal(): number { return this.items().reduce((s, i) => s + i.lineTotal, 0); }
}
