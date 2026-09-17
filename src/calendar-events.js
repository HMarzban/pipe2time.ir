// Read Gregorian components explicitly: slash-formatted Date parsing is platform dependent.
const dateParts = value => {
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value)
  if (!match) throw new Error(`Invalid Gregorian date: ${value}`)
  const parts = match.slice(1).map(Number)
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
  if (date.getUTCFullYear() !== parts[0] || date.getUTCMonth() + 1 !== parts[1] || date.getUTCDate() !== parts[2]) {
    throw new Error(`Invalid Gregorian date: ${value}`)
  }
  return { parts, date }
}

const calendarEvents = months => months.flatMap(month => month.events.map(event => {
  const { parts: start, date } = dateParts(event.mDate)
  date.setUTCDate(date.getUTCDate() + 1)
  return {
    title: (event.isHoliday ? "تعطیل - " : "") + event.text,
    ...(event.isHoliday ? { busyStatus: "FREE" } : {}),
    description: event.text,
    start,
    // RFC 5545 DTEND is exclusive, so an all-day event ends the following day.
    end: [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()],
  }
}))
module.exports = { calendarEvents }
