var mongo = require("mongodb").MongoClient;

var config = {
    url: 'mongodb://localhost:27017/twitter-sentiment',
    coll : 'hooverData_2'
}

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done(state.db)

  mongo.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    done(state.db)
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}
