((global) => {
	const _log = console.log;
	const _error = console.error;
	const timeNormalize = global.Utils.getTimeString;
	const combine = (prefix, ...args) => {
		var result = args.map(a => {
			if (typeof a === 'number' || a instanceof Number) return '' + a;
			if (typeof a === 'string' || a instanceof String) return a;
			return JSON.stringify(a);
		});
		result = result.join(' ');
		return prefix + ' ' + result;
	};

	// Copy from Ansi-Style
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			// Bright color
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};
	styles.color.grey = styles.color.gray;
	for (let groupName of Object.keys(styles)) {
		let group = styles[groupName];

		for (let styleName of Object.keys(group)) {
			let style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];
		}

		styles[groupName] = group;
	}
	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	const setStyle = global.console.setStyle = (msg, style) => {
		if (style instanceof String || typeof style === 'string') {
			style = styles[style];
			if (!style || !style.open || !style.close) return msg;
			return style.open + msg + style.close;
		}
		else for (let s of style) {
			s = styles[s];
			if (!s || !s.open || !s.close) continue;
			msg = s.open + msg + s.close;
		}
		return msg;
	};

	var logcolor = {
		info: 'yellow',
		log: 'green',
		warn: 'magenta',
		error: 'red'
	};
	var loglev = 0;
	var console_info = function () {
		if (loglev <= 1) {
			[].unshift.call(arguments, '[INFO (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_log(setStyle(combine.apply(console, arguments), logcolor.info));
		}
	};
	var console_log = function () {
		if (loglev <= 2) {
			[].unshift.call(arguments, '[LOG  (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_log(setStyle(combine.apply(console, arguments), logcolor.log));
		}
	};
	var console_warn = function () {
		if (loglev <= 3) {
			[].unshift.call(arguments, '[WARN (T-' + thread.id + ' ' + timeNormalize() + ')]');
			_error(setStyle(combine.apply(console, arguments), logcolor.warn));
		}
	};
	var console_error = function () {
		if (loglev <= 4) {
			[].unshift.call(arguments, '[ERROR(T-' + thread.id + ' ' + timeNormalize() + ')]');
			_error(setStyle(combine.apply(console, arguments), logcolor.error));
		}
	};
	console.info = console.log;
	console.warn = console.error;
	global.setLogLev = lv => {
		if (isNaN(lv)) return;
		loglev = lv;
		if (loglev < 1) {
			console.log = _log;
			console.log = _log;
			console.warn = _error;
			console.error = _error;
		}
		else {
			console.info = console_info;
			console.log = console_log;
			console.warn = console_warn;
			console.error = console_error;
		}
	};
}) (this);