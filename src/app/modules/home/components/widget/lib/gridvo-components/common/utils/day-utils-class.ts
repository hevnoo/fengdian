type IBeginOrEnd = 0 | 1;

export class GfDayUtils {
  static currentDate = new Date();
  static currentYear = GfDayUtils.currentDate.getFullYear();
  //得到对应日期的周一
  static getFirstDayOfWeek(date) {
    var day = date.getDay() || 7;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1 - day
    );
  }
  // 根据日期获取这一周的日期
  static getWeek(date) {
    let timeArr = [];
    let one = this.getFirstDayOfWeek(date).getDate();
    let maxDay = GfDayUtils.getMaxDay(date.getFullYear(), date.getMonth());
    timeArr.push(one);
    if (date.getMonth() + 1 !== 12) {
      for (let i = 1; i < 7; i++) {
        if (one + i <= maxDay) {
          timeArr.push(one + i);
          //超过当月最大号
        } else {
          timeArr.push(one + i - maxDay);
        }
      }
      //如果一个月最大的一天存在，那么月份可能是相同，可能是加一
    } else {
      //12月很有可能是年份要加
      for (let i = 1; i < 7; i++) {
        if (one + i <= maxDay) {
          timeArr.push(one + i);
        } else {
          timeArr.push(one + i - maxDay);
        }
      }
      //如果一个月最大的一天存在，那么月份可能是相同，可能是加一
    }
    return timeArr;
  }
  //获取每个月有多少天
  static getMaxDay(year: number, month: number): number {
    //存放31天的日期
    let big = [1, 3, 5, 6, 7, 8, 10, 12];
    if (month === 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      }
      return 28;
    } else if (big.includes(month)) {
      return 31;
    } else {
      return 30;
    }
  }
  static startOrEndTime(type: IBeginOrEnd, time: number | Date) {
    const resultTimeDate = new Date(time);
    if (type === 0) {
      // 一天开始时间
      return resultTimeDate.setHours(0, 0, 0, 0);
    } else {
      //一天结束时间
      return resultTimeDate.setHours(23, 59, 59, 999);
    }
  }

  /**
   *
   * @returns 今天的时间Date
   */
  static getBeginToday() {
    return new Date(new Date(new Date().toLocaleDateString()).getTime());
  }

  /**
   *
   * @param type 参数可以有0，1。0表示开始，1表示结束。
   * @returns
   */
  static getBeginTodayAndEnd(
    type: IBeginOrEnd,
    currentDate: Date = this.currentDate
  ) {
    const resultTimer = currentDate?.getTime();
    return GfDayUtils.startOrEndTime(type, resultTimer);
  }

  /**
   *
   * @param type 参数可以有0，1。0表示开始，1表示结束。
   * @returns
   */
  static getBeginYesterdayAndEnd(type: IBeginOrEnd) {
    const resultTimer =
      GfDayUtils.getBeginToday().getTime() - 24 * 60 * 60 * 1000;
    return GfDayUtils.startOrEndTime(type, resultTimer);
  }

  /**
   *
   * @param currentDate 时间类型为Date类型
   * @param currentYear currentDate参数的年份
   * @returns 一天最早时间
   */
  static getBeginMonth(
    currentDate: Date = this.currentDate,
    currentYear = this.currentYear
  ) {
    const currentMonth = currentDate.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1);
    return GfDayUtils.startOrEndTime(0, firstDay);
  }

  /**
   *
   * @param currentDate 时间类型为Date类型
   * @param currentYear currentDate参数的年份
   * @returns 一天最晚时间
   */
  static getEndMonth(
    currentDate: Date = this.currentDate,
    currentYear = this.currentYear
  ) {
    const month = currentDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
    const endOfMonth = new Date(currentYear, month, 0);
    return GfDayUtils.startOrEndTime(1, endOfMonth);
  }

  /**
   *
   * @param currentYear 可选参数，传入当前年份
   * @returns 一天最早时间
   */
  static getBeginYear(currentYear = this.currentYear) {
    const firstDay = new Date(currentYear, 0, 1);
    return this.startOrEndTime(0, firstDay);
  }

  /**
   *
   * @param currentYear 可选参数，传入当前年份
   * @returns 一天最晚时间
   */
  static getEndYear(currentYear = this.currentYear) {
    const endOfYear = new Date(currentYear, 12, 0);
    return this.startOrEndTime(1, endOfYear);
  }

  /**
   *
   * @param num 前几天 -1前一天，-2前两天
   * @returns
   */
  static getDayWithDate(num: number) {
    const today = new Date();
    const nowTime = today.getTime();
    const ms = 24 * 3600 * 1000 * num;
    const resultTime = nowTime + ms;
    today.setTime(resultTime);
    return today;
  }

  /**
   *
   * @param num 前几天 -1前一天，-2前两天
   * @returns
   */
  static getDayWithString(num: number, str: string) {
    const today = new Date();
    const nowTime = today.getTime();
    const ms = 24 * 3600 * 1000 * num;
    const resultTime = nowTime + ms;
    today.setTime(resultTime);
    const oYear = today.getFullYear();
    let oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = "0" + oMoth;
    let oDay = today.getDate().toString();
    if (oDay.length <= 1) oDay = "0" + oDay;
    return oYear + str + oMoth + str + oDay;
  }

  /**
   * @param timeString 转换字符串格式
   * @returns Date类型
   */
  static getTimeForString(timeString: string) {
    timeString = timeString.substring(0, 19);
    timeString = timeString.replace(/-/g, "/");
    return new Date(timeString).getTime();
  }
}
