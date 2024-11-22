import { useState, useMemo, useEffect } from "react";
import { Dropdown, MenuProps } from "antd";
import {
  getCurrentDay,
  getCurrentMonth,
  getCurrentYear,
  getMonthDays,
  getWeekDay,
  formatNum,
  sloarToLunar,
  getSolarFestival,
  getLunarFestival,
} from "./utils";

import type { CalendarItemType } from "./interface";
import "./index.scss";

const CY = getCurrentYear();
const CM = getCurrentMonth();
const CD = getCurrentDay();

const weeks = ["一", "二", "三", "四", "五", "六", "日"];

export default () => {
  const [calendarData, setCalendarData] = useState<CalendarItemType[]>([]);
  const [currentYear, setCurrentYear] = useState(CY);
  const [currentMonth, setCurrentMonth] = useState(CM);
  const [currentDay, setcurrentDay] = useState(CD);

  // 操作区，改变年月
  const changeCalendarDate = (type: string) => {
    if (type === "next-month") {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (type === "prev-month") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (type === "prev-year") {
      setCurrentYear(currentYear - 1);
    } else if (type === "next-year") {
      setCurrentYear(currentYear + 1);
    } else if (type === "today") {
      setCurrentMonth(CM);
      setCurrentYear(CY);
    }
  };
  // 获取日历数据
  const getCalendarData = (y: number, m: number) => {
    const prevMonthDays = getMonthDays(y, m - 1);
    const currentMonthDays = getMonthDays(y, m);

    const prevShowDays = getPrevDaysInCurrentMonth(y, m);
    const nextShowDays = getNextDaysInCurrentMonth(y, m);
    // console.log(y, m, currentMonthDays)

    const currentMonthValue: CalendarItemType[] = [];
    const prevMonthValue: CalendarItemType[] = [];
    const nextMonthValue: CalendarItemType[] = [];
    for (let i = prevShowDays; i > 0; i--) {
      prevMonthValue.push({
        year: currentYear,
        month: currentMonth - 1,
        day: prevMonthDays - i + 1,
        isCurrentMonth: false,
        isToday: false,
        isTomorrow: false,
        isYesterday: false,
        currentDate: `${currentYear}-${currentMonth - 1}-${
          prevMonthDays - i + 1
        }`,
        lunarDate: sloarToLunar(
          currentYear,
          currentMonth - 1,
          prevMonthDays - i + 1
        ),
      });
    }

    for (let i = 0; i < currentMonthDays; i++) {
      currentMonthValue.push({
        year: currentYear,
        month: currentMonth,
        day: i + 1,
        isCurrentMonth: true,
        isToday: i + 1 === currentDay && m === CM && y === CY,
        isTomorrow: i + 1 === currentDay + 1,
        isYesterday: i + 1 === currentDay - 1,
        currentDate: `${currentYear}-${currentMonth}-${i + 1}`,
        lunarDate: sloarToLunar(currentYear, currentMonth, i + 1),
        solarFestival: getSolarFestival(currentYear, currentMonth, i + 1),
        lunarFestival: getLunarFestival(currentYear, currentMonth, i + 1),
      });
    }

    for (let i = 0; i < nextShowDays; i++) {
      nextMonthValue.push({
        year: currentYear,
        month: currentMonth + 1,
        day: i + 1,
        isCurrentMonth: false,
        isToday: false,
        isTomorrow: false,
        isYesterday: false,
        currentDate: `${currentYear}-${currentMonth + 1}-${i + 1}`,
        lunarDate: sloarToLunar(currentYear, currentMonth + 1, i + 1),
      });
    }
    const data = [...prevMonthValue, ...currentMonthValue, ...nextMonthValue];
    // console.log(data, "data");
    setCalendarData(data);
  };

  // 获取在当面面板展示的上个月的天数
  const getPrevDaysInCurrentMonth = (y: number, m: number) => {
    const currentMonthFisrtDayInWeek = getWeekDay(y, m, 1);
    const showPrevDaysInCurrentMonth =
      currentMonthFisrtDayInWeek === 0 ? 7 - 1 : currentMonthFisrtDayInWeek - 1;
    return showPrevDaysInCurrentMonth;
  };
  // 获取在当面面板展示的下个月的天数
  const getNextDaysInCurrentMonth = (y: number, m: number) => {
    const currentMonthDays = getMonthDays(y, m);
    const currentMonthLastDayInWeek = getWeekDay(y, m, currentMonthDays);
    const showNextDaysInCurrentMonth =
      currentMonthLastDayInWeek === 0 ? 0 : 7 - currentMonthLastDayInWeek;
    return showNextDaysInCurrentMonth;
  };
  // item类名计算
  const itemClassNames = (item: CalendarItemType) => {
    let arr = ["ik-calendar-content__days-item"];
    if (item.isToday) {
      arr.push("ik-calendar-content__days-today");
    }
    if (!item.isCurrentMonth) {
      arr.push("ik-calendar__days-prev-month");
    }
    if (!item.isCurrentMonth) {
      arr.push("ik-calendar__days-next-month");
    }
    if (item.solarFestival === '结婚纪念日') {
      arr.push('is-pink-bg')
    }
    return arr.join(" ");
  };

  useEffect(() => {
    getCalendarData(currentYear, currentMonth);
  }, [currentYear, currentMonth]);
  // const currentFullDate = useMemo(() => {
  //   return `${currentYear}年${currentMonth}月`;
  // }, [currentYear, currentMonth]);
  const currentWeek = useMemo(() => {
    const week = getWeekDay(currentYear, currentMonth, currentDay);
    return `周${weeks[week === 0 ? 6 : week - 1]}`;
  }, [currentYear, currentMonth, currentDay]);
  const monthSelectItems: MenuProps["items"] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ].map((el) => ({
    key: el,
    label: el,
    onClick: () => {
      setCurrentMonth(Number(el));
    },
  }));
  const yearSelectItems: MenuProps["items"] = useMemo(() => {
    let list = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        key: CY + i + 1,
        label: CY + i + 1,
        onClick: () => {
          setCurrentYear(Number(CY + i + 1));
        },
      });
    }
    for (let i = 0; i < 50; i++) {
      list.unshift({
        key: CY - i,
        label: CY - i,
        onClick: () => {
          setCurrentYear(Number(CY - 1));
        },
      });
    }
    return list.reverse();
  }, [currentYear]);
  return (
    <div className="ik-calendar">
      <div className="ik-calendar-action">
        <div className="ik-calendar__current-date">
          <div className="ik-calendar__date-info">
            <Dropdown
              menu={{ items: yearSelectItems }}
              overlayClassName="ik-calendar__year-select"
            >
              <span>{currentYear}</span>
            </Dropdown>
            <span className="ik-calendar__date-info-symb">年</span>
            <Dropdown menu={{ items: monthSelectItems }}>
              <span>{currentMonth}</span>
            </Dropdown>
            <span className="ik-calendar__date-info-symb">月</span>
            {/* {currentDay} */}
          </div>
          {/* <span className="ik-calendar__week-info">{currentWeek}</span> */}
        </div>
        <div className="ik-calendar__opeation">
          <button
            className="ik-calendar__opeation-btn"
            onClick={() => changeCalendarDate("prev-year")}
          >
            去年
          </button>
          <button
            className="ik-calendar__opeation-btn"
            onClick={() => changeCalendarDate("prev-month")}
          >
            上个月
          </button>
          <button
            className="ik-calendar__opeation-btn"
            onClick={() => changeCalendarDate("today")}
          >
            今
          </button>
          <button
            className="ik-calendar__opeation-btn"
            onClick={() => changeCalendarDate("next-month")}
          >
            下个月
          </button>
          <button
            className="ik-calendar__opeation-btn"
            onClick={() => changeCalendarDate("next-year")}
          >
            明年
          </button>
        </div>
      </div>
      <div className="ik-calendar-header">
        {weeks.map((el, index) => {
          return (
            <span className="ik-calendar-header__weeks-item" key={index}>
              {el}
            </span>
          );
        })}
      </div>
      <div className="ik-calendar-content">
        {calendarData.map((item: any, key) => {
          return (
            <div key={key} className={itemClassNames(item)}>
              <span className="cal-day">{item.day}</span>
              {item.solarFestival ? (
                <span className='cal-lunar-day cal-solar-festival'>{item.solarFestival}</span>
              ) : (
                <span className="cal-lunar-day">{item.lunarDate.lunarDay}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="ik-calendar-bgDate">{`${currentYear}-${formatNum(
        currentMonth
      )}`}</div>
    </div>
  );
};
