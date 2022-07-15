import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tb-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit {
  @Input() items: any

  constructor() { }


  ngOnInit(): void {
    
  }

  initFormLength() {

  }
}
