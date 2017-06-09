var company = require('./competitor.js');
var mongo = require("mongodb").MongoClient;
var async = require("async");

var filters;
function matchByState(competitors, target, cb)
{
  if(filters.state === false || competitors.length < 5)
  {
     //console.log("Passed through state filtering");
     cb(null,competitors, target);
  }
  else
  {
    resultArr = competitors.filter(function(doc)
    {
      if(doc['State Or Province'] == target['State Or Province'])
        return doc;
    });
    console.log("Passed through state filtering");
    cb(null, resultArr, target);
  }
}


function sortByRevenue(competitors, target, cb)
{
  if(filters.revenue === false)
    cb(null,competitors, target);
 else {
    target['Revenue USD'] == null || undefined ? targetRev = 0 : targetRev = target['Revenue USD'];
    competitors.sort(function(a,b)
    {
      var a1 = Math.abs(a['Revenue USD'] - targetRev);
      var b1 = Math.abs(b['Revenue USD'] - targetRev);
      return a1 - b1;
      console.log("Passed through revenue");
    });
    cb(null, competitors,target);
  }
}

function sortByProfits(competitors, target,cb)
{
  if(filters.profit === false)
    cb(null, competitors, target);
 else {

    if (target['Pre Tax Profit USD'] != null){
       targetProfits = target['Pre Tax Profit USD'];
      competitors.sort(function(a,b)
      {
        var a1 = Math.abs(a['Pre Tax Profit USD'] - targetProfits);
        var b1 = Math.abs(b['Pre Tax Profit USD'] - targetProfits);
        //console.log(a1 +" "+b1)
        return a1 - b1;
      });
      console.log("Passed through profits");
      cb(null, competitors, target);
  }
    else {
      competitors.sort(function(a,b){ return b['Pre Tax Profit USD'] - a['Pre Tax Profit USD']})
        console.log("Passed through profits");
        cb(null,competitors, target);
    }

  }
}



function sortByLiabilities(competitors, target, cb)
{
  if(filters.liabilities === false)
    cb(null, competitors, target);
 else {

    if (target['Liabilities USD'] != null){

      targetLiabilities = target['Liabilities USD'];
      competitors.sort(function(a,b)
      {
        var a1 = Math.abs(a['Liabilities USD'] - targetLiabilities);
        var b1 = Math.abs(b['Liabilities USD'] - targetLiabilities);
        //console.log(a1 +" "+b1)
        return a1 - b1;
      });
      console.log("Passed through liabilities");
      cb(null, competitors, target);
  }
    else {
      competitors.sort(function(a,b){ return b['Liabilities USD'] - a['Liabilities USD']})
      console.log("Passed through liabilities");
      cb(null, competitors, target);
    }
  }
}


function sortByEmployees(competitors, target, cb)
{
  if(filters.employees === false)
     cb(null,competitors, target);
 else {

    if (target['Employees'] != null){

      targetEmployees = target['Employees'];
      competitors.sort(function(a,b)
      {
        var a1 = Math.abs(a['Employees'] - targetEmployees);
        var b1 = Math.abs(b['Employees'] - targetEmployees);
        //console.log(a1 +" "+b1)
        return a1 - b1;
      });
      console.log("Passed through employees");
      cb(null, competitors, target);
  }
    else {competitors.sort(function(a,b){ return b['Employees'] - a['Employees']});
           console.log("Passed through employees");
          cb(null,competitors, target);
    }
  }
}

function sortByDescriptionSimilarity(competitors, target, cb)
{
  if(filters.description === false)
    cb(null, competitors, target);
  else{
    var text = target['Business Description'];

    var arrayIds = [];

    competitors.forEach(function(f)
       { arrayIds.push(f["_id"]); });

       mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
         {
           if(err)
            console.log(err);
           else
           {
              db.collection("companies", function(err, coll)
              {
                coll.aggregate([
                  { $match: { $and:
                                [
                                  {"_id" : {$in : arrayIds}},
                                  {$text: { $search: text}}
                                ]
                            }},
                        {$sort: { score: { $meta: "textScore" }}},
                      ],
                    function(err, docs)
                            {
                              if(err)
                                throw err;
                              console.log("Passed through text filtering");
                               cb(null, docs, target);
                            });
              });
           }
         });
  }
}


function dummy(c,t,cb)
{
  console.log("Dummy");
  console.log(Array.isArray(c));
  console.log(typeof t);
  if(c === null || c=== undefined)
   console.log("c broken");
   if(t === null || t === undefined)
    console.log("t broken");
    cb(null,c,t);
}

function getTopN(competitors,target,cb)
{
  if(competitors.length < 10)
    cb(null, competitors, target);
  else
  {
    cb(null, competitors.slice(0,5), target);
  }
}


function filterTopCompetitors(competitors, target, f, callback)
{
  filters = f;
  async.waterfall([
    async.apply(sortByDescriptionSimilarity, competitors, target),
    sortByEmployees,
    sortByProfits,
    sortByRevenue,
    sortByLiabilities,
    matchByState,
    getTopN
    ],
    function(err, results, target)
    {
      if(err)
        callback(err, null)
      else {
            console.log(results.length);
            callback(null, results);
           }
    });
}

module.exports =
{
  filterTopCompetitors : filterTopCompetitors
}

//company.findSimilarCompanies(filterTopCompetitors);
