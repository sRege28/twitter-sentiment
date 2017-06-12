var twitter = require('twitter');
var sentiment = require('sentiment');
var mongo = require("mongodb").MongoClient;

var config = {
  consumer_key: 'ysAleI7T1Ww9m2XzVPjaj5qRU',
  consumer_secret: 'J28QRycBLELqniO9beCmkkQf4M0W5i3ptZVxKB86wlNEkmC9n5',
  access_token_key: '1533314264-psvgsbn2SoLR0dio8BX5QgSArCpA2zAilOs5vJy',
  access_token_secret: 'ooxjAMuhjahgvr7unGiRvTx86r8NGsvdP4yw9NSKoUTOP'
};

//var queries = ["21st Century Fox America, Inc.","21st Century North America Insurance Company","24 Hour Fitness Usa, Inc.","3M Company","84 Lumber Company"];


function findTweets(dataScraped, callback)
{
   var client = new twitter(config);
   var company = dataScraped.name;
   if(dataScraped.x == null || dataScraped.x === "###" || dataScraped.x === "" || dataScraped.x === undefined)
      callback();
  else
  {
    var handle = dataScraped.x;
    client.get("search/tweets",{q:"@"+handle+" AND -from:"+handle+" AND -filter:retweets", count: 100, lang:"en", }, function(err, results)
      {
        if(err)
         throw err;
       else
       {
           console.log("getTweets::30:/ Getting tweet number for"+company+" and "+ handle+" :");
           var tweets = results.statuses;
           //console.log(tweets[0]);
           console.log(tweets.length);
           tweets.forEach(function(twit)
           {
             senti = sentiment(twit.text);
             //console.log(twit.text);
             //console.log(senti.score);
             twit.score = senti.score;
             twit.parent = company;
             twit._id = twit.id;
             twit.parent_handle = handle;
             mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
               {
                 if(!err){
                     db.collection("tweets").insertOne(twit,function(err)
                     {
                       //if(err)
                        //console.log(err);
                     });

                     db.collection("companies").update({"Company Name" : company},{"$set" : {"Twitter Handle" : handle}});
                 }
               });
           });
           console.log("All tweets stored");
           callback();
       }
     });
  }
   //console.log(query);


}

//findTweets(queries);

module.exports =
{
  findTweets : findTweets
}

var dt = { x:
     [ 'twitter.com/MCCLabel',
       'MCCLabel'
     ],
    name: 'Multi-Color Corporation' };

//findTweets(dt);
