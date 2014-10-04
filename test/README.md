# mongodb-counter

This is a trivial mongodb auto-increment counter implementation based on [MongoDB Documentation](http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/).

But this implementation requires Mongo 2.4 because it uses the $setOnInsert operation.  Unlike the sample in the documentation, this will allow creating new counters on the fly without initializing the counters to zero.

[![NPM info](https://nodei.co/npm/mongodb-counter.png?downloads=true)](https://npmjs.org/package/mongodb-counter)

[![Travis build status](https://api.travis-ci.org/Like-Falling-Leaves/mongodb-counter.png?branch=master)](
https://travis-ci.org/Like-Falling-Leaves/mongodb-counter)

## Install

    npm install mongodb-counter

## Initialization

```javascript

   // Initialization via mongo URLs of the form: mongodb://user:password@host:port/database
   var counters = require('mongodb-counter').createCounters({mongoUrl: 'mongodb://user:password@host:port/database'});

   // Specifying collection name instead of defaulting to counters collection
   var counters = require('mongodb-counter').createCounters({
     mongoUrl: 'mongodb://user:password@host:port/database',
     collectionName: 'yoyo'
   });

   // Initialization via a pre-created database collection to use
   var counters = require('mongodb-counter').createCounters({collection: db.counters});

```

## API

```javascript

   counters('requests').increment(); // increments by one, throws away the result
   counters('requests').increment(5); // increments by 5 throws away the result
   counters('requests').increment(5, function (err, currentCount) {
     // currentCount is the updated count.
   });

   // increment by one and get the new value
   counters('requests').increment(function (err, currentCount) {
     // currentCount is the updated count.
   });

   counters('requests').decrement(); // same options with decrement
   counters('requests').get(function (err, val) {
     // fetch the current value
   });
   counters('requests').set(52); // update the value.

```

