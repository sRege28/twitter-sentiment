var mongo = require("mongodb").MongoClient;
//var config = require("../config.js")
var async = require("async");
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};

const emitter = new MyEmitter();

function connect(db,companyName,callback){
        db.collection("companies",function(err, coll)
        {
          if(err)
           throw err;
          coll.findOne({"Company Name": companyName},function(err,c)
          { if(err)
             throw err;
             console.log("Found company");
             callback(null,db,c);
          });
        });
}


function getCompetitors(db,c,callback)
{
  db.collection("companies", function(err, coll){
  if(err)
   throw err;
   coll.find({"DB Hoovers Industry": c["DB Hoovers Industry"]}).toArray(function(err,comps)
      {
        if(err)
         throw err;
         arr = comps.filter(function(docs)
         {
           if(docs["Company Name"] != c["Company Name"])
            {
              return docs;
            }
         });
         console.log("Found competitors");
         db.close();
         callback(null,arr,c);
      });
  });
}

function findSimilarCompanies(db,company,callback){
   async.waterfall(
     [async.apply(connect,db,company),
       getCompetitors],function(err,results,company)
   {
     callback(results,company);
   });
}

module.exports =
{
  findSimilarCompanies : findSimilarCompanies
}
