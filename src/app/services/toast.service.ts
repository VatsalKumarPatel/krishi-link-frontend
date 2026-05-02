import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<ToastItem[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show({ kind = 'info' as ToastKind, title, message, duration = 4000 }: {
    kind?: ToastKind;
    title?: string;
    message?: string;
    duration?: number;
  }): number {
    const id = Date.now() + Math.random();
    this._toasts.update(ts => [...ts, { id, kind, title, message }]);
    if (duration > 0) setTimeout(() => this.dismiss(id), duration);
    return id;
  }

  success(message: string, title = 'Success'): void {
    this.show({ kind: 'success', title, message });
  }

  error(message: string, title = 'Something went wrong'): void {
    this.show({ kind: 'error', title, message, duration: 6000 });
  }

  warning(message: string, title = 'Heads up'): void {
    this.show({ kind: 'warning', title, message });
  }

  info(message: string, title = 'Info'): void {
    this.show({ kind: 'info', title, message });
  }

  dismiss(id: number): void {
    this._toasts.update(ts => ts.filter(t => t.id !== id));
  }
}
