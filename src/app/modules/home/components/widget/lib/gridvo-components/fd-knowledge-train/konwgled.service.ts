import { Injectable } from "@angular/core";
import type {
  IBannerInfo,
  IProjectConfig,
  IMarks,
  IImagePageData,
  IImageInfo,
  IPPT,
  IAllData,
} from "@gwhome/fd-knowledge-train/type/type";
import type { EChartsOption } from "echarts";
import { environment as env } from "@env/environment";
import { ComponentEmiterType } from "@gwhome/fd-knowledge-train/type/enum";
import { HttpClient } from "@angular/common/http";
import { string } from "prop-types";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";

@Injectable({
  providedIn: "root",
})
export class KonwgledService {
  constructor(private http: HttpClient) {}

  origin = env.production ? location.origin : "http://10.0.5.92:30661";
  origin2 = `${this.origin}/group1`;
  picture1 = `${this.origin2}/assets/img/turbine-construction.png`;
  picture2 = `${this.origin2}/assets/img/turbine-check.png`;
  picture3 = `${this.origin2}/assets/img/turbine-fire.png`;
  picture4 = `${this.origin2}/assets/img/turbine-fire.png`;

  /**
   * 自动生成ppt url
   * @param count 总页数
   * @param currentPPTUrl 详细链接
   * @param suffix 后缀名 jpg，png
   * @param baseUrl 基本的代理URL
   * @returns 返回一个pptURL数组
   */
  generatePPTUrl(
    count: number,
    currentPPTUrl: string,
    suffix: "jpg" | "png",
    baseUrl = this.origin2
  ): IPPT[] {
    const url = `${baseUrl}/${currentPPTUrl}`;
    const resultArr: IPPT[] = [];
    for (let i = 1; i <= count; i++) {
      resultArr.push({
        id: i,
        url: `${url}${i}.${suffix}`,
      });
    }
    return resultArr;
  }
  /**
   * 获取轮播图信息
   * @returns ：返回轮播图信息，或者是observation对象
   */
  getBannerInfo(): IBannerInfo[] {
    return [
      {
        imgUrl: `${this.origin}/group1/assets/img/learn-train-banner/images1.jpg`,
        alt: "风电1",
      },
      {
        imgUrl: `${this.origin}/group1/assets/img/learn-train-banner/images2.jpg`,
        alt: "风电2",
      },
      {
        imgUrl: `${this.origin}/group1/assets/img/learn-train-banner/images3.jpg`,
        alt: "风电3",
      },
      {
        imgUrl: `${this.origin}/group1/assets/img/learn-train-banner/images4.jpg`,
        alt: "风电4",
      },
      {
        imgUrl: `${this.origin}/group1/assets/img/learn-train-banner/images5.jpg`,
        alt: "风电5",
      },
    ];
  }

  getBannerInfo2(ctx: WidgetContext): IBannerInfo[] {
    const { baseUrl, changeItem } = ctx.widgetConfig.settings;
    if (!changeItem) return [];
    const resultArr: IBannerInfo[] = [];
    for (let i = 0; i < changeItem.length; i++) {
      resultArr.push({
        imgUrl: `${baseUrl}${changeItem[i].imageUrl}`,
        alt: changeItem[i].alt,
      });
    }
    return resultArr;
  }

  /**
   *
   * @returns 主要信息数据和配置
   */
  getProjectConfigInfo(): IProjectConfig[] {
    const projectMarks: IMarks = {
      nzXXl: "4",
      nzXl: "8",
      nzLg: "12",
      nzMd: "16",
      nzSm: "20",
      nzXs: "24",
    };
    return [
      {
        marks: { ...projectMarks },
        name: "培训项目：",
        value: "0",
      },
      {
        name: "考试项目：",
        marks: { ...projectMarks },
        value: "0",
      },
      {
        marks: { ...projectMarks },
        name: "练习项目：",
        value: "0",
      },
      {
        name: "完成：",
        marks: { ...projectMarks },
        value: "0",
      },
      {
        name: "合格：",
        marks: { ...projectMarks },
        value: "0",
      },
    ];
  }

