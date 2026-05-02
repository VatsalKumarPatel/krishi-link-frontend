import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KlCardComponent } from '../../../components/shared/kl-card/kl-card.component';
import { SupplierService } from '@services/supplier.service';
import { CreateSupplierCommand, SupplierDto } from '@models/supplier.model';

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
  phoneNumber = signal('');
  email = signal('');
  gstin = signal('');
  address = signal('');
  creditLimitFromSupplier = signal(0);
  paymentTermsDays = signal(0);
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
        this.phoneNumber.set(s.phoneNumber ?? '');
        this.email.set(s.email ?? '');
        this.gstin.set(s.gstin ?? '');
        this.address.set(s.address ?? '');
        this.creditLimitFromSupplier.set(s.creditLimitFromSupplier);
        this.paymentTermsDays.set(s.paymentTermsDays);
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

    const cmd: CreateSupplierCommand = {
      name: this.name().trim(),
      code: this.code().trim().toUpperCase(),
      contactPerson: this.contactPerson().trim() || null,
      phoneNumber: this.phoneNumber().trim() || null,
      email: this.email().trim() || null,
      gstin: this.gstin().trim() || null,
      address: this.address().trim() || null,
      creditLimitFromSupplier: this.creditLimitFromSupplier(),
      paymentTermsDays: this.paymentTermsDays(),
      isActive: this.isActive(),
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
      this.supplierService.update(this.supplierId()!, cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => { this.saving.set(false); this.router.navigate(['/purchase/suppliers', this.supplierId()!]); },
          error: onError,
        });
    } else {
      this.supplierService.create(cmd)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (result: SupplierDto) => { this.saving.set(false); this.router.navigate(['/purchase/suppliers', result.id]); },
          error: onError,
        });
    }
  }
}
