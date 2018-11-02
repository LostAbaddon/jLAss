# jLAss

My Personal Javascript Core Lib

> Author: [LostAbaddon](mailto:lostabaddon@gmail.com)

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
	For Number, pick a random number not lager than it.
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

## Threads [TBD]

Not Done Yet...