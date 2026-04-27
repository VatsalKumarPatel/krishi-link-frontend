import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  TenantDto,
  TenantPagedResult,
  CreateTenantCommand,
  UpdateTenantCommand,
  ActivityLogDto,
  AdminStorePagedResult,
  TenantListFilters,
  TenantDropdownItem,
} from '@models/tenant.model';

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

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, filters?: TenantListFilters): Observable<TenantPagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.sortDir) params = params.set('sortDir', filters.sortDir);
    return this.http.get<TenantPagedResult>(this.base, { params });
  }

  getById(id: string): Observable<TenantDto> {
    return this.http.get<TenantDto>(`${this.base}/${id}`);
  }

  create(cmd: CreateTenantCommand): Observable<TenantDto> {
    return this.http.post<TenantDto>(this.base, cmd);
  }

  update(id: string, cmd: UpdateTenantCommand): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, cmd);
  }

  getActivity(id: string, page = 1, pageSize = 50): Observable<ActivityPagedResult> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<ActivityPagedResult>(`${this.base}/${id}/activity`, { params });
  }

  getDropdown(): Observable<TenantDropdownItem[]> {
    return this.http.get<TenantDropdownItem[]>(`${this.base}/dropdown`);
  }

  getStores(tenantId: string, page = 1, pageSize = 50): Observable<AdminStorePagedResult> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<AdminStorePagedResult>(`${this.base}/${tenantId}/stores`, { params });
  }
}
