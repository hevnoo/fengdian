import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuElement } from "../front-settings.component";

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: MenuElement,
    public dialogRef: MatDialogRef<DeleteDialogComponent, boolean>) {

  }

  ngOnInit(): void {
    this.name = this.data.name;
  }

  close(no: boolean): void {
    this.dialogRef.close(no);
  }

  onDelete(yes: boolean): void {
    this.dialogRef.close(yes);
  }

}
