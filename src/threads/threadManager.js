/**
 * Name:	Thread Manager
 * Desc:    辅助工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.21
 *
 * 基于 WebWorker-Threads 的线程管理中心
 * 实现分组线程池
 */

// 对WebWorker-Threads的拓展
const Thread = require('webworker-threads');
Thread._create = Thread.create;
Thread.create = () => {
	var thread = Thread._create();
	thread.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return thread.eval("(" + func + ")(" + args + ")", cb);
	};
	return thread;
};
Thread._createPool = Thread.createPool;
Thread.createPool = n => {
	var pool = Thread._createPool(n);
	pool.any.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return pool.any.eval("(" + func + ")(" + args + ")", cb);
	};
	pool.all.call = (func, ...args) => {
		var cb = args.pop();
		args = JSON.stringify(args);
		args = args.substring(1, args.length - 1);
		return pool.all.eval("(" + func + ")(" + args + ")", cb);
	};
	return pool;
};

// 线程池参数
const CPUCount = require('os').cpus().length;
const ThreadPerCPU = 2;
const PoolLimit = CPUCount * ThreadPerCPU;
const elfSoul = __dirname + '/threadWorker.js';

// 封装的Worker类
class Deacon {
	constructor (freeWorld, battleField, soul = elfSoul, ghosts = null, loglev = 0) {
		this.freeWorld = freeWorld;
		this.battleField = battleField;
		var ego = this;
		var logger = global.logger(loglev);
		soul = soul || elfSoul;
		ego.soul = new Thread.Worker(soul);
		ego.soul.isfree = true;
		ego.soul.onmessage = msg => {
			msg = msg.data;
			if (msg.action === 'complete') {
				ego.soul.isfree = true;
				var index = ego.battleField.indexOf(ego);
				if (index >= 0) ego.battleField.splice(index, 1);
				ego.freeWorld.push(ego);
				var messager = ego.messager;
				var reaper = ego.reaper;
				ego.messager = null;
				ego.reaper = null;
				if (!!reaper) reaper({
					quest: msg.quest,
					ok: msg.ok,
					msg: msg.data
				});
			}
			else if (msg.action === 'message') {
				if (!!ego.messager) ego.messager({
					quest: msg.quest,
					msg: msg.msg
				});
			}
		};
		ego.soul.thread.on('error', err => {
			logger.error("Thread " + ego.soul.thread.id + " Error: (" + err.type + ")");
			logger.error(err.msg);
			logger.error(err.data);
			if (!!ego.reporter) ego.reporter({
				quest: msg.quest,
				msg: err.msg,
				data: msg.data
			});
		});
		ego.soul.postMessage({
			action: 'init',
			path: __dirname,
			filelist: ghosts,
			loglev: loglev
		});
		ego.freeWorld.push(ego);
	}
	get isFree () {
		return this.soul.isfree;
	}
	attach (script) {
		var len = script.length;
		if (script.indexOf('\n') >= 0 || script.substring(len - 3, len).toLowerCase() !== '.js') {
			this.soul.thread.eval(script);
		}
		else {
			this.soul.thread.load(script);
		}
	}
	dispatch (quest, data, messager, reaper, reporter) {
		this.messager = messager;
		this.reaper = reaper;
		this.reporter = reporter;
		this.soul.isfree = false;
		var index = this.freeWorld.indexOf(this);
		if (index >= 0) this.freeWorld.splice(index, 1);
		this.battleField.push(this);
		this.soul.postMessage({
			action: 'quest',
			quest: quest,
			data: data
		});
		return this;
	}
	submit (msg) {
		this.soul.postMessage({
			action: 'message',
			data: msg
		});
		return this;
	}
	suicide () {
		if (!this.soul.isfree) return false;
		this.soul.isfree = false;
		this.freeWorld.splice(this.freeWorld.indexOf(this), 1);
		this.soul.terminate();
		return true;
	}
	terminate () {
		this.soul.terminate();
	}
	onmessage (cb) {
		this.messager = cb;
		return this;
	}
	onfinish (cb) {
		this.reaper = cb;
		return this;
	}
}

