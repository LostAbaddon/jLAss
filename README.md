# jLAss

My Personal Javascript Core Lib

> Author: [LostAbaddon](mailto:lostabaddon@gmail.com)

> Version: 0.1.1

## Includes

-	Module Manager for b/n
-	Extends for Class, Object, Function, Promise, Date and Time, Symbol
-	Log Utils
-	System Monitor Utils
-	FileSystem Utils
-	Math(TBD)
-	Threads(TBD)
-	Sync and Async Events
-	CommandLine Tools

## Extends

We can use "global" in both browser and node (b/n)

> UpCase for class, LowCase for instance<br>
> Obj.Y for function, Obj:Y for property

### Global

-	promisify
-	setImmediate<br>
	Fire callback when the next loop just begins.
-	nextTick<br>
	Fire callback when current loop just ends.
-	wait<br>
	Promisify version for setTimeout
-	waitLoop<br>
	Promisify version for setImmediate
-	waitTick<br>
	Promisify version for nextTick
-	Clock<br>
	Event-Timestamp Manager

### Promisify

-	global.promisify<br>
	Convert a function to a Promise object.<br>
	The last argument of the function is "next" which is the resolve function of Promise.
-	global.promisify.withTimeout<br>
	Convert a function to a Promise object with timeout.<br>
    The returned Promise object has a function `timeout` which can set timeout or callback or both.<br>
    Timeout `<= 0` means never timeout.
```javascript
promisify(fn(..., res)).timeout([timeout], [callback]);
```
-   global.promisify.serial<br>
	Do the tasks one by one, and the result of previous one will be passed to the next one.<br>
	Two usages:
	-	`promisify.serial(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.serial([fn1, fn2, ..., fnx], data, callbak)`
-   global.promisify.parallel<br>
	Do the tasks simulately, and the results will be arranged in an array, and passed to the callback.<br>
	Two usages:
	-	`promisify.parallel(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.parallel([fn1, fn2, ..., fnx], data, callbak)`

-   global.promisify.some<br>
	Do the tasks simulately, and only returns the first finished one.<br>
	Two usages:
	-	`promisify.some(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.some([fn1, fn2, ..., fnx], data, callbak)`

### Object

-	object.copy
-	object.extent
-	object.isSubClassOf

### Function

-	Function.is
-	AsyncFunction<br>
	Class of async functions
-	AsyncFunction.is

### Array

-	array.copy
-	array.randomize
-	array.remove
-	array.translate
-	array.has
-	array:first
-	array:last
-	Array.is
-	Array.generate
-	Array.random
-	uint8Array.copy

### String

-	string.prepadding
-	String.random
-	String.blank
-	String.is

### Symbol

-	Symbol.setSymbols
-	Symbol.is

### Math

-	Math.pick<br>
	For Array, pick one random element inside it.<br>
	For Number, pick a boolean value whether a random number less than the given value;
-	Math.range<br>
	Pick a random number in a range.

## Events [TBD]

Some utils for event-related functions.

-	FiniteStateMachine
-	EventManager for both sync and async callbacks
-	Broadcast
-	Event Pipe with and without Barrier

## CommandLine

CLI utils, includes cl parse and interface.

### CommandLine Parser

Demo:

