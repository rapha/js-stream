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

Out of the box, a stream has the method: `next`.

This package adds `take`, `skip`, `interleave`, `add`, `zip`, `filter` and `map` to stream instances, as well as the globally accessible `Stream.unfold` function, which provides a simple way to build infinite streams.
