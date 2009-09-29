var Stream = (function(){yield 1})().__proto__.constructor

Stream.unfold = function(func) {
  return function(seed) {
    return (function() {
      for (var next = seed; true; next = func(next)) {
        yield next;
      }
    })()
  }
}

Stream.prototype.take = function(n) {
  var list = new Array(n);
  for (var i = 0; i < n; i += 1) {
    list[i] = this.next();
  }
  return list;
}

Stream.prototype.skip = function(n) {
  for (var i = 0; i < n; i++) {
    this.next();
  }
  return this;
}

Stream.prototype.interleave = function() {
  var iters = Array.prototype.concat.apply([this], arguments);
  return (function() {
    for (var i = 0; true; i++) {
      yield iters[i % iters.length].next();
    }
  })()
}

Stream.prototype.add = function() {
  var iters = Array.prototype.concat.apply([this], arguments);
  return (function() {
    while (true) {
      var sum = 0;
      iters.forEach(function(iter) { sum += iter.next() });
      yield sum;
    }
  })()
},

Stream.prototype.zip = function() {
  var iters = Array.prototype.concat.apply([this], arguments);
  return (function() {
    while (true)
      yield iters.map(function(iter) { return iter.next() });
  })()
}

Stream.prototype.filter = function(predicate) {
  var self = this;
  return (function() {
      while (true) {
        var value = self.next();
        if (predicate(value)) {
          yield value;
        }
      }
  })()
}

Stream.prototype.map = function(transform) {
  var self = this;
  return (function() {
      while (true) {
        yield transform(self.next());
      }
  })()
}