```javascript
var cmdLauncher = clp({
	title: SyncerTitle + ' v' + SyncerVersion,
	mode: 'process'
})
.describe('多文件夹自动同步者。\n' + setStyle('当前版本：', 'bold') + 'v' + SyncerVersion)
.addOption('--config -c <config> >> 配置文档地址')
.addOption('--showdiff -sd >> 只查看变更结果')
.addOption('--ignore -i >> 是否忽略删除')
.addOption('--deamon -d [duration(^\\d+$|^\\d+\\.\\d*$)=10] >> 是否启用监控模式，可配置自动监控时间间隔，默认时间为十分钟')
.addOption('--deaf -df >> 失聪模式')
.addOption('--delay -dl <delay> >> 巡视后行动延迟时长')
.addOption('--silence -s >> 不启用命令行控制面板')
.addOption('--web -w >> 启用Web后台模式' + setStyle('【待开发】', ['green', 'bold']))
.addOption('--socket -skt >> 启用Socket后台模式' + setStyle('【待开发】', ['green', 'bold']))
.on('command', params => {
	if (!!params.config) syncConfig.file = params.config;
	if (!!params.showdiff) syncConfig.showdiff = params.showdiff;
	if (!!params.deaf) syncConfig.deaf = params.deaf;
	if (!!params.ignore) syncConfig.ignore = params.ignore;
	if (!!params.deamon) {
		syncConfig.deamon = params.deamon;
		syncConfig.silence = false;
	}
	if (!isNaN(params.duration)) syncConfig.duration = params.duration * 60;
	if (!isNaN(params.delay)) syncConfig.delay = params.delay;
	if (!!params.silence) syncConfig.silence = true;
	if (!!params.web) {
		syncConfig.web = params.web;
		logger.error('Web服务模式暂未开启，敬请期待~~');
	}
})
.on('done', async params => {
	if (params.help) return;
	var config, configFile = syncConfig.file;
	try {
		config = await readJSON(syncConfig.file);
	}
	catch (err) {
		configFile = configPath;
		try {
			config = await readJSON(configPath);
		}
		catch (e) {
			configFile = null;
			config = {};
		}
	}

	syncConfig.deamon = syncConfig.deamon || config.deamonMode || false;
	syncConfig.duration = syncConfig.duration || config.monitor || deamonDuration;
	syncConfig.delay = syncConfig.delay || config.delay || deamonDelay;
	syncConfig.silence = syncConfig.silence || config.silence || !syncConfig.deamon;
	syncConfig.deaf = syncConfig.deaf || config.deaf || false;
	syncConfig.web = syncConfig.web || config.web || false;
	syncConfig.syncPrompt = config.syncPrompt || syncConfig.syncPrompt;
	syncConfig.mapPaddingLeft = config.mapPaddingLeft || syncConfig.mapPaddingLeft;
	syncConfig.mapPaddingLevel = config.mapPaddingLevel || syncConfig.mapPaddingLevel;
	syncConfig.ignores = config.ignore || [];
	syncConfig.group = config.group || {};

	syncConfig.ignores = generateIgnoreRules(syncConfig.ignores);
	for (let group in syncConfig.group) {
		syncConfig.group[group] = syncConfig.group[group].map(path => path.replace(/^~/, process.env.HOME));
	}

	if (syncConfig.showdiff) {
		launchShowDiff();
		return;
	}

	if (!syncConfig.silence) {
		rtmLauncher.launch();

		logger.info = (...args) => { args.map(arg => rtmLauncher.showHint(arg)) };
		logger.log = (...args) => { args.map(arg => rtmLauncher.showHint(arg)) };
		logger.warn = (...args) => { args.map(arg => rtmLauncher.showError(arg)) };
		logger.error = (...args) => { args.map(arg => rtmLauncher.showError(arg)) };
	}

	if (syncConfig.deamon && !!configFile) configWatch = fs.watch(configFile, async stat => {
		changePrompt(syncConfig.syncPrompt);
		logger.log(setStyle('配置文件改变，重新启动巡视者~~~', 'blue bold') + '      ' + timeNormalize());
		changePrompt();
		clearTimeout(deamonWatch);
		var config;
		try {
			config = await readJSON(configFile);
		}
		catch (err) {
			config = null;
		}

		if (!!config) {
			syncConfig.ignores = config.ignore;
			syncConfig.ignores = generateIgnoreRules(syncConfig.ignores);
			syncConfig.group = config.group;
			for (let group in syncConfig.group) {
				syncConfig.group[group] = syncConfig.group[group].map(path => path.replace(/^~/, process.env.HOME));
			}
		}

		var isInputStopped = rtmLauncher.isInputStopped;
		if (!isInputStopped) rtmLauncher.stopInput();
		await launchMission(true);
		if (!isInputStopped) rtmLauncher.resumeInput();
	});

	var isInputStopped = rtmLauncher.isInputStopped;
	if (!isInputStopped) rtmLauncher.stopInput();
	await launchMission();
	if (!isInputStopped) rtmLauncher.resumeInput();
})
;

var rtmLauncher = clp({
	title: SyncerTitle + ' v' + SyncerVersion,
	mode: 'cli',
	hint: {
		welcome: setStyle('欢迎来到同步空间~', 'yellow underline bold'),
		byebye: setStyle('世界，终结了。。。', 'magenta bold')
	},
	historyStorage: {
		limit: 100
	}
})
.describe('多文件夹自动同步者。\n' + setStyle('当前版本：', 'bold') + 'v' + SyncerVersion)
.add('refresh|re >> 强制同步更新')
.add('start|st >> 开始巡视模式')
.add('stop|sp >> 停止巡视模式')
.add('list|lt >> 显示当前分组同步信息')
.addOption('--group -g <group> >> 指定group标签后可查看指定分组下的源情况')
.addOption('--files -f <path> >> 查看指定路径下的文件列表')
.addOption('--all -a >> 显示所有文件与文件夹，不打开则只显示有变化的文件与文件夹')
.add('delete|del [...files] >> 删除文件列表')
.addOption('--group -g <group> >> 指定分组')
.addOption('--notforce -nf >> 强制删除整个目录')
.add('create|new [...files] >> 创建文件列表')
.addOption('--group -g <group> >> 指定分组')
.addOption('--folder -f >> 指定创建的是文件夹')
.add('copy|cp <source> <target> >> 从外源复制文件进来')
.addOption('--group -g <group> >> 指定分组')
.addOption('--notforce -nf >> 强制覆盖文件')
.add('move|mv <source> <target> >> 从外源复制文件进来')
.addOption('--group -g <group> >> 指定分组')
.addOption('--notforce -nf >> 强制覆盖文件')
.add('health|ht [duration(^\\d+$|^\\d+\\.\\d*$)=1] >> 查看当前 CPU 与 MEM 使用状态，统计时长单位为秒')
.addOption('--interval -i [interval(^\\d+$|^\\d+\\.\\d*$)=1] >> 定式更新，更新间隔单位为秒')
.addOption('--stop -s >> 定制定式更新')
.add('history|his >> 查看更新文件历史')
.addOption('--all -a >> 查看启动以来的更新文件历史')
.add('status|stt >> 显示当前配置')
.on('command', (param, command) => {
	if (Object.keys(param).length > 1) return;
	if (param.mission.length > 0) return;
	param.no_history = true;
	logger.error('不存在该指令哦！输入 help 查看命令~');
	autoTimerCount = 0;
})
.on('done', async params => {
	missionPipe.launch();
})
.on('quit', (param, command) => {
	if (!!healthWatcher) {
		clearInterval(healthWatcher);
		changePrompt(syncConfig.syncPrompt);
		logger.log('结束监控者。。。');
		changePrompt();
	}
	razeAllWatchers();
	if (!!deamonWatch) {
		clearTimeout(deamonWatch);
		if (configWatch) configWatch.close();
		configWatch = null;
		changePrompt(syncConfig.syncPrompt);
		logger.log('结束巡视者。。。');
		changePrompt();
	}
	param.msg = '同步者已死……';
})
.on('exit', (param, command) => {
	changePrompt(setStyle(syncConfig.syncPrompt, 'red bold'));
	logger.log(setStyle('世界崩塌中。。。', 'red bold'));
	changePrompt();
	setTimeout(function () {
		changePrompt(setStyle(syncConfig.syncPrompt, 'red bold'));
		logger.log(setStyle('世界已重归虚无。。。', 'red bold'));
		changePrompt();
		process.exit();
	}, 200);
})
.on('refresh', (param, all, command) => {
	missionPipe.add(taskRefresh);
})
.on('list', (param, all, command) => {
	var group = param.group;
	var path = param.path;
	var showAll = !!param.all;
	missionPipe.add(taskShowList, group, path, showAll);
})
.on('health', (param, all, command) => {
	var duration = param.duration * 1000;
	var interval = param.interval;
	var stop = param.stop;
	missionPipe.add(taskShowHealth, duration);
})
.on('status', (param, all, command) => {
	missionPipe.add(taskShowStatus);
})
.on('history', (param, all, command) => {
	var showAll = !!param.all;
	missionPipe.add(taskShowHistory);
})
.on('create', async (param, all, command) => {
	var group = param.group;
	if (!group) {
		command.showError('所属分组参数不能为空！');
		return;
	}
	group = syncGroups[group];
	if (!group) {
		command.showError('所选分组不存在！');
		return;
	}
	if (group.mode === WatchMode.NOTREADY) {
		command.showError('所选分组检测中，请稍后再试！');
		return;
	}
	if (group.mode === WatchMode.WRONG) {
		command.showError('所选分组异常！');
		return;
	}
	if (group.mode === WatchMode.FILE) {
		command.showError('不可在文件同步组里创建文件/目录！');
		return;
	}
	var paths = param.files;
	if (!paths || paths.length === 0) {
		command.showError('不可没有目标路径！');
		return;
	}

	missionPipe.add(createFilesAndFolders, group, paths, !!param.folder);
	missionPipe.add(revokeMission, true);
})
.on('delete', async (param, all, command) => {
	var paths = param.files;
	if (!paths || paths.length === 0) {
		command.showError('不可没有目标路径！');
		return;
	}
	var group = param.group, force = !param.notforce;

	missionPipe.add(deleteFilesAndFolders, syncGroups[group], paths, force);
	missionPipe.add(revokeMission, true);
})
.on('copy', async (param, all, command) => {
	var group = param.group;
	if (!group) {
		command.showError('所属分组参数不能为空！');
		return;
	}
	group = syncGroups[group];
	if (!group) {
		command.showError('所选分组不存在！');
		return;
	}
	if (group.mode === WatchMode.NOTREADY) {
		command.showError('所选分组检测中，请稍后再试！');
		return;
	}
	if (group.mode === WatchMode.WRONG) {
		command.showError('所选分组异常！');
		return;
	}
	if (group.mode === WatchMode.FILE) {
		command.showError('不可往文件同步组里复制文件/目录！');
		return;
	}
	var source = param.source;
	if (!source) {
		command.showError('不可没有源文件路径！');
		return;
	}
	var target = param.target;
	if (!target) {
		command.showError('不可没有目标文件路径！');
		return;
	}

	missionPipe.add(copyFilesFromOutside, source, target, group, !param.notforce);
	missionPipe.add(revokeMission, true);
})
.on('move', async (param, all, command) => {
	var group = param.group;
	if (!group) {
		command.showError('所属分组参数不能为空！');
		return;
	}
	group = syncGroups[group];
	if (!group) {
		command.showError('所选分组不存在！');
		return;
	}
	if (group.mode === WatchMode.NOTREADY) {
		command.showError('所选分组检测中，请稍后再试！');
		return;
	}
	if (group.mode === WatchMode.WRONG) {
		command.showError('所选分组异常！');
		return;
	}
	if (group.mode === WatchMode.FILE) {
		command.showError('不可往文件同步组里复制文件/目录！');
		return;
	}
	var source = param.source;
	if (!source) {
		command.showError('不可没有源文件路径！');
		return;
	}
	var target = param.target;
	if (!target) {
		command.showError('不可没有目标文件路径！');
		return;
	}

	var force = !param.notforce;
	if (source.substring(0, 1) === '/') {
		missionPipe.add(copyFilesFromOutside, group.map.source[0] + source, target, group, force);
	}
	else {
		missionPipe.add(copyFilesFromOutside, group.map.source[0] + '/' + source, target, group, force);
	}
	missionPipe.add(deleteFilesAndFolders, group, [source], force);
	missionPipe.add(revokeMission, true);
})
.on('stop', (param, all, command) => {
	missionPipe.add(taskStopMission);
})
.on('start', (param, all, command) => {
	missionPipe.add(taskStartMission);
})
;

cmdLauncher.launch();
```

## Threads [TBD]

Not Done Yet...
