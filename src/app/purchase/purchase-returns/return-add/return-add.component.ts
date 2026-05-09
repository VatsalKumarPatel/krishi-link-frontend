import { Component, Input } from '@angular/core';
import { KlDrawerComponent } from '@shared/kl-drawer/kl-drawer.component';
import { KlDrawerFormHost } from '@shared/kl-drawer/kl-drawer-form-host';
import { ReturnFormComponent } from '../return-form/return-form.component';

@Component({
  selector: 'app-return-add',
  standalone: true,
  imports: [KlDrawerComponent, ReturnFormComponent],
  templateUrl: './return-add.component.html',
  styles: [':host { display: contents; }'],
})
export class ReturnAddComponent extends KlDrawerFormHost {
  @Input() returnId: string | null = null;

  get title(): string { return this.isEdit ? 'Edit Return' : 'New Return'; }
  get subtitle(): string {
    return this.isEdit ? `ID ${this.shortId()}` : 'Create a new purchase return.';
  }

  protected get entityId(): string | null { return this.returnId; }
  protected get entityIdInputName(): string { return 'returnId'; }
}
