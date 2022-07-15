import { Directive, ElementRef, Input } from '@angular/core';
import { ModalDragService } from "./drag-modal.service";
import { NzModalRef } from 'ng-zorro-antd/modal';
@Directive({
  selector: '[dragModal]'
})
export class DragModalDirective {
  @Input() dragModal: NzModalRef;

  constructor(private ModalDragService: ModalDragService) { 
    setTimeout(() => {
      this.ModalDragService.dragServiceModal(this.dragModal);
    }, 16);
  }

}
