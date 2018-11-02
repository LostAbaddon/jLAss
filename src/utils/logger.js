/**
 * Name:	Logger Extension
 * Desc:    日志记录拓展
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2017.09.27
 */

const setStyle = require('../commandline/setConsoleStyle');
const timeNormalize = global.Utils.getTimeString;

global.logger = (loglev, colors) => {
	colors = colors || global.logger.Color.copy();
	for (let color in colors) {
		let style = setStyle.styles[colors[color]] || setStyle.styles[global.logger.Color[color]];
		colors[color] = style;
	}

	var info = function (...args) {
		if (loglev > 1) return;
		args.unshift('[INFO (' + timeNormalize() + ')]');
		args.unshift(colors.info.open);
		args.push(colors.info.close);
		console.info(...args);
	};
	var log = function (...args) {
		if (loglev > 2) return;
		args.unshift('[LOG  (' + timeNormalize() + ')]');
		args.unshift(colors.log.open);
		args.push(colors.log.close);
		console.log(...args);
	};
	var warn = function (...args) {
		if (loglev < 3) return;
		args.unshift('[WARN (' + timeNormalize() + ')]');
		args.unshift(colors.warn.open);
		args.push(colors.warn.close);
		console.warn(...args);
	};
	var error = function (...args) {
		if (loglev > 4) return;
		args.unshift('[ERROR(' + timeNormalize() + ')]');
		args.unshift(colors.error.open);
		args.push(colors.error.close);
		console.error(...args);
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