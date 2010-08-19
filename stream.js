var Stream = (function() {
	let proto = Object.getPrototypeOf(function(){yield 1}());

	let empty = function() {
		let s = (function() { yield 1; })();
		s.next();
		return s;
	};

	let unfold = function(func) {
		return function(seed) {
			for (let next = seed; true; next = func(next)) {
				yield next;
			}
		}
	};

	let count = unfold(function(x) x + 1 );
	let repeat = unfold(function(x) x);

	let cycle = function(stream) {
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

	let fromArray = function(arr) {
		for (var i = 0; i < arr.length; i++) {
			yield arr[i];
		}
		throw StopIteration;
	}

	let take = function(stream, n) {
		for (var i = 0; i < n; i += 1) {
			yield stream.next();
		}
		throw StopIteration;
	}

	let drain = function(stream) {
		let arr = [];
		try {
			while (true) {
				arr.push(stream.next());
			}
		} catch (e if e === StopIteration) {
			return arr;
		}
	}

	let drop = function(stream, n) {
		try {
			for (let i = 0; i < n; i++) {
				stream.next();
			}
			return stream;
		} catch (e if e === StopIteration) {
			return empty();
		}
	}

	let interleave = function() {
		var iters = Array.concat.apply([], arguments);
		for (var i = 0; true; i++) {
			yield iters[i % iters.length].next();
		}
	}

	let zip = function() {
		var iters = Array.concat.apply([], arguments);
		while (true) {
			yield iters.map(function(iter) iter.next());
		}
	}

	let combine = function(combiner, acc) {
		return function() {
			var args = [].concat.apply([], arguments);
			var zipped = zip.apply(null, args);
			return map(zipped, function(values) values.reduce(combiner, acc));
		}
	}

	let filter = function(stream, predicate) {
		while (true) {
			var value = stream.next();
			if (predicate(value)) {
				yield value;
			}
		}
	}

	let map = function(stream, transform) {
		while (true) {
			yield transform(stream.next());
		}
	}

	let concat = function() {
		let args = [].concat.apply([], arguments);
		for (let i = 0; i < args.length; i += 1) {
			try {
				while (true) {
					yield args[i].next();
				}
			} catch (e if e === StopIteration) {
				// go to next stream
			}
		}
		throw StopIteration;
	}

	let contains = function(stream, item) {
		try {
			find(stream, function(curr) curr === item);
			return true;
		} catch (e if e === "Not found") {
			return false;
		}
	}

	let find = function(stream, predicate) {
		try {
			while (true) {
				let curr = stream.next();
				if (predicate(curr)) {
					return curr;
				}
			}
		} catch (e if e === StopIteration) {
			throw "Not found"; // TODO what should this be?
		}
	}

	let builders = {
		empty: empty,
		fromArray: fromArray,
		count: count,
		unfold: unfold,
		repeat: repeat,
		combine: combine,
		concat: concat,
	}
	let methods = {
		drain: drain,
		cycle: cycle,
		take: take,
		drop: drop,
		interleave: interleave,
		map: map,
		filter: filter,
		zip: zip,
		concat: concat,
		contains: contains,
		find: find,
	}

	Object.keys(methods).forEach(function(name) {
		let method = methods[name];
		proto[name] = function() {
			var args = Array.prototype.concat.apply([this], arguments);
			return method.apply(null, args);
		}
	});

	return Object.keys(methods).reduce(function(result, name) {
		result[name] = methods[name];
		return result;
	}, Object.create(builders));
})()
