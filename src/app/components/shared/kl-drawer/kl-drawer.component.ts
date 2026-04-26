import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kl-drawer',
  standalone: true,
  templateUrl: './kl-drawer.component.html',
  styles: [':host { display: contents; }'],
})
export class KlDrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Output() close = new EventEmitter<void>();
}
