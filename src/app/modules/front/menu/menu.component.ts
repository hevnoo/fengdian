import { Component, OnInit, Input } from '@angular/core';
import { TabsService } from '@app/core/services/tabs.service';

@Component({
  selector: 'tb-front-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() menu: any = [];
  @Input() isCollapsed: boolean = this.TabsService.collapse;
  @Input() theme: string;

  constructor(private TabsService: TabsService,) {
  }

  ngOnInit() {
  }
}
