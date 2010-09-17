This is a package for manipulating [generators and iterators](https://developer.mozilla.org/en/JavaScript/Guide/Iterators_and_Generators) in Javascript 1.7+.

A generator is an object returned from a function which contains yield statements.

e.g. in Rhino
		version(180);
    load('stream.js');
    
    var readme = (function(reader) {
      for (var line = reader.readLine(); line; line = reader.readLine()) {
        yield line;
      }
      reader.close();
      throw StopIteration;
    })(new java.io.BufferedReader(new java.io.FileReader('README.md')));
    
		Stream.count(1).zip(readme).drain().forEach(function(pair) { print(pair); });
