import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
    Renderer2,
    Input
} from "@angular/core";
import { isDefined } from '@core/utils';
import {
    WidgetConfig
} from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { NzMessageService } from 'ng-zorro-antd/message';

interface inputArr {
    text?: string;
    tipText: string;
    searchName: string;
}
interface buttonArr {
    text: string;
}
@Component({
    selector: "fd-searchButton",
    templateUrl: "./searchButton.component.html",
    styleUrls: ["./searchButton.component.scss"],
})
export class SearchButtonComponent implements OnInit {
    @Input() ctx: WidgetContext
    @Input() hiddenParent
    @Input() selectName
    @Input() showInputArrName: string = "设备台账首页"
    inputArr: inputArr[] = []
    buttonArr: buttonArr[] = []
    hidden: string[]
    modelObj = {}
    searchText = []
    buttonClickTimes = 0
    clickTimes = 0
    clickButton
    inputButtonArr = []
    constructor(private nzMessageService: NzMessageService
    ) { }

    ngOnInit(): void {
        this.ctx.$scope.searchButton = this
        const settings = this.ctx.widgetConfig.settings
        this.inputButtonArr = settings.inputButtonArr
        this.hidden = this.hiddenParent


        // console.log(this.hidden, typeof this.hidden, this.hiddenParent)
        this.dataChange()
    }
    public dataChange() {
        this.hidden = this.hiddenParent
        if (this.showInputArrName) {
            this.inputButtonArr.map(item => {
                // console.log(this.showInputArrName, "show", item, "item", this.showInputArrName === item.name, typeof this.showInputArrName, item.name)
                if (this.showInputArrName === item.name) {
                    this.inputArr = item.input
                    this.buttonArr = item.button
                }
            })
            if (Object.keys(this.modelObj).length === 0) {
                //初始化modelObj，同步输入框的内容，只需要初始化一次，所以当modelObj有内容之后不会再执行该处
                this.inputArr.map(item => {
                    this.modelObj[item.text] = ""
                })
            }
        }
        if (this.hidden) {
            //隐藏的按钮隐藏获取复原
            if (this.hidden.length > 0) {
                this.inputArr = this.inputArr.filter(item => {
                    if (!(this.hidden.includes(item.text))) {
                        return item
                    }
                })
                this.buttonArr = this.buttonArr.filter(item => {
                    if (!(this.hidden.includes(item.text))) {
                        return item
                    }
                })
            } else {
                if (this.showInputArrName) {
                    this.inputButtonArr.map(item => {
                        // console.log(this.showInputArrName, "show", item, "item", this.showInputArrName === item.name, typeof this.showInputArrName, item.name)
                        if (this.showInputArrName === item.name) {
                            this.inputArr = item.input
                            this.buttonArr = item.button
                        }
                    })
                }
            }
        }
        this.ctx.detectChanges()
        // console.log(this.inputArr, "inputArr", this.hidden, this.buttonArr, 'arr')
    }
    buttonClick(button: string): void {
        this.buttonClickTimes++
        if (button !== "删除") {
            if (button === "添加" || button === "修改")
                this.clickButton = this.buttonClickTimes + button
            else {
                this.clickButton = button
            }
        }
        // console.log(this.clickButton === "添加", "searchButton")
        if (button === "搜索") {
            this.searchText = []
            this.inputArr.map(item => {
                //将用户输入的搜索内容push到searchText里面，并传给table
                this.searchText.push({ name: item.searchName, text: this.modelObj[item.text] })
            })
        }
        this.ctx.detectChanges()
    }
    //取消删除执行
    cancel(): void {
        this.nzMessageService.info('取消删除');
    }
    //确定删除执行
    confirm(): void {
        this.clickTimes++
        this.clickButton = "删除"
        this.nzMessageService.info('已删除');
    }
}
