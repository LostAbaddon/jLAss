/**
 * Name:	Object Utils
 * Desc:    Object 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.11.09
 */

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