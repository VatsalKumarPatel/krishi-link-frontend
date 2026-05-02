import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { PurchaseService } from '@services/purchase.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { StorePickerService } from '@services/store-picker.service';
import {
  CreatePurchaseCommand,
  AddPurchaseItemCommand,
  PurchaseDetailDto,
} from '@models/purchase.model';
import { SupplierSummaryDto } from '@models/supplier.model';

const GST_RATES = [0, 5, 12, 18, 28];

interface LineItem {
  productId: string;
  productName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  ratePerUnit: number;
  discountPercent: number;
  hsnCode: string;
  taxRatePercent: number;
  batchNumber: string;
  expiryDate: string;
  // computed
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  lineTotal: number;
}

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent],
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
})
export class PurchaseFormComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly userService = inject(UserService);
  readonly storePicker = inject(StorePickerService);

  readonly gstRates = GST_RATES;

  // Header
  supplierId = signal('');
  supplierSearch = signal('');
  supplierResults = signal<SupplierSummaryDto[]>([]);
  selectedSupplier = signal<SupplierSummaryDto | null>(null);
  storeId = signal('');
  purchaseDate = signal(new Date().toISOString().substring(0, 10));
  notes = signal('');

  // Items
  items = signal<LineItem[]>([]);

  // UI state
  step = signal<1 | 2>(1);
  saving = signal(false);
  savingReceive = signal(false);
  error = signal<string | null>(null);
  draftId = signal<string | null>(null);
  showSupplierDrop = signal(false);

  // Totals
  readonly subTotal = computed(() => this.items().reduce((s, i) => s + i.taxableAmount, 0));
  readonly totalDiscount = computed(() => this.items().reduce((s, i) => s + i.discountAmount, 0));
  readonly totalCgst = computed(() => this.items().reduce((s, i) => s + i.cgst, 0));
  readonly totalSgst = computed(() => this.items().reduce((s, i) => s + i.sgst, 0));
  readonly totalIgst = computed(() => this.items().reduce((s, i) => s + i.igst, 0));
  readonly grandTotal = computed(() => this.items().reduce((s, i) => s + i.lineTotal, 0));

  ngOnInit(): void {
    // Default to selected store
    const store = this.storePicker.selectedStore();
    if (store) this.storeId.set(store.id);
  }

  searchSupplier(term: string): void {
    this.supplierSearch.set(term);
    if (term.length < 2) { this.supplierResults.set([]); return; }
    this.supplierService.search(term).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => { this.supplierResults.set(r); this.showSupplierDrop.set(true); },
    });
  }

  selectSupplier(s: SupplierSummaryDto): void {
    this.selectedSupplier.set(s);
    this.supplierId.set(s.id);
    this.supplierSearch.set(s.name);
    this.showSupplierDrop.set(false);
    this.supplierResults.set([]);
  }

  addRow(): void {
    this.items.update(rows => [...rows, this.blankRow()]);
  }

  removeRow(i: number): void {
    this.items.update(rows => rows.filter((_, idx) => idx !== i));
  }

  updateRow(i: number, field: keyof LineItem, value: string | number): void {
    this.items.update(rows => {
      const updated = [...rows];
      (updated[i] as any)[field] = value;
      updated[i] = this.recalcRow(updated[i]);
      return updated;
    });
  }

  private recalcRow(row: LineItem): LineItem {
    const gross = row.quantity * row.ratePerUnit;
    const discAmt = gross * (row.discountPercent / 100);
    const taxable = gross - discAmt;
    const taxAmt = taxable * (row.taxRatePercent / 100);
    const half = taxAmt / 2;
    return {
      ...row,
      discountAmount: +discAmt.toFixed(4),
      taxableAmount: +taxable.toFixed(4),
      cgst: +half.toFixed(4),
      sgst: +half.toFixed(4),
      igst: 0,
      lineTotal: +(taxable + taxAmt).toFixed(2),
    };
  }

  private blankRow(): LineItem {
    return {
      productId: '', productName: '', unitId: '', unitName: '',
      quantity: 1, ratePerUnit: 0, discountPercent: 0,
      hsnCode: '', taxRatePercent: 5,
      batchNumber: '', expiryDate: '',
      discountAmount: 0, taxableAmount: 0, cgst: 0, sgst: 0, igst: 0, lineTotal: 0,
    };
  }

  goToStep2(): void {
    if (!this.supplierId() || !this.storeId() || !this.purchaseDate()) {
      this.error.set('Please fill in Supplier, Store and Purchase Date.');
      return;
    }
    this.error.set(null);
    if (this.items().length === 0) this.addRow();
    this.step.set(2);
  }

  saveDraft(): void {
    this.error.set(null);
    this.saving.set(true);
    const cmd: CreatePurchaseCommand = {
      supplierId: this.supplierId(),
      storeId: this.storeId(),
      purchaseDate: this.purchaseDate(),
      notes: this.notes().trim() || null,
    };
    this.purchaseService.create(cmd).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (draft) => this.saveItems(draft, false),
      error: (err) => { this.saving.set(false); this.error.set(err.error?.detail ?? 'Failed to create purchase.'); },
    });
  }

  saveAndReceive(): void {
    this.error.set(null);
    this.savingReceive.set(true);
    const cmd: CreatePurchaseCommand = {
      supplierId: this.supplierId(),
      storeId: this.storeId(),
      purchaseDate: this.purchaseDate(),
      notes: this.notes().trim() || null,
    };
    this.purchaseService.create(cmd).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (draft) => this.saveItems(draft, true),
      error: (err) => { this.savingReceive.set(false); this.error.set(err.error?.detail ?? 'Failed to create purchase.'); },
    });
  }

  private saveItems(draft: PurchaseDetailDto, thenReceive: boolean): void {
    const validItems = this.items().filter(i => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      const path = thenReceive
        ? ['/purchase/purchases', draft.id, 'receive']
        : ['/purchase/purchases', draft.id];
      this.saving.set(false); this.savingReceive.set(false);
      this.router.navigate(path);
      return;
    }

    // Fire all item adds in sequence
    let remaining = validItems.length;
    let failed = false;
    for (const item of validItems) {
      const itemCmd: AddPurchaseItemCommand = {
        productId: item.productId,
        unitId: item.unitId,
        quantity: item.quantity,
        ratePerUnit: item.ratePerUnit,
        discountPercent: item.discountPercent,
        hsnCode: item.hsnCode,
        taxRatePercent: item.taxRatePercent,
        batchNumber: item.batchNumber || null,
        expiryDate: item.expiryDate || null,
      };
      this.purchaseService.addItem(draft.id, itemCmd)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            remaining--;
            if (remaining === 0 && !failed) {
              this.saving.set(false); this.savingReceive.set(false);
              this.router.navigate(thenReceive
                ? ['/purchase/purchases', draft.id, 'receive']
                : ['/purchase/purchases', draft.id]);
            }
          },
          error: () => {
            failed = true;
            this.saving.set(false); this.savingReceive.set(false);
            this.error.set('Draft saved but some items failed. Edit from the purchase detail page.');
            this.router.navigate(['/purchase/purchases', draft.id]);
          },
        });
    }
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
