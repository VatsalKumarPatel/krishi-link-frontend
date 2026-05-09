import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '@app/environment';
import {
  StoreDto,
  CreateStoreCommand,
  UpdateStoreCommand,
  StoreListFilters,
} from '@models/store.model';
import { ActivityPagedResult } from './tenant.service';
import { PaginatedResponse } from '@app/models/pagination.model';
import { buildListParams } from '@app/utils/http-params';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/admin/stores`;
  private http = inject(HttpClient);
  private abort$ = new Subject<void>();

  constructor() {}

  getAll(page = 1, pageSize = 10, filters?: StoreListFilters): Observable<PaginatedResponse<StoreDto>> {
    const params = buildListParams(page, pageSize, {
      search: filters?.search,
      status: filters?.status,
      sortDir: filters?.sortDir,
    });
    return this.http.get<PaginatedResponse<StoreDto>>(this.base, { params }).pipe(
      takeUntil(this.abort$),
    );
  }

  getById(id: string): Observable<StoreDto> {
    return this.http.get<StoreDto>(`${this.base}/${id}`);
  }

  create(cmd: CreateStoreCommand): Observable<StoreDto> {
    return this.http.post<StoreDto>(this.base, cmd);
  }

  update(id: string, cmd: UpdateStoreCommand): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, cmd);
  }

  getActivity(id: string, page = 1, pageSize = 50): Observable<ActivityPagedResult> {
    const params = buildListParams(page, pageSize);
    return this.http.get<ActivityPagedResult>(`${this.base}/${id}/activity`, { params });
  }
}
