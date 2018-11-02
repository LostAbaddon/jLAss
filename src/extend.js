/**
 * Name:	Auxillary Utils and Extends
 * Desc:    常用基础类拓展
 * Author:	LostAbaddon
 * Version:	0.0.3
 * Date:	2017.11.09
 */

try {
	if (!global) window.global = global;
}
catch (e) {
	if (!!window) window.global = global;
}

// Strng Extends

String.prototype.prepadding = function (len = 0, pad = ' ', is_left = true) {
	var l = this.length;
	l = len - l;
	if (l <= 0) return this.toString();
	var result = this.toString();
	if (is_left) for (let i = 0; i < l; i ++) result = pad + result;
	else for (let i = 0; i < l; i ++) result = result + pad;
	return result;
};

const KeySet = [];
(() => {
	for (let i = 0; i < 10; i ++) KeySet.push('' + i);
	for (let i = 65; i <= 90; i ++) KeySet.push(String.fromCharCode(i));
	for (let i = 97; i <= 122; i ++) KeySet.push(String.fromCharCode(i));
}) ();
String.random = (len) => {
	var rnd = "";
	for (let i = 0; i < len; i ++) {
		rnd += KeySet[Math.floor(KeySet.length * Math.random())];
	}
	return rnd;
};
String.blank = (len, block) => {
	block = block || ' ';
	var line = '';
	for (let i = 0; i < len; i ++) line += block;
	return line;
};
String.is = (str) => {
	if (str instanceof String) return true;
	if (typeof str === 'string') return true;
	return false;
};

// Object Extends

Object.prototype.copy = function () {
	return Object.assign({}, this);
}
Object.prototype.extent = function (...targets) {
	var copy = Object.assign({}, this);
	targets.reverse();
	Object.assign(this, ...targets, copy);
}
Object.defineProperty(Object.prototype, 'copy', { enumerable: false });
Object.defineProperty(Object.prototype, 'extent', { enumerable: false });

// Function Extends

Function.is = obj => obj instanceof Function;
global.AsyncFunction = (async () => {}).constructor;
AsyncFunction.is = obj => obj instanceof AsyncFunction;

// Array Extends

