import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeviceService } from "@app/core/public-api";
import { PageLink } from "@app/shared/public-api";

@Component({
    selector: 'tb-select-device',
    templateUrl: './select-device.component.html',
    styleUrls: ['./select-device.component.scss']
})
export class SelectDeviceComponent implements OnInit {
    @Input() title: string  // label文字
    @Input() isDisable: boolean  // 是否用
    @Input() isRequired: boolean  // 是否必填
    @Input() devDefault: string
    @Output() deviceData = new EventEmitter()

    pageLink = new PageLink(1000, 0);
    hasNext = true
    public isLoading = false
    public deviceOption = []
    deviceDataForm: FormGroup = this.fb.group({})

    constructor(private deviceService: DeviceService,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder
    ) { }


    ngOnInit(): void {

        this.onDeviceSearch('')
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log(this.devDefault, 'test设备', changes)
        if (this.isRequired) {
            if (!this.deviceDataForm.get("devSelect")) {
                this.deviceDataForm.addControl("devSelect", this.fb.control(this.devDefault || null, [Validators.required]))
            } else {
                this.deviceDataForm.patchValue({
                    devSelect: this.devDefault
                })
            }
        } else {
            this.deviceDataForm = this.fb.group({
                devSelect: [this.devDefault || null]
            })
        }
        this.deviceDataForm.get("devSelect").valueChanges.subscribe((data) => {
            this.deviceData.emit(data)
        })
    }

    // 重置deveceDataForm
    resetDeveceDataForm() {
        this.deviceDataForm.reset()
    }

    // 获取设备数据
    onDeviceSearch(value) {
        this.isLoading = true
        this.pageLink.textSearch = value
        this.pageLink.page = 0
        this.deviceService.getTenantDeviceInfos(this.pageLink, "").subscribe(data => {
            this.hasNext = data.hasNext
            if (data.hasNext) {
                this.pageLink.page += 1
            }
            if (data.data) {
                this.deviceOption = []
            }
            this.isLoading = false
            data.data.forEach(item => {
                this.deviceOption.push({
                    label: item.label,
                    value: item.id.id
                })
            });
            this.cd.detectChanges()
        })

    }

}