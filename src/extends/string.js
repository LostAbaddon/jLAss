/**
 * Name:	String Utils
 * Desc:    String 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.11.09
 */

String.prototype.prepadding = function (len = 0, pad = ' ', is_right = false) {
	var l = this.length;
	l = len - l;
	if (l <= 0) return this.toString();
	var result = this.toString();
	if (!is_right) for (let i = 0; i < l; i ++) result = pad + result;
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