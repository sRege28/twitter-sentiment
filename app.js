var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config.js');

var app = express();

var mongoPool = require('express-mongo-db');

var companyModule = require('./services/competitor.js');

var tweetModule = require('./services/getTweets.js');

var filterModule = require("./services/filterData.js");

var scraper = require('./services/webScraper.js');

var analytics = require('./services/analytics.js');

var async = require("async");



app.set('port', (process.env.PORT || 3000));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoPool(config.db.url));

app.use('/', index);
app.use('/users', users);


app.get('/autocomplete',function(req, res)
{
    //console.log(req.query.term);

    var b = req.query.term;
    var db = req.db;
    db.collection('searchIndex', function(err, collection) {
      collection.find({ "name" : new RegExp(b, 'i') }).limit(5).toArray(function(err, items) {
                if(err)
                  console.log(err);
                  items.forEach(function(i){console.log(i.name);})
                res.jsonp(items);
            });
        });

});



app.post('/competitors',function(req,res)
{
   var companyName = req.body.term;
   var db = req.db;
   var filters = JSON.parse(req.body.filters);
   console.log(filters);
   companyModule.findSimilarCompanies(db, companyName ,function(results,target)
   {
       filterModule.filterTopCompetitors(results, target, filters, function(err, results)
       {
         if(err)
            console.log(err);
          else {
            console.log("Filtered...");
            res.jsonp({competitors: results, company: target});
          }
       });
   });

});


app.post("/tweets", function(req,res, next)
{
   var arr = JSON.parse(req.body.arr);
   //console.log("Length of array "+arr.length+" ok\n");
   //console.log(arr);
   var db = req.db;
   var solns = [];

   async.each(arr, function(datum, cb)
     {
       //console.log(datum);
       scraper.getTwitterHandles(datum, function(i)
      {
          tweetModule.findTweets(i,cb);
      });
   },
   function(err)
   {
     if(err)
      res.jsonp(err);
      else
      {
        console.log("Sending success to client...");
        //res.jsonp({msg : "Done!"});
        next();
      }
   });
});


app.post("/tweets", function(req,res)
{
  console.log("Next route called!");
  var arr = JSON.parse(req.body.arr);
  var db = req.db;
  var solns = [];
  //console.log(arr);

  async.each(arr, function(datum, cb)
    {
      analytics.applyAnalytics(datum, db, function(report)
        {
           //console.log(report);
           solns.push(report);
           cb();
        })
    }, function(err)
    {
      console.log("All values in array done!");
      if(!err)
       res.jsonp(solns);
      else
      console.log(err);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), function(err)
{
  if(err)
    console.log(err);
  else
    console.log("Magic at port 3000..");

});
