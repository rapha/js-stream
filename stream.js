var Stream = {

  shift : function(n, stream) {
    var list = new Array(n);
    for (var i = 0; i < n; i += 1) {
      list[i] = stream();
    }
    return list;
  },

  Combine : {
    interleave : function() {
      var streams = arguments;
      var i = 0;
      return function() {
        return streams[i++ % streams.length]();
      }
    },

    add : function() {
      var streams = Array.prototype.slice.call(arguments, 0);
      return function() {
        var sum = 0;
        streams.forEach(function(stream) { sum += stream() }, 0);
        return sum;
      }
    },

    zip : function() {
      var streams = Array.prototype.slice.call(arguments, 0);
      return function() {
        return streams.map(function(stream) { return stream() });
      }
    }

  },

  Build : {
    unfold : function(func) {
      return function(start) {
        var prev = start;
        return function() {
          var result = func(prev);
          prev = result[1];
          return result[0];
        }
      }
    }
  }
}

