import { DefectMamentService } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/services/defect-manage.service"
import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
    Renderer2,
    Input, OnDestroy
} from "@angular/core";
import { isDefined } from '@core/utils';
import {
    WidgetConfig
} from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EntityRelationService } from "@core/http/entity-relation.service";
import { EntityId } from '@app/shared/models/id/entity-id';
import { EntityType } from '@shared/models/entity-type.models';
interface DataItem {
    select: boolean;
    name: string;
    code: string;
    type: string;
    fullName: string;
    id: number;
    address: string;
    status: string;
}
@Component({
    selector: "fd-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
    public widgetConfig: WidgetConfig;
    @Input() ctx: WidgetContext
    @Input() searchText = []
    @Input() clickButton
    @Input() clickTimes = 0
    routerLister$: Subscription = null;
    entityId: EntityId = {
        id: '',
        entityType: EntityType.DEVICE
    }
    orgrinData
    public selectName: string
    searchData: DataItem[] = []
    deleteTimes = 0
    selectId = []
    public selectAll = false
    nextId = 2
    listOfColumn = [
        {
            title: '名称',
        },
        {
            title: '代码',
        },
        {
            title: '类型',
        },
        {
            title: '设备全路径名称',
        },
        {
            title: '安装地点',
        },
        {
            title: '运行状态',
        },
        {
            title: '操作',
        }
    ];
    listOfData: DataItem[] = this.defect.getData()
    pageSize = 10
    public setOfCheckedId = new Set<number>()
    constructor(private defect: DefectMamentService, private router: Router, private entityRelationService: EntityRelationService
    ) { }
    //test
    ngOnInit(): void {
        this.ctx.$scope.table = this
        // console.log(this.ctx?.data, "data table")
        this.getTableData(this.ctx?.data ?? [])
        this.listenRouterChange();
        // this.listOfData = this.defect.getData()
    }
    private listenRouterChange() {
        this.routerLister$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd)
        ).subscribe((res: any) => {
            //获取仪表板状态参数
            const idObj = this.ctx.stateController.getStateParams();
            this.entityId = idObj.default.entityId;
            // console.log(this.entityId, idObj, "entityId,table", this.orgrinData, this.ctx.stateController.getStateParams())
            // console.log(idObj.default.entityId, idObj.default.entityId.id)
            this.entityRelationService.findInfoByFrom(this.entityId).subscribe(res => {
                const filterData = [];
                if (res.length <= 0) {// 最后一层级
                    const _itemArr = this.orgrinData.filter(_item => _item.entityId === this.entityId["id"]
                    );
                    if (_itemArr.length > 0) {
                        filterData.push(_itemArr[0]);
                    }
                } else {
                    res.forEach(item => {
                        const _itemArr = this.orgrinData.filter(_item => _item.entityId === item.to.id);
                        if (_itemArr.length > 0) {
                            filterData.push(_itemArr[0]);
                        }
                    })
                };
                // console.log(filterData, "filterData table")
                this.listOfData = Object.values(filterData[0])
                //过滤掉entitypeId和entitype
                this.listOfData = this.listOfData.filter(item => typeof item === "object")
                this.defect.assignData(this.listOfData, [], [], [], [], [])
                // console.log(filterData, "filterData table", this.listOfData)
                this.ctx.detectChanges();
            })
        });
    }
    singleCheckedChange(id: number, check: boolean) {
        // this.selectId = []
        // this.defect.changeSingleSelect(id)
        // this.listOfData = this.defect.getData()
        this.listOfData.map(item => {
            if (item.id === id) {
                //如果选中了单条，那么选中的name就为这一条
                if (check) {
                    // this.selectId.push(item.id)
                    this.defect.changeSelectId(id)
                    this.setOfCheckedId.add(item.id)
                    this.selectName = item.name
                } else {
                    this.setOfCheckedId.delete(item.id)
                }
            }
            return item
        })
        // console.log(id, check, "check single id table")
    }
    checkedChange(check: boolean) {
        this.selectAll = check
        this.defect.changeSelectAll(check)
        this.listOfData = this.defect.getData()
        if (check) {
            this.listOfData = this.listOfData.map(item => {
                this.setOfCheckedId.add(item.id)
                return item
            })
            this.selectName = this.listOfData[0].name
        }
        //如果全选，那么选中的name设置为第一条
        else {
            this.selectId = []
            this.setOfCheckedId.clear()
            this.selectName = ""
        }
        console.log(check, "check table")
    }
    //格式化数据
    formatData(telemetryData) {
        const deviceData = {};
        let baseData = []
        let capitalData = []
        let deviceBaseData = []
        let guaranteeData = []
        let manufacturerData = []
        telemetryData.forEach((item: any) => {
            let entityId = item.datasource.entityId;
            let key = item.dataKey.name;
            let value = item.data[0] && item.data[0][1];
            let valueType = item.datasource.entityType
            let newestTime = item.data[0] && item.data[0][0];
            const id = this.defect.getNextId()
            if (Object.keys(deviceData).includes(entityId)) {
                deviceData[entityId][key] = {
                    name: item.datasource.name,
                    type: valueType,
                    fullName: item.datasource.entityLabel,
                    address: "",
                    code: "",
                    status: "",
                    id: id,
                };
            } else {
                deviceData[entityId] = {};
                deviceData[entityId][key] = {
                    name: item.datasource.name,
                    type: valueType,
                    fullName: item.datasource.entityLabel,
                    address: "",
                    code: "",
                    status: "",
                    id: id,
                };
                deviceData[entityId].entityId = entityId;
                deviceData[entityId].entityType = item.datasource.entityType;
            }
            baseData.push({
                model: "",
                type: "",
                top: "",
                code: "",
                name: "",
                kksCode: "",
                icon: "",
                radio: "",
                textarea: "",
                id: id,
            })
        })
        return {
            deviceData, baseData, capitalData, deviceBaseData, guaranteeData, manufacturerData
        };
    }
    getTableData(data) {
        if (data.length <= 0) return;
        const formatData = this.formatData(data)
        const flatData: any = Object.values(formatData.deviceData);
        let ObjectData = []
        flatData.map(item => {
            Object.values(item).map(element => {
                if (typeof element === "object")
                    ObjectData.push(element)
            })
        })
        // console.log(flatData, "flatData table", this.formatData(data), ObjectData)
        this.listOfData = ObjectData
        this.defect.assignData(ObjectData, formatData.baseData, formatData.capitalData, formatData.deviceBaseData, formatData.guaranteeData, formatData.manufacturerData)
        this.orgrinData = flatData
        this.ctx.detectChanges();
    }

    getKeys(obj = {}) {
        return Object.values(obj)
    }
    dataChange() {
        this.listenRouterChange()
        if (this.searchText && this.searchText.length > 0) {
            this.searchData = []
            this.listOfData.map(item => {
                let num = 0
                this.searchText.map(element => {
                    let name = element.name.split(',')
                    if (name.length > 1) {
                        //判断是否包含中文，如果包含中文查询的是名称那一列，如果不包含中文那查找的是代码那一列
                        if (/.*[\u4e00-\u9fa5]+.*$/.exec(element.text)) {
                            name = name[0]
                        } else {
                            name = name[1]
                        }
                    } else {
                        name = name[0]
                    }
                    if (this.search(name, element.text, item) > -1) {
                        num++
                    }
                    // console.log(this.search(name, element.text, item) ,"search",name,"name",element.text,"text",item,"item")
                })
                // console.log(num,item,this.searchText.length,"search")
                //因为用户输入内容的时候可能输入的内容不止一个，只有一个符合要求的不能输出，只有当行全部符合搜索的才能显示出来
                if (num >= this.searchText.length) {
                    this.searchData.push(item)
                }
            })
        } else {
            this.searchText = []
        }
        // console.log(this.clickTimes, "clickTimes", this.deleteTimes, "deleteTimes", this.clickButton, "clickButton")
        if (this.clickTimes - 1 === this.deleteTimes && this.clickButton === "删除") {
            this.deleteTimes++
            // this.listOfData = this.listOfData.filter(item => !(item.select))
            this.defect.deleteData()
            this.listOfData = this.defect.getData()
            this.searchData = this.searchData.filter(item => !(this.setOfCheckedId.has(item.id)))
        }
        this.ctx.detectChanges()
        // console.log(this.listOfData, this.searchData, "table")
    }
    //name是搜索的列，text是搜索的内容，data是当行数据，为-1就是找不到，为正整数就是在data中找到的位置，只要text有一点点符合data就行
    search(name: string, text: string, data: DataItem) {
        return data[name].search(text)
    }
}
