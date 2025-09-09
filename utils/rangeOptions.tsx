import { isValid, startOfDay, subDays } from "date-fns"
const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  })
  
  export function formatDate(date: Date) {
    return DATE_FORMATTER.format(date)
  }

export const RANGE_OPTIONS = {
  today: {
    label: "Today",
    startDate: startOfDay(new Date()),
    endDate: startOfDay(new Date()),
  },
  yesterday: {
    label: "Yesterday",
    startDate: startOfDay(subDays(new Date(), 1)),
    endDate: null,
  },
  last_7_days: {
    label: "Last 7 Days",
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: null,
  },
  last_30_days: {
    label: "Last 30 Days",
    startDate: startOfDay(subDays(new Date(), 29)),
    endDate: null,
  },
  last_90_days: {
    label: "Last 90 Days",
    startDate: startOfDay(subDays(new Date(), 89)),
    endDate: null,
  },
  last_365_days: {
    label: "Last 365 Days",
    startDate: startOfDay(subDays(new Date(), 364)),
    endDate: null,
  },
  overAll: {
    label: "Over All",
    startDate: 'reset',
    endDate: 'reset',
  },
}

export function getRangeOption(range?: any, from?: any, to?: any) {
  if (range == null) {
    const startDate = new Date(from || "")
    const endDate = new Date(to || "")
    if (!isValid(startDate) || !isValid(endDate)) return

    return {
      label: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      startDate,
      endDate,
    }
  }
  return RANGE_OPTIONS[range as keyof typeof RANGE_OPTIONS]
}