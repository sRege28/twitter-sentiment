mongo = require("mongodb").MongoClient;

function totalTweetsbySentiment()
{
   mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
   {
     var target = "Equinox Holdings, Inc.";
     if(!err)
      db.collection("tweets", function(err, coll)
        {
          coll.aggregate([
            {$match:{
                       parent: target
                    }
            },
            {
              $group:
              {
                "_id" : null,
                "positive_count":
                  {
                     $sum:
                     {
                        $cond: [{$gt: ["$score", 0]},1,0]
                     }
                  },
                "negative_count":
                {
                   $sum:
                   {
                      $cond: [{$lt: ["$score", 0]},1,0]
                   }
                },
                "neutral_count":
                {
                  $sum:
                    {
                       $cond: [{$eq: ["$score",0]},1,0]
                    }
                }
              }
            }
          ], function(err, docs)
          {
            docs[0].parent = target;
            console.log(docs);
          });
        });
   })
}

function averageSentiment()
{
  var target = "Equinox Holdings, Inc.";
  mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
  {
    db.collection("tweets").aggregate([
      {$match : {
                 parent: target
              }
      },
      {$group:
        {
           "_id": "$parent",
           "Average Sentiment Score":
                {
                  $avg: "$score"
                }
        }
      }
    ], function(err,docs)
    {
      console.log(docs);
    });
  });
}

function positiveToNegative()
{
   var target = "Equinox Holdings, Inc.";
   mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
   {
     db.collection("tweets").aggregate([
       {$match : {
                  parent: target
               }
        },
        {$group:
            {
              "_id" : "$parent",
              "positive_count":
                {
                   $sum:
                   {
                      $cond: [{$gt: ["$score", 0]},1,0]
                   }
                },
              "negative_count":
              {
                 $sum:
                 {
                    $cond: [{$lt: ["$score", 0]},1,0]
                 }
              },
          }
        },
          {$project:
            {"PtoNRatio": {$divide:
                              ["$positive_count","$negative_count"]
                           }
            }
          }
     ], function(err, docs)
     {
       console.log(docs);
     });
   });
}

function highestRetweeted()
{
  var target = "Equinox Holdings, Inc.";
  mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
  {
    db.collection("tweets").aggregate([
      {$match : {
                 parent: target
              }
       },
       {$sort : {"retweet_count": -1} },
       {$limit: 5},
       {
         $project:
            {
              "_id": "$parent",
              "score": "$score",
              "tweet": "$text",
              "retweet_count": "$retweet_count",
              "user": "$user.name"
            }
       }
     ], function(err, docs)
      {
        if(err)
         console.log(err);
        console.log(docs);
      });
      db.close();
  });
}


function highestFavorited()
{
  var target = "Equinox Holdings, Inc.";
  mongo.connect("mongodb://localhost:27017/twitter-sentiment", function(err, db)
  {
    db.collection("tweets").aggregate([
      {$match : {
                 parent: target
              }
       },
       {$sort : {"favorite_count": -1} },
       {$limit: 5},
       {
         $project:
            {
              "_id": "$parent",
              "score": "$score",
              "tweet": "$text",
              "favorite_count": "$favorite_count",
              "user": "$user.name"
            }
       }
     ], function(err, docs)
      {
        if(err)
         console.log(err);
        console.log(docs);
      });
      db.close();
  });
}


//totalTweetsbySentiment();
//averageSentiment();
//positiveToNegative();
//highestFavorited();
