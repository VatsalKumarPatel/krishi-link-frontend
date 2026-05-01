import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  PurchaseDetailDto,
  PurchaseSummaryPagedResult,
  CreatePurchaseCommand,
  AddPurchaseItemCommand,
  ReceiveAndInvoiceCommand,
  ReceiveStockCommand,
  CancelPurchaseCommand,
  PurchaseListFilters,
  PurchaseItemDto,
} from '@models/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/purchases`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters?: PurchaseListFilters): Observable<PurchaseSummaryPagedResult> {
    let params = new HttpParams()
      .set('page', String(filters?.page ?? 1))
      .set('pageSize', String(filters?.pageSize ?? 20));
    if (filters?.supplierId) params = params.set('supplierId', filters.supplierId);
    if (filters?.storeId)    params = params.set('storeId', filters.storeId);
    if (filters?.status)     params = params.set('status', String(filters.status));
    if (filters?.fromDate)   params = params.set('fromDate', filters.fromDate);
    if (filters?.toDate)     params = params.set('toDate', filters.toDate);
    return this.http.get<PurchaseSummaryPagedResult>(this.base, { params });
  }

  getPendingPayment(page = 1, pageSize = 20): Observable<PurchaseSummaryPagedResult> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<PurchaseSummaryPagedResult>(`${this.base}/pending-payment`, { params });
  }

  getOverdue(page = 1, pageSize = 20): Observable<PurchaseSummaryPagedResult> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<PurchaseSummaryPagedResult>(`${this.base}/overdue`, { params });
  }

  getById(id: string): Observable<PurchaseDetailDto> {
    return this.http.get<PurchaseDetailDto>(`${this.base}/${id}`);
  }

  create(cmd: CreatePurchaseCommand): Observable<PurchaseDetailDto> {
    return this.http.post<PurchaseDetailDto>(this.base, cmd);
  }

  addItem(purchaseId: string, cmd: AddPurchaseItemCommand): Observable<PurchaseItemDto> {
    return this.http.post<PurchaseItemDto>(`${this.base}/${purchaseId}/items`, cmd);
  }

  removeItem(purchaseId: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${purchaseId}/items/${itemId}`);
  }

  receiveAndInvoice(id: string, cmd: ReceiveAndInvoiceCommand): Observable<PurchaseDetailDto> {
    return this.http.post<PurchaseDetailDto>(`${this.base}/${id}/receive-and-invoice`, cmd);
  }

  receiveOnly(id: string, cmd: ReceiveStockCommand): Observable<PurchaseDetailDto> {
    return this.http.post<PurchaseDetailDto>(`${this.base}/${id}/receive`, cmd);
  }

  cancel(id: string, cmd: CancelPurchaseCommand): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/cancel`, cmd);
  }
}
