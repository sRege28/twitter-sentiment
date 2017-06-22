var cheerio = require("cheerio");
var request = require("request")

var links = new Array();



function scrapeData(company, cb)
{

  request({"uri": company["URL"], "method": "GET"}, function (error, response, html)
  {
    this.ans = {};
    this.ans.x = null;
    this.ans.company = company["Company Name"];
    //console.log("Scraping data for "+ans.name+"...");
    if(error)
      console.log(error);
    else
    {
      if (!error && response.statusCode == 200)
      {
        var $ = cheerio.load(html);
        //console.log("html found");
        $('a').each(function()
        {
            links.push($(this).attr('href'));
        });
        console.log(links.length);
        var exp = "(?:[t|T]witter\.com\/)(?:!#\/)?([_A-Za-z0-9]*)";
        var re = RegExp(exp,"i");

        for(let i of links)
          {
            if(re.test(i))
              this.ans.x = re.exec(i);
          }
          if(this.ans.x === null)
            {
              //console.log("company "+company["Company Name"]+"No luck finding handle");
              this.ans.x = '###';
             }
          else {
            this.ans.x = this.ans.x[1];
            //console.log(" company "+company["Company Name"]+"handle found: "+ans.x);
          }
      }
        cb(this.ans);
    }

  });
}

function getTwitterHandles(company, cb)
{
   if(company["Twitter Handle"] === null || company["Twitter Handle"] === undefined  ||  company["Twitter Handle"] === "")
    {
       //console.log("company "+company["Company Name"]+" twitter handle not found, scraping the web...")
        if(company["URL"] === null || company["URL"] === undefined || company["URL"] === "")
           {
             company["Twitter Handle"] = "###";
             console.log("company "+company["Company Name"]+" URL null");
             cb({name:company["Company Name"], x:"###"});
           }

       else {
          //console.log("company "+company["Company Name"]+" URL found"+company["URL"]);
          scrapeData(company, cb);
            }
      }

      else
        {
          //console.log("company "+company["Company Name"]+"exists, sending to tweet module...");
          cb({ x: company["Twitter Handle"], name:company["Company Name"]});
        }
}

module.exports =
{
  getTwitterHandles : getTwitterHandles
}
