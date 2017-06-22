
function getCompany(db,callback)
{
     db.collection["hooverData_2"].find({"Company Name": "A T I Funding Corporation"}).toArray(function(err,docs)
     {
        callback(docs);
     });
}

function getCompetitors(arr)
{
  if(Array.isArray)
  {
    console.log("Array");
    console.log(arr.length);
    console.log(arr[0]);
  }

  db.collection["hooverData_2"].count({'DB Hoovers Industry': type}, function(conut)
  {
    console.log(conut);
  });
}


db.companies.ensureIndex({"ANZSIC 2006 Description": "text", "UK SIC 2007 Description":"text", "NAICS 2012 Description" : "text", "US SIC 1987 Description" : "text", "Business Description" : "text"}, {"name" : "matcher"});


{
  "$match" : {"_id" : {"$in" : arrayIds}}
},




coll.aggregate([
  {$match:{
      $and:[
            { parent: "Equinox Holdings, Inc." },
            { score: {$gt : 0} }
           ]
    }
  }
]




"positive_count":
  {
     $sum:
     {
        $cond: [{$gt: ["score", 0]},1,0]
     }
  },


{$sort : {"$retweet_count":1} }

  {$limit: 5},
  {
    $project:
       {
         "_id": "$parent",
         "score": "$score",
         "tweet": "$text",
         "user" : "$user.name"
       }
  }










db.companies.aggregate([{ $group: {_id: '$Twitter Handle', values: {$sum: 1} }  }]);

















,
   {"$text": {"$search": 'Business Description'}},
      {"score": {"$meta": 'textScore'}},
        {"sort": {"score" : {"$meta": 'textScore'}}}








        async.waterfall([
          //async.apply(sortByDescriptionSimilarity, competitors, target),
          async.apply(sortByEmployees,competitors, target),
          sortByProfits,
          sortByRevenue,
          sortByLiabilities,
          matchByState],
          function(results, target)
          {
             //console.log(results);
          });




          sortByEmployees(competitors, target,
            function(c,t)
            {
              sortByProfits(c,t,
                function(c1,t1)
                {
                   //console.log(c1);
                });
            });






db.companies.find({ "Company Name" : new RegExp("am", 'i') })







 db.companies.findOne(function(doc)
{   var url =
    db.urls.find({ "D-U-N-S Number" : doc["D-U-N-S Number"] },function(e)
    {return e["URL"]});
    db.companies.update({"_id":  doc["_id" ] },{ $set: {  "url" : url}}  );

});



















        db.companies.aggregate([{ $match: { $text: { $search: "metal"}}},{$sort: { score: { $meta: "textScore" }, posts: -1 }}]);
