/**
 * Name:	Class Utils
 * Desc:    Class 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.11.09
 */

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
