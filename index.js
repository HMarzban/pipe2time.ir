const cheerio = require('cheerio'),
        fs = require('fs');

let $ = ""; 
let json = {
    "version":"1.0.0",
    "creatAt":"2018/3/21",
    "cal":{
        "1397":{"jalali":"","miladi":"","qamari":"","event":[],"days":[]},
        "1398":{"jalali":"","miladi":"","qamari":"","event":[],"days":[]},
        "1399":{"jalali":"","miladi":"","qamari":"","event":[],"days":[]},
        "1400":{"jalali":"","miladi":"","qamari":"","event":[],"days":[]}
    }
}

var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
var arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

let fixNumbers =  (str) =>{

        if (typeof str === 'string') {
            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
};

const get_year =  function(){

    //FIXME: depend of this, is harmful
    return new Promise(resolve => {
          let year =   $('input[type="text"]').val()
          resolve(year);
      });   
}//fn get_year

const get_month_days = (_index  )=>{

    return new Promise(resolve => {
        var montht_day = []
        var p = Promise.resolve();
        $('.panel-body').eq(_index).find('.dayList > div').each(  (index,val) =>{
            p = p.then(function(){ 
                let jj =   fixNumbers($(val).find('.jalali').text());
                let mi = $(val).find('.miladi').text();
                let qa =  fixNumbers($(val).find('.qamari').text());
                let disable = $(val).hasClass("disabled");
                let  holiday = $(val).find('div').hasClass(' holiday');
                montht_day.push( {"holiday":holiday,"disabled":disable,"days":{"j":jj,"m":mi,"q":qa}} )
            });
        });
        p.then(function(){
            resolve(montht_day);
        });
    })// promise return

}// fn get_month_days

const get_month_event = (_index = 1)=>{

    return new Promise(resolve => {
        var p = Promise.resolve();
        let eventDays = [];
        $('.panel-body').eq(_index).find('.list-unstyled li').each((index,val)=>{
            p = p.then(function(){ 
                let isHoliday = $(val).hasClass('eventHoliday');
                let text = fixNumbers($(val).text().replace(/\  /g,""));
                eventDays.push({"isHoliday":isHoliday,"text": JSON.stringify( text.trim() ) });
            });
        });
        p.then(function(){
            resolve(eventDays);
        });
    });// promise return
}// fn get_month_event

const get_month_heade = (_index) =>{

        //TODO: checke for resolve (await) callback.
        let json;
        let jalali = fixNumbers($('.panel-body').eq(_index).find('.header .jalali').text());
        let miladi = $('.panel-body').eq(_index).find('.header .miladi').text();
        let qamari = fixNumbers($('.panel-body').eq(_index).find('.header .qamari').text());

        json = {jalali,miladi,qamari};
        return JSON.stringify(json);
}

const compilehtml2Jsons = async () =>{

    //TODO: match this list with _json var, To of Page
    let year_list = ["1397","1398","1399","1400"]
    for(let o = 0 ; o < year_list.length ; o++ ){
        //TODO: check for if file does not exist.
        $ =  cheerio.load(fs.readFileSync('cal/'+year_list[o]+'.html'));

        let year = await get_year();

        let month_head = JSON.parse( await get_month_heade(1));
        json.cal[year].jalali = month_head.jalali;
        json.cal[year].miladi = month_head.miladi;
        json.cal[year].qamari = month_head.qamari;

        for(let i = 1 ; i<= 12 ; i++){
            let montht_day = await get_month_days(i);
            let month_event = await get_month_event(i);
            json.cal[year].days.push(  montht_day ); 
            json.cal[year].event.push( month_event );
        }
       
    }// loop
    var jsonss = JSON.stringify(json); 
        fs.writeFile('api_calendar.json', jsonss); 
    
}// fn compilehtml2Jsons

compilehtml2Jsons();

//FIXME: check and fix warning: "DeprecationWarning: Calling an asynchronous function without callback is deprecated"





