/**
 * @description: // 格式化时间
 * @param {*}stamp: 时间戳
 * @param {*}format: 转换的时间格式
 * @return {*}
 */
export function dateFormat(stamp, format) {
  let o = {
    "M+": stamp.getMonth() + 1, //月份
    "d+": stamp.getDate(), //日
    "h+": stamp.getHours(), //小时
    "m+": stamp.getMinutes(), //分
    "s+": stamp.getSeconds(), //秒
    "q+": Math.floor((stamp.getMonth() + 3) / 3), //季度
    S: stamp.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (stamp.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
}
