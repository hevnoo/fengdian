import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragModalDirective } from "./drag-modal.directive";
import { ModalDragService } from "./drag-modal.service";

@NgModule({
  providers: [ModalDragService],
  declarations: [DragModalDirective],
  imports: [
    CommonModule,
  ],
  exports: [DragModalDirective]
})
export class ModalDragModule { }
