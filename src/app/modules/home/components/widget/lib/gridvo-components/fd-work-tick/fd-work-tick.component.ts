import { Component, OnInit, OnDestroy } from "@angular/core";
import { Input } from "@angular/core";
import { WorkTickService } from "@app/core/http/work-tick.service";
import { WidgetContext } from "@home/models/widget-component.models";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzTableQueryParams } from "ng-zorro-antd/table";

interface workTableData {
  type: string;
  id: string;
  task: string;
  leadingCadre: string;
  alowTime: string;
  endTime: string;
  signer: string;
  alowPeopleStart: string;
  alowPeopleEnd: string;
  address: string;
}

@Component({
  selector: "tb-fd-work-tick",
  templateUrl: "./fd-work-tick.component.html",
  styleUrls: ["./fd-work-tick.component.scss"],
})
export class FdWorkTickComponent implements OnInit {
  @Input() ctx: WidgetContext;
  selectAllCheck: boolean = false;
  tableData = [];
  total = 100;
  loading = true;
  fullTableData = [];
  setSelectId = new Set<string>();
  searchTextOfId = "";
  searchTextOfPeople = "";
  selectData;
  pageIndex = 1;
  pageSize = 10;
  paramsOfStartUserId = "";
  isFrontPagination = false;
  constructor(
    private message: NzMessageService,
    private workTickService: WorkTickService
  ) {}
  ngOnInit() {
    // this.loadDataFromServer();
    // this.getAllData();
    this.getWorkTickList(1);
  }
  getWorkTickList(curentPageIndex?: number) {
    if (curentPageIndex) this.pageIndex = curentPageIndex;
    let page = this.pageIndex - 1;
    this.tableData = [];
    this.workTickService
      .searchWork(
        { page: page, pageSize: this.pageSize },
        this.searchTextOfId,
        this.searchTextOfPeople
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.totalElements;
          this.ctx.detectChanges();
        },
        (err) => {
          this.message.error(err.error.detail);
        }
      );
  }

  selectAll(check: boolean) {
    //全选以及全不选
    if (!check) {
      this.setSelectId.clear();
    } else {
      this.tableData.map((item) => {
        this.setSelectId.add(item.sid);
      });
    }
  }
  selectSingle(data, id: string, check: boolean) {
    if (check) {
      this.setSelectId.add(id);
      this.selectData = data;
    } else {
      this.setSelectId.delete(id);
    }
    //判断是否全部选择
    if (this.setSelectId.size === this.tableData.length)
      this.selectAllCheck = true;
    else this.selectAllCheck = false;
  }
  cancel() {
    this.message.success("已取消");
  }
}
