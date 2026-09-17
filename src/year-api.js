const fs = require("node:fs")
const path = require("node:path")

// Keep the flat-array API, including disabled cells that pad each month's grid.
const yearOutputs = (year, data) => {
  const months = data[year]
  if (!Array.isArray(months) || months.length !== 12) {
    throw new Error(`Expected 12 months for ${year}`)
  }
  for (const month of months) {
    if (!Array.isArray(month.events) || !Array.isArray(month.weeks)) {
      throw new Error(`Missing events or weeks in ${year}`)
    }
  }
  return {
    events: months.flatMap(month => month.events),
    weeks: months.flatMap(month => month.weeks),
  }
}

const createJsonApiFile = (year, data, root = "./api") => {
  const outputs = yearOutputs(year, data)
  const directory = path.join(root, String(year))
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, "events.json"), JSON.stringify(outputs.events))
  fs.writeFileSync(path.join(directory, "weeks.json"), JSON.stringify(outputs.weeks))
  fs.writeFileSync(path.join(directory, "index.json"), JSON.stringify(data))
}

module.exports = { yearOutputs, createJsonApiFile }
