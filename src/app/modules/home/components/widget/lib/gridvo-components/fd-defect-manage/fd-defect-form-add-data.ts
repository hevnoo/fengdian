export interface select {
    value: string;
    label: string;
}
export interface form {
    name: string,
    errorTip: string
    userName: string,
    placeholder: string,
    isSingleRow: boolean,
    isTextArea: boolean,
    isRequire: boolean,
    isRadio: boolean,
    isDisable: boolean,
    isSelectDate: boolean;
    select: select[]
}

//添加框的基础信息的表单数据
export const addBaseData: form[] = [{
    name: "对象模型",
    errorTip: "必须输入",
    userName: "model",
    placeholder: "请选择",
    isSingleRow: false,
    isTextArea: false,
    isRequire: true,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: [{
        value: "车载定位仪",
        label: "car"
    }]
},
{
    name: "类别",
    errorTip: "必须输入",
    userName: "type",
    placeholder: "请选择",
    isSingleRow: false,
    isTextArea: false,
    isRequire: true,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: [{
        value: "设备",
        label: "device"
    }, {
        value: "资产",
        label: "capital"
    }]
},
{
    name: "所属上级",
    errorTip: "",
    userName: "top",
    placeholder: "/",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: true,
    isSelectDate: false,
    select: []
},
{
    name: "代码",
    errorTip: "必须输入",
    userName: "code",
    placeholder: "代码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: true,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "名称",
    errorTip: "必须输入",
    userName: "name",
    placeholder: "名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: true,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "编码",
    errorTip: "",
    userName: "kksCode",
    placeholder: "kksCode",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "图标",
    errorTip: "",
    userName: "icon",
    placeholder: "请选择图标",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "是否为IOT设备",
    errorTip: "",
    userName: "radio",
    placeholder: "",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: true,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "备注",
    errorTip: "",
    userName: "textarea",
    placeholder: "备注",
    isSingleRow: true,
    isTextArea: true,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
]
export const EditBaseData: form[] = [{
    name: "对象模型",
    errorTip: "",
    userName: "model",
    placeholder: "",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: true,
    isSelectDate: false,
    select: []
},
{
    name: "类别",
    errorTip: "",
    userName: "type",
    placeholder: "",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: true,
    isSelectDate: false,
    select: []
},
{
    name: "所属上级",
    errorTip: "",
    userName: "top",
    placeholder: "/",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: true,
    isSelectDate: false,
    select: []
},
{
    name: "代码",
    errorTip: "",
    userName: "code",
    placeholder: "",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: true,
    isSelectDate: false,
    select: []
},
{
    name: "名称",
    errorTip: "必须输入",
    userName: "name",
    placeholder: "名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: true,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "编码",
    errorTip: "",
    userName: "kksCode",
    placeholder: "kksCode",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "图标",
    errorTip: "",
    userName: "icon",
    placeholder: "请选择图标",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "是否为IOT设备",
    errorTip: "",
    userName: "radio",
    placeholder: "",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: true,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "备注",
    errorTip: "",
    userName: "textarea",
    placeholder: "备注",
    isSingleRow: true,
    isTextArea: true,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
]
//添加框的资产信息的表单数据
export const addCapitalData: form[] = [{
    name: "物资模型",
    errorTip: "",
    userName: "capitalName",
    placeholder: "物资名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "物资编码",
    errorTip: "",
    userName: "thingCode",
    placeholder: "物资编码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "固定资产编码",
    errorTip: "",
    userName: "bottomCode",
    placeholder: "固定资产编码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "物资二维码",
    errorTip: "",
    userName: "materialQRCode",
    placeholder: "物资二维码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "入库日期",
    errorTip: "",
    userName: "date",
    placeholder: "入库日期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
},
{
    name: "运行状态",
    errorTip: "",
    userName: "runningState",
    placeholder: "运行状态",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "投运日期",
    errorTip: "",
    userName: "operationDate",
    placeholder: "选择最早投运日期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
},
{
    name: "报废日期",
    errorTip: "",
    userName: "scrapDate",
    placeholder: "报废日期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
},
{
    name: "资产性质",
    errorTip: "",
    userName: "natureOfAssets",
    placeholder: "资产所属单位",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
},
]
//添加框的设备基础信息的表单信息
export const addDeviceBaseData: form[] = [{
    name: "上级设备编码",
    errorTip: "",
    userName: "superiorEquipmentCode",
    placeholder: "上级设备编码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "上级设备名称",
    errorTip: "",
    userName: "superiorEquipmentName",
    placeholder: "上级设备名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "设备编码",
    errorTip: "",
    userName: "deviceCode",
    placeholder: "设备编码",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "设备名称",
    errorTip: "",
    userName: "deviceName",
    placeholder: "设备名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "所属专业",
    errorTip: "",
    userName: "major",
    placeholder: "所属专业",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "主辅设备",
    errorTip: "",
    userName: "mainAndAuxiliaryEquipment",
    placeholder: "主辅设备",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "设备评级",
    errorTip: "",
    userName: "equipmentRating",
    placeholder: "设备评级",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "安装位置",
    errorTip: "",
    userName: "installationPosition",
    placeholder: "安装位置",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "设备号",
    errorTip: "",
    userName: "deviceId",
    placeholder: "设备号",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "规格型号",
    errorTip: "",
    userName: "specificationAndModel",
    placeholder: "规格型号",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
}
]
//添加框的保修的表单数据
export const addGuaranteeData: form[] = [{
    name: "保修单位名称",
    errorTip: "",
    userName: "nameOfWarrantyUnit",
    placeholder: "保修单位名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "大修周期",
    errorTip: "",
    userName: "overhaulCycle",
    placeholder: "大修周期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "小修周期",
    errorTip: "",
    userName: "minorRepairCycle",
    placeholder: "小修周期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "联系方式",
    errorTip: "",
    userName: "telphone",
    placeholder: "联系方式",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "保修合同号",
    errorTip: "",
    userName: "warrantyContractNo",
    placeholder: "保修合同号",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "保修开始时间",
    errorTip: "",
    userName: "warrantyStartTime",
    placeholder: "保修开始时间",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
},
{
    name: "保修结束时间",
    errorTip: "",
    userName: "warrantyEndTime",
    placeholder: "保修结束时间",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
}
]
//添加框的制造商的表单信息
export const addManufacturerData: form[] = [{
    name: "厂商名称",
    errorTip: "",
    userName: "manufacturerName",
    placeholder: "厂商名称",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "厂商地址",
    errorTip: "",
    userName: "manufacturerAddress",
    placeholder: "厂商地址",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "出厂编号",
    errorTip: "",
    userName: "factoryNumber",
    placeholder: "出厂编号",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "联系方式",
    errorTip: "",
    userName: "telphone2",
    placeholder: "联系方式",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "购置合同号",
    errorTip: "",
    userName: "purchaseContractNo",
    placeholder: "购置合同号",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "价格",
    errorTip: "",
    userName: "price",
    placeholder: "价格",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: false,
    select: []
},
{
    name: "出厂日期",
    errorTip: "",
    userName: "dateOfProduction",
    placeholder: "出厂日期",
    isSingleRow: false,
    isTextArea: false,
    isRequire: false,
    isRadio: false,
    isDisable: false,
    isSelectDate: true,
    select: []
}
]