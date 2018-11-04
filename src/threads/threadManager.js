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
		this.tasks = new Map();
		this.stat = ThreadWorker.Stat.IDLE;

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
		if (this.stat === ThreadWorker.Stat.DEAD) return;
		this._worker.postMessage({
			event: 'message',
			needReply: false,
			data: msg,
			postAt: Date.now()
		});
	}
	request (event, data, callback) {
		if (this.stat === ThreadWorker.Stat.DEAD) return;
		this.stat = ThreadWorker.Stat.BUSY;

		var n = Date.now();
		var eventTag = event + ':' + n;
		this.tasks.set(eventTag, true);

		return new Promise((res, rej) => {
			this._worker.postMessage({
				event,
				needReply: true,
				data,
				postAt: n
			});
			this.once('reply:' + eventTag, (data, event) => {
				var msg = data.data;
				this.tasks.delete(eventTag);
				if (this.tasks.size === 0) this.stat = ThreadWorker.Stat.IDLE;
				if (!!callback) callback(msg);
				res(msg);
			});
		});
	}
	get count () {
		return this.tasks.size;
	}
	suicide () {
		this.stat = ThreadWorker.Stat.DEAD;
		this._worker.terminate();
	}
}
ThreadWorker.Stat = Symbol.set(['IDLE', 'BUSY', 'DEAD']);

const TM = {
	// 根据 filenames 批量载入运行程序，并传入初始参数 data
	create: (filenames, data) => {
		var worker = new ThreadWorker(filenames, data);
		return worker;
	},
	evaluate: (fn, data, callback) => new Promise((res, rej) => {
		var worker = new ThreadWorker(__dirname + '/threadEvaluater.js', {
			event: 'evaluate',
			data: data,
			fun: fn.toString()
		});
		worker.on('evaluate', data => {
			var err = data.err;
			data = data.result;
			if (!!err) data = null;
			if (!!callback) callback(data, err);
			worker.suicide();
			if (!err) res(data);
			else rej(err);
		});
	})
};

module.exports = TM;

_('Utils.Threads', TM);