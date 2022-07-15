import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNull } from 'lodash';
import { CarVideoService } from "../../../common/services/car-video.service";
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'tb-person-add',
  templateUrl: './person-add.component.html',
  styleUrls: ['./person-add.component.scss']
})
export class PersonAddComponent implements OnInit {
  @Input() isAddPersonVisible: boolean;
  @Output() closeAddPersonEmiter = new EventEmitter();
  validateForm!: FormGroup;

  title: string = '新增人员';

  workCardList;
  constructor(private fb: FormBuilder,
    private CarVideoService: CarVideoService,
    private message: NzMessageService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      isStaff: [null],
      name: [null, [Validators.required, Validators.maxLength(5)]],
      company: [null, [Validators.required, Validators.maxLength(16)]],
      enterTime: [null],
      outTime: [null],
      workCard: [null],
      notes: [null],
    });
  }

  addModalAfterOpen() {
    const cardList = this.CarVideoService.workCardList$.getValue();
    const staffList = this.CarVideoService.staffList;
    let noUse = [];
    cardList.forEach(item => {
      const use = staffList.filter(s => s.workCard === item.cardcode);
      if(use.length <= 0) noUse.push(item);
    });
    this.workCardList = noUse;
  }

  cancelModal() {
    this.validateForm.reset();
    this.closeAddPersonEmiter.emit(false);
  }
  addStaff() {
    this.title = '添加人员';
    this.validateForm.reset();
    this.validateForm.patchValue({ id: new Date().getTime() });
  }
  modifyStaff(staffId) {
    this.title = '修改人员';
    const staffList = this.CarVideoService.staffList;
    const staff = staffList.filter(item => item.id === staffId)[0];
    this.validateForm.patchValue({ id: staff.id });
    this.validateForm.patchValue({ isStaff: staff.isStaff });
    this.validateForm.patchValue({ name: staff.name });
    this.validateForm.patchValue({ company: staff.company });
    this.validateForm.patchValue({ enterTime: staff.enterTime });
    this.validateForm.patchValue({ outTime: staff.outTime });
    this.validateForm.patchValue({ workCard: staff.workCard });
    this.validateForm.patchValue({ notes: staff.notes });
  }

  submitForm(form) {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    };
    if (!this.validateForm.valid) return;
    const addValue = {
      id: form.id,
      isStaff: form.isStaff,
      name: form.name,
      company: form.company,
      enterTime: new Date(form.enterTime).getTime(),
      outTime: new Date(form.outTime).getTime(),
      workCard: form.workCard,
      notes: form.notes
    };
    if(addValue.enterTime - addValue.outTime > 0) {
      return this.message.info('出场时间不可早于进场时间');
    }
    this.CarVideoService.addAndModifyStaff(addValue).then(res => {
      if(res) {
        this.closeAddPersonEmiter.emit(false);
        this.validateForm.reset();
      }
    });
  }
}
