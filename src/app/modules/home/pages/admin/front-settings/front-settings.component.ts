import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from "./components/delete-dialog.component";
import { PageComponent } from '@shared/components/page.component';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { AssetService } from '@core/http/asset.service';
import { AttributeService } from '@core/http/attribute.service';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';

type MenuType = 'menu' | 'link';
export interface MenuElement {
  parentName?: string;
  type?: MenuType;
  name: string;
  icon?: string;
  dashboardId: string;
  isExternal?: boolean;
  isFullBg?: boolean;
  children?: MenuElement[]
}

@Component({
  selector: 'tb-front-settings',
  templateUrl: './front-settings.component.html',
  styleUrls: ['./front-settings.component.scss', '../settings-card.scss']
})
export class FrontSettingsComponent extends PageComponent implements OnInit, AfterViewInit  {

  userMenu: any;

  orgrinData: any;

  assetType: any = {
    entityType: 'ASSET',
    id: null
  }

  menuSettings: MenuElement = {
    parentName: '0',
    type: 'link',
    name: null,
    icon: null,
    dashboardId: null
  }

  displayedColumns: string[] = ['parentName', 'type', 'name', 'icon', 'dashboardId', 'actions'];
  dataSource = new MatTableDataSource<MenuElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(protected store: Store<AppState>,
              private dialog: MatDialog,
              private assetService: AssetService,
              private attributeService: AttributeService,) {
    super(store);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadUserMenu();
  }

  loadUserMenu () {
    this.assetService.findByName("menu-management").subscribe(
      (info) => {
        if (info) {
          this.assetType.id = info.id.id;
          this.attributeService.getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE).subscribe(
            (menu) => {
              if(menu.length > 0) {
                this.orgrinData = JSON.parse(JSON.stringify(menu));
                const userMenu: MenuElement[] = Object.values(menu[0].value);
                this.userMenu = userMenu;
                this.dataSource = new MatTableDataSource<MenuElement>(userMenu);
              }
            }
          )
        }
      }
    );
  }

  save(): void {
    if(!this.menuSettings.parentName ||
      !this.menuSettings.name ) return;
    const timeid: any = new Date().getTime();
    const inputmenu = {
      parentName: this.menuSettings.parentName,
      type: this.menuSettings.type,
      name: this.menuSettings.name,
      icon: this.menuSettings.icon,
      dashboardId: this.menuSettings.dashboardId
    };
    this.orgrinData[0].value[timeid] = inputmenu;
    this.saveMenu();
  }

  delete(row: MenuElement) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = '200px';
    dialogConfig.data = row;
    this.dialog.open(DeleteDialogComponent, dialogConfig).afterClosed().subscribe(
      (res) => {
        if(res) {
          for(let item in this.orgrinData[0].value) {
            if(this.orgrinData[0].value[item].name === row.name) {
              delete this.orgrinData[0].value[item];
            }
          }
          this.saveMenu();
        }
      }
    )
  }

  saveMenu() {
    this.attributeService.saveEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE, this.orgrinData).subscribe(
      () => {
        this.loadUserMenu();
      }
    )
  }
}
