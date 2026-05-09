import { signal, WritableSignal } from '@angular/core';

export abstract class PagedListBase {
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly query = signal('');
  readonly sortCol = signal('');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly drawerOpen = signal(false);
  readonly editId = signal<string | null>(null);

  readonly setPage = (pageIndex: number, pageSize: number): void => {
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
  };

  readonly setSearch = (value: string): void => {
    this.query.set(value);
    this.pageIndex.set(0);
  };

  readonly setSort = (field: string, direction: 'asc' | 'desc'): void => {
    this.sortCol.set(field);
    this.sortDir.set(direction);
    this.pageIndex.set(0);
  };

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  openAdd(): void {
    this.editId.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(row: { id: string }): void {
    this.editId.set(row.id);
    this.drawerOpen.set(true);
  }

  protected filterSet<T>(sig: WritableSignal<T>, value: T): void {
    sig.set(value);
    this.pageIndex.set(0);
  }

  protected closeDrawerAndReload(resource: { reload(): void }): void {
    this.drawerOpen.set(false);
    resource.reload();
  }
}