Array.prototype.copy = function () {
	return this.map(ele => ele);
};
Array.prototype.randomize = function () {
	var l = this.length;
	var result = Array.random(l);
	var self = this;
	result = result.map(i => self[i]);
	return result;
};
Array.prototype.remove = function (obj) {
	var index = this.indexOf(obj);
	if (index < 0) return this;
	this.splice(index, 1);
	return this;
};
Array.prototype.translate = function (offset) {
	var c = this.copy();
	if (isNaN(offset)) return c;
	var l = this.length;
	if (offset >= l || offset <= -l) return c;
	if (offset > 0) {
		for (let i = 0, j = offset; i < l - offset; i ++, j ++) {
			c[i] = this[j];
		}
		for (let i = l - offset, j = 0; i < l; i ++, j ++) {
			c[i] = this[j];
		}
	}
	else {
		offset = - offset;
		for (let i = 0, j = offset; i < l - offset; i ++, j ++) {
			c[j] = this[i];
		}
		for (let i = l - offset, j = 0; i < l; i ++, j ++) {
			c[j] = this[i];
		}
	}
	return c;
};
Array.prototype.has = function (obj) { return this.indexOf(obj) >= 0};
Object.defineProperty(Array.prototype, 'first', {
	get () {
		return this[0];
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(Array.prototype, 'last', {
	get () {
		return this[this.length - 1];
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(Array.prototype, 'copy', { enumerable: false });
Object.defineProperty(Array.prototype, 'remove', { enumerable: false });
Object.defineProperty(Array.prototype, 'randomize', { enumerable: false });
Object.defineProperty(Array.prototype, 'translate', { enumerable: false });
Object.defineProperty(Array.prototype, 'has', { enumerable: false });
Array.is = obj => obj instanceof Array;
Array.generate = (total, generator = i => i) => {
	var result = [];
	if (Function.is(generator)) for (let i = 0; i < total; i ++) result.push(generator(i));
	else for (let i = 0; i < total; i ++) result.push(generator);
	return result;
};
Array.random = total => {
	var origin = [], result = [];
	for (let i = 0; i < total; i ++) origin.push(i);
	for (let i = 0; i < total; i ++) {
		let j = Math.floor(Math.random() * origin.length);
		result.push(origin[j]);
		origin.splice(j, 1);
	}
	return result;
};

Uint8Array.prototype.__proto__.copy = function () {
	var copy = new this.constructor(this.length);
	copy.set(this);
	return copy;
};
Object.defineProperty(Uint8Array.prototype.__proto__, 'copy', { enumerable: false });

// Class Extends

Object.prototype.isSubClassOf = function (target) {
	if (typeof this !== 'function') return false;
	var cls = this;
	while (!!cls) {
		if (cls === target) return true;
		cls = Object.getPrototypeOf(cls);
	}
	return false;
};
Object.defineProperty(Object.prototype, 'isSubClassOf', { enumerable: false });

// Symbol Extends

Symbol.setSymbols = (host, symbols) => {
	if (Array.is(host) && !symbols) {
		symbols = host;
		host = null;
	}
	host = host || {};
	var symb2name = {};
	var str2name = {};
	symbols.forEach(symbol => {
		symbol = symbol.split('|');
		if (symbol.length === 0) return;
		if (symbol.length < 2) symbol[1] = symbol[0];
		var name = symbol[1];
		symbol = symbol[0];
		var sym = Symbol(symbol);
		symb2name[sym] = name;
		str2name[symbol] = name;
		Object.defineProperty(host, symbol, {
			value: sym,
			configurable: false,
			enumerable: true
		});
	});
	host.toString = symbol => symb2name[symbol] || str2name[symbol] || 'No Such Symbol';
	return host;
};
Symbol.is = symbol => (symbol.__proto__ === Symbol.prototype) || (typeof symbol === 'symbol');

// Math Extends

Math.pick = list => {
	if (Array.is(list)) {
		let i = Math.floor(Math.random() * list.length);
		return list[i];
	}
	else if (!isNaN(list)) {
		return Math.random() <= list;
	}
	return null;
};
Math.range = (l, r) => {
	if (isNaN(r)) {
		r = l;
		l = 0;
	}
	return l + Math.random() * (r - l);
};

// Timers Extends

if (!!global.setTimeout) { // For Process instead of Thread
	require('./events/promisify');
	global.setImmediate = global.setImmediate || function (callback) { setTimeout(callback, 0); };
	global.nextTick = !!process ? process.nextTick || global.setImmediate : global.setImmediate;
	global.wait = promisify((delay, next) => {
		var start = new Date().getTime();
		setTimeout(() => next(new Date().getTime() - start), delay);
	});
	global.waitLoop = promisify(next => {
		var start = new Date().getTime();
		setImmediate(() => next(new Date().getTime() - start));
	});
	global.waitTick = promisify(next => {
		var start = new Date().getTime();
		nextTick(() => next(new Date().getTime() - start));
	});
}
global.Clock = class Clock {
	constructor (lable='Initialized', not_node=false) {
		this.stamps = [];
		this.isNode = !!global.process;
		if (this.isNode && !not_node) {
			this.clock = () => {
				var c = process.hrtime();
				return c[0] + c[1] / 1e9;
			};
		}
		else {
			this.clock = () => new Date().getTime() / 1000;
		}
		this.stamp(lable);
	}
	stamp (lable='') {
		var stamp = this.clock();
		this.stamps.push([stamp, lable]);
		return stamp;
	}
	list (is_text=true) {
		var last = this.stamps[0][0], len = this.stamps.length, list, max = 0;
		list = this.stamps.map(s => {
			var r = [s[0] - last, s[1]];
			last = s[0];
			var l = s[1].length;
			if (l > max) max = l;
			return r;
		});
		if (!is_text) return list;
		list = list.map(l => {
			var lab = l[1], nan = l[0];
			lab = lab.prepadding(max);
			return lab + '\t' + nan;
		});
		return list.join('\n');
	}
	getStamp (lable) {
		if (!lable) return -1;
		var result = -1;
		this.stamps.some(s => {
			if (s[1] === lable) {
				result = s[0];
				return true;
			}
			return false;
		});
		return result;
	}
	spent (start, end) {
		if (!end) {
			end = this.getStamp(start);
			if (end < 0) end = this.stamps[this.stamps.length - 1][0];
			start = this.stamps[0][0];
		}
		else {
			start = this.getStamp(start);
			if (start < 0) start = this.stamps[0][0];
			end = this.getStamp(end);
			if (end < 0) end = this.stamps[this.stamps.length - 1][0];
		}
		return end - start;
	}
};