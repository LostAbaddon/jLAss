/**
 * Name:	Logger Extension
 * Desc:    日志记录拓展
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2017.09.27
 */

const setStyle = require('./commandline/setConsoleStyle');
const timeNormalize = global.Utils.getTimeString;
global.logger = (loglev, colors) => {
	colors = colors || global.logger.Color.copy();
	for (let color in colors) {
		let style = setStyle.styles[colors[color]] || setStyle.styles[global.logger.Color[color]];
		colors[color] = style;
	}

	var info = function () {
		if (loglev <= 1) {
			[].unshift.call(arguments, '[INFO (' + timeNormalize() + ')]');
			[].unshift.call(arguments, colors.info.open);
			[].push.call(arguments, colors.info.close);
			console.info.apply(console, arguments);
		}
	};
	var log = function () {
		if (loglev <= 2) {
			[].unshift.call(arguments, '[LOG  (' + timeNormalize() + ')]');
			[].unshift.call(arguments, colors.log.open);
			[].push.call(arguments, colors.log.close);
			console.log.apply(console, arguments);
		}
	};
	var warn = function () {
		if (loglev <= 3) {
			[].unshift.call(arguments, '[WARN (' + timeNormalize() + ')]');
			[].unshift.call(arguments, colors.warn.open);
			[].push.call(arguments, colors.warn.close);
			console.warn.apply(console, arguments);
		}
	};
	var error = function () {
		if (loglev <= 4) {
			[].unshift.call(arguments, '[ERROR(' + timeNormalize() + ')]');
			[].unshift.call(arguments, colors.error.open);
			[].push.call(arguments, colors.error.close);
			console.error.apply(console, arguments);
		}
	};
	return {
		info: info,
		log: log,
		warn: warn,
		error: error
	}
};
global.logger.Color = {
	info: 'yellow',
	log: 'green',
	warn: 'magenta',
	error: 'red'
};