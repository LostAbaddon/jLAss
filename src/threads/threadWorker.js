/**
 * Name:	Thread Worker
 * Desc:    线程内辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.11.04
 */

global._env = 'node';
global._canThread = true;

global.thread = require('worker_threads');

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

// 加载工具包
require('../utils/loadall');
require('../extend');
require('../utils/datetime');
require('../utils/logger');

// 线程事务管理器

const EventEmitter = require('events');
const EE = new EventEmitter();
global.register = (tag, callback) => {
	if (tag === 'init') EE.once(tag, callback)
	else EE.on(tag, callback)
};
global.request = (event, data) => {
	thread.parentPort.postMessage({
		event,
		data,
		postAt: Date.now()
	});
};
global.send = msg => global.request('message', msg);
global.reply = (event, data) => {
	thread.parentPort.postMessage({
		event: 'reply:' + event.event + ':' + event.postAt,
		originEvent: event.event,
		data,
		postAt: Date.now()
	});
};
global.suicide = () => global.request('suicide');
process.exit = global.suicide;

const evaluate = event => {
	var fun = event.data.fn;
	var data = event.data.data;
	var result;
	try {
		result = eval(fun)(data);
	}
	catch (err) {
		reply(event, { err: err.toString(), result: null });
		return;
	}
	reply(event, { err: null, result });
};
const loadFiles = files => {
	if (Array.is(files)) files.forEach(file => require(file));
	else require(files);
};

thread.parentPort.on('message', msg => {
	if (!msg.event) return;
	if (msg.event === 'evaluate') {
		evaluate(msg);
		return;
	}
	if (msg.event === 'loadfile') {
		loadFiles(msg.data);
		return;
	}
	msg.receiveAt = Date.now();
	EE.emit(msg.event, msg.data, msg);
});

// 加载指定文件
if (!!thread.workerData && !!thread.workerData.scripts) {
	if (Array.is(thread.workerData.scripts)) {
		thread.workerData.scripts.forEach(fp => require(fp));
	}
	else {
		require(thread.workerData.scripts);
	}
}

// 触发启动事件

if (!!thread.workerData.data) EE.emit('init', thread.workerData.data, {
	event: 'init',
	data: thread.workerData.data,
	scripts: thread.workerData.scripts,
	sendAt: Date.now(),
	receiveAt: Date.now()
});