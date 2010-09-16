This is a package for manipulating generator-iterators (streams) in Javascript.

A stream is an object returned from a function which contains yield statements.

e.g.
    version('180');
    load('stream.js');
    
    var readme = (function(reader) {
      for (var line = reader.readLine(); line; line = reader.readLine()) {
        yield line;
      }
      reader.close();
      throw StopIteration;
    })(new java.io.BufferedReader(new java.io.FileReader('README.md')));
    
		Stream.count(1).zip(readme).drain().forEach(function(pair) { print(pair); });

Out of the box, a stream has the method: `next`.

This package adds `take`, `skip`, `interleave`, `add`, `zip`, `filter` and `map` to stream instances, as well as the top-level `Stream.unfold` function, which provides a simple way to build infinite streams.
