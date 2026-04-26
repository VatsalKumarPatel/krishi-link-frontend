import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kl-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styles: [':host { display: contents; }'],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Output() closed = new EventEmitter<void>();
}
