[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Jalali, Qamari, Miladi Calendar from "time.ir", JSON API

Web Crawler for Time.ir to obtain all data as a JSON file, Jalali, Qamari, Miladi data are included.

This script has two pipes:

- [JSON API](#json-api)
- [.ics calendar](#ics-events-for-google,-outlook-...)

## .ics events for google, outlook ...

One of the pipes that you can achieve when you execute the project is creating a .ics file. by default, you can download one of the files below and import in to your calendar. these files contains all events of the year by the source of [time.ir](https://www.time.ir/)

#### Events

[1390](./dist/event-1390.ics),
[1391](./dist/event-1391.ics),
[1392](./dist/event-1392.ics),
[1393](./dist/event-1393.ics),
[1394](./dist/event-1394.ics),
[1395](./dist/event-1395.ics),
[1396](./dist/event-1396.ics),
[1397](./dist/event-1397.ics),
[1398](./dist/event-1398.ics),
[1399](./dist/event-1399.ics),
[1400](./dist/event-1400.ics),
[1401](./dist/event-1401.ics),
[1402](./dist/event-1402.ics),
[1403](./dist/event-1403.ics)

## JSON API

#### Api schema:

`https://hmarzban.github.io/pipe2time.ir/api/:year/:target`

#### Example:

`https://hmarzban.github.io/pipe2time.ir/api/1399/index.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/index.json)

`https://hmarzban.github.io/pipe2time.ir/api/1399/events.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/events.json)

`https://hmarzban.github.io/pipe2time.ir/api/1399/weeks.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/weeks.json)

Also, you can download all in one these years data by [this link](./dist/calendar.json)

> List of available years: `1390,1391,1392,1393,1394,1395,1396,1397,1398,1399,1400,1401,1402,1402,1403`
> Note: if you need more years, clone the project and make your custom list of years.

## JSON OUTPUT SCHEMA

```json
{
 "1398": [ ... ],
 "1394": [
  {
  "header": {
    "miladi": "March - April 2015",
    "qamari": "جمادي الاولي - جمادي الثانيه - 1436",
    "jalali": "فروردین 1394"},
  "events": [
    {
    "isHoliday": true,
    "text": "1 فروردین جشن نوروز/جشن سال نو",
    "jDate": "1394/01/01",
    "mDate": "2015/03/21",
    "jDay": "1"
    },
    ...
  ],
  "weeks": [
    {"holiday": true, "disabled": false, "day": { "j": "1", "m": "21", "q": "30" } },
    ...
  ]
  },
  ...
 ],
 "1401": [ ... ],
 "1402": [ ... ]
}
```

## Develop and Contribute

1. install dependecy `npm i`
2. run the cli `npm start`

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
