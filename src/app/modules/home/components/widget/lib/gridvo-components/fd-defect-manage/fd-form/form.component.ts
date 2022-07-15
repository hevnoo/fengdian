import { Subscriber } from 'rxjs';
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from "@angular/core";
import {
    WidgetConfig
} from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DefectMamentService } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/services/defect-manage.service"

@Component({
    selector: "fd-form",
    templateUrl: "./form.component.html",
    styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit, OnChanges {
    public widgetConfig: WidgetConfig;
    // @Input() ctx: WidgetContext
    @Input() buttonArr = []
    validateForm
    public tableData = {}
    //name名称 errorTip用户输入错误的提示文字 isSingleRow布尔值，该输入框是否显示一行，isTextArea该输入框是否是textArea，isSelectDate是否是日期选择框，isRequire该输入框是否必填,isRadio是否是单选滑块,select如果是选择框的话填内容，如果不是选择框就不需要填写内容
    @Input() formData = []
    @Output() private formDataChanges = new EventEmitter()
    @Output() private VisibleChange = new EventEmitter()
    constructor(private fb: FormBuilder, private defect: DefectMamentService
    ) { }
    ngOnInit(): void {
        //让其为空，等到formData有数据的时候根据这个来出现
        this.validateForm = this.fb.group({});
        this.formatDataChange()
        this.validateForm.valueChanges.subscribe(data => { this.formDataChanges.emit(data) })
    }
    ngOnChanges() {
        this.formatDataChange()
    }
    public formatDataChange() {
        // console.log(this.formData, "formData form", this.validateForm)
        if (this.validateForm) {
            this.formData.map(item => {
                //因为如果是选择框的话写了require，不管有没有选择，它都是有error
                if (item.isRequire && item.select.length <= 0) {
                    this.validateForm.addControl(item.userName, new FormControl({ value: '', disabled: item.isDisable }, Validators.required))
                } else {
                    this.validateForm.addControl(item.userName, new FormControl({ value: '', disabled: item.isDisable }))
                }
            })
        }
    }
    footerRender = (): string => 'extra footer';
    submitForm(): void {
        console.log(this.validateForm, this.validateForm.valid, 'form')
        if (this.validateForm.valid) {
            this.tableData = this.validateForm.value
            this.formDataChanges.emit(true)
            // this.defect.addData({ name: this.validateForm.value.name, type: this.validateForm.value.type, code: this.validateForm.value.code, select: false })
            this.VisibleChange.emit(false)
            // console.log('submit', this.validateForm);
        }
    }
}