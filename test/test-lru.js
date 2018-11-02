require('../src');

var s = String.random(10);
console.log(s);
console.log(s.prepadding(20, '_'));
console.log(s.prepadding(20, '_', true));

return;

class Raw {
	constructor () {
		this._datastore = Object.create(null);
	}
	set (k, v) {
		this._datastore[k] = v;
	}
	get (k) {
		return this._datastore[k];
	}
}

class LRU {
	constructor () {
		this._cache = Object.create(null);
		this._datastore = Object.create(null);
		this.limit = 100;
	}
	set (k, v) {
		if (this._cache[k] === undefined && Object.keys(this._cache).length >= this.limit) {
			this._datastore = this._cache;
			this._cache = Object.create(null);
		}
		this._cache[k] = v;
	}
	get (k) {
		var v = this._cache[k];
		if (v !== undefined) return v;
		v = this._datastore[k];
		if (v !== undefined  && Object.keys(this._cache).length >= this.limit) {
			this._datastore = this._cache;
			this._cache = Object.create(null);
		}
		return v;
	}
}

const tester = (ds, label) => {
	var start, end, tester;
	tester = new ds();
	for (let i = 0; i < 10; i ++) {
		let k = 'K-' + i, v = 'V-' + i;
		tester.set(k, v);
	}

	start = Date.now();
	for (let t = 0; t < 100; t ++) {
		for (let i = 0; i < 10; i ++) {
			let k = 'K-' + i, v = 'V-' + i;
			for (let j = 0; j < 1000; j ++) {
				tester.get(k);
			}
		}
	}
	end = Date.now();
	console.log(label + ' Task-1 Time Used: ' + (end - start) + ' ms.');

	start = Date.now();
	for (let t = 0; t < 100; t ++) {
		for (let i = 0; i < 100; i ++) {
			let k = 'K-' + i, v = 'V-' + i;
			for (let j = 0; j < 100; j ++) {
				tester.get(k);
			}
		}
	}
	end = Date.now();
	console.log(label + ' Task-2 Time Used: ' + (end - start) + ' ms.');

	start = Date.now();
	for (let t = 0; t < 100; t ++) {
		for (let i = 0; i < 1000; i ++) {
			let k = 'K-' + i, v = 'V-' + i;
			for (let j = 0; j < 10; j ++) {
				tester.get(k);
			}
		}
	}
	end = Date.now();
	console.log(label + ' Task-3 Time Used: ' + (end - start) + ' ms.');
};

tester(Raw, 'Raw');
tester(LRU, 'LRU');