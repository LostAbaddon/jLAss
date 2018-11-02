require('../src');

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

class MAP {
	constructor () {
		this._datastore = new Map();
	}
	set (k, v) {
		this._datastore[k] = v;
	}
	get (k) {
		return this._datastore[k];
	}
}

class LRU {
	constructor (limit=100) {
		this._cache = Object.create(null);
		this._datastore = Object.create(null);
		this._limit = limit;
	}
	set (k, v) {
		if (this._cache[k] === undefined) this._update()
		this._cache[k] = v;
	}
	get (k) {
		var v = this._cache[k];
		if (v !== undefined) return v;
		v = this._datastore[k];
		if (v !== undefined) this._update()
		return v;
	}
	_update () {
		if (Object.keys(this._cache).length < this._limit) return;
		this._datastore = this._cache;
		this._cache = Object.create(null);
	}
}

class ADV {
	constructor (limit=100) {
		this._datastore = Object.create(null);
		this._index = 0;
		this._count = 0;
		this._limit = limit;
	}
	set (k, v) {
		this._datastore[k] = [v, this._index ++];
		this._update();
	}
	get (k) {
		var v = this._datastore[k];
		if (!v) return v;
		v[1] = this._index ++;
		this._update();
		return v[0];
	}
	_update () {
		this._count ++;
		if (this._count < this._limit) return;
		if (Object.keys(this._datastore).length < this._limit) return;

		this._count = 0;
		var list = [];
		for (let k in this._datastore) {
			let [v, c] = this._datastore[k];
			list.push([k, v, c]);
		}
		list.sort((a, b) => b[2] - a[2]);

		list.splice(0, this._limit);
		for (let e of list) {
			let k = e[0];
			delete this._datastore[k];
		}
		return;

		list = list.splice(0, this._limit);
		this._datastore = Object.create(null);
		for (let e of list) {
			let [k, v, c] = e;
			this._datastore[k] = [v, c];
		}
	}
}

const tester = (ds, label, limit=100) => {
	var mem = process.memoryUsage();
	console.log(mem.rss, mem.heapTotal, mem.external, mem.rss + mem.heapTotal + mem.external);

	var start, end, tester;
	tester = new ds(limit);

	start = Date.now();
	for (let t = 0; t < 100; t ++) {
		for (let i = 0; i < 10; i ++) {
			let k = 'K-' + i, v = 'V-' + i;
			for (let j = 0; j < 1000; j ++) {
				let vv = tester.get(k);
				if (!vv) tester.set(k, v);
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
				let vv = tester.get(k);
				if (!vv) tester.set(k, v);
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
				let vv = tester.get(k);
				if (!vv) tester.set(k, v);
			}
		}
	}
	end = Date.now();
	console.log(label + ' Task-3 Time Used: ' + (end - start) + ' ms.');

	start = Date.now();
	for (let t = 0; t < 100; t ++) {
		for (let i = 0; i < 1000; i ++) {
			for (let j = 0; j < 10; j ++) {
				let p = Math.ceil(Math.random() * 1000);
				let k = 'K-' + p, v = 'V-' + p;
				let vv = tester.get(k);
				if (!vv) tester.set(k, v);
			}
		}
	}
	end = Date.now();
	console.log(label + ' Task-4 Time Used: ' + (end - start) + ' ms.');

	mem = process.memoryUsage();
	console.log(mem.rss, mem.heapTotal, mem.external, mem.rss + mem.heapTotal + mem.external);

	console.log('=============================');
};

var limit = 100;
tester(Raw, 'Raw', limit);
tester(MAP, 'Map', limit);
tester(ADV, 'ADV', limit);
tester(LRU, 'LRU', limit);