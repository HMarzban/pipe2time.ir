const fs = require("fs")
const ics = require("ics")

const buildICS = year => {
	const calander = require("../dist/calendar.json")
	const events = []
	if (!calander[year] && !calander[year].length) return false
	calander[year].forEach(el => {
		el.events.map(event => {
			const date = new Date(event.mDate)
			event = {
				title: (event.isHoliday ? "تعطیل - " : "") + event.text,
				busyStatus: event.isHoliday ? "FREE" : null,
				description: event.text,
				end: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
				start: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
			}
			events.push(event)
		})
	})
	const { error, value } = ics.createEvents(events)
	if (error) throw ("Making .ics file has an error", error)
	fs.writeFileSync(`./dist/event-${year}.ics`, value)
	return true
}

module.exports = buildICS
