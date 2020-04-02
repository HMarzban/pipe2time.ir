const crawlTimeIr = require("./pipe2time.ir")
const buildICS = require("./pipe2calendar")

const inquirer = require("inquirer")
const questions = [
	{
		type: "input",
		name: "years",
		message: "Enter your needed years? (separate by ',')",
	},
	{
		type: "confirm",
		name: "ics",
		default: false,
		message: "Also, do you wanna export the calendar as .ics files?",
	},
	{
		type: "confirm",
		name: "api",
		default: false,
		message: "Do you wanna export the calendar as separated API files?",
	},
]

inquirer.prompt(questions).then(async ({ years, ics, api }) => {
	const yParse = years.split(",")
	yParse.map(year => {
		if (!(+year <= 1500 && +year >= 1280)) {
			throw new Error({
				code: "YEAR_VALIDATION",
				message: `Input year does not in range of support. year must grather than 1280 and less than 1500, input year => ${year}`,
			})
		}
	})
	if (yParse.length) await crawlTimeIr(yParse, api)
	if (ics) yParse.map(year => buildICS(year))
})
