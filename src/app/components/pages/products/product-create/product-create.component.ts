import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { KlCardComponent } from '../../../shared/kl-card/kl-card.component';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  selector: 'app-product-create',
  imports: [FormsModule, RouterLink, KlCardComponent, AlertComponent],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})
export class ProductCreateComponent {
  product = { name: '', sku: '', categoryId: '', unitId: '', price: null as number | null, minStock: null as number | null, maxStock: null as number | null, description: '' };
  isLoading = signal(false);
  error = signal('');

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.router.navigate(['/products']); }, 500);
  }
}
