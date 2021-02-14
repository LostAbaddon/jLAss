# jLAss

-	Version: 1.0.3
-	Author: [LostAbaddon](mailto:lostabaddon@gmail.com)
-	NodeJS Version: >= 14.0.0

My Personal Javascript Core Lib

## Install

```
npm install https://github.com/LostAbaddon/jLAss.git --save
```

## Includes

-	Module Manager for b/n
-	Extends for Class, Object, Function, Promise, Date and Time, Symbol
-	Log Utils
-	System Monitor Utils
-	FileSystem Utils
-	Datastore and Cache
-	Math(TBD)
-	Threads
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
-	pumplize<br>
	Make function delay for a while and use the last called arguments (stack mode) or all the called arguments (pump mode).<br>
	Default mode is stack mode.
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
	Parse filepath to a loadable path.<br>
	If start with `./` then the root path is jLass path; if start with `~/` then the root path will be `process.cwd()`.
-	setLoadRoot<br>
	Change the default root path for `~/`

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
-	array.query
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
-	Channel
-	Tunnel: Thread-crossing Channel

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
.add('list|lt >> 显示当前分组同步信息')
.addOption('--group -g <group> >> 指定group标签后可查看指定分组下的源情况')
.addOption('--files -f <path> >> 查看指定路径下的文件列表')
.addOption('--all -a >> 显示所有文件与文件夹，不打开则只显示有变化的文件与文件夹')
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
.on('list', (param, all, command) => {
	...
})
;

cmdLauncher.launch();
```

## Threads

-	Utils.Threads<br>
	Simple Thread Manager, return a thread-worker wrapper.<br>
	Worker will load a list of js core lib.
-	Utils.Threads.create(filelist, init_data)<br>
	Create a thread and load filelist, start with init_data
-	Utils.Threads.evaluate(fun, data)<br>
	Create a thread and run the given function with given data.
-	Worker<br>
	Wrapped ThreadWorker.<br>
	-	`worker.send(msg)` to send message to thread;
	-	`worker.load(files)` to load files;
	-	`worker.request(msg, data)` to call thread worker with message `{ event, data }`, return a promise object;
	-	`worker.evaluate(fun, data)` to call thread worker to run the given function with given data;
	-	`worker.suicide()` to kill the thread worker;
	-	`count` is the running task count;
-	ThreadWorker.Stat<br>
	Status of worker: `IDLE`, `BUSY`, `DEAD`
-	ThreadWorker<br>
	A worker with basic core libs.<br>
	-	Use `register(tag, fn)` to response the request from main thread;<br>
		register the "init" event to response the init_data which passed from main thread.<br>
	-	Use `send(msg)` to send message to main thread;<br>
	-	Use `request(event, data)` to call main thread with message `{ event, data}`;<br>
	-	Use `suicide` to tell main thread to kill current thread worker
-	ThreadPool<br>
	A thread pool which can choise thread automatically.
-	ThreadPool.create(size, files, data)<br>
	Create a batch of threads with init files and data.
-	ThreadPool.load(files)<br>
	Make all threads load files.
-	ThreadPool.request(event, data, cb)<br>
	Choose a free thread or a thread with least tasks to run the given event;
-	ThreadPool.requestAll(event, data, cb)<br>
	Make all thread to do the job.
-	ThreadPool.evaluate(fun, data, cb)<br>
	Choose a free thread or a thread with least tasks to do the evaluation;
-	ThreadPool.refresh([files])<br>
	Kill the free threads and reload it, with the files set in `create` or the given files;
-	ThreadPool.refreshAll([files])<br>
	Kill the free threads, and when the busy threads finish all their jobs then suicide, and reload all the threads with the files set in `create` or the given files;
-	ThreadPool.killAll()<br>
	Kill all the threads and release the pool.

## Datastore and Cache

-	LRUCache & LRUCache.withDatastore<br>
	Latest Recently Use Cache
-	UFCache & UFCache.withDatastore<br>
	Usage Frequency Cache

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
-	FS.hasFile
-	FS.getFolderMap
-	Utils.preparePath<br>
	Check path and create necessary folders.
-	Utils.preparePathSync<br>
	Sync version of Utils.preparePath.