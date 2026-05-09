import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { formatShortId } from '@app/utils/format';

@Directive()
export abstract class KlDrawerFormHost implements OnChanges {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isEdit = false;

  protected abstract get entityId(): string | null;
  protected abstract get entityIdInputName(): string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes[this.entityIdInputName]) {
      this.isEdit = !!(this.open && this.entityId);
      this.onDrawerStateChange(changes);
    }
  }

  closeDrawer(): void {
    this.close.emit();
  }

  notifySaved(): void {
    this.saved.emit();
  }

  protected shortId(id = this.entityId): string {
    return formatShortId(id);
  }

  protected onDrawerStateChange(_changes: SimpleChanges): void {}
}
