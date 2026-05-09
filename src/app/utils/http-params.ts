import { HttpParams } from '@angular/common/http';

export function buildListParams(
  page: number,
  pageSize: number,
  filters?: Record<string, string | number | boolean | undefined | null>,
): HttpParams {
  let params = new HttpParams()
    .set('page', String(page))
    .set('pageSize', String(pageSize));

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value != null && value !== '') {
        params = params.set(key, String(value));
      }
    }
  }

  return params;
}
