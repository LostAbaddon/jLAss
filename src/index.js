/**
 * Name:	Common Core
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.3
 * Date:	2018.11.02
 *
 * 热更新require库
 * 字符串拓展、随机穿
 * 日志工具
 * 文件夹生成
 * 辅助工具
 * Object的copy与extent功能
 */

try {
	if (!!window) {
		window.global = window;
		global._env = 'browser';
		global.require = () => {};
	}
	else {
		global._env = 'node';
	}
}
catch (err) {
	global._env = 'node';
}

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

require('./utils/loadall');
require('./extend');
require('./utils/datetime');
require('./utils/logger');

require('./moduleManager');
require('./events/eventManager');
// require('./threads/threadManager');

// require('./algorithm');

require('./fs/prepare');