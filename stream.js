var Stream = Object.getPrototypeOf(function(){yield 1}()).constructor

Stream.unfold = function(func) {
  return function(seed) {
		for (let next = seed; true; next = func(next)) {
			yield next;
		}
  }
}

Stream.count = Stream.unfold(function(x) x + 1 );
Stream.repeat = Stream.unfold(function(x) x);
Stream.cycle = function(stream) {
	var vals = [];
	try {
		while (true) {
			let then = stream.next();
			vals.push(then);
			yield then;
		}
	} catch (e if e === StopIteration) {
		let i = 0;
		while (true) {
			yield vals[i];
			i = (i+1) % vals.length;
		}
	}
}
Stream.stream = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		yield arr[i];
	}
	throw StopIteration;
}

Stream.take = function(stream) {
	return function(n) {
		var list = new Array(n);
		for (var i = 0; i < n; i += 1) {
			list[i] = stream.next();
		}
		return list;
	}
}

Stream.drop = function(stream) {
	return function(n) {
		for (var i = 0; i < n; i++) {
			stream.next();
		}
		return stream;
	}
}

Stream.interleave = function() {
  var iters = Array.prototype.concat.apply([], arguments);
	for (var i = 0; true; i++) {
		yield iters[i % iters.length].next();
	}
}

Stream.zip = function() {
  var iters = Array.prototype.concat.apply([], arguments);
	while (true) {
		yield iters.map(function(iter) iter.next());
	}
}

Stream.combine = function(combiner, acc) {
	return function() {
		var args = [].concat.apply([], arguments);
		var groups = Stream.zip.apply(null, args);
		return Stream.map(function(values) values.reduce(combiner, acc))(groups);
	}
}

Stream.filter = function(predicate) {
  return function(stream) {
      while (true) {
        var value = stream.next();
        if (predicate(value)) {
          yield value;
        }
      }
  }
}

Stream.map = function(transform) {
	return function(stream) {
		while (true) {
			yield transform(stream.next());
		}
	}
}
