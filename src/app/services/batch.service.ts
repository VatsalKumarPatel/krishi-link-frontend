import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environment';
import { BatchPagedResult } from '@models/batch.model';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private readonly base = `${environment.apiBaseUrl}/${environment.version}/batches`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 1, pageSize = 20, showExpired = false, showDepleted = false): Observable<BatchPagedResult> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('showExpired', String(showExpired))
      .set('showDepleted', String(showDepleted));
    return this.http.get<BatchPagedResult>(this.base, { params });
  }
}
