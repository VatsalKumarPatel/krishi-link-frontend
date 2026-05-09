import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';

interface TargetForm {
  targetType: 'Daily' | 'Weekly';
  targetAmount: number | null;
}

@Component({
  selector: 'app-collection-target-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './collection-target-add.component.html',
  styles: [':host { display: contents; }'],
})
export class CollectionTargetAddComponent implements OnChanges {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form: TargetForm = { targetType: 'Daily', targetAmount: null };
  saving = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.form = { targetType: 'Daily', targetAmount: null };
      this.saving = false;
    }
  }

  get periodHint(): string {
    const today = new Date();
    if (this.form.targetType === 'Daily') {
      return `Period: ${this.formatDate(today)} (today)`;
    }
    const mon = this.startOfWeek(today);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return `Period: ${this.formatDate(mon)} – ${this.formatDate(sun)} (this week)`;
  }

  private startOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  }

  private formatDate(d: Date): string {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  closeDrawer(): void { this.close.emit(); }

  submit(): void {
    if (!this.form.targetAmount || this.saving) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.saved.emit();
    }, 600);
  }
}
