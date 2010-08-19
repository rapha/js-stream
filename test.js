#!/usr/bin/env rhino -version 180 -debug

load('stream.js')

var empty = Stream.empty,
		fromArray = Stream.fromArray,
		drain = Stream.drain,
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
		zip = Stream.zip,
		concat = Stream.concat,
		contains = Stream.contains,
		find = Stream.find;

// TESTS

var begins = function(stream, arr) {
	equals(stream.take(arr.length).drain(), arr);
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

var equals = function(actual, expected) {
	if (expected.toSource() !== actual.toSource()) {
		throw 'Expected ' + expected.toSource() + ' but was ' + actual.toSource();
	}
}

var raises = function(code, exception) {
	try {
		code();
		equals("no exception", exception);
	} catch (e) {
		equals(e, exception);
	}
}

// empty
becomes(empty(), []);

// fromArray 
becomes(fromArray([1,2,3]), [1,2,3]);
becomes(fromArray([]), []);

// drain
equals(drain(fromArray([1,2,3])), [1,2,3]);
equals(fromArray([1,2,3]).drain(), [1,2,3]);

// unfold
begins(unfold(function(x) x)(0), [0,0,0]);
begins(unfold(function(x) x + x)(3), [3,6,12]);
begins(unfold(function(){throw StopIteration})(3), []);

// repeat
begins(repeat(5), [5,5,5]);

// count
begins(count(1), [1,2,3]);
begins(count(4), [4,5,6]);

// cycle 
begins(cycle(fromArray([1,2])), [1,2,1,2,1]);
begins(cycle(fromArray([])), []);
begins(fromArray([1,2]).cycle(), [1,2,1,2,1]);

// take
becomes(take(fromArray([1,2,3]), 1), [1]);
becomes(take(fromArray([1,2,3]), 0), []);
becomes(take(fromArray([1]), 2), [1]);
becomes(fromArray([1]).take(2), [1]);

// drop
begins(drop(fromArray([1,2,3]), 0), [1,2,3]);
begins(drop(fromArray([1,2,3]), 1), [2,3]);
begins(drop(fromArray([1,2,3]), 4), []);
begins(fromArray([1,2,3]).drop(2), [3]);

// interleave
begins(interleave(count(1)), [1,2]);
begins(interleave(repeat(1), repeat(2), repeat(3)), [1,2,3,1,2,3,1]);
becomes(interleave(fromArray([1,2]), repeat(5)), [1,5,2,5]);

// map
begins(map(count(1), function(x) x * x), [1,4,9,16]);
begins(count(1).map(function(x) x * x), [1,4,9,16]);

// filter
begins(filter(count(1), function(x) x % 2), [1,3,5,7]);
begins(count(1).filter(function(x) x % 2), [1,3,5,7]);

// combine
begins(combine(function(a,b) a * b, 1)(count(1), repeat(4)), [4,8,12,16]);

// zip
begins(zip(count(1), count(3)), [[1,3], [2,4], [3,5]]);
begins(zip(count(1), fromArray(['a'])), [[1,'a']]);
begins(count(1).zip(count(3)), [[1,3], [2,4], [3,5]]);

// concat
becomes(concat(fromArray([1,2]), fromArray([3,4]), fromArray([5,6])), [1,2,3,4,5,6]);
begins(fromArray([1,2]).concat(fromArray([3,4]), repeat(5)), [1,2,3,4,5,5]);

// contains 
equals(contains(fromArray([1,2]), 1), true)
equals(contains(fromArray([1,2]), 3), false)
equals(contains(fromArray([]), 3), false)
equals(fromArray([1,2,3]).contains(3), true);

// find
let even = function(x) x % 2 === 0
equals(find(fromArray([1,2,3,4]), even), 2);
raises(function() find(fromArray([1,3,5]), even), "Not found");
equals(count(1).find(even), 2);

// EXAMPLES

var lines = function(inputReader) {
	let reader = new java.io.BufferedReader(inputReader);
	for (let line = reader.readLine(); line; line = reader.readLine()) {
		yield String(line);
	}
	reader.close();
	throw StopIteration;
}

var fib = function() {
  yield 1; yield 1;
  var [prev, curr] = [1, 1];
  while (true) {
    var [prev, curr] = [curr, (prev+curr)]
    yield curr;
  }
}

begins(lines(new java.io.FileReader("test.js")).drop(2), ["load('stream.js')"]);

begins(fib(), [1,1,2,3,5,8,13])

