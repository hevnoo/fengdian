import { Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { DateTimeComponent } from './datetime-copmpone/datetime.component';

import { InputComponent } from './input-component/input.component';
import { NumberComponent } from './number-component/number.component';
import { SelectComponent } from './select-component/select.component';
import { SwitchComponent } from './switch-component/switch.component';
@Component({
  selector: 'tb-device-other-information',
  templateUrl: './device-other-information.component.html',
  styleUrls: ['./device-other-information.component.scss']
})
export class DeviceOtherInformationComponent implements OnInit {
  @Input() ctx: WidgetContext;

  @ViewChild ('dynamicForm', {read: ViewContainerRef}) dynamicForm: ViewContainerRef

  public dynamicFormData = [
    {
      content: 'qqq',
      type: 'input',
      label: 'aaa'
    },
    {
      content: '',
      type: 'number',
      label: 'ddd'
    },
    {
      content: '',
      type: 'switch',
      label: 'eee'
    },
    {
      content: '',
      type: 'dynamic-select',
      label: 'fff'
    },
    {
      content: '',
      type: 'datetime',
      label: 'fff'
    }
  ]

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.createDynamicForm() 
  }

  createDynamicForm() {
    
   
      this.dynamicFormData.forEach(item => {
        const createForm = this.componentFactoryResolver.resolveComponentFactory(this.getFormComponent(item.type))
        const creatComponentRef = this.dynamicForm.createComponent(createForm)
        creatComponentRef.instance.items = item
      })
    
  }

  getFormComponent(type) {
    switch (type) {
      case 'input':
        return InputComponent;
      case 'number':
        return NumberComponent;
      case 'switch':
        return SwitchComponent;
      case 'dynamic-select':
        return SelectComponent;
      case 'datetime':
        return DateTimeComponent
      default:
        return InputComponent;
    }
  }

  // 用于处理循环的数据长度
  initFormLength() {
    let num =  Math.ceil(this.dynamicFormData.length / 2)
    console.log('www', this.dynamicFormData.slice(0, num));
    
    return this.dynamicFormData.slice(0, num)
  }

}
