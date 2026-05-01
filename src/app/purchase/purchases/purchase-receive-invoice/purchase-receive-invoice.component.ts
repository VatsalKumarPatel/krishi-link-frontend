import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { BadgeComponent } from '../../../components/shared/badge/badge.component';
import { PurchaseService } from '@services/purchase.service';
import { PurchaseDetailDto, ReceiveAndInvoiceCommand } from '@models/purchase.model';

const PLACE_OF_SUPPLY_OPTIONS = [
  '01-J&K', '02-HP', '03-Punjab', '04-Chandigarh', '05-Uttarakhand',
  '06-Haryana', '07-Delhi', '08-Rajasthan', '09-UP', '10-Bihar',
  '11-Sikkim', '12-Arunachal Pradesh', '13-Nagaland', '14-Manipur',
  '15-Mizoram', '16-Tripura', '17-Meghalaya', '18-Assam', '19-West Bengal',
  '20-Jharkhand', '21-Odisha', '22-Chhattisgarh', '23-MP', '24-Gujarat',
  '27-Maharashtra', '29-Karnataka', '30-Goa', '32-Kerala', '33-TN',
  '36-Telangana', '37-Andhra Pradesh',
];

@Component({
  selector: 'app-purchase-receive-invoice',
  standalone: true,
  imports: [RouterLink, FormsModule, KlCardComponent, BadgeComponent],
  templateUrl: './purchase-receive-invoice.component.html',
})
export class PurchaseReceiveInvoiceComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  purchase = signal<PurchaseDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);
  receivingOnly = signal(false);
  showTwoStep = signal(false);
  fieldErrors = signal<Record<string, string>>({});

  // Form fields
  supplierInvoiceNumber = signal('');
  invoiceDate = signal(new Date().toISOString().substring(0, 10));
  dueDate = signal('');
  sellerGstin = signal('');
  buyerGstin = signal('');
  placeOfSupply = signal('');
  isInterState = signal(false);

  readonly placeOptions = PLACE_OF_SUPPLY_OPTIONS;

  readonly taxTotal = computed(() => {
    const p = this.purchase();
    if (!p) return 0;
    return this.isInterState()
      ? p.totalIgst
      : p.totalCgst + p.totalSgst;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.purchaseService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (p) => {
        this.purchase.set(p);
        this.sellerGstin.set(p.sellerGstin ?? '');
        this.buyerGstin.set(p.buyerGstin ?? '');
        // Auto-detect inter-state from GSTINs
        if (p.sellerGstin && p.buyerGstin) {
          this.isInterState.set(p.sellerGstin.substring(0, 2) !== p.buyerGstin.substring(0, 2));
        }
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load purchase.'); this.loading.set(false); },
    });
  }

  onInvoiceDateChange(date: string): void {
    this.invoiceDate.set(date);
    // Pre-fill due date based on supplier payment terms
    // We don't have the full supplier here, so we compute if supplier info is on the purchase somehow
    // Default: leave as-is if already set
    if (!this.dueDate()) this.dueDate.set(date);
  }

  confirm(): void {
    this.fieldErrors.set({});
    if (!this.supplierInvoiceNumber().trim()) {
      this.fieldErrors.set({ supplierInvoiceNumber: 'Required' });
      return;
    }
    if (!this.invoiceDate()) {
      this.fieldErrors.set({ invoiceDate: 'Required' });
      return;
    }
    if (!this.placeOfSupply()) {
      this.fieldErrors.set({ placeOfSupply: 'Required' });
      return;
    }

    const cmd: ReceiveAndInvoiceCommand = {
      supplierInvoiceNumber: this.supplierInvoiceNumber().trim(),
      invoiceDate: this.invoiceDate(),
      dueDate: this.dueDate() || null,
      sellerGstin: this.sellerGstin().trim() || null,
      buyerGstin: this.buyerGstin().trim() || null,
      placeOfSupply: this.placeOfSupply(),
      isInterState: this.isInterState(),
    };

    this.saving.set(true);
    this.purchaseService.receiveAndInvoice(this.purchase()!.id, cmd)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/purchase/purchases', this.purchase()!.id]);
        },
        error: (err) => {
          this.saving.set(false);
          if (err.status === 409) {
            this.error.set('Someone else is updating this record. Please refresh and try again.');
          } else {
            this.error.set(err.error?.detail ?? 'Failed to receive & invoice.');
          }
        },
      });
  }

  receiveOnly(): void {
    this.receivingOnly.set(true);
    this.purchaseService.receiveOnly(this.purchase()!.id, { receivedAt: new Date().toISOString() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.receivingOnly.set(false);
          this.router.navigate(['/purchase/purchases', this.purchase()!.id]);
        },
        error: (err) => {
          this.receivingOnly.set(false);
          this.error.set(err.error?.detail ?? 'Failed to receive stock.');
        },
      });
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  }
}
