/**
 * Name:	Thread Manager
 * Desc:    线程池管理工具
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2018.11.08
 */

if (!global._canThread) return;

const { Worker } = require('worker_threads');

const EventEmitter = require('events');

class ThreadWorker extends EventEmitter {
	constructor (files, data) {
		super();

		if (!files) files = [];
		else if (Array.is(files)) {
			files = files.map(fp => global.getLoadPath(fp));
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
	load (files) {
		if (this.stat === ThreadWorker.Stat.DEAD) return;
		if (Array.is(files)) {
			files = files.map(fp => global.getLoadPath(fp));
		}
		else {
			files = global.getLoadPath(files);
		}
		this._worker.postMessage({
			event: 'loadfile',
			needReply: false,
			data: files,
			postAt: Date.now()
		});
		return this;
	}
	send (msg) {
		if (this.stat === ThreadWorker.Stat.DEAD) return;
		this._worker.postMessage({
			event: 'message',
			needReply: false,
			data: msg,
			postAt: Date.now()
		});
		return this;
	}
	request (event, data, callback) {
		return new Promise((res, rej) => {
			if (this.stat === ThreadWorker.Stat.DEAD) {
				if (!!callback) callback(null, 'Thread is dead.');
				rej('Thread is dead.');
				return;
			}

			this.stat = ThreadWorker.Stat.BUSY;

			var n = Date.now();
			var eventTag = event + ':' + n;
			this.tasks.set(eventTag, true);

			this._worker.postMessage({
				event,
				needReply: true,
				data,
				postAt: n
			});
			this.once('reply:' + eventTag, (data, event) => {
				this.tasks.delete(eventTag);
				if (this.tasks.size === 0) {
					this.stat = ThreadWorker.Stat.IDLE;
					setImmediate(() => this.emit("allJobsDone"));
				}
				if (!!callback) callback(data, null);
				res(data);
			});
		});
	}
	evaluate (fn, data, callback) {
		if (this.stat === ThreadWorker.Stat.DEAD) return;
		this.stat = ThreadWorker.Stat.BUSY;

		var n = Date.now();
		var eventTag = 'evaluate:' + n;
		this.tasks.set(eventTag, true);

		return new Promise((res, rej) => {
			this._worker.postMessage({
				event: 'evaluate',
				needReply: true,
				data: {
					fn: fn.toString(),
					data
				},
				postAt: n
			});
			this.once('reply:' + eventTag, (data, event) => {
				this.tasks.delete(eventTag);
				if (this.tasks.size === 0) {
					this.stat = ThreadWorker.Stat.IDLE;
					setImmediate(() => this.emit("allJobsDone"));
				}
				if (!!data.err) {
					if (!!callback) callback(null, data.err);
					rej(data.err);
				}
				else {
					if (!!callback) callback(data.result, null);
					res(data.result);
				}
			});
		});
	}
	get count () {
		if (this.stat === ThreadWorker.Stat.DEAD) return 0;
		return this.tasks.size;
	}
	get id () {
		if (this.stat === ThreadWorker.Stat.DEAD) return -1;
		return this._worker.threadId;
	}
	suicide () {
		this.stat = ThreadWorker.Stat.DEAD;
		this._worker.terminate();
		this._worker = null;
		this.tasks = null;
		for (let key in this._events) {
			let cbs = this._events[key];
			if (Function.is(cbs)) this.removeListener(key, cbs);
			else cbs.forEach(cb => this.removeListener(key, cb));
		}
	}
}
ThreadWorker.Stat = Symbol.set(['IDLE', 'BUSY', 'DEAD']);

var pool = null;
const pool_default = {
	files: undefined,
	data: undefined
};

const choiseThread = () => {
	pool.sort((ta, tb) => {
		if (ta.stat !== ThreadWorker.Stat.DEAD && tb.stat === ThreadWorker.Stat.DEAD) return -1;
		if (tb.stat !== ThreadWorker.Stat.DEAD && ta.stat === ThreadWorker.Stat.DEAD) return 1;

		if (ta.stat === ThreadWorker.Stat.IDLE && tb.stat === ThreadWorker.Stat.BUSY) return -1;
		if (tb.stat === ThreadWorker.Stat.IDLE && ta.stat === ThreadWorker.Stat.BUSY) return 1;

		return ta.count - tb.count;
	});
	return pool[0];
};

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
	}),
	Pool: {
		size: require('os').cpus().length,
		create: (size=TM.Pool.size, files, data) => {
			if (!!pool) return TM.Pool;
			if (files !== undefined) pool_default.files = files;
			if (data !== undefined) pool_default.data = data;
			if (isNaN(size) || size <= 0) size = TM.Pool.size;
			pool = Array.generate(size, () => new ThreadWorker(files, data));
			return TM.Pool;
		},
		load: files => {
			pool.forEach(th => th.load(files));
			return TM.Pool;
		},
		request: (event, data, callback) => {
			return new Promise(async (res, rej) => {
				var th = choiseThread();
				var result;
				try {
					result = await th.request(event, data);
				}
				catch (err) {
					if (!!callback) callback(null, err);
					rej(err);
				}
				if (!!callback) callback(result, null);
				res(result);
			});
		},
		requestAll: (event, data, callback) => {
			return new Promise((res, rej) => {
				var result = [], tasks = pool.length;;
				pool.forEach(async (th, i) => {
					var r;
					try {
						r = await th.request(event, data);
						result[i] = [r, null];
					}
					catch (err) {
						result[i] = [null, err];
					}
					tasks --;
					if (tasks === 0) {
						if (!!callback) callback(result);
						res(result);
					}
				});
			});
		},
		evaluate: (fn, data, callback) => {
			return new Promise(async (res, rej) => {
				var th = choiseThread();
				var result;
				try {
					result = await th.evaluate(fn, data);
				}
				catch (err) {
					if (!!callback) callback(null, err);
					rej(err);
				}
				if (!!callback) callback(result, null);
				res(result);
			});
		},
		tasks: () => {
			var t = 0;
			pool.forEach(th => t += th.count);
			return t;
		},
		refresh: files => {
			var indexes = [];
			pool.forEach((th, i) => {
				if (th.stat !== ThreadWorker.Stat.BUSY) indexes.push(i);
				if (th.stat === ThreadWorker.Stat.IDLE) th.suicide();
			});
			indexes.reverse().forEach(i => pool.splice(i, 1));
			var len = indexes.length;
			pool = pool.concat(Array.generate(len, () => {
				var worker = new ThreadWorker(pool_default.files, pool_default.data);
				if (!!files) worker.load(files);
				return worker;
			}));
		},
		refreshAll: files => {
			var size = pool.length;
			pool.forEach(th => {
				if (th.stat === ThreadWorker.Stat.IDLE) th.suicide();
				else if (th.stat === ThreadWorker.Stat.BUSY) th.once('allJobsDone', () => setImmediate(() => th.suicide()));
			});
			pool = Array.generate(size, () => {
				var worker = new ThreadWorker(pool_default.files, pool_default.data);
				if (!!files) worker.load(files);
				return worker;
			});
		},
		killAll: () => {
			pool.forEach(th => th.suicide());
			pool = null;
		}
	}
};

module.exports = TM;

_('Utils.Threads', TM);