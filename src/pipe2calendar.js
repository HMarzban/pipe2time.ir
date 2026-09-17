const fs = require("fs")
const ics = require("ics")
const { calendarEvents } = require("./calendar-events")

const buildICS = year => {
  const calendar = require("../dist/calendar.json")
  if (!Array.isArray(calendar[year]) || calendar[year].length === 0) return false
  const { error, value } = ics.createEvents(calendarEvents(calendar[year]))
  if (error) throw error
  fs.writeFileSync(`./dist/event-${year}.ics`, value)
  return true
}
module.exports = buildICS
