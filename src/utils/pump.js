/**
 * Name:	Pumplize Function
 * Desc:    堆与泵函数
 * 			一段时间内可多次调用，但只响应最后一次（堆），或将所有请求打包执行
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.11.04
 */

global.pumplize = (fn, cb, last_only=true) => {
	var stack = [], start_time = null, timeout = 100, timer = null;
	var done = () => {
		start_time = null;
		var args = stack;
		stack = [];
		if (last_only) cb(fn(...args));
		else cb(fn(args));
	};
	var pfn = (...args) => {
		if (start_time === null) {
			start_time = Date.now();
			if (timer) clearTimeout(timer);
			timer = setTimeout(done, timeout);
		}
		var n = Date.now();
		if (n - start_time >= timeout) {
			done();
		}
		else {
			if (last_only) stack = args;
			else stack.push(args);
		}
	};
	pfn.timeout = to => {
		if (isNaN(to)) return pfn;
		timeout = to;
		if (start_time === null) return pfn;
		var n = Date.now();
		if (timer) clearTimeout(timer);
		timer = setTimeout(done, timeout + start_time - n);
		return pfn;
	};
	return pfn;
};