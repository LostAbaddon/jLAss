/**
 * Name:	Array Utils
 * Desc:    Array 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.11.09
 */

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
Array.random = (total, generator = i => i) => {
	var origin = [], result = [];
	for (let i = 0; i < total; i ++) origin.push(i);
	for (let i = 0; i < total; i ++) {
		let j = Math.floor(Math.random() * origin.length);
		result.push(generator(origin[j]));
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