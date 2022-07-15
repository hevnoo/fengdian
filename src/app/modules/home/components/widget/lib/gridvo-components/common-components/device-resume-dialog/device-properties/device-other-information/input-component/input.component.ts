import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tb-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() items: any

  constructor() { }


  ngOnInit(): void {
    console.log(this.items.content);
  }


}
