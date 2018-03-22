# Jalali, Qamari, Miladi Calendar from "time.ir" offline json api
Web Crawler for Time.ir to Retrive JSON File, jalali, qamari, miladi  json calendar api.
 


## Json output
```
{
    "version": "1.0.0",
    "creatAt": "2018/3/21",
    "cal": {
        "1397": {
            "jalali": "فروردین 1397",
            "miladi": "March - April 2018",
            "qamari": "رجب - شعبان - 1439",
            "event": [
                [
                    {
                        "isHoliday": true,
                        "text": "\"1 فروردین\\nجشن نوروز/جشن سال نو\""
                    },
                    {
                        "isHoliday": false,
                        "text": "\"1 فروردین\\nشهادت امام علی النقی الهادی علیه السلام\\n [ 3 رجب ]\""
                    },
                    .
                    .
                    .
                ],
                .
                .
                .
            ],
            "days": [
                 [
                    {
                        "holiday": false,
                        "disabled": true,
                        "days": {
                            "j": "26",
                            "m": "17",
                            "q": "28"
                        }
                    },
                    {
                        "holiday": false,
                        "disabled": true,
                        "days": {
                            "j": "27",
                            "m": "18",
                            "q": "29"
                        }
                    },
                    .
                    .
                    .
                 ],
                 .
                 .
                 .
            ]
        },
        "1398": { ... },
        "1399": { ... }, ...
    }
}
```