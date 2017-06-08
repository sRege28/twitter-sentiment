var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoPool = require('express-mongo-db');

var companyModule = require('./services/competitor.js');

var tweetModule = require('./services/getTweets.js');

var scraper = require('./services/webScraper.js');

var async = require("async");

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

app.use(mongoPool('mongodb://localhost:27017/twitter-sentiment'));

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

   companyModule.findSimilarCompanies(db, companyName ,function(results,target)
   {
      res.jsonp(results);
   });

});


app.post("/tweets", function(req,res)
{
   var arr = JSON.parse(req.body.arr);
   var db = req.db;
   var solns = [];

   async.each(arr, function(datum, cb)
     {
       scraper.getTwitterHandles(datum, function(i)
      {
          tweetModule.findTweets(i);
      });
   },
   function(err)
   {
       //tweetModule.findTweets(solns);
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

app.listen(3000, function(err)
{
  if(err)
    console.log(err);
  else
    console.log("Magic at port 3000..");

});
