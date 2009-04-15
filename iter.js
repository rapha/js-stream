var Generator = (function(){yield 1})().__proto__.constructor

Generator.unfold = function(func) {
  return function(start) {
    var prev = start;
    return (function() {
      while (true) {
        var result = func(prev);
        prev = result[1];
        yield result[0];
      }
    })()
  }
}

Generator.prototype.shift = function (n) {
  var list = new Array(n);
  for (var i = 0; i < n; i += 1) {
    list[i] = this.next();
  }
  return list;
}

Generator.prototype.interleave = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  var i = 0;
  return (function() {
    while (true) 
      yield iters[i++ % iters.length].next();
  })()
}

Generator.prototype.add = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  var self = this;
  return (function() {
    while (true) {
      var sum = 0;
      iters.forEach(function(iter) { sum += iter.next() }, 0);
      yield sum;
    }
  })()
},

Generator.prototype.zip = function() {
  var iters = [this];
  Array.prototype.push.apply(iters, arguments);
  return (function() {
    while (true)
      yield iters.map(function(iter) { return iter.next() });
  })()
}

