// 函数类型
interface IAnyFn {
  (...args: any[]): any;
}
/**
 * @param this 动态绑定的this
 * @param fn 转换的函数
 * @param delary 延迟时间
 * @param immedia 第一次是否要立即执行
 * @returns 返回防抖函数
 * conversionDebounce
 */
export function debounce(
  this: any,
  fn: IAnyFn,
  delary: number,
  immedia: boolean
) {
  let timer: ReturnType<typeof setTimeout> | null;
  let invoke = true;
  function _debounce(this: any, ...args: any[]) {
    if (immedia && invoke) {
      fn.apply(this, args);
      invoke = false;
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        invoke = true;
        fn.apply(this, args);
      }, delary);
    }
  }
  return _debounce;
}
