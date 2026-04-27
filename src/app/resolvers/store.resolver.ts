import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StorePickerService, MyStoreDto } from '@services/store-picker.service';

/**
 * Fetches the list of stores accessible to the logged-in user
 * (GET /stores/my) before the layout renders.
 * On failure it resolves to an empty array so the app still loads.
 */
export const storeResolver: ResolveFn<MyStoreDto[]> = () => {
  const storePickerService = inject(StorePickerService);

  return storePickerService.load().pipe(
    catchError(() => of([])),
  );
};
