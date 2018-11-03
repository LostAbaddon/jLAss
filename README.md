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
-	Other Utils

## Extends

We can use "global" in both browser and node (b/n)

> UpCase for class, LowCase for instance<br>
> Obj.Y for function, Obj:Y for property

### Global

-	promisify
-	oncilize<br>
	Make function and promise run only once.<br>
	call `fn.refresh()` to allow it be run again.
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
-	waitQueue<br>
	Promisify version for queueMicrotask<br>
	which is a V8 version of nextTick and always run after nextTick.
-	Clock<br>
	Event-Timestamp Manager
-	loadall<br>
	load all js / json files under a given folder, and the second argument can decide load the sub folders or not, which default value is true.
-	Version<br>
	Version class for parsing version strings.
-	getLoadPath<br>
	获取绝对路径：“./”开始则从 jLAss 包位置开始加载，“~/”开始则从 `process.cwd()` 位置开始加载
-	setLoadRoot<br>
	指定 getLoadPath 开始的根路径（默认为 jLAss 包位置）

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
	Alias: promisify.s<br>
	Two usages:
	-	`promisify.serial(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.serial([fn1, fn2, ..., fnx], data, callbak)`
-   global.promisify.parallel<br>
	Do the tasks simulately, and the results will be arranged in an array, and passed to the callback.<br>
	Alias: promisify.p<br>
	Two usages:
	-	`promisify.parallel(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.parallel([fn1, fn2, ..., fnx], data, callbak)`

-   global.promisify.any<br>
	Do the tasks simulately, and only returns the first finished one.<br>
	Alias: promisify.a<br>
	Two usages:
	-	`promisify.any(fn1, fn2, ..., fnx, data, callback)`
	-	`promisify.any([fn1, fn2, ..., fnx], data, callbak)`

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
	...
	rtmLauncher.launch();
})
.on('done', async params => {
	...
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
	...
})
.on('done', async params => {
	...
})
.on('quit', (param, command) => {
	...
})
.on('exit', (param, command) => {
	...
})
.on('health', (param, all, command) => {
	...
})
;

cmdLauncher.launch();
```

## Threads [TBD]

-	Utils.Threads<br>
	Simple Thread Manager, return a thread-worker wrapper.<br>
	Worker will load a list of js core lib.

## Utils

-	ModuleManager<br>
	use "global._" to load and set namespace.
-	Utils.getHealth<br>
	CPU and Memory usage utils.
-	logger<br>
	Generate a colored logger.

## FS Utils

-	FS.mkfolder<br>
	Create nonexist folder automatically.
-	FS.filterPath<br>
	Filter the filss and folders and others.
-	FS.createFolders<br>
	Create list of folders.
-	FS.createEmptyFiles
-	FS.deleteFiles<br>
	Delete list of files.
-	FS.deleteFolders
	Delete list of folders.
-	FS.watchFolderAndFile
-	Utils.preparePath<br>
	Check path and create necessary folders.
-	Utils.preparePathSync<br>
	Sync version of Utils.preparePath.