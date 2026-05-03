import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
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
} from '@models/purchase.model';
import { DropdownItem } from '@app/models/shared.model';

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

  // Header
  supplierId = signal('');
  suppliers = signal<DropdownItem[]>([]);
  suppliersLoading = signal(false);
  storeId = signal('');
  purchaseDate = signal(new Date().toISOString().substring(0, 10));
  notes = signal('');

  // UI state
  saving = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Default to selected store
    const store = this.storePicker.selectedStore();
    if (store) this.storeId.set(store.id);
    this.loadSuppliers();
  }
   
  private loadSuppliers(): void {
    this.suppliersLoading.set(true);
    this.supplierService.getDropdown().subscribe({
      next: (list) => { 
        this.suppliers.set(list);
        this.suppliersLoading.set(false); 
      },
      error: () => { this.suppliersLoading.set(false); },
    });
  }

  createDraft(): void {
    if (!this.supplierId() || !this.storeId() || !this.purchaseDate()) {
      this.error.set('Please fill in Supplier, Store and Purchase Date.');
      return;
    }

    this.error.set(null);
    this.saving.set(true);
    const cmd: CreatePurchaseCommand = {
      supplierId: this.supplierId(),
      storeId: this.storeId(),
      purchaseDate: this.purchaseDate(),
      notes: this.notes().trim() || null,
    };
    this.purchaseService.create(cmd).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (draft) => {
        this.saving.set(false);
        this.router.navigate(['/purchase/purchases', draft.id], { queryParams: { tab: 'items' } });
      },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.detail ?? 'Failed to create purchase.'); },
    });
  }

  isStoreManager(): boolean {
    const r = this.userService.profile()?.staffRole;
    return r === 'StoreManager' || r === 'TenantAdmin';
  }
}
