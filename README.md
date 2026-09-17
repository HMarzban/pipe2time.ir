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

<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1390.ics" download>1390</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1391.ics" download>1391</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1392.ics" download>1392</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1393.ics" download>1393</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1394.ics" download>1394</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1395.ics" download>1395</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1396.ics" download>1396</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1397.ics" download>1397</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1398.ics" download>1398</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1399.ics" download>1399</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1400.ics" download>1400</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1401.ics" download>1401</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1402.ics" download>1402</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1403.ics" download>1403</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1404.ics" download>1404</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1405.ics" download>1405</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1406.ics" download>1406</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1407.ics" download>1407</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1408.ics" download>1408</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1409.ics" download>1409</a>,
<a href="https://hmarzban.github.io/pipe2time.ir/dist/event-1410.ics" download>1410</a>,
## JSON API

#### Api schema:

`https://hmarzban.github.io/pipe2time.ir/api/:year/:target`

#### Example:

`https://hmarzban.github.io/pipe2time.ir/api/1399/index.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/index.json)

`https://hmarzban.github.io/pipe2time.ir/api/1399/events.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/events.json)

`https://hmarzban.github.io/pipe2time.ir/api/1399/weeks.json` [open Link](https://hmarzban.github.io/pipe2time.ir/api/1399/weeks.json)

Also, you can download all in one these years data by [this link](./dist/calendar.json)

> List of available years: `1390,1391,1392,1393,1394,1395,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410`
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

## Data scope and regeneration

The checked-in data is a historical snapshot collected from time.ir. The original
scrape date was not recorded; future-year files are not a promise of current holiday
accuracy. Review the upstream calendar before relying on an event.

On 2026-09-17, `events.json` and `weeks.json` for 1390–1410 were regenerated **only
from each committed `index.json`** to correct a first-month-only export. No calendar
entries, source indexes, `dist/calendar.json`, or ICS files were re-scraped or changed.
For example, 1405 now exports all 220 events instead of the first 20.

- `index.json`: year-keyed array of 12 month objects.
- `events.json`: flat array of every month's events in calendar order.
- `weeks.json`: flat array of every month's day-grid cells, including disabled
  leading/trailing cells. These cells contain day numbers, not complete dates;
  use `index.json` when you need month boundaries.

Regenerate derived JSON endpoints and run the fixture tests without dependencies,
a browser, or network access (Node.js 22+):

```sh
npm run regenerate:api
npm test
```

## Develop and contribute

The scraper remains a historical Puppeteer 2 integration. Its selectors and live
compatibility have not been revalidated. Scraping requires installing dependencies
and a compatible browser; `npm start` opens the interactive CLI. The ICS generator
uses the stored Gregorian `mDate` components without timezone-dependent parsing,
and gives all-day events an exclusive end on the following day. Fixtures cover
leap days, year rollover and the 1405 snapshot. Existing ICS downloads are preserved;
this does not revalidate the original Jalali-to-Gregorian conversion or upstream
holiday accuracy.

The package metadata follows the existing [MIT license](LICENSE).
