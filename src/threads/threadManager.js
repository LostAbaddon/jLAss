/**
 * Name:	Thread Manager
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.11.04
 */

if (!global._canThread) return;

const {
	Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');

const EventEmitter = require('events');

class ThreadWorker extends EventEmitter {
	constructor (files, data) {
		super();

		if (Array.is(files)) {
			files = files.map(fp => getLoadPath(fp));
		}
		else {
			files = global.getLoadPath(files);
		}
		this._worker = new Worker(__dirname + '/threadWorker.js', {
			workerData : {
				scripts: files,
				data: data
			}
		});
		this.id = this._worker.threadId;
		this._worker.on('message', data => {
			if (!data || !data.event || !data.postAt) return;
			var tag = data.event;
			if (!!data.originEvent) {
				data.event = data.originEvent;
				delete data.originEvent;
			}
			this.emit(tag, data.data, data);
		});
		this.on('suicide', this.suicide);
	}
	send (msg) {
		this.request('message', msg);
	}
	request (event, data) {
		this._worker.postMessage({
			event,
			needReply: false,
			data,
			postAt: Date.now()
		});
	}
	requestAndWait (event, data, callback) {
		return new Promise((res, rej) => {
			var n = Date.now();
			this._worker.postMessage({
				event,
				needReply: true,
				data,
				postAt: n
			});
			this.once('reply:' + event + ':' + n, (data, event) => {
				var msg = data.data;
				if (!!callback) callback(msg);
				res(msg);
			});
		});
	}
	suicide () {
		this._worker.terminate();
	}
}

const TM = {
	// Load list of files, and then send the data.
	create: (filenames, data) => {
		var worker = new ThreadWorker(filenames, data);
		return worker;
	},
};

module.exports = TM;

_('Utils.Threads', TM);