import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlCardComponent } from '../../shared/kl-card/kl-card.component';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, KlCardComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  profile = { firstName: 'Riya', lastName: 'Acharya', email: 'riya.acharya@krishilink.in', phone: '+977 98123 45678' };
  notifications = { lowStock: true, transfers: true, weeklySummary: false, newRegistrations: true };
}
