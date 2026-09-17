const { test } = require("node:test")
const assert = require("node:assert/strict")
const { calendarEvents } = require("../src/calendar-events")

test("all-day dates preserve Gregorian components and roll exclusive end dates correctly", () => {
  const fixture = [{ events: [
    { text: "Leap day", mDate: "2024/02/29", isHoliday: false },
    { text: "Year end", mDate: "2025/12/31", isHoliday: true },
  ] }]
  const original = JSON.stringify(fixture)
  const events = calendarEvents(fixture)
  assert.deepEqual(events[0].start, [2024, 2, 29])
  assert.deepEqual(events[0].end, [2024, 3, 1])
  assert.deepEqual(events[1].end, [2026, 1, 1])
  assert.equal(events[1].busyStatus, "FREE")
  assert.equal(JSON.stringify(fixture), original)
})

test("invalid and ambiguous Gregorian dates fail before export", () => {
  for (const mDate of ["2025/02/29", "2025/13/01", "2025-01-01"]) {
    assert.throws(() => calendarEvents([{ events: [{ mDate }] }]), /Invalid Gregorian date/)
  }
})

test("stored 1405 events retain their dates across all 12 months", () => {
  const source = require("../api/1405/index.json")[1405]
  const exported = calendarEvents(source)
  assert.equal(exported.length, 220)
  source.flatMap(month => month.events).forEach((event, i) => {
    assert.deepEqual(exported[i].start, event.mDate.split('/').map(Number))
  })
})
