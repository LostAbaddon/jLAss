require('../src');

const LRU = require('../src/datastore/lrucache');
const UFCache = require('../src/datastore/ufcache');

//===================//

class MEM {
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
		this._datastore.set(k, v);
	}
	get (k) {
		return this._datastore.get(k);
	}
}

class TST {
	constructor (limit=100) {
		this._datastore = Object.create(null);
		this._index = 0;
		this._limit = limit;
		this._active = Math.ceil(limit / 2 + limit);
		this._length = 0;
	}
	set (k, v) {
		const p = this._datastore[k];
		this._datastore[k] = [v, this._index ++];
		if (p === undefined) {
			this._length ++;
			this._update();
		}
	}
	get (k) {
		const v = this._datastore[k];
		if (!v) return v;
		v[1] = this._index ++;
		this._update();
		return v[0];
	}
	_update () {
		if (this._length < this._active) return;
		this._length = this._limit;

		const list = [];
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

class LRU2 {
	constructor (limit=100) {
		this._core = new Map();
		this._cache = new Map();
		this._secondary = new Map();
		this._limit = isNaN(limit) ? 100 : limit;
		this._gauge = Math.ceil(this._limit / 2);
		this._length = 0;
		this._count = 0;
	}
	set (k, v) {
		const p = this._cache.get(k);
		if (p === undefined) this._update(k, v);
		else this._cache.set(k, v);
	}
	get (k) {
		var v = this._core.get(k);
		if (v !== undefined) return v;
		v = this._cache.get(k);
		if (v !== undefined) {
			this._upgrade(k, v);
			return v;
		}
		v = this._secondary.get(k);
		if (v !== undefined) this._update(k, v);
		return v;
	}
	del (k) {
		var p = this._core.get(k);
		if (p !== undefined) this._count --;
		p = this._cache.get(k);
		if (p !== undefined) this._length --;
		this._core.delete(k);
		this._cache.delete(k);
		this._secondary.delete(k);
	}
	has (k) {
		return this._cache.has(k) || this._secondary.has(k);
	}
	clear () {
		this._cache = new Map();
		this._secondary = new Map();
		this._count = 0;
		this._length = 0;
	}
	_update (k, v) {
		this._length ++;
		if (this._length >= this._limit) {
			this._secondary = this._cache;
			this._cache = new Map();
			this._length = 0;
		}
		this._cache.set(k, v);
	}
	_upgrade (k, v) {
		this._count ++;
		if (this._count >= this._gauge) {
			this._core = new Map();
			this._core.set(k, v);
			this._count = 0;
		}
	}
}

//===================//

const M = {
	_data: null,
	start: () => {
		var mem = process.memoryUsage();
		M._data = [mem.rss, mem.heapTotal, mem.external];
	},
	finish: () => {
		var mem = process.memoryUsage();
		var deltarss = mem.rss - M._data[0];
		var deltaheap = mem.heapTotal - M._data[1];
		var deltaext = mem.external - M._data[2];
		return [deltarss, deltaheap, deltaext, deltarss + deltaheap + deltaext];
	}
};

const tester = (ds, label, limit=100) => {
	M.start();

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

	console.log(...(M.finish()));

	console.log('=============================');
};

const rndTester = (ds, label, limit=100, task=1000, loop=100) => {
	M.start();

	var start, end, tester;
	tester = new ds(limit);
	if (tester.withWeight) {
		tester.withWeight(v => {
			return v.length;
		})
	}

	var v = 'V: ' + Math.floor(Math.random() * task);

	start = Date.now();
	for (let t = 0; t < loop; t ++) {
		for (let i = 0; i < 10000; i ++) {
			let t = Math.pick(rndTester.policy);
			let j = t ? Math.floor(Math.random() * task) : Math.floor(Math.random() * limit);
			let k = 'K-' + j, v = 'V: ' + j;
			let vv = tester.get(k);
			if (vv !== undefined && v !== vv) console.log(k, v, vv);
			j = t ? Math.floor(Math.random() * task) : Math.floor(Math.random() * limit);
			k = 'K-' + j;
			v = 'V: ' + j;
			tester.set(k, v);
		}
	}
	end = Date.now();
	console.log(label + ' RNDTask Time Used: ' + (end - start) + ' ms.');

	console.log(...(M.finish()));

	console.log('=============================');
};
rndTester.policy = 0.1;

// var limit = 100, task = 100000000;
// var limit = 100000000, task = 100;

// tester(MEM, 'MEM', limit);
// tester(MAP, 'Map', limit);
// tester(LRU, 'LRU', limit);
// tester(TST, 'TST', limit);

var limit = 100, task = 1000000, loop = 100;
// var limit = 100, task = 2000, loop = 100;

// rndTester(MEM, 'MEM', limit, task, loop);
// rndTester(MAP, 'Map', limit, task, loop);
// rndTester(LRU, 'LRU', limit, task, loop);
// rndTester(LRU.withDatastore, 'LRUWDS', limit, task, loop);
// rndTester(LRU2, 'LRU2', limit, task, loop);
rndTester(UFCache, 'UFCache', limit, task, loop);
// rndTester(UFCache.withDatastore, 'UFCacheWDS', limit, task, loop);
// rndTester(TST, 'TST', limit, task, loop);