import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { KlDrawerComponent } from '../../../components/shared/kl-drawer/kl-drawer.component';
import { ReturnFormComponent } from '../return-form/return-form.component';

@Component({
  selector: 'app-return-add',
  standalone: true,
  imports: [KlDrawerComponent, ReturnFormComponent],
  templateUrl: './return-add.component.html',
  styles: [':host { display: contents; }'],
})
export class ReturnAddComponent implements OnChanges {
  @Input() open = false;
  @Input() returnId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isEdit = false;

  get title(): string { return this.isEdit ? 'Edit Return' : 'New Return'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${(this.returnId ?? '').slice(0, 8)}…` : 'Create a new purchase return.';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['returnId']) {
      this.isEdit = !!(this.open && this.returnId);
    }
  }
}
