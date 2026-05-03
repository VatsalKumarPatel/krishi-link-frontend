import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal, DestroyRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { SupplierService } from '@services/supplier.service';
import { ToastService } from '@services/toast.service';
import { SupplierDto, CreateSupplierCommand, UpdateSupplierCommand } from '@models/supplier.model';

interface SupplierForm {
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  creditLimitAmount: number;
  creditDays: number;
  isActive: boolean;
}

function emptyForm(): SupplierForm {
  return {
    name: '', code: '', contactPerson: '', phone: '',
    email: '', gstin: '', pan: '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
    creditLimitAmount: 0, creditDays: 0, isActive: true,
  };
}

function supplierToForm(s: SupplierDto): SupplierForm {
  return {
    name: s.name,
    code: s.code,
    contactPerson: s.contactPerson ?? '',
    phone: s.phone ?? '',
    email: s.email ?? '',
    gstin: s.gstin ?? '',
    pan: s.pan ?? '',
    addressLine1: s.addressLine1 ?? '',
    addressLine2: s.addressLine2 ?? '',
    city: s.city ?? '',
    state: s.state ?? '',
    pincode: s.pincode ?? '',
    creditLimitAmount: s.creditLimitAmount,
    creditDays: s.creditDays,
    isActive: s.isActive,
  };
}

@Component({
  selector: 'app-supplier-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './supplier-add.component.html',
  styles: [':host { display: contents; }'],
})
export class SupplierAddComponent implements OnChanges {
  @Input() open = false;
  @Input() supplierId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly supplierService = inject(SupplierService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  form: SupplierForm = emptyForm();
  saving = false;
  loading = signal(false);
  saveError: string | null = null;
  private loadedName = '';

  get isEdit(): boolean { return !!this.supplierId; }

  get title(): string {
    return this.isEdit ? `Edit · ${this.loadedName || '…'}` : 'Add Supplier';
  }

  get subtitle(): string {
    if (!this.isEdit) return 'Register a new supplier.';
    return `ID ${(this.supplierId ?? '').slice(0, 8)}…`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['supplierId']) {
      this.saveError = null;
      this.saving = false;
      if (this.open && this.supplierId) {
        this.loadSupplier(this.supplierId);
      } else if (this.open && !this.supplierId) {
        this.loadedName = '';
        this.form = emptyForm();
      }
    }
  }

  private loadSupplier(id: string): void {
    this.loading.set(true);
    this.supplierService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => {
        this.loadedName = s.name;
        this.form = supplierToForm(s);
        this.loading.set(false);
      },
      error: () => {
        this.saveError = 'Failed to load supplier.';
        this.loading.set(false);
      },
    });
  }

  onCodeInput(val: string): void { this.form.code = val.toUpperCase(); }

  submit(): void {
    if (this.saving) return;
    this.saving = true;
    this.saveError = null;

    const base = {
      name: this.form.name.trim(),
      code: this.form.code.trim().toUpperCase(),
      contactPerson: this.form.contactPerson.trim() || null,
      phone: this.form.phone.trim() || null,
      email: this.form.email.trim() || null,
      gstin: this.form.gstin.trim() || null,
      pan: this.form.pan.trim() || null,
      addressLine1: this.form.addressLine1.trim() || null,
      addressLine2: this.form.addressLine2.trim() || null,
      city: this.form.city.trim() || null,
      state: this.form.state.trim() || null,
      pincode: this.form.pincode.trim() || null,
      creditLimitAmount: this.form.creditLimitAmount,
      creditDays: this.form.creditDays,
    };

    const onError = (err: { error?: { detail?: string; message?: string } }) => {
      this.saving = false;
      this.saveError = err?.error?.detail ?? err?.error?.message ?? 'Failed to save supplier.';
      this.toast.error(this.saveError!);
    };

    if (this.isEdit) {
      const cmd: UpdateSupplierCommand = { ...base, isActive: this.form.isActive };
      this.supplierService.update(this.supplierId!, cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.saving = false;
            this.toast.success('Supplier updated successfully.');
            this.saved.emit();
          },
          error: onError,
        });
    } else {
      const cmd: CreateSupplierCommand = base;
      this.supplierService.create(cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.saving = false;
            this.toast.success('Supplier created successfully.');
            this.saved.emit();
          },
          error: onError,
        });
    }
  }
}
