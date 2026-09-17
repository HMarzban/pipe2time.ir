const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { yearOutputs, createJsonApiFile } = require("../src/year-api")

test("all 12 months are exported in order, including padding cells", t => {
  const months = Array.from({ length: 12 }, (_, month) => ({
    events: [{ month: month + 1 }], weeks: [{ disabled: true }, { month: month + 1 }],
  }))
  const fixture = { 1405: months }
  const expected = yearOutputs(1405, fixture)
  assert.deepEqual(expected.events.map(event => event.month), Array.from({ length: 12 }, (_, i) => i + 1))
  assert.equal(expected.weeks.length, 24)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "calendar-test-"))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  createJsonApiFile(1405, fixture, root)
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "1405/events.json"))), expected.events)
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "1405/weeks.json"))), expected.weeks)
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "1405/index.json"))), fixture)
})

test("incomplete years fail before producing misleading output", () => {
  assert.throws(() => yearOutputs(1405, {}), /12 months/)
  assert.throws(() => yearOutputs(1405, { 1405: [] }), /12 months/)
})

test("every committed year endpoint exactly matches its complete source index", () => {
  const root = path.resolve(__dirname, "../api")
  for (const year of fs.readdirSync(root).filter(year => /^\d{4}$/.test(year))) {
    const directory = path.join(root, year)
    const data = JSON.parse(fs.readFileSync(path.join(directory, "index.json")))
    const expected = yearOutputs(year, data)
    for (const [name, values] of Object.entries(expected)) {
      assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, `${name}.json`))), values, `${year}/${name}`)
    }
  }
  const year = require("../api/1405/events.json")
  assert.equal(year.length, 220)
  assert.equal(new Set(year.map(event => event.jDate.slice(5, 7))).size, 12)
})
