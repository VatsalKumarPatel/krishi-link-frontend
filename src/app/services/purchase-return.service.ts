import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  PurchaseReturnDetailDto,
  PurchaseReturnSummaryPagedResult,
  CreatePurchaseReturnCommand,
  DispatchReturnCommand,
} from '@models/purchase-return.model';

@Injectable({ providedIn: 'root' })
export class PurchaseReturnService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/purchase-returns`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, supplierId?: string, storeId?: string): Observable<PurchaseReturnSummaryPagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (supplierId) params = params.set('supplierId', supplierId);
    if (storeId)    params = params.set('storeId', storeId);
    return this.http.get<PurchaseReturnSummaryPagedResult>(this.base, { params });
  }

  getById(id: string): Observable<PurchaseReturnDetailDto> {
    return this.http.get<PurchaseReturnDetailDto>(`${this.base}/${id}`);
  }

  create(cmd: CreatePurchaseReturnCommand): Observable<PurchaseReturnDetailDto> {
    return this.http.post<PurchaseReturnDetailDto>(this.base, cmd);
  }

  dispatch(id: string, cmd: DispatchReturnCommand): Observable<PurchaseReturnDetailDto> {
    return this.http.post<PurchaseReturnDetailDto>(`${this.base}/${id}/dispatch`, cmd);
  }

  acknowledge(id: string): Observable<PurchaseReturnDetailDto> {
    return this.http.post<PurchaseReturnDetailDto>(`${this.base}/${id}/acknowledge`, {});
  }
}
