import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {
    WidgetConfig
} from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { addBaseData, addCapitalData, addDeviceBaseData, addGuaranteeData, addManufacturerData, form } from './fd-defect-form-add-data'
import { FormComponent } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/fd-form/form.component";
import { DefectMamentService } from "./services/defect-manage.service";
@Component({
    selector: "fd-defect-mange",
    templateUrl: "./fd-defect-manage.component.html",
    styleUrls: ["./fd-defect-manage.component.scss"],
})
export class FdDefectMangeComponent implements OnInit, OnChanges {
    public widgetConfig: WidgetConfig
    @Input() ctx: WidgetContext
    @Input() clickButton: string
    @ViewChild('fdForm') fdForm: FormComponent
    isVisibleAdd = false
    isVisibleEdit = false
    // headArr = ["基础信息", "资产信息", "设备基本信息", "保修、大小修信息", "制造商信息"]
    buttonArr = [{ value: "提交", type: "primary" }]
    addBaseDataOfForm
    addCapitalDataOfForm
    addDeviceBaseDataOfForm
    addGuaranteeDataOfForm
    addManufacturerDataOfForm

    dataValid = [false, false, false, false, false]
    //headArr一个元素的时候居中，多个元素的时候往左移动,
    headArr = [{ value: "基础信息", data: addBaseData }]
    headArrEdit = []
    constructor(private defect: DefectMamentService) { }
    ngOnInit(): void {
        this.ctx.$scope.defectMange = this
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.clickButton && changes.clickButton.currentValue) {
            //如果按钮改变，并且按钮是添加，显示添加的框框
            if (changes.clickButton.currentValue.split(/[0-9]+/)[1] === "添加") {
                this.showModal()
            } else if (changes.clickButton.currentValue.split(/[0-9]+/)[1] === "修改") {
                this.showEditModal()
            }
        }
    }
    //表单的数据传过来
    handleFormChange(data) {
        console.log(data, "defect mange")
        if (data.name) {
            this.addBaseDataOfForm = data
            this.addBaseDataOfForm.id = this.defect.nextId
        } else if (data.capitalName) {
            this.addCapitalDataOfForm = data
            this.addCapitalDataOfForm.id = this.defect.nextId
        } else if (data.superiorEquipmentCode) {
            this.addDeviceBaseDataOfForm = data
            this.addDeviceBaseDataOfForm.id = this.defect.nextId
        } else if (data.nameOfWarrantyUnit) {
            this.addGuaranteeDataOfForm = data
            this.addGuaranteeDataOfForm.id = this.defect.nextId
        } else if (data.manufacturerName) {
            this.addManufacturerDataOfForm = data
            this.addManufacturerDataOfForm.id = this.defect.nextId
        } else if (data === true && this.clickButton.split(/[0-9]+/)[1] === "添加") {
            //用户点了提交之后执行这个
            //boo是判断用户是否填了必填项
            let boo = true
            if (this.addBaseDataOfForm) {
                addBaseData.map(item => {
                    if (item.isRequire) {
                        // console.log(item, this.addBaseDataOfForm[item.userName], "item defect mange")
                        if (this.addBaseDataOfForm[item.userName] === "" && !this.addBaseDataOfForm[item.userName]) {
                            boo = false
                        }
                    }
                })
            } else {
                boo = false
            }
            // console.log(boo, this.addBaseDataOfForm, "defect manage")
            if (boo) {
                let nextId = this.defect.getNextId()
                this.defect.addData({
                    name: this.addBaseDataOfForm.name,
                    type: this.addBaseDataOfForm.type,
                    code: this.addBaseDataOfForm.code,
                    fullName: "", status: "", address: "",
                    select: false,
                    id: nextId
                }, this.addBaseDataOfForm || { id: nextId }, this.addCapitalDataOfForm || { id: nextId }, this.addDeviceBaseDataOfForm ||
                { id: nextId }, this.addGuaranteeDataOfForm || { id: nextId }, this.addManufacturerDataOfForm || { id: nextId })
                this.isVisibleAdd = false
                this.headArr = [{ value: "基础信息", data: addBaseData }]
                this.addBaseDataOfForm = {}
            }
        } else if (data === true && this.clickButton.split(/[0-9]+/)[1] === "修改") {
            let boo = true
            let baseData = this.handleBaseData()
            console.log(baseData, "baseData,defect manage", this.addBaseDataOfForm)
            if (this.addBaseDataOfForm) {
                baseData.map(item => {
                    if (item.isRequire) {
                        // console.log(item, this.addBaseDataOfForm[item.userName], "item defect mange")
                        if (this.addBaseDataOfForm[item.userName] === "" && !this.addBaseDataOfForm[item.userName]) {
                            boo = false
                        }
                    }
                })
            } else {
                boo = false
            }
            console.log(boo, "boo manage")
            // console.log(boo, this.addBaseDataOfForm, "defect manage")
            if (boo) {
                this.defect.editData({
                    name: this.addBaseDataOfForm.name,
                    type: this.addBaseDataOfForm.type,
                    code: this.addBaseDataOfForm.code,
                    fullName: "", status: "", address: "",
                })
                this.isVisibleEdit = false
                this.headArr = [{ value: "基础信息", data: baseData }]
                this.addBaseDataOfForm = {}
            }
        }
    }
    checkType(any) {
        return Object.prototype.toString.call(any).slice(8, -1)
    }
    //对象深拷贝
    clone(any) {
        if (this.checkType(any) === 'Object') { // 拷贝对象
            let o = {};
            for (let key in any) {
                o[key] = this.clone(any[key])
            }
            return o;
        } else if (this.checkType(any) === 'Array') { // 拷贝数组
            var arr = []
            for (let i = 0, leng = any.length; i < leng; i++) {
                arr[i] = this.clone(any[i])
            }
            return arr;
        }
        return any;
    }
    //显示添加框
    showModal() {
        if (this.fdForm) {
            this.fdForm.formatDataChange()
        }
        this.headArr = [{ value: "基础信息", data: addBaseData }]
        this.isVisibleAdd = true;
    }
    //显示修改框
    showEditModal() {
        if (this.fdForm) {
            this.fdForm.formatDataChange()
        }
        // this.handleBaseData()
        this.headArrEdit = [{ value: "基础信息", data: this.handleBaseData() }]
        console.log(this.handleBaseData(), this.headArrEdit, "arrEdit defect manage", this.defect.getBaseData(), this.defect.getData(), this.defect.baseData)
        this.isVisibleEdit = true;
    }
    //处理基础信息，在添加框和修改框的基础信息是不一样的，深拷贝一下再进行修改，placeholder需要读取,这个处理后的数据是显示在修改的地方
    handleBaseData(): form[] {
        let baseData = this.clone(addBaseData)
        baseData = baseData.map((item, index) => {
            if (index >= 0 && index < 4) {
                item.isRequire = false
                item.isDisable = true
            }
            item.placeholder = this.defect.getBaseData()[item.userName] || item.placeholder
            return item
        })
        return baseData
    }
    handleCancel() {
        this.isVisibleAdd = false;
        this.headArr = [{ value: "基础信息", data: addBaseData }]
        this.addBaseDataOfForm = {}
    }
    handleEditOk() {
        // if (this.dataValid.every(item => item === true))
        //     this.isVisibleAdd = false;
    }
    handleEditCancel() {
        this.isVisibleEdit = false;
        this.headArrEdit = [{ value: "基础信息", data: this.handleBaseData() }]
        this.addBaseDataOfForm = {}
    }
    handleOk() {
        // if (this.dataValid.every(item => item === true))
        //     this.isVisibleAdd = false;
    }
    dataUpdated() {
        console.log(this.defect, "defect")
        //模型有值之后，数据改变
        if (this.addBaseDataOfForm && this.addBaseDataOfForm.model.length > 1 && this.headArr.length === 1) {
            this.headArr.push({ value: "资产信息", data: addCapitalData })
            this.headArr.push({ value: "设备基本信息", data: addDeviceBaseData })
            this.headArr.push({ value: "保修、大小修信息", data: addGuaranteeData })
            this.headArr.push({ value: "制造商信息", data: addManufacturerData })
        } else if (this.headArrEdit.length === 1 && this.clickButton.split(/[0-9]+/)[1] === "修改" && this.isVisibleEdit) {
            this.headArrEdit.push({ value: "资产信息", data: addCapitalData })
            this.headArrEdit.push({ value: "设备基本信息", data: addDeviceBaseData })
            this.headArrEdit.push({ value: "保修、大小修信息", data: addGuaranteeData })
            this.headArrEdit.push({ value: "制造商信息", data: addManufacturerData })
        }//是修改页面的时候，头信息改变，现在先这样写，后面肯定要修改
        this.ctx.detectChanges()
    }
}
