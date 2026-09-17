// Derive endpoints from committed source snapshots; never scrape or rewrite them.
const fs = require("node:fs")
const path = require("node:path")
const { yearOutputs } = require("../src/year-api")
const root = path.resolve(__dirname, "../api")
for (const year of fs.readdirSync(root).filter(year => /^\d{4}$/.test(year)).sort()) {
  const directory = path.join(root, year)
  const data = JSON.parse(fs.readFileSync(path.join(directory, "index.json"), "utf8"))
  const outputs = yearOutputs(year, data)
  for (const [name, values] of Object.entries(outputs)) {
    fs.writeFileSync(path.join(directory, `${name}.json`), JSON.stringify(values))
  }
  console.log(`${year}: ${outputs.events.length} events, ${outputs.weeks.length} grid cells`)
}
