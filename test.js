#!/usr/bin/env rhino -version 180

load('stream.js')

// simple stream
var one = (function() { while (true) yield 1 })()

// some stream builders
var all = function(x) { return (function () { while (true) yield x })() }
var from = Stream.unfold(function(x) x + 1 );
var square = Stream.unfold(function(x) x * x );
var triple = Stream.unfold(function(x) x * 3 );
var lines = function(filename) {
  var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
  return (function() {
    while (true) 
      yield reader.readLine();
  })()
}

// tests
var assertEquals = org.junit.Assert.assertEquals;

assertEquals([1,1,1], one.take(3));
assertEquals([3,3,3], all(3).take(3));
assertEquals([1,2,3], from(1).take(3));
assertEquals([4,16,256], square(4).take(3));
assertEquals([2,6,18], triple(2).take(3));
assertEquals([54,162,486], (function() { var iter = triple(2); iter.take(3); return iter.take(3); })() );
assertEquals([0,2,4], from(0).filter(function(val) val % 2 == 0).take(3));
assertEquals([1,4,9], from(1).map(function(x) x*x).take(3));
assertEquals([3,4,5], from(1).skip(2).take(3));

assertEquals(["load('stream.js')"], lines("test.js").skip(2).take(1));

assertEquals([5,5,5], all(3).add(all(2)).take(3));
assertEquals([3,2,3,2], all(3).interleave(all(2)).take(4));
assertEquals([1,4,2,5], from(1).interleave(from(4)).take(4));

var zipped = from(1).zip(all('a')).take(2);
[[1,'a'], [2,'a']].forEach(function(expected, i) {
    assertEquals(expected, zipped[i]);
})

function days() {
  return (function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; })()
}

assertEquals(["mon", "tue", "wed"], days().take(3));
