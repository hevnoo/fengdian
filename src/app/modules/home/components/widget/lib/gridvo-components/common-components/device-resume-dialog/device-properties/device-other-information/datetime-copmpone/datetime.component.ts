import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tb-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss']
})
export class DateTimeComponent implements OnInit {
  @Input() items: any

  constructor() { }


  ngOnInit(): void {

    
  }

  
}
