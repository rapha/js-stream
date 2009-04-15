#!/usr/bin/env rhino -version 170

load('stream.js')

// simple stream
var one = function() { return 1 }

// some stream builders
var all = function(x) { return function () { return x } }
var from = Stream.Build.unfold(function(x) { return [x, x + 1] });
var square = Stream.Build.unfold(function(x) { return [x, x * x] });
var triple = Stream.Build.unfold(function(x) { return [x, x * 3] });
var lines = function(filename) {
  var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
  return function() {
    return reader.readLine();
  }
}

// tests
var assertEquals = org.junit.Assert.assertEquals;
var shift = Stream.shift, add = Stream.Combine.add, interleave = Stream.Combine.interleave;

assertEquals([1,1,1], shift(3, one));
assertEquals([1,1,1], shift(3, one));
assertEquals([3,3,3,3], shift(4, all(3)));
assertEquals([1,2,3], shift(3, from(1)));
assertEquals([4,16,256], shift(3, square(4)));
assertEquals([2,6,18], shift(3, triple(2)));
assertEquals([54,162,486], function() { var stream = triple(2); shift(3, stream); return shift(3, stream) }() );

assertEquals(["#!/usr/bin/env rhino -version 170", ""], shift(2, lines("test.js")));

assertEquals([5,5,5], shift(3, add(all(3), all(2))));
assertEquals([3,2,3,2,3,2], shift(6, interleave(all(3), all(2))));
assertEquals([1,4,2,5,3,6], shift(6, interleave(from(1), from(4))));
assertEquals([1,4,2,5,3,6], shift(6, interleave(from(1), from(4))));

var zipped = shift(2, Stream.Combine.zip(from(1), all('a')));
assertEquals([1,'a'], zipped[0]);
assertEquals([2,'a'], zipped[1]);

function days() {
  var it = (function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; })()
  return function() { return it.next(); }
}

assertEquals(["mon", "tue", "wed"], shift(3, days()));
