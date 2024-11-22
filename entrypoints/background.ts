import {
  getWeekDay,
  getCurrentYear,
  getCurrentMonth,
  getCurrentDay,
} from "./components/calendar/utils";

const CY = getCurrentYear();
const CM = getCurrentMonth();
const CD = getCurrentDay();
const getTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return [hours, minutes];
};

export default defineBackground(() => {
  const weekNum = getWeekDay(CY, CM, CD);
  console.log("Hello background!", { id: browser.runtime.id });
  chrome.notifications.create("notify1", {
    type: "basic",
    title: "hello",
    message: "欢迎使用涟漪日历",
    iconUrl: "icon/32.png",
  });
  const sendNotification = () => {
    chrome.notifications.create("notify1", {
      type: "basic",
      title: "不要坐太久了哦",
      message: "休息一下吧，休息一下吧，休息一下吧",
      iconUrl: "icon/32.png",
    });
  };
  // 该函数 doInterval 的功能是每隔10分钟检查当前时间是否在指定小时内（10, 11, 14, 15, 16, 17, 20），
  // 如果是，则发送通知并重新设置一个1小时后的定时器继续执行此检查。
  const doInterval = () => {
    let _id = setInterval(() => {
      const [hours, minutes] = getTime();
      console.log("hours", hours);
      const ary = [10, 11, 14, 15, 16, 17, 20, 21];
      const ary2 = [6, 0];
      // && !ary2.includes(weekNum)
      if (ary.includes(hours)) {
        sendNotification();
        clearInterval(_id);
        console.log("sendNotification");
        setTimeout(() => {
          doInterval();
        }, 1000 * 60 * 20);
      }
    }, 1000 * 60 * 20);
  };

  doInterval();
});
