import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { WorkTickService } from "@app/core/http/work-tick.service";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import moment from "moment";
import { fromEvent } from "rxjs";

@Component({
    selector: 'tb-app-work-ticket',
    templateUrl: './app-work-ticket.component.html',
    styleUrls: ['./app-work-ticket.component.scss']
})
export class FdAppWorkTicketComponent implements OnInit {
    @Input() ctx: WidgetContext

    public dataList: any[];   // 渲染到视图的数据
    public completeData: any[]   // 完整获取的数据
    public searchVal: string  // 搜索框的文字
    public isBottom: boolean = false
    public isShowSpin: boolean = true
    public pagetion = {
        page: 0,
        pageSize: 10,
    };
    public divEle;

    constructor(
        private cd: ChangeDetectorRef,
        private workTickService: WorkTickService,

    ) { }

    ngOnInit(): void {
        this.divEle = document.getElementById('ticket')
        fromEvent(this.divEle, 'scroll').subscribe((event) => {
            this.onWindowScroll()
        })
        this.initData(this.pagetion)
    }

    // 获取数据
    initData(page) {
        this.workTickService.getPageInfo(page).subscribe(res => {
            this.getApiData(res)
        })
    }

    // 滚动条抵达底部时获取下一页数据
    onWindowScroll() {
        if (this.divEle.scrollTop >= this.divEle.scrollHeight - this.divEle.clientHeight) {
            this.pagetion.page += 1
            if(!this.searchVal) {
                this.workTickService.getPageInfo(this.pagetion).subscribe(res => {
                   this.pullRefresh(res)
                })
            }else {
                let query = `page=${this.pagetion.page}&pageSize=${this.pagetion.pageSize}`
                let seaVal = `cCaption=${this.searchVal}`
                this.workTickService.searchData(query, seaVal).subscribe(res => {
                    this.pullRefresh(res)
                })
            }

        }
    }

    // 搜索功能
    search(page) {
        console.log(this.searchVal, "文字")
        this.isShowSpin = false
        this.isBottom = false
        this.pagetion.page = page

        if (!this.searchVal) {
            this.initData(this.pagetion)
            return
        }
        let query = `page=${this.pagetion.page}&pageSize=${this.pagetion.pageSize}`
        let seaVal = `cCaption=${this.searchVal}`
        this.workTickService.searchData(query, seaVal).subscribe(res => {
            console.log(res);
            this.getApiData(res)
        })
        // let arr = []
        // this.dataList.forEach((item) => {
        //     for(let key in item){
        //         if (typeof(item[key]) == 'string') {
        //             if (item[key].indexOf(this.searchVal) !== -1) {
        //                 arr.push(item)
        //                 break
        //             }
        //         }
        //     }

        // })
        // this.dataList = arr
    }

    // 清除输入框内容
    clearVal() {
        this.searchVal = ''
    }

    // 键盘回车进行搜索
    keySearch(e) {
        console.log(e, "键盘");
        if (e.keyCode == 13) {
            e.preventDefault()
            this.search(0);
        } else {

        }
    }

    // 处理请求数据
    getApiData(res) {
        this.dataList = res?.data
        this.dataList.forEach(item => {
            item.tbegin = moment(item.tbegin).format('YYYY-MM-DD')
            item.tend = moment(item.tend).format('YYYY-MM-DD')
        })
        this.cd.detectChanges()
    }

    // 处理下拉请求数据
    pullRefresh(res) {
         // @ts-ignore
         this.dataList = [...this.dataList, ...res?.data]
         this.dataList.forEach(item => {
             item.tbegin = moment(item.tbegin).format('YYYY-MM-DD')
             item.tend = moment(item.tend).format('YYYY-MM-DD')
         })
         if (!res?.hasNext) {
             this.isBottom = true
             this.isShowSpin = false
         } else {
             this.isBottom = false
             this.isShowSpin = true

         }
         this.cd.detectChanges()
    }
}