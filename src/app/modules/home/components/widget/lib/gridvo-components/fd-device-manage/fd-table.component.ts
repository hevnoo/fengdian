import { PageLink } from "@shared/models/page/page-link";
import { DeviceProfileService } from "@core/http/device-profile.service";
import { RelationTypeGroup } from "./../../../../../../../shared/models/relation.models";
import { DeviceService } from "@core/http/device.service";
import { WidgetConfig } from "./../../../../../../../shared/models/widget.models";
import { isDefined } from "@core/utils";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { Router, NavigationEnd, Resolve } from "@angular/router";
import { Subscription } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { EntityRelationService } from "@core/http/entity-relation.service";
import { EntityId } from "@app/shared/models/id/entity-id";
import { EntityType } from "@shared/models/entity-type.models";
import { formatTelemetryData } from "./utils";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ThrowStmt } from "@angular/compiler";
import { NzMessageService } from "ng-zorro-antd/message";
import { T } from "@angular/cdk/keycodes";
import { Direction, SortOrder } from "@app/shared/models/page/sort-order";
interface deviceInfo {
  entityId: string;
  [propname: string]: any;
}

interface timeseriesInfo {
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  sortDirections: NzTableSortOrder[];
  [propname: string]: any;
}

@Component({
  selector: "tb-fd-table",
  templateUrl: "./fd-table.component.html",
  styleUrls: ["./fd-table.component.scss"],
})
export class FdTableComponent implements OnInit, OnDestroy {
  // [x: string]: any;
  @Input() ctx: WidgetContext;
  deviceProfileInfo: any = [];
  token = localStorage.getItem("jwt_token");
  isVisibleErWeiMa: number | null = null;
  public isShowResume: boolean;
  entityName: string = "????????????????????????";
  entityId: EntityId = {
    id: "",
    entityType: EntityType.DEVICE,
  };
  orgrinData: deviceInfo[];
  tableData: deviceInfo[] = [];
  singlePageData: deviceInfo[] = [];
  detailInfo: deviceInfo;
  page = {
    index: 1,
    size: 10,
  };
  //???????????????????????????id,???????????????????????????
  mainEntityId: EntityId = {
    entityType: EntityType.DEVICE,
    id: "b4c411d0-8a09-11ec-9ccc-b741e5f50805",
  };
  validateEditForm: FormGroup;
  selectData: deviceInfo;
  validateAddForm: FormGroup;
  isClickDelete = false;
  searchText = "";
  searchTextOfType = "";
  // diaTableSearchValue: string = "";
  widgetConfig: WidgetConfig;
  formEditData; //?????????????????????
  formAddData; //?????????????????????
  routerLister$: Subscription = null;
  isAddModel = false; //?????????????????????
  isEditModel = false;
  currentWsEntityId: string = "";
  currentWsEntityType: string = "";
  beginningTimeData = []; // ?????????????????????????????????
  selectAllCheck = false;
  setSelectId = new Set<number>();
  public themeStyle: { [style: string]: boolean };
  nzWrapClassName: string = "";
  nzMessageService: any;
  deviceType = new Set<string>();
  webSocket = null;
  timeseriesData: any[] = [];
  constructor(
    private router: Router,
    private entityRelationService: EntityRelationService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private deviceService: DeviceService,
    private deviceProfileService: DeviceProfileService
  ) {}
  ngOnInit() {
    this.ctx.$scope.GfTableWidget = this;
    this.validateAddForm = this.fb.group({
      node: [""],
      name: ["", [Validators.required, Validators.maxLength(50)]],
      type: [""],
      label: ["", [Validators.required]],
    });

    // this.validateEditForm = this.initForm(EditBaseData)
    this.getGfTableData(this.ctx?.data ?? []);
    this.widgetConfig = this.ctx.widgetConfig;
    this.listenRouterChange(); // ???????????????????????????stateParams???
    // this.nzWrapClassName = this.wrapClassName()
    this.WebSocketAPIFn();
    //
    let that = this;
    //?????????????????????????????????????????????
    // $(document).on("click", function (e) {
    //   that.isVisibleErWeiMa = null; //???????????????????????????
    // });
  }
  pageIndexChange() {
    this.changePageData();
  }
  pageSizeChange() {
    this.changePageData();
  }
  toArrayOfSet(data: Set<string>): Array<string> {
    return Array.from(data);
  }
  handleErWeiMa(id: number) {
    //????????????????????????
    if (!this.isVisibleErWeiMa) {
      this.isVisibleErWeiMa = id;
    } else {
      if (this.isVisibleErWeiMa === id) this.isVisibleErWeiMa = null;
      else {
        this.isVisibleErWeiMa = id;
      }
    }
  }
  selectAll(check: boolean) {
    //????????????????????????????????????document??????????????????
    this.isVisibleErWeiMa = null;
    //?????????????????????
    if (!check) {
      this.setSelectId.clear();
    } else {
      this.tableData.map((item) => {
        this.setSelectId.add(item.name.id);
      });
    }
  }
  selectSingle(data: deviceInfo, id: number, check: boolean) {
    this.isVisibleErWeiMa = null;
    if (check) {
      this.setSelectId.add(id);
      this.selectData = data;
    } else {
      this.setSelectId.delete(id);
    }
    //????????????????????????
    if (this.setSelectId.size === this.tableData.length)
      this.selectAllCheck = true;
    else this.selectAllCheck = false;
  }

