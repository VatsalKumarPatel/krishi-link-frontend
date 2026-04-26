import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kl-stat-card',
  imports: [NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() delta = '';
  @Input() tone: 'up' | 'down' | 'flat' = 'up';
  @Input() sub = '';
}
