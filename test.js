#!/usr/bin/env es5

load('stream.js')

// EXAMPLES

// simple stream
var one = (function() { while (true) yield 1 })()

// some stream builders
var all = function(x) { return (function () { while (true) yield x })() }
var from = Stream.unfold(function(x) x + 1 );
var square = Stream.unfold(function(x) x * x );

var lines = function(filename) {
  return (function(reader) {
    for (var line = reader.readLine(); line; line = reader.readLine()) {
      yield line;
    }
    reader.close();
  })(new java.io.BufferedReader(new java.io.FileReader(filename)))
}

var fib = (function() {
  yield 1; yield 1;
  var [prev, curr] = [1, 1];
  while (true) {
    var [prev, curr] = [curr, (prev+curr)]
    yield curr;
  }
})()


var begins = function(stream, arr) {
  org.junit.Assert.assertEquals(arr, stream.take(arr.length));
}

begins(fib, [1,1,2,3,5])

begins(one, [1,1,1]);
begins(all(3), [3,3,3]);
begins(from(1), [1,2,3]);
begins((function() { var s = from(1); s.take(1); return s})(), [2,3,4]);
begins(square(3), [3,9,81]);
begins(from(1).skip(2), [3,4,5]);
begins(from(0).filter(function(val) val % 2 == 0), [0,2,4]);
begins(from(1).map(function(x) x*x), [1,4,9]);
begins(from(1).map(function(x) x*x).map(Math.sqrt), [1,2,3]);

begins(lines("test.js").skip(2), ["load('stream.js')"]);

begins(all(3).add(all(2)), [5,5,5]);
begins(all(3).interleave(all(2)), [3,2,3,2]);
begins(from(1).interleave(from(4)), [1,4,2,5]);

var actual = from(1).zip(all('a')).take(2);
[[1,'a'], [2,'a']].forEach(function(expected, i) {
  org.junit.Assert.assertEquals(expected, actual[i]);
})

var days = function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; }

begins(days(), ["mon", "tue", "wed"]);
