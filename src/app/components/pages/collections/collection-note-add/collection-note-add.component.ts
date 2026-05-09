import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';

@Component({
  selector: 'app-collection-note-add',
  standalone: true,
  imports: [FormsModule, KlDrawerComponent],
  templateUrl: './collection-note-add.component.html',
  styles: [':host { display: contents; }'],
})
export class CollectionNoteAddComponent {
  @Input() open = false;
  @Input() farmerName = '';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  noteText = '';
  createTodo = false;
  todoDate = '';
  saving = false;

  get title(): string { return 'Add Follow-up Note'; }
  get subtitle(): string { return this.farmerName ? `Recording note for ${this.farmerName}` : 'Recording a collection follow-up note'; }

  closeDrawer(): void { this.close.emit(); }

  submit(): void {
    if (!this.noteText.trim() || this.saving) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.saved.emit();
    }, 600);
  }
}
