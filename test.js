#!/usr/bin/env rhino -version 180 -debug

load('stream.js')

// EXAMPLES

// simple stream
// some stream builders
var stream = Stream.stream,
		unfold = Stream.unfold,
		repeat = Stream.repeat,
		count = Stream.count,
		cycle = Stream.cycle,
		take = Stream.take,
		drop = Stream.drop,
		interleave = Stream.interleave,
		map = Stream.map,
		filter = Stream.filter,
		combine = Stream.combine,
		zip = Stream.zip;

var add = combine(function(a,b) a + b, 0);

var square = function(x) { return x * x; };

var doubling = unfold(function(x) x + x );

var lines = function(filename) {
	let reader = new java.io.BufferedReader(new java.io.FileReader(filename));
	for (let line = reader.readLine(); line; line = reader.readLine()) {
		yield String(line);
	}
	reader.close();
	throw StopIteration;
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
			actual = take(stream)(arr.length).toSource();
	if (expected !== actual) throw 'Expected '+expected+' but was '+actual+'.'
}

var becomes = function(stream, arr) {
	begins(stream, arr);
	try {
		var then = stream.next();
		throw 'Expected stream to be exhausted, but still had ' + then;
	} catch (e if e === StopIteration) {
		return; // success
	}
}

begins(fib, [1,1,2,3,5])

begins(repeat(3), [3,3,3]);
begins(count(1), [1,2,3]);
begins((function() { var s = count(1); take(s)(1); return s})(), [2,3,4]);
begins(doubling(3), [3,6,12]);
begins(drop(count(1))(2), [3,4,5]);
begins(filter(function(val) val % 2 == 0)(count(0)), [0,2,4]);
begins(map(square)(count(1)), [1,4,9]);
begins(map(Math.sqrt)(map(square)(count(1))), [1,2,3]);

begins(drop(lines("test.js"))(2), ["load('stream.js')"]);

begins(add(repeat(3), repeat(2)), [5,5,5]);
begins(interleave(repeat(3), repeat(2)), [3,2,3,2]);
begins(interleave(count(1), count(4)), [1,4,2,5]);

begins(zip(count(1), repeat('a')), [[1,'a'], [2,'a']]);

var days = function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; }

begins(days(), ["mon", "tue", "wed"]);

becomes(stream([1,2,3]), [1,2,3]);
begins(cycle(stream([1,2,3])), [1,2,3,1,2,3,1]);
