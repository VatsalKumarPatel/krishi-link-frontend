import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { SupplierService } from '@services/supplier.service';
import { CreateSupplierCommand, UpdateSupplierCommand, SupplierDto } from '@models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [FormsModule, RouterLink, KlCardComponent],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
})
export class SupplierFormComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  isEdit = signal(false);
  supplierId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});

  // Form fields
  name = signal('');
  code = signal('');
  contactPerson = signal('');
  phone = signal('');
  email = signal('');
  gstin = signal('');
  pan = signal('');
  addressLine1 = signal('');
  addressLine2 = signal('');
  city = signal('');
  state = signal('');
  pincode = signal('');
  creditLimitAmount = signal(0);
  creditDays = signal(0);
  isActive = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.supplierId.set(id);
      this.loadSupplier(id);
    }
  }

  private loadSupplier(id: string): void {
    this.loading.set(true);
    this.supplierService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => {
        this.name.set(s.name);
        this.code.set(s.code);
        this.contactPerson.set(s.contactPerson ?? '');
        this.phone.set(s.phone ?? '');
        this.email.set(s.email ?? '');
        this.gstin.set(s.gstin ?? '');
        this.pan.set(s.pan ?? '');
        this.addressLine1.set(s.addressLine1 ?? '');
        this.addressLine2.set(s.addressLine2 ?? '');
        this.city.set(s.city ?? '');
        this.state.set(s.state ?? '');
        this.pincode.set(s.pincode ?? '');
        this.creditLimitAmount.set(s.creditLimitAmount);
        this.creditDays.set(s.creditDays);
        this.isActive.set(s.isActive);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load supplier.'); this.loading.set(false); },
    });
  }

  onCodeInput(val: string): void { this.code.set(val.toUpperCase()); }

  save(): void {
    this.fieldErrors.set({});
    this.error.set(null);

    const base = {
      name: this.name().trim(),
      code: this.code().trim().toUpperCase(),
      contactPerson: this.contactPerson().trim() || null,
      phone: this.phone().trim() || null,
      email: this.email().trim() || null,
      gstin: this.gstin().trim() || null,
      pan: this.pan().trim() || null,
      addressLine1: this.addressLine1().trim() || null,
      addressLine2: this.addressLine2().trim() || null,
      city: this.city().trim() || null,
      state: this.state().trim() || null,
      pincode: this.pincode().trim() || null,
      creditLimitAmount: this.creditLimitAmount(),
      creditDays: this.creditDays(),
    };

    this.saving.set(true);
    const onError = (err: { status: number; error?: { errors?: Record<string, string>; detail?: string } }) => {
      this.saving.set(false);
      if (err.status === 400 && err.error?.errors) {
        this.fieldErrors.set(err.error.errors);
      } else {
        this.error.set(err.error?.detail ?? 'Failed to save supplier. Please try again.');
      }
    };

    if (this.isEdit()) {
      const cmd: UpdateSupplierCommand = { ...base, isActive: this.isActive() };
      this.supplierService.update(this.supplierId()!, cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => { this.saving.set(false); this.router.navigate(['/purchase/suppliers', this.supplierId()!]); },
          error: onError,
        });
    } else {
      const cmd: CreateSupplierCommand = base;
      this.supplierService.create(cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (result: SupplierDto) => { this.saving.set(false); this.router.navigate(['/purchase/suppliers', result.id]); },
          error: onError,
        });
    }
  }
}
