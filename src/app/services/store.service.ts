import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  StoreDto,
  StorePagedResult,
  CreateStoreCommand,
  UpdateStoreCommand,
  StoreListFilters,
} from '@models/store.model';
import { ActivityPagedResult } from './tenant.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/admin/stores`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, filters?: StoreListFilters): Observable<StorePagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (filters?.search)   params = params.set('search', filters.search);
    if (filters?.status)   params = params.set('status', filters.status);
    if (filters?.tenantId) params = params.set('tenantId', filters.tenantId);
    if (filters?.sortBy)   params = params.set('sortBy', filters.sortBy);
    if (filters?.sortDir)  params = params.set('sortDir', filters.sortDir);
    return this.http.get<StorePagedResult>(this.base, { params });
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
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<ActivityPagedResult>(`${this.base}/${id}/activity`, { params });
  }
}
