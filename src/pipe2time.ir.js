const puppeteer = require("puppeteer")
const fs = require("fs")

const evaluatePage = async (browser, year) => {
	const page = await browser.newPage()
	await page.setDefaultNavigationTimeout(0)
	await page.goto("https://www.time.ir/fa/eventyear-%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%B3%D8%A7%D9%84%DB%8C%D8%A7%D9%86%D9%87", { waitUntil: "load" })
	await page.waitFor("#ctl00_cphTop_Sampa_Web_View_EventUI_EventYearCalendar10cphTop_3417_txtYear")
	await page.$eval("#ctl00_cphTop_Sampa_Web_View_EventUI_EventYearCalendar10cphTop_3417_txtYear", el => (el.value = ""))
	await page.type("#ctl00_cphTop_Sampa_Web_View_EventUI_EventYearCalendar10cphTop_3417_txtYear", year + "")
	await page.keyboard.press("Enter")
	await page.waitForNavigation()
	await page.addScriptTag({ path: "./node_modules/jalali-moment/dist/jalali-moment.browser.js" })
	const result = await page.evaluate(async () => {
		const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
		const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
		function toEnglishDigits(str) {
			if (typeof str === "string")
				for (let i = 0; i < 10; i++) {
					str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i)
				}
			return str
		}

		const moment = window.moment
		const year = $("input[type='text']").val()
		const data = { [year]: [] }

		$(".panel-body").each(function (monthIndex, el) {
			const month = { header: {}, events: [], weeks: [] }
			const $this = $(this)
			// Get Headers
			$this.find(".header .miladi").each(function () {
				month.header.miladi = $(this).text()
			})
			$this.find(".header .qamari").each(function () {
				month.header.qamari = toEnglishDigits($(this).text())
			})
			$this.find(".header .jalali").each(function () {
				month.header.jalali = toEnglishDigits($(this).text())
			})

			// Get Weeks
			$this.find(".dayList > div").each(function () {
				const jj = toEnglishDigits($(this).find(".jalali").text())
				const mi = $(this).find(".miladi").text()
				const qa = toEnglishDigits($(this).find(".qamari").text())
				const disable = $(this).hasClass("disabled")
				const holiday = $(this).find("div").hasClass(" holiday")
				month.weeks.push({
					holiday: holiday,
					disabled: disable,
					day: { j: jj, m: mi, q: qa },
				})
			})

			// Get Events
			$this.find(".list-unstyled li").each(function () {
				const isHoliday = $(this).hasClass("eventHoliday")
				const text = toEnglishDigits(
					$(this)
						.text()
						.trim()
						.replace(/(?:\r|\n)/g, " ")
						.replace(/\s{2}/g, ""),
				)
				const day = toEnglishDigits(text.slice(0, 2).trim())
				const date = `${year}/${monthIndex}/${day}`
				const jDate = moment(date, "jYYYY/jM/jD").format("jYYYY/jMM/jDD")
				const mDate = moment(date, "jYYYY/jM/jD").format("YYYY/MM/DD")
				month.events.push({ isHoliday, text, jDate, mDate, jDay: day })
			})

			if (month.weeks.length) data[year].push(month)
		})

		return data
	})
	await page.close()
	return result
}

const init = async (years, activeApi) => {
	try {
		const browser = await puppeteer.launch({ headless: true })

		const calendar = {}

		if (typeof years === "string") {
			console.info(`Getting ${years} info ...`)
			const result = await evaluatePage(browser, years)
			console.info(`The ${years} info extracted.`)
			Object.assign(calendar, result)
			if (activeApi) createJsonApiFile(years, result)
		} else if (years.length) {
			for (const year of years) {
				console.info(`Getting ${year} info ...`)
				const result = await evaluatePage(browser, year)
				if (activeApi) createJsonApiFile(year, result)
				Object.assign(calendar, result)
				console.info(`The ${year} info extracted.`)
			}
		}

		await browser.close()
		const DataJson = JSON.stringify(calendar)
		fs.writeFileSync("./dist/calendar.json", DataJson)
		console.info(`Don.`)
		return true
	} catch (error) {
		console.log(error)
	}
}

const createJsonApiFile = (year, data) => {
	const path = `./api/${year}`
	if (!fs.existsSync(path)) fs.mkdirSync(path)
	const events = data[year].map(month => month.events)
	const weeks = data[year].map(month => month.weeks)
	fs.writeFileSync(`${path}/events.json`, JSON.stringify(events[0]))
	fs.writeFileSync(`${path}/weeks.json`, JSON.stringify(weeks[0]))
	fs.writeFileSync(`${path}/index.json`, JSON.stringify(data))
}

module.exports = init