  offModel(e) {
    this.isShowResume = e;
  }
  showModel(item: deviceInfo) {
    this.sendData(item.entityId, item.entityType, false);
    this.currentWsEntityId = item.entityId;
    this.currentWsEntityType = item.entityType;
    this.detailInfo = item;

    this.isShowResume = true;
  }

  // ?????????????????????

  sendData(entityId, type, isUn) {
    let object = {
      tsSubCmds: [
        {
          entityType: type,
          entityId: entityId,
          scope: "LATEST_TELEMETRY",
          cmdId: 10,
          unsubscribe: isUn,
        },
      ],
      historyCmds: [],
      attrSubCmds: [],
    };
    let data = JSON.stringify(object);
    this.webSocket.send(data);
  }

  WebSocketAPIFn() {
    let _this = this;
    if (!this.webSocket) {
      this.webSocket = new WebSocket(
        `ws://${window.location.host}/api/ws/plugins/telemetry?token=${this.token}`
      );
    }

    this.webSocket.onmessage = function (event) {
      let received_msg = JSON.parse(event.data);
      let currentData = Object.entries(received_msg.data);
      _this.timeseriesData = [];
      currentData.forEach((item) => {
        _this.timeseriesData.push({
          name: item?.[0],
          val: item?.[1]?.[0]?.[1],
          newestTime: item?.[1]?.[0]?.[0],
        });
      });
      _this.beginningTimeData = _this.timeseriesData;
    };

    this.webSocket.onclose = function (event) {
      // console.log('??????ws', this.webSocket)
    };
  }

