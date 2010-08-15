#!/usr/bin/env rhino -version 180 -debug

load('stream.js')

// EXAMPLES

// simple stream
// some stream builders
var square = Stream.unfold(function(x) x * x );

var lines = function(filename) {
  return (function(reader) {
    for (var line = reader.readLine(); line; line = reader.readLine()) {
      yield String(line);
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
	var expected = arr.toSource(),
			actual = stream.take(arr.length).toSource();
	if (expected !== actual) throw 'Expected '+expected+' but was '+actual+'.'
}

begins(fib, [1,1,2,3,5])

begins(Stream.repeat(3), [3,3,3]);
begins(Stream.count(1), [1,2,3]);
begins((function() { var s = Stream.count(1); s.take(1); return s})(), [2,3,4]);
begins(square(3), [3,9,81]);
begins(Stream.count(1).drop(2), [3,4,5]);
begins(Stream.count(0).filter(function(val) val % 2 == 0), [0,2,4]);
begins(Stream.count(1).map(function(x) x*x), [1,4,9]);
begins(Stream.count(1).map(function(x) x*x).map(Math.sqrt), [1,2,3]);

begins(lines("test.js").drop(2), ["load('stream.js')"]);

begins(Stream.repeat(3).add(Stream.repeat(2)), [5,5,5]);
begins(Stream.repeat(3).interleave(Stream.repeat(2)), [3,2,3,2]);
begins(Stream.count(1).interleave(Stream.count(4)), [1,4,2,5]);

begins(Stream.count(1).zip(Stream.repeat('a')), [[1,'a'], [2,'a']]);

var days = function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; }

begins(days(), ["mon", "tue", "wed"]);

begins(Stream.cycle([1,2,3]), [1,2,3,1,2,3,1]);
