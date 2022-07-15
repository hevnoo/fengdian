import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DrawPolygon } from "./monomer.module";
const Cesium = (window as any).Cesium;
@Component({
  selector: 'tb-monomer',
  templateUrl: './monomer.component.html',
  styleUrls: ['./monomer.component.scss']
})
export class MonomerComponent implements OnInit {
  @Input() cesiumInstance: any;

  entity = [];
  entityListString: string[] = [];
  entityName: string = '01NB-01';
  entityColor: string = 'rgba(221,172,65,0.5)';

  isEntityInfo: boolean = false;
  clickEntityName: string;
  modifyName: string;
  modifyColor: string;
  positionsStr: any;
  constructor(private message: NzMessageService,) { }

  ngOnInit(): void {
  }

  createBox() {
    if (this.checkName()) {
      this.message.warning('请修改名称！');
      return;
    }
    if (typeof (this.entityName) === 'undefined' || 
      typeof (this.entityColor) === 'undefined') {
      this.message.info('请输入名称、高度、颜色后开始绘制！');
      return;
    }
    const gon = new DrawPolygon({
      viewer: this.cesiumInstance.viewer,
      id: this.entityName,
      entityColor: this.entityColor,
      cb: () => {
        this.entityListString.length = 0;
        this.entityListString = this.entity.map(item => item.id);
      }
    });
    gon.startCreate();
    this.entity.push(gon);
    console.log('gon :>> ', gon);
  }
  private checkName() {
    if (this.entity.length <= 0) return false;
    return this.entity.some(item => item.id === this.entityName);
  }

  handleEntityList(name) {
    this.clickEntityName = name;
    this.modifyName = this.clickEntityName;
    const entity = this.entity.filter(item => item.id === this.clickEntityName)[0];
    const cloneP = entity.positions.map(item => {
      const c = item.clone();
      return c.toString();
    });
    this.positionsStr = `[${cloneP.toString().replace(/\(/g, '[').replace(/\)/g, ']')}]`;
    this.isEntityInfo = true;
  }

  handleCancel() {
    this.isEntityInfo = false;
  }
  handleDelete() {
    let ids: number;
    const entity = this.entity.filter((item, index) => {
      if (item.id === this.clickEntityName) {
        ids = index;
        return item.id === this.clickEntityName;
      }
    });
    if(entity.length <= 0) return;
    entity[0].destroy();
    this.entity.splice(ids, 1);
    this.isEntityInfo = false;
    this.message.success(`成功删除 ${this.clickEntityName}`);
    if(this.entity.length <= 0) {
      this.entityListString.length = 0;
    } else {
      this.entityListString.length = 0;
      this.entityListString = this.entity.map(item => item.id);
    }
  }
  positionsCopied() {
    this.isEntityInfo = false;
    this.message.create('success', `复制点集合成功！`);
  }
  handleOk() {
    if (typeof (this.modifyName) === 'undefined' ||
      typeof (this.modifyColor) === 'undefined') {
        this.message.info('名称或颜色不能为空！');
    };
    const entity = this.entity.filter(item => item.id === this.clickEntityName);
    if(entity.length <= 0) return;
    entity[0].id = this.modifyName;
    entity[0].polygon.polygon.material = Cesium.Color.fromCssColorString(this.modifyColor);
    this.entityListString = this.entity.map(item => item.id);
    this.isEntityInfo = false;
    this.message.success(`修改成功,新名称为 ${this.modifyName}`);
  }
}
