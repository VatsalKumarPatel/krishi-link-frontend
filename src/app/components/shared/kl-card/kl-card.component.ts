import { Component, Input } from '@angular/core';

@Component({
  selector: 'kl-card',
  imports: [],
  templateUrl: './kl-card.component.html',
  styleUrl: './kl-card.component.scss',
})
export class KlCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
}
