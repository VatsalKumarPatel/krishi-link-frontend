import { Component, inject } from '@angular/core';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'kl-toast-host',
  imports: [],
  templateUrl: './kl-toast-host.component.html',
})
export class KlToastHostComponent {
  readonly toastService = inject(ToastService);
}
