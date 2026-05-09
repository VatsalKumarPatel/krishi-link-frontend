import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '@app/environment';
import { buildListParams } from '@app/utils/http-params';
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
    const params = buildListParams(page, pageSize, {
      search: filters?.search,
      status: filters?.status,
      sortDir: filters?.sortDir,
    });
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
    const params = buildListParams(page, pageSize);
    return this._httpClient.get<ActivityPagedResult>(`${this.base}/${id}/activity`, { params });
  }

  getDropdown(): Observable<TenantDropdownItem[]> {
    return this._httpClient.get<TenantDropdownItem[]>(`${this.base}/dropdown`);
  }

  getStores(tenantId: string, page = 1, pageSize = 50): Observable<PaginatedResponse<AdminStoreDtoForTenant>> {
    const params = buildListParams(page, pageSize);
    return this._httpClient.get<PaginatedResponse<AdminStoreDtoForTenant>>(`${this.base}/${tenantId}/stores`, { params });
  }
}
