import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  SupplierDto,
  SupplierSummaryDto,
  SupplierDtoPagedResult,
  SupplierBalanceDto,
  SupplierLedgerPagedResult,
  CreateSupplierCommand,
  UpdateSupplierCommand,
} from '@models/supplier.model';
import { PurchaseSummaryPagedResult } from '@models/purchase.model';
import { SupplierPaymentSummaryPagedResult } from '@models/supplier-payment.model';
import { DropdownItem } from '@app/models/shared.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/suppliers`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, search?: string, isActive?: boolean): Observable<SupplierDtoPagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (search)            params = params.set('search', search);
    if (isActive != null)  params = params.set('isActive', String(isActive));
    return this.http.get<SupplierDtoPagedResult>(this.base, { params });
  }

  getDropdown(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(`${this.base}/dropdown`);
  }

  /** Lightweight list for dropdowns */
  search(term: string): Observable<SupplierSummaryDto[]> {
    const params = new HttpParams().set('search', term).set('pageSize', '10');
    return this.http.get<SupplierSummaryDto[]>(`${this.base}/search`, { params });
  }

  getById(id: string): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.base}/${id}`);
  }

  getBalance(id: string): Observable<SupplierBalanceDto> {
    return this.http.get<SupplierBalanceDto>(`${this.base}/${id}/balance`);
  }

  getLedger(id: string, fromDate?: string, toDate?: string, page = 1, pageSize = 50): Observable<SupplierLedgerPagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate)   params = params.set('toDate', toDate);
    return this.http.get<SupplierLedgerPagedResult>(`${this.base}/${id}/ledger`, { params });
  }

  getPurchases(id: string, page = 1, pageSize = 10): Observable<PurchaseSummaryPagedResult> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<PurchaseSummaryPagedResult>(`${this.base}/${id}/purchases`, { params });
  }

  getPayments(id: string, page = 1, pageSize = 10): Observable<SupplierPaymentSummaryPagedResult> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<SupplierPaymentSummaryPagedResult>(`${this.base}/${id}/payments`, { params });
  }

  create(cmd: CreateSupplierCommand): Observable<SupplierDto> {
    return this.http.post<SupplierDto>(this.base, cmd);
  }

  update(id: string, cmd: UpdateSupplierCommand): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, cmd);
  }

  deactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  downloadStatement(id: string): Observable<Blob> {
    return this.http.get(`${this.base}/${id}/statement`, { responseType: 'blob' });
  }
}
