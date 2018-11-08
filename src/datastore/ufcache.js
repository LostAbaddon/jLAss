/**
 * Name:	Usage Frequency Cache
 * Desc:    基于Map的高频数据缓存
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2018.11.07
 */

const config = {
	frequency: 50,
	delay: 0.9,
	size: 100
};

class UFCache {
	constructor (frequency=config.frequency, delay=config.delay, size=config.size) {
		if (isNaN(frequency)) {
			this.frequency = frequency.frequency * 1 || config.frequency;
			this.delay = frequency.delay * 1 || config.delay;
			this.size = frequency.size * 1 || config.size;
		}
		else {
			this.frequency = frequency * 1 || config.frequency;
			this.delay = delay * 1 || config.delay;
			this.size = size * 1 || config.size;
		}
		this._cache = new Map();
		this._time = 0;
	}
	set (k, v) {
		var p = this._cache.get(k);
		if (!p) {
			p = [v, 0];
			this._cache.set(k, p);
		}
		else {
			p[0] = v;
		}
		p[1] ++;
		this._update();
	}
	get (k) {
		var v = this._cache.get(k);
		if (v === undefined) return v;
		v[1] ++;
		this._update();
		return v[0];
	}
	del (k) {
		this._cache.delete(k);
	}
	has (k) {
		return this._cache.has(k);
	}
	clear () {
		this._cache = new Map();
		this._time = 0;
	}
	_update (k, v) {
		this._time ++;
		if (this._time <= this.frequency) return;
		this._time = 0;
		if (this._cache.size <= this.size) return;
		var keys = Array.from(this._cache.keys());
		var remove = [];
		keys.forEach(k => {
			let v = this._cache.get(k);
			let f = v[1] * this.delay;
			if (f < this.delay) {
				this._cache.delete(k);
			}
			else {
				v[1] = f;
			}
		});
	}
}

class UFCacheWithDatastore extends UFCache {
	constructor (...args) {
		super(...args);
		var i = args.query(a => isNaN(a));
		if (i < 0) {
			this._ds = new Map();
		}
		else {
			this._ds = args[i];
		}
	}
	set (k, v) {
		UFCache.prototype.set.call(this, k, v);
		this._ds.set(k, v);
	}
	get (k) {
		var v = UFCache.prototype.get.call(this, k);
		if (v === undefined) {
			v = this._ds.get(k);
			if (v !== undefined) this._update(k, v);
		}
	}
	del (k) {
		UFCache.prototype.del.call(this, k);
		this._ds.delete(k);
	}
}

UFCache.withDatastore = UFCacheWithDatastore;

module.exports = UFCache;

_('DataStore').UFCache = UFCache;