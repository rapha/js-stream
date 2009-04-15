#!/usr/bin/env rhino -version 170

load('iter.js')

// simple stream
var one = (function() { while (true) yield 1 })()

// some stream builders
var all = function(x) { return (function () { while (true) yield x })() }
var from = Generator.unfold(function(x) { return [x, x + 1] });
var square = Generator.unfold(function(x) { return [x, x * x] });
var triple = Generator.unfold(function(x) { return [x, x * 3] });
var lines = function(filename) {
  var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
  return (function() {
    while (true) 
      yield reader.readLine();
  })()
}

// tests
var assertEquals = org.junit.Assert.assertEquals;

assertEquals([1,1,1], one.shift(3));
assertEquals([3,3,3], all(3).shift(3));
assertEquals([1,2,3], from(1).shift(3));
assertEquals([4,16,256], square(4).shift(3));
assertEquals([2,6,18], triple(2).shift(3));
assertEquals([54,162,486], (function() { var iter = triple(2); iter.shift(3); return iter.shift(3); })() );

assertEquals(["#!/usr/bin/env rhino -version 170", ""], lines("test.js").shift(2));

assertEquals([5,5,5], all(3).add(all(2)).shift(3));
assertEquals([3,2,3,2], all(3).interleave(all(2)).shift(4));
assertEquals([1,4,2,5], from(1).interleave(from(4)).shift(4));

var zipped = from(1).zip(all('a')).shift(2); 
assertEquals([1,'a'], zipped[0]);
assertEquals([2,'a'], zipped[1]);

function days() {
  return (function() { yield "mon"; yield "tue"; yield "wed"; yield "thu"; yield "fri"; })()
}

assertEquals(["mon", "tue", "wed"], days().shift(3));
