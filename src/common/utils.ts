class DateRange {
  startDate: Date
  endDate: Date
  constructor() {
    this.startDate = new Date()
    this.endDate = new Date()
  }
}

function convertDateTimeString(dateTimeString: string): string {
  let date = new Date(dateTimeString)
  let dateDay = date.getDate().toString().padStart(2, '0')
  let dateMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  let dateYear = date.getFullYear()

  let formattedDateString = dateDay + '/' + dateMonth + '/' + dateYear

  return formattedDateString
}

function getDateRangeByMonthRange(monthRange: number): DateRange {
  let currentDate = new Date()
  let currentDateRange = new DateRange()
  currentDateRange.startDate.setMonth(currentDate.getMonth() - monthRange)

  return currentDateRange
}

function convertDateToDotNetString(date: Date): string {
  let dateDay = date.getDate().toString().padStart(2, '0')
  let dateMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  let dateYear = date.getFullYear()

  let formattedDateString = `${dateYear}-${dateMonth}-${dateDay}T00:00:00`

  return formattedDateString
}

interface MonthRange {
  [key: string]: number
}

let monthRanges: MonthRange = {
  month: 1,
  quarter: 3,
  semester: 6,
  year: 12
}

export { convertDateTimeString, monthRanges, getDateRangeByMonthRange, convertDateToDotNetString }
