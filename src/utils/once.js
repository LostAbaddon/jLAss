/**
 * Name:	Oncilize Function
 * Desc:    日志记录拓展
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2018.11.02
 */

global.oncilize = fn => {
	var called = false, value, ofn;
	if (fn._promised) {
		ofn = (...args) => new Promise(async (res, rej) => {
			if (called) {
				await waitLoop();
				res(value);
				return;
			}
			called = true;
			value = await fn(...args);
			res(value);
		});
	}
	else {
		ofn = (...args) => {
			if (called) return value;
			called = true;
			value = fn(...args);
			return value;
		};
	}
	ofn.refresh = () => called = false;
	return ofn;
};