  submitForm() {
    if (this.validateAddForm.valid) {
      let entityId: EntityId;
      if (this.entityId.id.length === 0) {
        entityId = this.mainEntityId;
      } else {
        entityId = this.entityId;
      }
      //??????????????????????????????????????????????????????
      this.deviceService
        .saveDevice({
          name: this.validateAddForm.value.name,
          type: this.validateAddForm.value.type,
          label: this.validateAddForm.value.label,
        })
        .subscribe((res) => {
          this.entityRelationService
            .saveRelation({
              from: entityId,
              to: res.id,
              type: "Contains",
              typeGroup: RelationTypeGroup.COMMON,
            })
            .subscribe((data) => {
              this.message.success("???????????????");
              //????????????????????????????????????????????????????????????
              setTimeout(() => {
                location.reload();
              }, 1000);
            });
        });
      //????????????????????????????????????????????????????????????????????????
      let id = this.tableData.slice(-1)[0].name.id;
      this.tableData = [
        ...this.tableData,
        {
          entityId: this.tableData.slice(-1)[0].entityId,
          entiType: this.tableData.slice(-1)[0].entityType,

          name: {
            name: "name",
            label: "name",
            val: this.validateAddForm.value.name,
            newsTime: "",
            valueType: this.validateAddForm.value.type,
            id: id + 1,
          },
          type: {
            name: "type",
            label: "type",
            val: this.validateAddForm.value.type,
            newsTime: "",
            valueType: this.validateAddForm.value.type,
            id: id + 1,
          },
          createdTime: {
            name: "createdTime",
            label: "createdTime",
            val: new Date().getTime(),
            newsTime: "",
            valueType: this.validateAddForm.value.type,
            id: id + 1,
          },
        },
      ];
      this.cancleAddModel();
    } else if (!this.validateAddForm.valid) {
      Object.values(this.validateAddForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    this.ctx.detectChanges();
  }

  // showEditModel() {
  //   this.EditBaseData[0].placeholder = this.selectData.name.val
  //   this.EditBaseData[1].placeholder = this.selectData.type.val
  //   // this.headArrEdit = [{ text: "????????????", value: this.EditBaseData }]

  //   this.isEditModel = true
  // }
  showAddModel() {
    this.validateAddForm.get("node").setValue(this.entityName);
    this.validateAddForm.controls["node"].disable();
    this.isAddModel = true;
  }

  // cancleEditModel() {
  //   this.isEditModel = false
  // }
  cancleAddModel() {
    // this.headArr = [{ text: "????????????", value: addBaseData }]
    this.isAddModel = false;
    this.validateAddForm.reset();
    // this.validateAddForm = this.fb.group({})
  }
  handleTableDataDelete() {
    this.modal.confirm({
      nzTitle: "??????????????????????",
      nzOkText: "??????",
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => {
        // this.isClickDelete = true;
        if (this.selectAllCheck) {
          this.tableData.forEach((item) => {
            this.deviceService.deleteDevice(item.entityId).subscribe((res) => {
              location.reload();
            });
          });
          this.tableData = [];
        } else {
          this.tableData = this.tableData.filter((item) => {
            if (this.setSelectId.has(item.name.id)) {
              this.deviceService
                .deleteDevice(item.entityId)
                .subscribe((res) => {
                  //???????????????????????????????????????id???????????????
                  this.message.success("????????????");
                  this.setSelectId.clear();
                  this.selectAllCheck = false;
                  //????????????????????????????????????????????????????????????
                  setTimeout(() => {
                    location.reload();
                  }, 1000);
                });
            } else {
              return item;
            }
          });
        }
        // this.isClickDelete = false;
        this.ctx.detectChanges();
      },
      nzCancelText: "??????",
      nzOnCancel: () => console.log("Cancel"),
    });
  }

  // handleTableDataEdit() {
  //   this.tableData = this.tableData.map(item => {
  //     if (this.setSelectId.has(item.name.id)) {
  //       item = this.formEditData
  //     }
  //     return item
  //   })
  // }
  private listenRouterChange() {
    this.routerLister$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: any) => {
        //???????????????????????????????????????????????????????????????
        this.searchText = "";
        this.searchTextOfType = "";
        this.selectAllCheck = false;
        this.setSelectId.clear();
        const idObj = this.ctx.stateController.getStateParams();
        this.entityId = idObj.entityId;
        this.entityName = idObj.entityName;
        this.entityRelationService
          .findInfoByFrom(this.entityId)
          .subscribe((res) => {
            let filterData = [];
            if (res.length <= 0) {
              // ???????????????
              const _itemArr = this.orgrinData.filter(
                (_item) => _item.entityId === this.entityId.id
              );
              if (_itemArr.length > 0) {
                filterData.push(_itemArr[0]);
              }
            } else {
              if (res[0].from.id === this.mainEntityId.id) {
                filterData = filterData.concat(this.orgrinData);
              } else {
                res.forEach((item) => {
                  const _itemArr = this.orgrinData.filter(
                    (_item) => _item.entityId === item.to.id
                  );
                  if (_itemArr.length > 0) {
                    filterData.push(_itemArr[0]);
                  }
                });
              }
            }
            this.tableData = filterData;
            this.page = {
              index: 1,
              size: 10,
            };
            this.changePageData();
            this.ctx.detectChanges();
          });
      });
  }

  ngOnDestroy() {
    this.routerLister$?.unsubscribe();

    this.webSocket.close();
  }

  public onDataUpdated() {
    // this.nzWrapClassName = this.wrapClassName()
    // this.getGfTableData(this.ctx?.data ?? []);
    // this.listenRouterChange()
    this.ctx.detectChanges();
  }
  cancel(): void {
    this.isClickDelete = false;
    this.message.info("?????????");
  }
  changePageData() {
    this.singlePageData = this.tableData.slice(
      (this.page.index - 1) * this.page.size,
      this.page.index * this.page.size
    );
    this.ctx.detectChanges();
  }
  getGfTableData(data) {
    if (data.length <= 0) return;
    let formData = formatTelemetryData(data);
    const flatData: deviceInfo[] = Object.values(formData);
    this.tableData = flatData;
    this.changePageData();
    this.orgrinData = flatData;
    this.tableData.map((item) => {
      this.deviceType.add(item.type.val);
    });
    this.deviceProfileService
      .getDeviceProfiles(new PageLink(1000, 0, null, null))
      .subscribe((res) => {
        this.deviceProfileInfo = res.data;
      });
    this.ctx.detectChanges();
  }
  handleSearch() {
    // let allData: deviceInfo[] = Object.values(formatTelemetryData(this.ctx?.data ?? []));
    //??????????????????????????????????????????????????????
    this.searchText = this.searchText.replace(/(^\s*)|(\s*$)/g, "");
    this.tableData = this.orgrinData.filter((item) => {
      return (
        (this.searchText.length > 0
          ? item.name["val"].includes(this.searchText)
          : true) &&
        (this.searchTextOfType && this.searchTextOfType.length > 0
          ? item.type["val"].includes(this.searchTextOfType)
          : true)
      );
    });
    this.changePageData();
    this.setSelectId.clear();
    this.selectAllCheck = false;
    this.ctx.detectChanges();
  }
}
