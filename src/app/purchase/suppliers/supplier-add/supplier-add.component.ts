import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal, DestroyRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { SupplierService } from '@services/supplier.service';
import { ToastService } from '@services/toast.service';
import { SupplierDto, CreateSupplierCommand } from '@models/supplier.model';

interface SupplierForm {
  name: string;
  code: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  gstin: string;
  address: string;
  creditLimitFromSupplier: number;
  paymentTermsDays: number;
  isActive: boolean;
}

function emptyForm(): SupplierForm {
  return {
    name: '', code: '', contactPerson: '', phoneNumber: '',
    email: '', gstin: '', address: '',
    creditLimitFromSupplier: 0, paymentTermsDays: 0, isActive: true,
  };
}

function supplierToForm(s: SupplierDto): SupplierForm {
  return {
    name: s.name,
    code: s.code,
    contactPerson: s.contactPerson ?? '',
    phoneNumber: s.phoneNumber ?? '',
    email: s.email ?? '',
    gstin: s.gstin ?? '',
    address: s.address ?? '',
    creditLimitFromSupplier: s.creditLimitFromSupplier,
    paymentTermsDays: s.paymentTermsDays,
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

    const cmd: CreateSupplierCommand = {
      name: this.form.name.trim(),
      code: this.form.code.trim().toUpperCase(),
      contactPerson: this.form.contactPerson.trim() || null,
      phoneNumber: this.form.phoneNumber.trim() || null,
      email: this.form.email.trim() || null,
      gstin: this.form.gstin.trim() || null,
      address: this.form.address.trim() || null,
      creditLimitFromSupplier: this.form.creditLimitFromSupplier,
      paymentTermsDays: this.form.paymentTermsDays,
      isActive: this.form.isActive,
    };

    const onError = (err: { error?: { detail?: string; message?: string } }) => {
      this.saving = false;
      this.saveError = err?.error?.detail ?? err?.error?.message ?? 'Failed to save supplier.';
      this.toast.error(this.saveError!);
    };

    if (this.isEdit) {
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
