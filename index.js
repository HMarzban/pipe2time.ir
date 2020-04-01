const cheerio = require("cheerio")
const fs = require("fs")

let $
const json = {
	version: "1.0.0",
	creatAt: "2018/3/21",
	cal: {
		"1397": { jalali: "", miladi: "", qamari: "", event: [], days: [] },
		"1398": { jalali: "", miladi: "", qamari: "", event: [], days: [] },
		"1399": { jalali: "", miladi: "", qamari: "", event: [], days: [] },
		"1400": { jalali: "", miladi: "", qamari: "", event: [], days: [] },
	},
}

const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

const fixNumbers = str => {
	if (typeof str === "string") {
		for (let i = 0; i < 10; i++) {
			str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i)
		}
	}
	return str
} // fn fixNumbers

const getYear = function () {
	// FIXME: depend of this, is harmful
	return new Promise(resolve => {
		const year = $('input[type="text"]').val()
		resolve(year)
	})
} // fn getYear

const getMonthDays = _index => {
	return new Promise(resolve => {
		var monthDay = []
		var p = Promise.resolve()
		$(".panel-body")
			.eq(_index)
			.find(".dayList > div")
			.each((index, val) => {
				p = p.then(function () {
					const jj = fixNumbers(
						$(val)
							.find(".jalali")
							.text(),
					)
					const mi = $(val)
						.find(".miladi")
						.text()
					const qa = fixNumbers(
						$(val)
							.find(".qamari")
							.text(),
					)
					const disable = $(val).hasClass("disabled")
					const holiday = $(val)
						.find("div")
						.hasClass(" holiday")
					monthDay.push({
						holiday: holiday,
						disabled: disable,
						days: { j: jj, m: mi, q: qa },
					})
				})
			})
		p.then(function () {
			resolve(monthDay)
		})
	}) // promise return
} // fn getMonthDays

const getMonthEvents = (_index = 1) => {
	return new Promise(resolve => {
		let p = Promise.resolve()
		const eventDays = []
		$(".panel-body")
			.eq(_index)
			.find(".list-unstyled li")
			.each((index, val) => {
				p = p.then(function () {
					const isHoliday = $(val).hasClass("eventHoliday")
					const text = fixNumbers($(val).text())
					eventDays.push({
						isHoliday: isHoliday,
						text: text
							.trim()
							.replace(/(?:\r|\n)/g, " ")
							.replace(/\s{2}/g, ""),
					})
				})
			})
		p.then(function () {
			resolve(eventDays)
		})
	}) // promise return
} // fn getMonthEvents

const getMonthHead = _index => {
	// TODO: checke for resolve (await) callback.
	let json = {}
	const jalali = fixNumbers(
		$(".panel-body")
			.eq(_index)
			.find(".header .jalali")
			.text(),
	)
	const miladi = $(".panel-body")
		.eq(_index)
		.find(".header .miladi")
		.text()
	const qamari = fixNumbers(
		$(".panel-body")
			.eq(_index)
			.find(".header .qamari")
			.text(),
	)

	json = { jalali, miladi, qamari }
	return JSON.stringify(json)
} // fn getMonthHead

const compilehtml2Jsons = async () => {
	// TODO: match this list with _json var, To of Page
	const yearList = ["1397", "1398", "1399", "1400"]
	try {
		for (let o = 0; o < yearList.length; o++) {
			// TODO: check for if file does not exist.
			$ = cheerio.load(fs.readFileSync("./cal/" + yearList[o] + ".html"))

			const year = await getYear()

			const monthHead = JSON.parse(await getMonthHead(1))
			json.cal[year].jalali = monthHead.jalali
			json.cal[year].miladi = monthHead.miladi
			json.cal[year].qamari = monthHead.qamari

			for (let i = 1; i <= 12; i++) {
				const monthDay = await getMonthDays(i)
				const monthEvent = await getMonthEvents(i)
				json.cal[year].days.push(monthDay)
				json.cal[year].event.push(monthEvent)
			}
		} // loop

		const DataJson = JSON.stringify(json)
		fs.writeFileSync("./dist/api_calendar.json", DataJson)
	} catch (error) {
		console.log(error.message)
	}
} // fn compilehtml2Jsons

compilehtml2Jsons()

// FIXME: check and fix warning: "DeprecationWarning: Calling an asynchronous function without callback is deprecated"
