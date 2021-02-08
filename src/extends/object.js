/**
 * Name:	Object Utils
 * Desc:    Object 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2019.06.04
 */

Boolean.is = obj => {
	if (typeof obj === "boolean") return true;
	if (obj instanceof Boolean) return true;
	return false;
};
BigInt.is = obj => {
	if (typeof obj === "bigint") return true;
	if (obj instanceof BigInt) return true;
	return false;
};
Number.is = obj => {
	if (typeof obj === "number") return true;
	if (obj instanceof Number) return true;
	return false;
};
Object.isBasicType = obj => {
	if (String.is(obj)) return true;
	if (Boolean.is(obj)) return true;
	if (BigInt.is(obj)) return true;
	if (Number.is(obj)) return true;
	if (Symbol.is(obj)) return true;
	return false;
};

Object.prototype.copy = function () {
	return Object.assign({}, this);
};
Object.prototype.duplicate = function () {
	var copy = {};
	for (let key in this) {
		let value = this[key];
		if (Object.isBasicType(value)) {
			copy[key] = value.valueOf();
		} else if (value === null || value === undefined) {
			copy[key] = value;
		} else if (value instanceof Date) {
			copy[key] = new Date(value.getTime());
		} else if (typeof value === "object" && !(value instanceof Promise)) {
			copy[key] = value.duplicate();
		}
	}
	return Object.assign({}, this, copy);
};
Object.prototype.extent = function (...targets) {
	var copy = Object.assign({}, this);
	targets.reverse();
	Object.assign(this, ...targets, copy);
};
Object.defineProperty(Object.prototype, 'copy', { enumerable: false });
Object.defineProperty(Object.prototype, 'duplicate', { enumerable: false });
Object.defineProperty(Object.prototype, 'extent', { enumerable: false });

Number.prototype.duplicate = function () {
	return this * 1;
};
Object.defineProperty(Number.prototype, 'duplicate', { enumerable: false });
BigInt.prototype.duplicate = function () {
	return this * 1n;
};
Object.defineProperty(BigInt.prototype, 'duplicate', { enumerable: false });
Boolean.prototype.duplicate = function () {
	if (this === false || this.valueOf() === false) return false;
	return true;
};
Object.defineProperty(Boolean.prototype, 'duplicate', { enumerable: false });