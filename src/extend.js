/**
 * Name:	Auxillary Utils and Extends
 * Desc:    常用基础类拓展
 * Author:	LostAbaddon
 * Version:	0.0.3
 * Date:	2017.11.09
 */

const Version = require('./utils/version');

if (global._env === 'node') {
	let ver = new Version(process.version);
	if (ver.isLessThan('10.5')) {
		global._canThread = false;
	}
	else if (process.execArgv.indexOf('--experimental-worker') >= 0) {
		global._canThread = true;
	}
	else {
		global._canThread = false;
	}
}

loadall('./src/extends/');