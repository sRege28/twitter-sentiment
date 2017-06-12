var async = require("async");

function totalTweetsbySentiment(parent, db, report, callback)
{
  db.collection("tweets", function(err, coll)
    {
      coll.aggregate([
        {$match:{
                   parent: parent
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
            },

            "total_count":
            {
              $sum: 1
            }
          }
        }
      ], function(err, docs)
      {
        //docs[0].parent = parent;
        report.countOftweets = docs;
        callback();
      });
    });
}

function averageSentiment(parent, db, report, callback)
{
  db.collection("tweets").aggregate([
    {$match : {
               parent: parent
            }
    },
    {$group:
      {
         "_id": null,
         "Average Sentiment Score":
              {
                $avg: "$score"
              }
      }
    }
  ], function(err,docs)
  {
    if(err)
      console.log(err);
     report.average_sentiment = docs;
    callback();
  });
}

function positiveToNegative(parent, db, report, callback)
{
   db.collection("tweets").aggregate([
     {$match : {
                parent: parent
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
          {"PtoNRatio": {$cond: [{$eq: ['$negative_count', 0]}, '$positive_count',
                          {$divide:
                                ["$positive_count","$negative_count"]} ]
                        }
          }
        }
   ], function(err, docs)
   {
     if(err)
       console.log(err);
     report.positive_to_negative = docs;
     callback();
   });
}

function highestRetweeted(parent, db, report, callback)
{

  db.collection("tweets").aggregate([
    {$match : {
               parent: parent
            }
     },
     {$sort : {"retweet_count": -1} },
     {$limit: 5},
     {
       $project:
          {

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
      report.highest_retweeted = docs;
      callback();
    });

}


function highestFavorited(parent, db, report, callback)
{
  db.collection("tweets").aggregate([
    {$match : {
               parent: parent
            }
     },
     {$sort : {"favorite_count": -1} },
     {$limit: 5},
     {
       $project:
          {

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
      report.highest_favorited = docs;
      callback();
    });
}

function getScoreDistribution(parent, db, report, callback)
{
  console.log("Score distrib");
  db.collection("tweets").aggregate([
    {$match : {
               parent: parent
            }
     },
     {
       $project:
                {
                  "score": "$score",
                  "tweet": "$text",
                  "created_at": "$created_at"
                }
     }
  ], function(err, docs)
    {
      if(err)
       console.log(err);
      report.score_by_date = docs;
      callback();
    })
}

function applyAnalytics(company, db, callback)
{
  //console.log("Satrtin analytics");
  var analyzed_tweet = {};
  analyzed_tweet.parent = company["Company Name"];
  analyzed_tweet.average_sentiment = null;
  var parent = company["Company Name"];
  async.applyEach([totalTweetsbySentiment, averageSentiment, positiveToNegative, highestRetweeted, highestFavorited, getScoreDistribution], parent, db, analyzed_tweet,
    function(err)
      {
           if(err) console.log(err);
           console.log("All analytics completed!");
           callback(analyzed_tweet);
      });
}

module.exports =
{
  applyAnalytics : applyAnalytics
}
