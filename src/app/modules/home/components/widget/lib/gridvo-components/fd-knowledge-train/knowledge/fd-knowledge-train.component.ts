import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { KonwgledService } from "@app/modules/home/components/widget/lib/gridvo-components/fd-knowledge-train/konwgled.service";
import type {
  IImagePageData,
  IImageEmiter,
  IDisplayType,
  IModalConfig,
  IMoreImageEmiterType,
} from "@gwhome/fd-knowledge-train/type/type";
import { ComponentEmiterType } from "@gwhome/fd-knowledge-train/type/enum";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "tb-fd-knowledge-train",
  templateUrl: "./fd-knowledge-train.component.html",
  styleUrls: ["./fd-knowledge-train.component.scss"],
})
export class FdKnowledgeTrainComponent implements OnInit {
  rotate: number = 0;
  typePickList = ["视频", "PPT", "VR", "三维仿真", "题库"];
  tags = [];
  tagType: string = "";
  constructor(private kscs: KonwgledService, private sanitizer: DomSanitizer) {}
  @Input()
  imageData: IImagePageData[] = this.kscs.getTabPageData();

  displayConfig = {
    content: false,
    modal: true,
    full: true,
    vr: true,
    questions: true,
    ppt: true,
  };

  modalData: IModalConfig = {
    title: "风机消防系统培训",
    videoUrl: "",
    vrUrl: "",
    questionLibrary: "",
    ppt: [],
  };

  fullData = {
    allData: this.kscs.getMoreData(),
    technologyData: [],
    safetyData: [],
    allTitle: `全部 （${this.kscs.getMoreData().length}）`,
    technologyTitle: `风机技术培训 （${
      this.kscs.getMoreData().filter(function (item) {
        return item.childType == "technology";
      }).length
    }）`,
    safetyTitle: `风机安全培训 （${
      this.kscs.getMoreData().filter(function (item) {
        return item.childType == "security";
      }).length
    }）`,
  };
  fullDataCopy = this.fullData;

  @ViewChild("video") video: ElementRef<HTMLVideoElement> | undefined;
  ngOnInit(): void {}

  /**
   * 监听子组件Image传递过来的数值，做出显示和隐藏
   * @param event
   */
  switchImageType(event: IImageEmiter) {
    $("#scrollTag").parent().scrollTop(0);
    const { content } = this.displayConfig;
    this.displayConfig.content = !content;
    switch (event.type) {
      case ComponentEmiterType.FULL:
        this.displayConfig.full = event.value.flag;
        break;
      case ComponentEmiterType.PPT:
        this.displayConfig.ppt = event.value.flag;
        this.modalData.ppt = event.value.content.pptSource;
        break;
      case ComponentEmiterType.VIDEO:
        this.displayConfig.modal = event.value.flag;
        this.modalData.title = event.value.content.name;
        this.modalData.videoUrl = event.value.content.videoUrl;
        break;
      case ComponentEmiterType.VR:
        this.displayConfig.vr = event.value.flag;
        //转换为安全路径
        this.modalData.vrUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          event.value.content.vrUrl
        );
        break;
      case ComponentEmiterType.QUESTIONS:
        this.displayConfig.questions = event.value.flag;
        this.modalData.questionLibrary = event.value.content.questionLibrary;
        break;
      default:
        const checkType: never = event.type;
    }
  }

  /**
   * 返回按钮监听事件，
   * @param type 全部界面返回和单个返回
   */
  controlDisplay(type: IDisplayType) {
    const { modal, full, content, vr, questions, ppt } = this.displayConfig;
    this.displayConfig.content = !content;
    switch (type) {
      case "full":
        this.displayConfig.full = !full;
        break;
      case "modal":
        this.displayConfig.modal = !modal;
        // 暂停播放
        this.video.nativeElement.pause();
        break;
      case "vr":
        this.displayConfig.vr = !vr;
        break;
      case "questions":
        this.displayConfig.questions = !questions;
        break;
      case "ppt":
        this.displayConfig.ppt = !ppt;
        break;
      default:
        const checkType: never = type;
    }
  }

  moreSwitchType(event: IMoreImageEmiterType) {
    this.displayConfig.full = true;
    switch (event.type) {
      case ComponentEmiterType.VIDEO:
        this.displayConfig.modal = event.value.flag;
        this.modalData.title = event.value.content.name;
        this.modalData.videoUrl = event.value.content.videoSrc;
        break;
      case ComponentEmiterType.QUESTIONS:
        this.displayConfig.questions = event.value.flag;
        this.modalData.questionLibrary = event.value.content.examSrc;
        break;
      case ComponentEmiterType.PPT:
        this.displayConfig.ppt = event.value.flag;
        this.modalData.ppt = event.value.content.pptSource;
        break;
      case ComponentEmiterType.VR:
        this.displayConfig.vr = event.value.flag;
        this.modalData.vrUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          event.value.content.vrUrl
        );
        break;
    }
  }
  // 关闭tag标签
  onClose(i): void {
    this.fullData = this.fullDataCopy;
    this.tags[0] = "全部";
    console.log("tags", this.tags);
  }
  // 类型选择开关
  selectSwitch() {
    if (this.rotate == 0) {
      this.rotate = 180;
    } else {
      this.rotate = 0;
    }
  }
  // 类型点击事件
  selectType(i) {
    this.tagType = this.typePickList[i];
    this.tags[0] = this.tagType;
    console.log(this.tags);
    switch (this.tagType) {
      case "视频":
        this.typeSelection("video");
        break;
      case "PPT":
        this.typeSelection("PPT");
        break;
      case "VR":
        this.typeSelection("VR");
        break;
      case "三维仿真":
        this.typeSelection("simulation");
        break;
      case "题库":
        this.typeSelection("exam");
        break;
      default:
        break;
    }
  }
  // 类型赛选方法
  typeSelection(type) {
    this.fullData = this.fullDataCopy;
    this.fullData = {
      allData: this.fullData.allData.filter(function (item) {
        return item.type == type;
      }),
      technologyData: [],
      safetyData: [],
      allTitle: "",
      technologyTitle: "",
      safetyTitle: "",
    };

    let that = this;
    //技术培训、安全培训个数赛选
    function filterTraining() {
      that.fullData.allTitle = `全部 （${that.fullData.allData.length}）`;
      that.fullData.technologyTitle = `风机技术培训 （${
        that.fullData.allData.filter(function (item) {
          return item.childType == "technology";
        }).length
      }）`;
      that.fullData.safetyTitle = `风机安全培训 （${
        that.fullData.allData.filter(function (item) {
          return item.childType == "security";
        }).length
      }）`;
    }
    filterTraining();
    this.TechnicalTraining();
    this.SafetyTraining();
  }
  // 风机技术培训点击事件
  TechnicalTraining() {
    this.fullData.technologyData = this.fullData.allData.filter(function (
      item
    ) {
      return item.childType == "technology";
    });
  }
  // 风机安全培训点击事件
  SafetyTraining() {
    this.fullData.safetyData = this.fullData.allData.filter(function (item) {
      return item.childType == "security";
    });
  }
}
