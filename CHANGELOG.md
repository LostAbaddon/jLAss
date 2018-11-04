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