  /**
   *
   * @returns ECharts主要信息和配置
   */
  getProjectEChartsOption(): EChartsOption {
    const options2: EChartsOption = {
      title: {
        text: "",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c}  ({d}%)",
      },
      color: ["#bd03fc", "#54e1ea", "#ffe401", "#fb0c8e", "#009cdc"],
      legend: {
        orient: "vertical",
        top: "middle",
        bottom: 10,
        right: "2%",
        left: "70%",
        icon: "circle",
        // itemGap: 40,
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["50%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          // color: ["#bd03fc", "#54e1ea", "#ffe401"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 100, name: "自学学时" },
            { value: 100, name: "项目学时" },
            { value: 100, name: "外来档案学时" },
          ],
        },
      ],
    };
    return options2;
  }

  /**
   *
   * @returns 切换页面数据信息
   */
  getTabPageData(): IImagePageData[] {
    return [
      {
        title: "三维仿真",
        data: [
          {
            src: this.picture1,
            name: "风机建设",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/Construction_of_the_turbine.mp4`,
          },
          {
            src: this.picture2,
            name: "风机巡检培训",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/Turbine_inspection_training.mp4`,
          },
          {
            src: this.picture3,
            name: "风机消防系统",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/Turbine_fire_protection_system_training.mp4`,
          },
        ],
      },
      {
        title: "VR全景",
        data: [
          {
            src: `${this.origin2}/assets/img/vr.jpg`,
            name: "塔基柜VR全景",
            width: 200,
            height: 200,
            vrUrl: `${this.origin}/group1/assets/tour/index.html`,
          },
        ],
      },
      {
        title: "视频",
        data: [
          {
            src: this.picture3,
            name: "双馈发电机（一）",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/doubly_fed_generator_1.mp4`,
          },
          {
            src: this.picture3,
            name: "双馈发电机（二）",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/doubly_fed_generator_2.mp4`,
          },
          {
            src: this.picture3,
            name: "双馈发电机（三）",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/doubly_fed_generator_3.mp4`,
          },
          {
            src: this.picture3,
            name: "双馈发电机（四）",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/doubly_fed_generator_4.mp4`,
          },
          {
            src: this.picture3,
            name: "风速风向仪校准",
            width: 200,
            height: 200,
            videoUrl: `${this.origin}/group1/assets/video/Anemometer_calibration.mp4`,
          },
        ],
      },
      {
        title: "智慧风电知识题库",
        data: [
          {
            src: this.picture4,
            name: "风的测量及自动测风系统的主要组成部分",
            width: 200,
            height: 200,
            questionLibrary: `${this.origin}/group1/assets/exam/exam1.jpg`,
          },
          {
            src: this.picture4,
            name: "新吊装或刚更新大件的风机应重点监视哪些参数",
            width: 200,
            height: 200,
            questionLibrary: `${this.origin}/group1/assets/exam/exam2.jpg`,
          },
          {
            src: this.picture4,
            name: "风电机组双馈异步发电机并网过程",
            width: 200,
            height: 200,
            questionLibrary: `${this.origin}/group1/assets/exam/exam3.jpg`,
          },
          {
            src: this.picture4,
            name: "发电机过热的原因有哪些",
            width: 200,
            height: 200,
            questionLibrary: `${this.origin}/group1/assets/exam/exam4.jpg`,
          },
          {
            src: this.picture4,
            name: "在风电场哪些区域使用明火作业使用一级动火工作票",
            width: 200,
            height: 200,
            questionLibrary: `${this.origin}/group1/assets/exam/exam5.jpg`,
          },
        ],
      },
      {
        title: "PPT",
        data: [
          {
            src: `${this.origin2}/assets/ppt/knowledge/picture1.png`,
            name: "反违章管理培训",
            width: 200,
            height: 200,
            pptSource: this.generatePPTUrl(
              32,
              "assets/ppt/knowledge/picture",
              "png"
            ),
          },
          {
            src: `${this.origin2}/assets/ppt/Wind_turbine_operation_and_fault_analysis/1.jpg`,
            name: "风电机组运行及故障分析",
            width: 200,
            height: 200,
            pptSource: this.generatePPTUrl(
              71,
              "assets/ppt/Wind_turbine_operation_and_fault_analysis/",
              "jpg"
            ),
          },
          {
            src: `${this.origin2}/assets/ppt/Fan_mechanical_knowledge_introduction/1.jpg`,
            name: "风机机械知识介绍",
            width: 200,
            height: 200,
            pptSource: this.generatePPTUrl(
              77,
              "assets/ppt/Fan_mechanical_knowledge_introduction/",
              "jpg"
            ),
          },
          {
            src: `${this.origin2}/assets/ppt/Introduction_of_wind_turbine_generator_and_inverter_system/1.jpg`,
            name: "风力发电机组发电机及变频器系统介绍",
            width: 200,
            height: 200,
            pptSource: this.generatePPTUrl(
              26,
              "assets/ppt/Introduction_of_wind_turbine_generator_and_inverter_system/",
              "jpg"
            ),
          },
          {
            src: `${this.origin2}/assets/ppt/Introduction_of_fan_monitoring_system/1.jpg`,
            name: "风机监控系统介绍",
            width: 200,
            height: 200,
            pptSource: this.generatePPTUrl(
              65,
              "assets/ppt/Introduction_of_fan_monitoring_system/",
              "jpg"
            ),
          },
        ],
      },
    ];
  }

  /**
   *
   * @param imageInfo 传递过来的图片数据
   * @returns 返回选中的类型
   */
  judgmentEmiterType(imageInfo: IImageInfo): ComponentEmiterType {
    if (imageInfo.videoUrl) {
      return ComponentEmiterType.VIDEO;
    } else if (imageInfo.vrUrl) {
      return ComponentEmiterType.VR;
    } else if (imageInfo.questionLibrary) {
      return ComponentEmiterType.QUESTIONS;
    } else {
      return ComponentEmiterType.PPT;
    }
  }

  identifyMoreEmiterType(imageInfo: IAllData): ComponentEmiterType {
    if (imageInfo.videoSrc) {
      return ComponentEmiterType.VIDEO;
    } else if (imageInfo.examSrc) {
      return ComponentEmiterType.QUESTIONS;
    } else if (imageInfo.vrUrl) {
      return ComponentEmiterType.VR;
    } else {
      return ComponentEmiterType.PPT;
    }
  }

  getMoreData(): IAllData[] {
    return [
      {
        name: "风机建设",
        picture: this.picture1,
        videoSrc: `${this.origin2}/assets/video/Construction_of_the_turbine.mp4`,
        type: "simulation",
        childType: "technology",
      },
      {
        name: "风机巡检培训",
        picture: this.picture2,
        videoSrc: `${this.origin2}/assets/video/Turbine_inspection_training.mp4`,
        knowledge: "反”三违“培训",
        type: "simulation",
        childType: "technology",
      },
      {
        name: "风机消防系统培训",
        picture: this.picture3,
        videoSrc: `${this.origin2}/assets/video/Turbine_fire_protection_system_training.mp4`,
        type: "simulation",
        childType: "security",
      },
      {
        picture: this.picture4,
        name: "VR全景",
        cloudUrl: "",
        appName: "",
        type: "VR",
        childType: "technology",
        vrUrl: `${this.origin2}/assets/tour/index.html`,
      },
      {
        picture: `${this.origin2}/assets/ppt/knowledge/picture1.png`,
        name: "反违章管理培训",
        type: "PPT",
        childType: "security",
        pptSource: this.generatePPTUrl(
          32,
          "assets/ppt/knowledge/picture",
          "png"
        ),
      },
      {
        name: "风电机组运行及故障分析",
        picture: `${this.origin2}/assets/ppt/Wind_turbine_operation_and_fault_analysis/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          71,
          "assets/ppt/Wind_turbine_operation_and_fault_analysis/",
          "jpg"
        ),
      },
      {
        name: "风机机械知识介绍",
        picture: `${this.origin2}/assets/ppt/Fan_mechanical_knowledge_introduction/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          77,
          "assets/ppt/Fan_mechanical_knowledge_introduction/",
          "jpg"
        ),
      },
      {
        name: "风力发电机组发电机及变频器系统介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_of_wind_turbine_generator_and_inverter_system/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          26,
          "assets/ppt/Introduction_of_wind_turbine_generator_and_inverter_system/",
          "jpg"
        ),
      },
      {
        name: "风机监控系统介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_of_fan_monitoring_system/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          65,
          "assets/ppt/Introduction_of_fan_monitoring_system/",
          "jpg"
        ),
      },
      {
        name: "丹控含安全链系统介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_of_safety_chain_system_with_dan_control/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          81,
          "assets/ppt/Introduction_of_safety_chain_system_with_dan_control/",
          "jpg"
        ),
      },
      {
        name: "风机OAT交流变桨系统介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_of_fan_OAT_AC_variable_paddle_system/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          67,
          "assets/ppt/Introduction_of_fan_OAT_AC_variable_paddle_system/",
          "jpg"
        ),
      },
      {
        name: "风机电气知识系统介绍",
        picture: `${this.origin2}/assets/ppt/Fan_electrical_knowledge_system_introduction/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          48,
          "assets/ppt/Fan_electrical_knowledge_system_introduction/",
          "jpg"
        ),
      },
      {
        name: "风机偏航系统问题分析及处理",
        picture: `${this.origin2}/assets/ppt/Analysis_and_treatment_of_fan_yaw_system_problems/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          23,
          "assets/ppt/Analysis_and_treatment_of_fan_yaw_system_problems/",
          "jpg"
        ),
      },
      {
        name: "风机灭火装置、火灾防范措施介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_of_fire_prevention_measures/1.jpg`,
        type: "PPT",
        childType: "security",
        pptSource: this.generatePPTUrl(
          41,
          "assets/ppt/Introduction_of_fire_prevention_measures/",
          "jpg"
        ),
      },
      {
        name: "连江白云岭风电场继电保护配置介绍",
        picture: `${this.origin2}/assets/ppt/Introduction_to_relay_protection_configuration/1.jpg`,
        type: "PPT",
        childType: "technology",
        pptSource: this.generatePPTUrl(
          28,
          "assets/ppt/Introduction_to_relay_protection_configuration/",
          "jpg"
        ),
      },
      {
        name: "风速风向仪校准",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Anemometer_calibration.mp4`,
        type: "video",
        childType: "technology",
      },
      {
        name: "液压系统测试",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Hydraulic_system_test.mp4`,
        type: "video",
        childType: "technology",
      },
      {
        name: "偏航系统测试",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Yaw_system_test.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "安全链测试",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Safety_chain_test.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "其他顺桨测试",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Other_paddle_tests.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "上电前检查",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Check_before_power_on.mp4",
        childType: "technology`,
        type: "video",
      },
      {
        name: "变桨系统上电",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/The_paddle_changer_system_is_powered_on.mp4",
        childType: "technology`,
        type: "video",
      },
      {
        name: "桨叶角度的调零和撞块调整",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/The_blade_Angle_is_zeroed_and_the_bump_is_adjusted.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "恢复变桨通讯和旁通测试",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Resume_variable_paddle_communication_and_bypass_tests.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "齿轮箱油滤芯的更换",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Replacement_of_oil_filter_element_in_gear_box.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "主轴刹车片的更换",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/Replacement_of_spindle_brake_pad.mp4`,
        childType: "technology",
        type: "video",
      },

      {
        name: "双馈发电机（一）",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/doubly_fed_generator_1.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "双馈发电机（二）",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/doubly_fed_generator_2.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "双馈发电机（三）",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/doubly_fed_generator_3.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "双馈发电机（四）",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/doubly_fed_generator_4.mp4`,
        childType: "technology",
        type: "video",
      },
      {
        name: "防止交通事故措施",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/measures_to_prevent_traffic_accidents.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "风力发电机组设备反事故措施",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/wind_turbine_equipment_anti_accident_measures.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "基本要求",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/the_basic_requirements.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "轮毂、叶片脱落风险控制措施",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/risk_control_measures_for_wheel_hub_and_blade_shedding.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "塔筒倒塌风险控制措施",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/tower_tube_collapse_risk_control_measures.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "调试、检修、维护",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/commissioning_overhaul_and_maintenance.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "叶轮超速风险控制措施",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/impeller_overspeed_risk_control_measures.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "应急处理",
        picture: this.picture4,
        videoSrc: `${this.origin2}/assets/video/emergency_treatment.mp4`,
        childType: "security",
        type: "video",
      },
      {
        name: "风的测量及自动测风系统的主要组成部分",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam1.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "新吊装或刚更新大件的风机应重点监视哪些参数",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam2.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "风电机组双馈异步发电机并网过程",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam3.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "发电机过热的原因有哪些",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam4.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "在风电场哪些区域使用明火作业使用一级动火工作票",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam5.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "工作负责人的安全责任有哪些",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam6.jpg`,
        type: "exam",
        childType: "technology",
      },
      {
        name: "线路停、送电有何规定",
        picture: this.picture4,
        examSrc: `${this.origin2}/assets/exam/exam7.jpg`,
        type: "exam",
        childType: "technology",
      },
    ];
  }

  /**
   * @returns 试卷信息
   */
  getExamination() {
    return this.http.get(
      `/api/gv_main/examination/cloud_examination_paper?path=http://10.0.5.92:30661/group1/assets/exam/examination_paper.xlsx`
    );
  }
}
