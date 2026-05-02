import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '@app/environment';
import {
  TenantDto,
  CreateTenantCommand,
  UpdateTenantCommand,
  ActivityLogDto,
  TenantListFilters,
  TenantDropdownItem,
  AdminStoreDtoForTenant,
} from '@models/tenant.model';
import { PaginatedResponse } from '@app/models/pagination.model';

export interface ActivityPagedResult {
  items: ActivityLogDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/admin/tenants`;
  private _httpClient = inject(HttpClient);
  private abort$ = new Subject<void>();

  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public API
  // -----------------------------------------------------------------------------------------------------
  cancelPendingRequests() {
      this.abort$.next();
  }

  getAll(page = 1, pageSize = 20, filters?: TenantListFilters): Observable<PaginatedResponse<TenantDto>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      // .set('sort', sort);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    // if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.sortDir) params = params.set('sortDir', filters.sortDir);
    return this._httpClient.get<PaginatedResponse<TenantDto>>(this.base, { params }).pipe(
          takeUntil(this.abort$),
        );
  }

  getById(id: string): Observable<TenantDto> {
    return this._httpClient.get<TenantDto>(`${this.base}/${id}`);
  }

  create(cmd: CreateTenantCommand): Observable<TenantDto> {
    return this._httpClient.post<TenantDto>(this.base, cmd);
  }

  update(id: string, cmd: UpdateTenantCommand): Observable<void> {
    return this._httpClient.put<void>(`${this.base}/${id}`, cmd);
  }

  getActivity(id: string, page = 1, pageSize = 50): Observable<ActivityPagedResult> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this._httpClient.get<ActivityPagedResult>(`${this.base}/${id}/activity`, { params });
  }

  getDropdown(): Observable<TenantDropdownItem[]> {
    return this._httpClient.get<TenantDropdownItem[]>(`${this.base}/dropdown`);
  }

  getStores(tenantId: string, page = 1, pageSize = 50): Observable<PaginatedResponse<AdminStoreDtoForTenant>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this._httpClient.get<PaginatedResponse<AdminStoreDtoForTenant>>(`${this.base}/${tenantId}/stores`, { params });
  }
}
