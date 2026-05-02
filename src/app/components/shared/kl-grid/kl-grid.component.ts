import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaginatedResponse, createEmptyPaginatedResponse } from '@app/models/pagination.model';
import { BadgeComponent, BadgeVariant } from '../badge/badge.component';
import { GridColumn } from './kl-grid.types';

@Component({
  selector: 'kl-grid',
  imports: [DatePipe, BadgeComponent],
  templateUrl: './kl-grid.component.html',
  styleUrl: './kl-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlGridComponent<T extends Record<string, any>> {
  @Input() inputdata: PaginatedResponse<T> = createEmptyPaginatedResponse<T>();
  @Input() columns: GridColumn[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No items found.';
  @Input() showSearch = true;
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'Search…';
  @Input() pageIndex = 0;
  @Input() showActions = false;

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() editClick = new EventEmitter<T>();

  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';
  readonly skeletonRows = [1, 2, 3, 4, 5, 6];

  get showPagination(): boolean {
    return !this.loading && this.inputdata.totalCount > 0;
  }

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.inputdata.totalPages }, (_, i) => i + 1);
  }

  pageRange(): string {
    const { totalCount } = this.inputdata;
    if (!totalCount) return '0 results';
    const size = this.inputdata.pageSize || 10;
    const start = this.pageIndex * size + 1;
    const end = Math.min((this.pageIndex + 1) * size, totalCount);
    return `${start}–${end} of ${totalCount}`;
  }

  onHeaderClick(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.sortChange.emit(this.sortDir === 'asc' ? this.sortField : `-${this.sortField}`);
  }

  onPrevPage(): void {
    if (this.inputdata.hasPreviousPage) {
      this.pageChange.emit({ pageIndex: this.pageIndex - 1, pageSize: this.inputdata.pageSize || 10 });
    }
  }

  onNextPage(): void {
    if (this.inputdata.hasNextPage) {
      this.pageChange.emit({ pageIndex: this.pageIndex + 1, pageSize: this.inputdata.pageSize || 10 });
    }
  }

  onGoToPage(page: number): void {
    this.pageChange.emit({ pageIndex: page - 1, pageSize: this.inputdata.pageSize || 10 });
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onEditClick(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.editClick.emit(row);
  }

  getBadgeVariant(col: GridColumn, value: any, row: T): BadgeVariant {
    if (!col.badgeVariant) return 'neutral';
    return typeof col.badgeVariant === 'function' ? col.badgeVariant(value, row) : col.badgeVariant;
  }
}
