import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tb-front-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() showTitle: boolean;
  @Input() theme: string;
  constructor() {
  }
  
  ngOnInit() {
  }
}
