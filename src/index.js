/**
 * Name:	Common Core
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2017.08.24
 *
 * 热更新require库
 * 字符串拓展、随机穿
 * 日志工具
 * 文件夹生成
 * 辅助工具
 * Object的copy与extent功能
 */

global._ = (path, module) => {
	path = path.split(/[\/\\,\.\:;]/).map(p => p.trim()).filter(p => p.length > 0);
	if (path.length < 1) return global;
	var node = global, last = path.pop();
	path.forEach(p => {
		var next = node[p];
		if (!next) {
			next = {};
			node[p] = next;
		}
		node = next;
	});
	if (!!module) {
		node[last] = module;
	}
	else if (!node[last]) {
		node[last] = {};
	}
	return node[last];
};
_('Utils');

require('./loadall');
require('./extend');
require('./datetime');
require('./logger');
require('./moduleManager');
require('./events/eventManager');
// require('./algorithm');
// require('./threads/threadManager');

const FS = require('fs');
const Path = require('path');

global.Utils.preparePath = async (path, cb) => {
	var has = FS.access(path, (err) => {
		if (!err) return cb(true);
		var parent = Path.parse(path).dir;
		global.Utils.preparePath(parent, (result) => {
			if (!result) return cb(false);
			FS.mkdir(path, (err) => {
				if (!err) return cb(true);
			});
		});
	});
};
global.Utils.preparePathSync = path => {
	var has;
	try {
		has = FS.accessSync(path);
		return true;
	}
	catch (err) {}
	var parent = Path.parse(path).dir;
	has = global.Utils.preparePathSync(parent);
	if (!has) return false;
	try {
		FS.mkdirSync(path);
	}
	catch (err) {
		return false;
	}
};