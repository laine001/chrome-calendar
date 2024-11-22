export interface LunarDateType {
  lunarYear: string
  lunarMonth: string
  lunarDay: string
}

export interface CalendarItemType {
  year: number
  month: number
  day: number
  date?: string
  lunarDate?: LunarDateType
  isToday?: boolean
  isYesterday?: boolean
  isTomorrow?: boolean
  lunarYear?: number
  isCurrentMonth?: boolean
  currentDate?: string
  solarFestival?: string
  lunarFestival?: string
}