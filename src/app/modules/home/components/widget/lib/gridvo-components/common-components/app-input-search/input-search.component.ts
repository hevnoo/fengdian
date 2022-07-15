import { EventEmitter, SimpleChanges } from '@angular/core';
import { Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemBufferService } from '@core/services/item-buffer.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { isDefined } from '@app/core/utils';
import { ThemeService } from '@app/core/services/theme.server';
import { data } from 'jquery';
import { DashboardService } from '@app/core/http/dashboard.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefectManagementService } from '@app/core/http/defect-management.service';
import { PageLink } from '@app/shared/models/page/page-link';
import { UserService } from '@app/core/http/user.service';
import { DeviceService } from '@app/core/http/device.service';
import { DeviceProfileService } from '@app/core/http/device-profile.service';
import { inputData } from './input'
//这个组件是app可以用来搜索和下拉的,使用这个组件的时候请不要用ngif，请用display：none来控制显示与隐藏
@Component({
    selector: 'app-input-search',
    templateUrl: './input-search.component.html',
    styleUrls: ['./input-search.component.scss']
})
export class FdAppInputSearchComponent implements OnInit {
    searchText = ''
    @Input() listData: inputData[] = []
    showListData: inputData[] = []
    isShowList = false
    @Output() selectValue = new EventEmitter()
    constructor(
    ) { }

    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.listData) {
            this.showListData = changes.listData.currentValue.slice(0, 10)
        }
    }
    //设备的输入框内容改变，可以显示的设备列表改变,输入框是搜索的
    changeSearchDevice(value) {
        value.preventDefault();
        this.isShowList = true
        // this.searchDevice = value.data
        this.showListData = this.listData.filter(item =>
            item.label.includes(value.data)
        )
        if (this.showListData.length === 0 && value.data && value.data.length > 0) {
            this.showListData[0] = { label: '搜索不到', value: '' }
        } else if (!value.data || value.data.length === 0) {
            //搜索框没有内容就取前面十条数据
            this.showListData = this.listData.slice(0, 10)
        }
    }
    //得到焦点显示设备列表
    selectDevice($event) {
        $event.preventDefault();
        this.isShowList = true
    }
    //失去焦点后设备列表不显示
    notSelectDevice($event) {
        this.isShowList = false
    }
    //li选择，选中之后记录设备的id
    selectDeviceOfLi(device) {
        console.log(111)
        if (device.label !== '搜索不到') {
            this.searchText = device.label
            this.selectValue.emit(device.value)
        }
        console.log(this.searchText, 'this.searchText')
    }
}
