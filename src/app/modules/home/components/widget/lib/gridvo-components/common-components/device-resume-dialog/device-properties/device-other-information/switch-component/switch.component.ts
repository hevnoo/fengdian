import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tb-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() items: any

  constructor() { }


  ngOnInit(): void {
    
  }

  initFormLength() {

  }
}
