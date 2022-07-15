import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tb-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() items: any

  constructor() { }


  ngOnInit(): void {
    
  }

  initFormLength() {

  }
}
