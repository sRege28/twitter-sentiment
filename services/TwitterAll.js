var async = require('async');
var mongo = require('mongodb').MongoClient;
var scrape = require('./webScraper.js');



function storeTwitterHandlesForAll()
{
  mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err,db)
  {
    if(err) console.log(err);
     var cursor = db.collection('companies').find();
     var count = 0;
     cursor.forEach(function(it)
      {
        scrape.getTwitterHandles(it, function(res)
        {
           if(res.x == 'null' || res.x == undefined || res.x == '')
            res.x = '###';

           db.collection('companies').update({'Company Name': res.name}, {$set: {'Twitter Handle' : res.x}} , function(err)
           {
             if(err) console.log(err);
             else {
               count++;
               console.log(count);
             }
           });

        });
      });
  });
}


function test()
{
  mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err,db)
  {
    if(err) console.log(err);
     var docs = db.collection('companies').aggregate([{$sample: {size: 50}}]);

     docs.forEach(function(it)
     {
       scrape.getTwitterHandles(it, function(res)
       {
          console.log(res);
       });

     });
   });
}

//test();
