import { ThisReceiver } from "@angular/compiler";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { AnnouncementService } from "@app/core/http/announcement.service";
import { UserService } from "@app/core/http/user.service";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { cloneDeep } from "lodash";
import moment from "moment";
import { fromEvent } from "rxjs";

@Component({
    selector: "tb-app-announcement-details",
    templateUrl: "./app-announcement-details.component.html",
    styleUrls: ["./app-announcement-details.component.scss"],
})
export class AppAnnouncementDetailsComponent implements OnInit {

    @Input() ctx: WidgetContext

    public dataList: any[];   // 渲染到视图的数据
    public completeData: any[];   // 完整获取的数据
    public searchVal: string; // 搜索框的文字
    public isBottom: boolean = false;
    public isShowSpin: boolean = true;
    public name;
    public pagetion = {
        page: 0,
        pageSize: 10,
    };
    public divEle;
    announcementTypeMap = new Map<number, string>()
        .set(1, '公告')
        .set(2, '通知')
        .set(3, '通报')

    constructor(
        private cd: ChangeDetectorRef,
        private userService: UserService,
        private announcementService: AnnouncementService
    ) { }

    ngOnInit(): void {
        this.divEle = document.getElementById('announcement')
        fromEvent(this.divEle, 'scroll').subscribe((event) => {
            this.onWindowScroll()
        })
        this.initData(this.pagetion.page, this.pagetion.pageSize)
    }

    // 获取数据
    async initData(page, pageSize) {
        const res = await this.announcementService.getPaging(page, pageSize).toPromise()
        this.proServeData(res)
    }

    // 滚动条抵达底部时获取下一页数据
    async onWindowScroll() {
        if (this.divEle.scrollTop >= this.divEle.scrollHeight - this.divEle.clientHeight) {
            this.pagetion.page += 1
            if (!this.searchVal) {
                // console.log("111")
                const res = await this.announcementService.getPaging(this.pagetion.page, this.pagetion.pageSize).toPromise()
                this.pullRefresh(res)
            }else {
                // console.log(this.searchVal)
                let query = `page=${this.pagetion.page}&pageSize=${this.pagetion.pageSize}`
                let serData = `topic=${this.searchVal}`
                const res = await this.announcementService.searchData(query, serData).toPromise()
                this.pullRefresh(res)
                
            }

        }

    }

    // 搜索功能
    async search(page) {
        this.isShowSpin = false
        this.isBottom = false
        if (!this.searchVal) {
            this.pagetion.page = 0
            this.pagetion.pageSize = 10
            this.initData(this.pagetion.page, this.pagetion.pageSize)
            return
        }
        this.pagetion.page = page
        let query = `page=${this.pagetion.page}&pageSize=${this.pagetion.pageSize}`
        let serData = `topic=${this.searchVal}`
        const res = await this.announcementService.searchData(query, serData).toPromise()
        // console.log(res, "查询");
        this.proServeData(res)
       
    }

    // 处理请求数据
    proServeData(res) {
        Promise.all((res as any)?.data.map(i => this.userService.getUser(i.creatorId).toPromise())).then(values => {

            (res as any)?.data.forEach((i, index) => {
                i.createName = values[index]?.['firstName']
                i.createTime = moment(i.createTime).format('YYYY-MM-DD')
                i.fileUrl = i.fileUrl?.split("/")?.[i.fileUrl?.split("/")?.length - 1]
                // console.log(i.fileUrl?.split("/")?.[i.fileUrl?.split("/")?.length - 1], "ddd")
            })
            this.dataList = (res as any)?.data
            // console.log(this.dataList, "查询数据")
            this.completeData = cloneDeep(this.dataList)
            this.cd.detectChanges()
        }, err => {
            console.log(err);

        })
    }

    // 处理下拉刷新数据
    pullRefresh(res) {
        Promise.all((res as any)?.data.map(i => this.userService.getUser(i.creatorId).toPromise())).then(values => {
            (res as any)?.data.forEach((i, index) => {
                i.createName = values[index]?.['firstName']
                i.createTime = moment(i.createTime).format('YYYY-MM-DD')
                i.fileUrl = i.fileUrl?.split("/")?.[i.fileUrl?.split("/")?.length - 1]
            })
            // @ts-ignore
            this.dataList = [...this.dataList, ...(res as any)?.data]
            this.completeData = cloneDeep(this.dataList)
            this.cd.detectChanges()
            if (!(res as any)?.hasNext) {
                this.isBottom = true
                this.isShowSpin = false
            } else {
                this.isBottom = false
                this.isShowSpin = true
    
            }
        })
        
        this.cd.detectChanges()
    }

    // 键盘回车进行搜索
    keySearch(e) {
        // console.log(e, "键盘");
        if(e.keyCode == 13) {
            e.preventDefault()
            this.search(0);
        }else {

        }
    }


}