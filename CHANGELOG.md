# jLAss Change Log

My Personal Javascript Core Lib

> Author: [LostAbaddon](mailto:lostabaddon@gmail.com)

---

## 0.1.0

###	2017

Start to build my personal js-core lib.

### 2018.11.01

-	Upload to Github
-	测试了LRU缓存方案，比 Map 速度慢了10%，内存使用也更大，所以不要相信网上的 JS-LRU 方案。

---

## 0.1.1

### 2018.11.02

-	调整目录结构
-	调整部分函数
-	增加了 once 化函数
-	增加了对 queueMicroTask 的 promisify 版本支持

### 2018.11.02

-	增加了 loadall 的路径解析规则
-	增加了 Version 类
-	增加了对是否支持线程的判断
-	once 化增加对 promisify 的支持

### 2018.11.03

-	调增 promisify.some 为 promisify.any
-	增加 promisify 三个流程函数的别名
-	调整 LRU 测试的实现，LRU在大量数据与读写时速度与 Object 或 Map 差不多，内存使用减少；自己的测试类在海量数据读写的速度和内存使用上都比 LRU 好。
-	once 函数增加 refresh 功能
-	公开了 getLoadPath 方法，使用“~/”从 `process.cwd()` 位置加载文件，默认从 jLAss 包位置开始加载
-	实现了简单的 ThreadManager，线程内自动加载一系列基础库，并对主线程与子线程之间的通讯进行封装<br>
	使用 `ThreadManager.creae(filelist, init_data)` 启一个线程并自动加载文件，使用传入初始数据 init_data，线程中注册（regist）init 事件来响应。

### 2018.11.04

-	增加 pump 函数<br>
	可实现等待一定时间后执行最后一次参数（stack模式）或全部参数都执行（pump模式），默认stack模式。

---

## 0.1.2

### 2018.11.04

-	ThreadManager 增加 evaluate 功能<br>
	使用 `ThreadManager.evaluate(fn, data, callback)` 起一个线程运行指定函数。
-	ThreadWorker 增加 evaluate 功能
-	增加线程池功能，由线程池模块自行完成线程分派和调度

### 2018.11.05

-	pump 化函数提供 dump 直接输出的功能
-	线程池管理增加更新闲置线程与更新所有线程的功能（用于释放线程中加载太多的文件而产生的内存压力）<br>
-	增加基于 Map 的 LRUCache

## 0.1.3

### 2018.11.07

-	Array 增加 query 命令，返回符合条件的第一个元素的指标：`index = array.query(fun)`
-	增加基于带 Datastore 的 Cache 模块：LRUCache.withDatastore 和 UFCache.withDatastore

## 0.1.4

### 2018.11.08

-	ThreadManager 的 pool 增加默认参数记录功能
-	ThreadManager 的 pool 在 killAll 后可重新 create
-	删除无用的 console.log
-	LRUCache 和 UFCache 增加 del、has、clear 功能

## 0.1.5

### 2018.11.09

-	增加通道channel<br>
	生产者：`channel.push(data)`或阻塞式：`await channel.push(data)`<br>
	消费者：`var data = await channel.pull()`
	关闭：`channel.close()
	强制关闭：`channel.kill()`

### 2018.11.14
-	增加跨线程通道tunnel

### 2018.11.15
-	增加Channel和Tunnel的合并功能

### 2021.02.08
-	用实际使用的新库来替代原有的库（改动太大，懒得样样都记录了……）