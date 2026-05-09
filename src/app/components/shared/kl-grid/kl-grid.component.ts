import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  PaginatedResponse,
  createEmptyPaginatedResponse,
} from '@app/models/pagination.model';

import { BadgeComponent, BadgeVariant } from '../badge/badge.component';
import { GridColumn } from './kl-grid.types';

type PageButton = number | '...';

@Component({
  selector: 'kl-grid',
  standalone: true,
  imports: [DatePipe, BadgeComponent],
  templateUrl: './kl-grid.component.html',
  styleUrl: './kl-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlGridComponent<T extends Record<string, any>>
  implements OnInit, OnDestroy
{
  // ---------------- INPUTS ----------------
  @Input() inputdata: PaginatedResponse<T> =
    createEmptyPaginatedResponse<T>();
  @Input() columns: GridColumn[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No items found.';
  @Input() showSearch = true;
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'Search…';
  @Input() searchDebounceMs = 300;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() showActions = false;

  // 🔥 NEW: Signal-style setters (optional)
  @Input() setSearch?: (value: string) => void;
  @Input() setPage?: (pageIndex: number, pageSize: number) => void;
  @Input() setSort?: (field: string, direction: 'asc' | 'desc') => void;

  // ---------------- OUTPUTS (fallback) ----------------
  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  @Output() sortChange = new EventEmitter<{
    field: string;
    direction: 'asc' | 'desc';
  }>();

  @Output() rowClick = new EventEmitter<T>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() editClick = new EventEmitter<T>();

  // ---------------- STATE ----------------
  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';

  readonly skeletonRows = [1, 2, 3, 4, 5, 6,7,8,9,10] as const;

  private searchSubject = new Subject<string>();

  // ---------------- LIFECYCLE ----------------
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.searchDebounceMs),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (this.setSearch) {
          this.setSearch(value);
        } else {
          this.searchChange.emit(value);
        }
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // ---------------- COMPUTED ----------------
  get showPagination(): boolean {
    return !this.loading && this.inputdata.totalCount > 0;
  }

  pageRange(): string {
    const { totalCount } = this.inputdata;
    if (!totalCount) return '0 results';

    const size = this.inputdata.pageSize || this.pageSize;
    const start = this.pageIndex * size + 1;
    const end = Math.min((this.pageIndex + 1) * size, totalCount);

    return `${start}–${end} of ${totalCount}`;
  }

  // ---------------- SEARCH ----------------
  onSearchInput(value: string): void {
    this.searchValue = value;
    this.searchSubject.next(value);
  }

  // ---------------- SORT ----------------
  onHeaderClick(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }

    if (this.setSort) {
      this.setSort(this.sortField, this.sortDir);
    } else {
      this.sortChange.emit({
        field: this.sortField,
        direction: this.sortDir,
      });
    }
  }

  // ---------------- PAGINATION ----------------
  onPrevPage(): void {
    if (this.inputdata.hasPreviousPage) {
      const pageIndex = this.pageIndex - 1;
      const size = this.inputdata.pageSize || this.pageSize;

      if (this.setPage) {
        this.setPage(pageIndex, size);
      } else {
        this.pageChange.emit({ pageIndex, pageSize: size });
      }
    }
  }

  onNextPage(): void {
    if (this.inputdata.hasNextPage) {
      const pageIndex = this.pageIndex + 1;
      const size = this.inputdata.pageSize || this.pageSize;

      if (this.setPage) {
        this.setPage(pageIndex, size);
      } else {
        this.pageChange.emit({ pageIndex, pageSize: size });
      }
    }
  }

  onGoToPage(page: number): void {
    const pageIndex = page - 1;
    const size = this.inputdata.pageSize || this.pageSize;

    if (this.setPage) {
      this.setPage(pageIndex, size);
    } else {
      this.pageChange.emit({ pageIndex, pageSize: size });
    }
  }

  // ---------------- PAGINATION LOGIC ----------------
  pageNumbers(): PageButton[] {
    const totalPages = this.inputdata.totalPages;
    const currentPage = this.pageIndex + 1;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sorted = this.generatePageSet(totalPages, currentPage);

    return sorted.reduce<PageButton[]>((acc, page) => {
      const prev = acc[acc.length - 1];
      if (typeof prev === 'number' && page - prev > 1) {
        acc.push('...');
      }
      acc.push(page);
      return acc;
    }, []);
  }

  private generatePageSet(
    totalPages: number,
    currentPage: number
  ): number[] {
    const pages = new Set<number>([1, totalPages]);

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pages.add(i);
    }

    if (currentPage <= 3) [2, 3, 4].forEach((p) => pages.add(p));

    if (currentPage >= totalPages - 2) {
      [totalPages - 3, totalPages - 2, totalPages - 1].forEach((p) =>
        pages.add(p)
      );
    }

    return Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }

  // ---------------- ROW ACTIONS ----------------
  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onEditClick(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.editClick.emit(row);
  }

  // ---------------- TRACK BY ----------------
  trackByIndex = (index: number) => index;

  trackById = (_: number, item: T) => item['id'] ?? item;

  // ---------------- BADGE ----------------
  getBadgeVariant(
    col: GridColumn,
    value: any,
    row: T
  ): BadgeVariant {
    if (!col.badgeVariant) return 'neutral';
    return typeof col.badgeVariant === 'function'
      ? col.badgeVariant(value, row)
      : col.badgeVariant;
  }
}