var PoolSize = PoolLimit;
var poolGroup = {};
const ThreadPool = {
	init (option = {}) {
		var total_size = 0;
		var group_count = 0;
		for (let g in option) {
			let q = option[g];
			if (!isNaN(q)) {
				option[g] = { count: q, worker: elfSoul };
			}
			else if (!q.worker) {
				q.worker = elfSoul;
			}
			total_size += q.count;
			group_count += 1;
		}
		var default_size = 0;
		if (total_size <= PoolSize) { // 剩余的作为默认线程池
			default_size = PoolSize - total_size;
		}
		else if (group_count > PoolSize) { // 全部放在默认线程池中
			default_size = PoolSize;
			for (let g in option) option[g].count = 0;
		}
		else {
			let ave = Math.floor(PoolSize / group_count);
			default_size = PoolSize;
			for (let g in option) {
				if (ave < option[g].count) option[g].count = ave;
				default_size -= option[g].count;
			}
		}
		this.group = {};
		for (let g in option) {
			let q = option[g];
			this.group[g] = {
				size: q.count,
				worker: q.worker,
				files: q.files,
				free: [],
				busy: [],
				pool: []
			};
		}
		this.group.default = {
			size: default_size,
			free: [],
			busy: [],
			pool: []
		};
		for (let g in this.group) {
			g = this.group[g];
			for (let i = 0; i < g.size; i ++) {
				let worker = new Deacon(g.free, g.busy, g.worker, g.files);
			}
		}
	},
	size (name) {
		return (this.group[name] || this.group.default).size;
	},
	set SizeLimit (limit) {
		if (limit < PoolLimit) PoolSize = limit;
	},
	get SizeLimit () {
		return PoolSize;
	},
	terminate (group) {
		group = this.group[group];
		if (!group) return;
		group.free.forEach(w => w.terminate());
		group.busy.forEach(w => w.terminate());
		group.free = [];
		group.busy = [];
	},
	terminateAll () {
		for (var group in this.group) this.terminate(group);
	},
	setEnv (group, request) {
		group = this.group[group];
		if (!group) return;
		group.free.forEach(w => w.attach(request));
		group.busy.forEach(w => w.attach(request));
	},
	async execute (group, worker, task, msg, res, rej) {
		await waitLoop();
		worker.dispatch(task, msg, null, async result => {
			this.resume(group);
			// 线程切换后直接调用resolve或reject会无响应，用nextTick也无法正确切换线程，所以用setImmediate切换到主线程
			await waitLoop();
			if (result.ok) {
				res(result.msg);
			}
			else {
				rej(result.msg);
			}
		});
	},
	run (group, task, msg) {
		return new Promise((res, rej) => {
			var g = this.group[group];
			if (!g) {
				group = 'default';
				g = this.group.default;
			}
			if (g.free.length === 0) {
				g.pool.push([task, msg, res, rej]);
				return;
			}
			var worker = g.free[0];
			this.execute(group, worker, task, msg, res, rej);
		});
	},
	runBatch (group, task, ...generator) {
		return new Promise((res, rej) => {
			var taskCount, result = [], list = [], success = true, onstep = null;
			if (generator.length > 0) {
				if (generator[0] instanceof Array) {
					list = generator[0];
					taskCount = list.length;
					if (generator[1] instanceof Function) {
						onstep = generator[1];
					}
				}
				else if (!isNaN(generator[0])) {
					taskCount = generator[0];
					list = Array.generate(taskCount, generator[1]);
					if (generator[2] instanceof Function) {
						onstep = generator[2];
					}
				}
			}
			else {
				res({ success: true, result: [] });
				return;
			}
			list.forEach(async (msg, i) => {
				var r;
				try {
					r = await this.run(group, task, msg);
					result[i] = {
						ok: true,
						result: r
					};
				}
				catch (err) {
					success = false;
					result[i] = {
						ok: false,
						result: err
					};
				}
				taskCount --;
				if (!!onstep) onstep(i, result[i]);
				if (taskCount > 0) return;
				res({ success, result });
			});
		});
	},
	resume (group) {
		var g = this.group[group];
		if (!g) return;
		if (g.pool.length === 0) return;
		if (g.free.length === 0) return;
		var [task, msg, res, rej] = g.pool.shift();
		var worker = g.free[0];
		this.execute(group, worker, task, msg, res, rej);
	}
};

ThreadPool.Thread = Thread;

module.exports.ThreadPool = ThreadPool;
module.exports.ThreadWorker = Deacon;
module.exports._ThreadWorker = Thread;

_('Utils.Threads').Thread = Thread;
_('Utils.Threads').ThreadWorker = Deacon;
_('Utils.Threads').ThreadPool = ThreadPool;