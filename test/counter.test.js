var assert = require('assert');
var counter = require('../counter.js')({mongoUrl: 'mongodb://127.0.0.1/test'});
var counters = require('../counter.js').createCounters({mongoUrl: 'mongodb://127.0.0.1/test'});
var nn = (new Date()).getTime();

describe('MongoDB Counter', function () {
  this.timeout(5000);

  it('Should create a new counter successfully on first increment', function (done) {
    counter.increment('test1' + nn, 1, function (err, val) {
      assert.ok(!err);
      assert.equal(val, 1);
      done();
    });
  });

  it('Should increment a counter by if number not specified', function (done) {
    counter.increment('test2' + nn, 2, function (err, val) {
      assert.ok(!err);
      assert.equal(val, 2);
      counter.increment('test2' + nn, function (err, val) {
        assert.ok(!err);
        assert.equal(val, 3);
        done();
      });
    });
  });

  it('Should decrement a counter', function (done) {
    counter.increment('test3' + nn, 2, function (err, val) {
      assert.ok(!err);
      assert.equal(val, 2);
      counter.decrement('test3' + nn, function (err, val) {
        assert.ok(!err);
        assert.equal(val, 1);
        done();
      });
    });
  });

  it('Should get and set counters', function (done) {
    counter.increment('test4' + nn, 2, function (err, val) {
      assert.ok(!err);
      assert.equal(val, 2);
      counter.set('test4' + nn, 42, function (err, val) {
        assert.ok(!err);
        assert.equal(val, 42);
        counter.get('test4' + nn, function (err, val) {
          assert.ok(!err);
          assert.equal(val, 42);
          done();
        });
      });
    });
  });

  it ('should do getNextUniqueId really fast', function (done) {
    var cc = counters('test5' + nn);

    cc.getNextUniqueId(function (err, val) {
      assert.ok(!err);
      var val2 = 0;
      cc.getNextUniqueId(function (err, val) {
        assert.ok(!err);
        val2 = val;
      });
      assert.ok(val2);
      assert.equal(val + 1, val2);
      done();
    });
  });
});
