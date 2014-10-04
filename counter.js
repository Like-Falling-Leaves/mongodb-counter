var mongodb = require('mongodb');
module.exports = counter;
module.exports.createCounters = createCounters;

function createCounters(options) {
  var counters = counter(options);
  return function (name) {
    return {
      increment: counters.increment.bind(name),
      decrement: counters.decrement.bind(name),
      set: counters.set.bind(name),
      get: counters.get.bind(name)
    };
  }
}

function counter(options) {
  var collection;
  return {
    increment: increment,
    decrement: decrement,
    get: get,
    set: set
  };

  function increment(counterName, by, done) {
    if (typeof(by) == 'function' || typeof(by) == 'undefined') { done = by; by = 1; }
    getCollection(function (err, collection) {
      if (err) return done(err);
      collection.findAndModify(
        {_id: counterName},
        {_id: 1},
        {$inc: {seq: by}, $setOnInsert: {}},
        {upsert: true, new: true},
        function (err, doc) { return done && done(err, doc && doc.seq); }
      );
    });
  }

  function decrement(counterName, by, done) {
    if (typeof(by) == 'function' || typeof(by) == 'undefined') { done = by; by = 1; }
    return increment(counterName, -by, done);
  }

  function get(counterName, done) {
    getCollection(function (err, collection) {
      if (err) return done(err);
      collection.findOne({_id: counterName}, function (err, val) { return done(err, val && val.seq); });
    });
  }

  function set(counterName, seq, done) {
    getCollection(function (err, collection) {
      if (err) return done(err);
      collection.findAndModify(
        {_id: counterName},
        {_id: 1},
        {$set: {seq: seq}},
        {new: true, upsert: true},
        function (err, doc) { return done && done(err, doc && doc.seq); }
      );
    });
  }

  function getCollection(done) {
    if (collection) return done(null, collection);
    if (options.collection) {
      collection = options.collection;
      return done(null, collection);
    }

    mongodb.MongoClient.connect(options.mongoUrl, function (err, _db) {
      if (err) return done(err);
      collection = _db.collection(options.collectionName || 'counters');
      return done(null, collection);
    });
  }
}

