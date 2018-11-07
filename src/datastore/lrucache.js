/**
 * Name:	LRU Cache
 * Desc:    基于Map的最近使用缓存
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.11.05
 */

class LRUCache {
	constructor (limit=100) {
		this._cache = new Map();
		this._secondary = new Map();
		this._limit = isNaN(limit) ? 100 : limit;
		this._length = 0;
	}
	set (k, v) {
		const p = this._cache.get(k);
		if (p === undefined) this._update(k, v);
		else this._cache.set(k, v);
	}
	get (k) {
		var v = this._cache.get(k);
		if (v !== undefined) return v;
		v = this._secondary.get(k);
		if (v !== undefined) this._update(k, v);
		return v;
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
}

class LRUCacheWithDatastore extends LRUCache {
	constructor (limit=100, ds) {
		super(limit);
		this._ds = ds || new Map();
	}
	set (k, v) {
		LRUCache.prototype.set.call(this, k, v);
		this._ds.set(k, v);
	}
	get (k) {
		var v = LRUCache.prototype.get.call(this, k);
		if (v === undefined) {
			v = this._ds.get(k);
			if (v !== undefined) this._update(k, v);
		}
		return v;
	}
}

LRUCache.withDatastore = LRUCacheWithDatastore;

module.exports = LRUCache;

_('DataStore').LRUCache = LRUCache;