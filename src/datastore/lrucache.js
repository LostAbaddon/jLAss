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
		this._datastore = new Map();
		this._limit = limit;
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
		v = this._datastore.get(k);
		if (v !== undefined) this._update(k, v)
		return v;
	}
	_update (k, v) {
		this._length ++;
		if (this._length >= this._limit) {
			this._datastore = this._cache;
			this._cache = new Map();
			this._length = 0;
		}
		this._cache.set(k, v);
	}
}

module.exports = LRUCache;

_('DataStore').LRUCache = LRUCache;