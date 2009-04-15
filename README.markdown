This is a package for manipulating generator-iterators (streams) in Javascript.

A stream is an object returned from a function which contains yield statements.

e.g.

    function days() {
      yield "Monday";
      yield "Tuesday";
      yield "Wednesday";
      yield "Thursday";
      yield "Friday";
      yield "Saturday";
      yield "Sunday";
    }

    var stream = days();

Out of the box, a stream only has one method: next. This package adds:

    shift, add, zip and interleave

to stream instances, and the globally accessible

    Stream.unfold

method, which provides a simple way of building infinite streams.
