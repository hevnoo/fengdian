import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'tb-fb-view-details',
    templateUrl: './view-details.component.html',
    styleUrls: ['./view-details.component.scss']
  })
export class ViewDetailsComponent implements OnInit {
    @Input() isView: boolean
    @Input() formData: any
    @Output() closeDetail =  new EventEmitter()
    constructor() {}

    ngOnInit(): void {
        
    }

    ngOnChanges() {
      console.log(this.formData, "定检查看");
      
    }

    modelCancel() {
        this.closeDetail.emit(false)
    }
      
  }