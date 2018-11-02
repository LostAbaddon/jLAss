/**
 * Name:	Promisify
 * Desc:    异步化
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.10.30
 */

const AsyncFunction = (async () => {}).constructor;

const promisify = (fn) => {
	if (!(fn instanceof Function)) return null;
	if (!!fn._promised) return fn;
	var afun = (...args) => new Promise((res, rej) => {
		try {
			setImmediate(() => fn(...args, res));
		}
		catch (err) {
			rej(err);
		}
	});
	afun._promised = true;
	afun._original = fn;
	return afun;
};
promisify.withTimeout = (fn) => {
	if (!(fn instanceof Function)) return null;
	if (!!fn._promised) return fn;
	var afun = (...args) => {
		var start_time, tocb = null, todelay = -1, towatch = null, rej;
		var prom = new Promise((_res, _rej) => {
			rej = _rej;
			var res = (...args) => {
				if (!!towatch) clearTimeout(towatch);
				towatch = null;
				_res(...args);
			};
			try {
				start_time = new Date().getTime();
				setImmediate(() => fn(...args, res));
			}
			catch (err) {
				rej(err);
			}
		});
		prom.timeout = (...args) => {
			if (args[0] instanceof Number) args[0] = args[0] * 1;
			if (!isNaN(args[0])) {
				if (args[1] instanceof Function) tocb = args[1];
				todelay = args[0] >= 0 ? args[0] : -1;
				if (todelay < 0 && !!towatch) {
					clearTimeout(towatch);
					towatch = null;
				}
				else if (todelay >= 0) {
					if (!!towatch) clearTimeout(towatch);
					let n = new Date().getTime();
					towatch = setTimeout(() => {
						if (!!tocb) tocb();
						rej(new Error('Timeout!'));
					}, todelay - (n - start_time));
				}
			}
			else if (args[0] instanceof Function) {
				tocb = args[0];
			}
			return prom;
		};
		return prom;
	};
	afun._promised = true;
	afun._original = fn;
	return afun;
};

const fun_prep = (promisible, ...args) => {
	var funs, data, cb;
	if (args[0] instanceof Array) {
		funs = args[0];
		data = args[1];
		cb = args[2];
		if (!cb) {
			cb = data;
			data = null;
		}
	}
	else {
		cb = args.pop();
		if (args[args.length - 1] instanceof Function) data = null;
		else data = args.pop();
		funs = args;
	}
	if (!!promisible) funs = funs.map(f => promisify(f));
	else funs = funs.map(f => f._original || f);
	return [funs, data, cb];
};

promisify.serial = promisify(async (...args) => {
	var [funs, data, res] = fun_prep(true, ...args);
	for (let fun of funs) {
		let v;
		if (data === null || data === undefined) v = await fun();
		else v = await fun(data);
		if (v !== undefined) data = v;
	}
	res(data);
});
promisify.parallel = promisify(async (...args) => {
	var [funs, data, res] = fun_prep(true, ...args);
	var tasks = funs.length, results = [];;
	funs.forEach(async (f, i) => {
		var v;
		if (data === null || data === undefined) v = await f();
		else v = await f(data);
		results[i] = v;
		tasks --;
		if (tasks > 0) return;
		res(results);
	});
});
promisify.some = promisify(async (...args) => {
	var [funs, data, res] = fun_prep(true, ...args);
	funs.forEach(async (f, i) => {
		var v;
		if (data === null || data === undefined) v = await f();
		else v = await f(data);
		res(v);
	});
});

global.promisify = promisify;