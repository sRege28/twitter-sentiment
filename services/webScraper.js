var cheerio = require("cheerio");
var request = require("request")

var links = new Array();
var handle;




function scrapeData(company, cb)
{
  let ans = {x:null, name:company["Company Name"]};
  request({"uri": company["URL"], "method": "GET"}, function (error, response, html)
  {
    console.log("Scraping data for "+ans.name+"...");
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
        var exp = "(?:[t|T]witter.com\/)(?:!#\/)?([_A-Za-z0-9]*)";
        var re = RegExp(exp,"i");

        for(let i of links)
          {
            if(re.test(i))
              ans.x = re.exec(i);
          }
          if(ans.x === null)
            {
              console.log("No luck");
              ans.x = '###';
             }
          else {ans.x = ans.x[1];}
      }

    }
    cb(ans);
  });
}

function getTwitterHandles(company, cb)
{
   if(company["Twitter Handle"] === null || company["Twitter Handle"] === undefined  ||  company["Twitter Handle"] === "")
    {
        if(company["URL"] === null || company["URL"] === undefined || company["URL"] === "")
           {
             company["Twitter Handle"] = "###";
             cb("###");
           }

       else {
          scrapeData(company, cb);

            }
      }

      else
        {
          console.log("Sending to tweet module...");
          cb({ x: company["Twitter Handle"], name:company["Company Name"]});
        }
}

module.exports =
{
  getTwitterHandles : getTwitterHandles
}
