
function getAnalytics(arr, db , callback)
{
   console.log(arr);

   newArr = arr.map(function(company){ return company['Company Name']; });

   console.log(newArr);

   db.collection('tweets').aggregate([
     {$match:  {  "parent" : {$in: newArr}}

     },
     {$group:  {
                  _id: "$parent",

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
                  },

                  "avg_senti_score":
                       {
                         $avg: "$score"
                       },

                  "score_by_date" : {$push :{"score": "$score", "tweet": "$text", "created_at": "$created_at", "retweet_count": "$retweet_count",
                                             "favorite_count" : "$favorite_count", "user" : "$user.name"}}

              }
      },
      {$project:
                {
                  "parent" : "$_id",
                  "positive_count" : "$positive_count",
                  "negative_count" : "$negative_count",
                  "neutral_count"  : "$neutral_count",
                  "total_count"    : "$total_count",
                  "Average Sentiment Score" : "$avg_senti_score",

                  "score_by_date"  : "$score_by_date",

                  "PtoNRatio" :  {$cond: [{$eq: ['$negative_count', 0]}, '$positive_count',
                                  {$divide:
                                        ["$positive_count","$negative_count"]} ]
                                },

                }
      }
   ], function (err, docs)
   {
     if(!err)
      callback(docs);
     else console.log(err);
   });
}



module.exports =
{
  getAnalytics : getAnalytics
}
