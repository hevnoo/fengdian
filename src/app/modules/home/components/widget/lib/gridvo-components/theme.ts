export interface Theme {
  name: string;
  chinaName: string,
  properties: any;
}
//用echarts写的部件样式无法在css中写，要做到主题定制就通过this.themeService.getActiveTheme().properties["--blue-1"]读取到对应的属性值，--blue-1改成相对应的属性
//请使用rgb或者rgba的形式写颜色，统一这样写容易知道两个颜色是否相同  邹哥说是属性名称需要以颜色命名
const ljfengdian: Theme = {
  name: "ljfengdian",
  chinaName: "连江风电",
  properties: {
    "--header-bg-color-1": "#009cdc",
    "--header-bg-color-2": "#cde7f4",
    "--pinkRed-1": "rgba(176,58,91,1)",//粉红色
    "--white-1": "rgb(255,255,255)",//白色
    "--dark-seven": "rgba(0,0,0,0.7)",//0.7透明度黑色
    "--moreBlue": `rgba(0,156,220,0.1),rgba(0,156,220,0.2),rgba(0,156,220,0.4),rgba(0,156,220,0.6),rgba(0,156,220,0.8),rgba(0,156,220,1)`,//多种蓝色，写在玫瑰图的每层圈圈颜色
    "--blue-five": "rgba(0,156,220,0.5)",//0.5透明度蓝色
    "--pinkRed-six":"rgba(176,58,91,0.6)",//0.6透明度粉红色
    "--grey-1":"rgb(96, 98, 102)",// 灰色
    "--grey-2": "#ddd",
  }
}
const testTheme: Theme = {  //现在没有第二种风格 仅做测试展示用 后续删除
  name: "testTheme",
  chinaName: "测试风格2",
  properties: {
    "--header-bg-color-1": "rgba(0,0,0,.65)",
    "--header-bg-color-2": "rgba(255, 255, 255, 0.3)",
    "--pinkRed-1": "rgb(193, 25, 32)",//粉红色
    "--white-1": "rgb(255,255,255)",//白色
    "--dark-seven": "rgba(0,0,0,0.7)",//0.7透明度黑色
    "--moreBlue": `rgba(0,156,220,0.1),rgba(0,156,220,0.2),rgba(0,156,220,0.4),rgba(0,156,220,0.6),rgba(0,156,220,0.8),rgba(0,156,220,1)`,//多种蓝色，写在玫瑰图的每层圈圈颜色
    "--blue-five": "rgba(0,156,220,0.5)",//0.5透明度蓝色
    "--pinkRed-six":"rgba(176,58,91,0.6)",//0.6透明度粉红色
    "--grey-1":"rgb(96, 98, 102)",// 灰色
    "--grey-2": "#ddd",
  }
}
export const themeList = [ljfengdian,testTheme]
