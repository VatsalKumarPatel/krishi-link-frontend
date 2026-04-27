import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';

export interface MyStoreDto {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class StorePickerService {
  private readonly url = `${environment.apiBaseUrl}/${environment.version}/stores/my`;

  private readonly _stores = signal<MyStoreDto[]>([]);
  private readonly _selected = signal<MyStoreDto | null>(null);

  /** All stores accessible to the current user. */
  readonly stores = this._stores.asReadonly();

  /** Currently selected store. Null means "All stores". */
  readonly selectedStore = this._selected.asReadonly();

  /** Label shown in the topbar button. */
  readonly selectedLabel = computed(() => this._selected()?.name ?? 'All stores');

  /** True when a specific store is chosen (not All). */
  readonly isFiltered = computed(() => this._selected() !== null);

  constructor(private readonly http: HttpClient) {}

  /** Called by the resolver — fetches /stores/my and caches the result. */
  load(): Observable<MyStoreDto[]> {
    return this.http.get<MyStoreDto[]>(this.url).pipe(
      tap(stores => this._stores.set(stores)),
    );
  }

  select(store: MyStoreDto | null): void {
    this._selected.set(store);
  }

  clear(): void {
    this._stores.set([]);
    this._selected.set(null);
  }
}
