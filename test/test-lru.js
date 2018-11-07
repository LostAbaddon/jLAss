require('../src');

const LRU = require('../src/datastore/lrucache');
const UFCache = require('../src/datastore/ufcache');

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
	var v = 'V: ' + Math.floor(Math.random() * task);

	start = Date.now();
	for (let t = 0; t < loop; t ++) {
		for (let i = 0; i < 10000; i ++) {
			let j = Math.floor(Math.random() * task);
			let k = 'K-' + j, v = 'V: ' + j;
			let vv = tester.get(k);
			if (vv !== undefined && v !== vv) console.log(k, v, vv);
			j = Math.floor(Math.random() * task);
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
// rndTester(TST, 'TST', limit, task, loop);
rndTester(UFCache, 'UFCache', limit, task, loop);
rndTester(UFCache.withDatastore, 'UFCacheWDS', limit, task, loop);