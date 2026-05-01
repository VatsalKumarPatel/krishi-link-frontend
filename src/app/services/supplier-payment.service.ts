import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import {
  SupplierPaymentDetailDto,
  SupplierPaymentSummaryPagedResult,
  RecordCashPaymentCommand,
  RecordUpiPaymentCommand,
  RecordChequePaymentCommand,
  RecordNeftPaymentCommand,
  AllocatePaymentCommand,
  BounceOrReverseCommand,
  VerifyPaymentCommand,
  OutstandingInvoiceDto,
} from '@models/supplier-payment.model';

@Injectable({ providedIn: 'root' })
export class SupplierPaymentService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/supplier-payments`;
  private readonly allocBase = `${environment.apiBaseUrl}/${environment.version}/supplier-payment-allocations`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, supplierId?: string, storeId?: string): Observable<SupplierPaymentSummaryPagedResult> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (supplierId) params = params.set('supplierId', supplierId);
    if (storeId)    params = params.set('storeId', storeId);
    return this.http.get<SupplierPaymentSummaryPagedResult>(this.base, { params });
  }

  getById(id: string): Observable<SupplierPaymentDetailDto> {
    return this.http.get<SupplierPaymentDetailDto>(`${this.base}/${id}`);
  }

  getOutstandingInvoices(supplierId: string): Observable<OutstandingInvoiceDto[]> {
    const params = new HttpParams().set('supplierId', supplierId);
    return this.http.get<OutstandingInvoiceDto[]>(`${environment.apiBaseUrl}/${environment.version}/purchases/outstanding`, { params });
  }

  recordCash(cmd: RecordCashPaymentCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/cash`, cmd);
  }

  recordUpi(cmd: RecordUpiPaymentCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/upi`, cmd);
  }

  recordCheque(cmd: RecordChequePaymentCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/cheque`, cmd);
  }

  recordNeft(cmd: RecordNeftPaymentCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/neft`, cmd);
  }

  verify(id: string, cmd: VerifyPaymentCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.put<SupplierPaymentDetailDto>(`${this.base}/${id}/verify`, cmd);
  }

  bounce(id: string, cmd: BounceOrReverseCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/${id}/bounce`, cmd);
  }

  reverse(id: string, cmd: BounceOrReverseCommand): Observable<SupplierPaymentDetailDto> {
    return this.http.post<SupplierPaymentDetailDto>(`${this.base}/${id}/reverse`, cmd);
  }

  allocate(paymentId: string, cmd: AllocatePaymentCommand): Observable<void> {
    return this.http.post<void>(`${this.allocBase}/split`, { paymentId, ...cmd });
  }
}
