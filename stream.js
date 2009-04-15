var Stream = (function(){yield 1})().__proto__.constructor

Stream.unfold = function(func) {
  return function(seed) {
    var arg = seed;
    return (function() {
      while (true) {
        var result = func(arg);
        arg = result[1];
        yield result[0];
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

Stream.prototype.interleave = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  var i = 0;
  return (function() {
    while (true) 
      yield iters[i++ % iters.length].next();
  })()
}

Stream.prototype.add = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  var self = this;
  return (function() {
    while (true) {
      var sum = 0;
      iters.forEach(function(iter) { sum += iter.next() });
      yield sum;
    }
  })()
},

Stream.prototype.zip = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  return (function() {
    while (true)
      yield iters.map(function(iter) { return iter.next() });
  })()
}


