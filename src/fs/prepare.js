/**
 * Name:	Prepare Folder
 * Desc:    创建指定路径的文件夹
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.11.09
 */

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