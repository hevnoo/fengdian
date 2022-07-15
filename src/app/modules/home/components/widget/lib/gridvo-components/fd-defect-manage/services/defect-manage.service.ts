import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import Cookies from 'js-cookie';

@Injectable({
    providedIn: 'root'
})
export class DefectMamentService {
    public nextId = 2
    listOfTableData = []
    baseData = []
    capitalData = []
    deviceBaseData = []
    guaranteeData = []
    manufacturerData = []
    selectAll = false
    selectId = new Set<number>()
    public getData() {
        return this.listOfTableData
    }
    public getNextId() {
        return this.nextId++
    }
    changeSelectId(id: number) {
        this.selectId.add(id)
    }
    clearSelectId() {
        this.selectId.clear()
    }
    changeSelectAll(check) {
        this.selectAll = check
    }
    public assignData(data, baseData?, capitalData?, deviceBaseData?, guaranteeData?, manufacturerData?) {
        this.baseData = baseData
        this.capitalData = capitalData
        this.deviceBaseData = deviceBaseData
        this.guaranteeData = guaranteeData
        this.manufacturerData = manufacturerData
        this.listOfTableData = data
    }
    public addData(listData, baseData, capitalData, deviceBaseData, guaranteeData, manufacturerData) {
        this.listOfTableData.push(listData)
        this.baseData.push(baseData)
        this.capitalData.push(capitalData)
        this.deviceBaseData.push(deviceBaseData)
        this.guaranteeData.push(guaranteeData)
        this.manufacturerData.push(manufacturerData)
        this.nextId++
        // console.log(this.listOfTableData, "data service")
    }
    public deleteData() {
        if (!this.selectAll) {
            this.listOfTableData = this.listOfTableData.filter(item => !this.selectId.has(item.id))
        } else {
            this.listOfTableData = []
        }
    }
    // public changeSelectAll() {
    //     this.selectAll = !this.selectAll
    //     this.listOfTableData = this.listOfTableData.map(item => {
    //         item.select = this.selectAll
    //         return item
    //     })
    // }
    // getSelectDataId(id) {
    //     return this.listOfTableData.filter(item => id.has(item.id))[0].id
    // }
    editBaseData(id, data) {
        // let id = this.getSelectDataId()
        this.baseData = this.baseData.map(item => {
            if (item.id === id) {
                item = data
            }
            return item
        })
    }
    editData(data) {
        let id: number = Array.from(this.selectId)[0]
        this.listOfTableData = this.listOfTableData.map(item => {
            if (item.id === id) {
                item.model = data.model
                item.name = data.name
                item.type = data.type
                item.code = data.code
                item.fullName = data.fullName
                item.status = data.status
                item.address = data.status
            }
            return item
        })
    }
    getBaseData() {
        let id: number = Array.from(this.selectId)[0]
        console.log(id, this.selectId, "id defect service")
        return this.baseData.filter(item => item.id === id)[0]
    }
    // public changeSingleSelect(id: number) {
    //     this.listOfTableData.map(item => {
    //         if (item.id === id) {
    //             item.select = !item.select
    //         }
    //         return item
    //     })
    // }
}
