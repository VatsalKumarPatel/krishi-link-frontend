import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { KlCardComponent } from '@shared/kl-card/kl-card.component';
import { KlGridComponent } from '@shared/kl-grid/kl-grid.component';
import { GridColumn } from '@shared/kl-grid/kl-grid.types';
import { SupplierAddComponent } from '../supplier-add/supplier-add.component';
import { SupplierService } from '@services/supplier.service';
import { SupplierSummaryDto } from '@models/supplier.model';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';
import { PagedListBase } from '@app/utils/paged-list-base';
import { formatMoneyWithSymbol } from '@app/utils/format';

type SupplierRow = SupplierSummaryDto & {
  statusLabel: string;
  outstandingFmt: string;
  termsFmt: string;
};

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [KlCardComponent, KlGridComponent, SupplierAddComponent],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent extends PagedListBase {
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);

  isActiveFilter = signal<boolean | undefined>(undefined);
  confirmDeactivateId = signal<string | null>(null);
  deactivating = signal(false);

  readonly columns: GridColumn[] = [
    { field: 'name', header: 'Supplier' },
    { field: 'code', header: 'Code', sortable: false },
    { field: 'phoneNumber', header: 'Phone', sortable: false },
    { field: 'outstandingAmt', header: 'Outstanding (₹)', sortable: false },
    { field: 'termsFmt', header: 'Payment Terms', sortable: false },
    { field: 'statusLabel', header: 'Status', type: 'badge', sortable: false,
      badgeVariant: (_v: string, row: SupplierRow) => row.isActive ? 'success' : 'neutral' },
  ];

  private readonly queryParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    isActive: this.isActiveFilter(),
  }));

  suppliersResource = rxResource<PaginatedResponse<SupplierRow>, ReturnType<SupplierListComponent['queryParams']>>({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.supplierService.getAll(params.pageIndex + 1, params.pageSize, params.query || undefined, params.isActive).pipe(
        map(r => ({
          ...r,
          items: r.items.map(s => ({
            ...s,
            statusLabel: s.isActive ? 'Active' : 'Inactive',
            outstandingFmt: formatMoneyWithSymbol(s.netOutstanding),
            termsFmt: s.paymentTermsDays > 0 ? `${s.paymentTermsDays} days` : '—',
          })),
        }))
      ),
  });

  suppliers = computed(() => this.suppliersResource.value() ?? createEmptyPaginatedResponse<SupplierRow>());

  setFilter(val: boolean | undefined): void { this.filterSet(this.isActiveFilter, val); }

  onRowClick(row: SupplierRow): void {
    this.router.navigate(['/purchase/suppliers', row.id]);
  }

  closeDrawer(reload = false): void {
    this.drawerOpen.set(false);
    if (reload) this.suppliersResource.reload();
  }

  promptDeactivate(id: string): void { this.confirmDeactivateId.set(id); }
  cancelDeactivate(): void { this.confirmDeactivateId.set(null); }

  confirmDeactivate(): void {
    const id = this.confirmDeactivateId();
    if (!id) return;
    this.deactivating.set(true);
    this.supplierService.deactivate(id).subscribe({
      next: () => {
        this.confirmDeactivateId.set(null);
        this.deactivating.set(false);
        this.suppliersResource.reload();
      },
      error: () => this.deactivating.set(false),
    });
  }
}
