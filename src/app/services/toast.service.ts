import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const BASE_CONFIG = {
  horizontalPosition: 'center' as const,
  verticalPosition: 'bottom' as const,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, undefined, {
      ...BASE_CONFIG,
      duration: 3000,
      panelClass: ['kl-toast', 'kl-toast-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      ...BASE_CONFIG,
      duration: 6000,
      panelClass: ['kl-toast', 'kl-toast-error'],
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, undefined, {
      ...BASE_CONFIG,
      duration: 4000,
      panelClass: ['kl-toast', 'kl-toast-warning'],
    });
  }

  info(message: string): void {
    this.snackBar.open(message, undefined, {
      ...BASE_CONFIG,
      duration: 3000,
      panelClass: ['kl-toast', 'kl-toast-info'],
    });
  }
}
