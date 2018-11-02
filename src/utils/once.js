/**
 * Name:	Oncilize Function
 * Desc:    日志记录拓展
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2018.11.02
 */

global.oncilize = fn => {
	var called = false, value;
	return (...args) => {
		if (called) return value;
		called = true;
		value = fn(...args);
		return value;
	};
};