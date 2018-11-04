require('../src');
require('../src/threads/threadManager');

const ThreadManager = _('Utils.Threads');

const ThreadPool = ThreadManager.Pool.create();

ThreadPool.load('~/test/worker1.js');

const test1 = promisify(async (pool, next) => {
	var tasks = total = 50;
	for (let i = 0; i < total; i ++) {
		pool.request('test', 'No. ' + (i + 1) + ' voting...', (result, err) => {
			console.log('>', result);
			tasks --;
			if (tasks === 0) {
				next();
			}
		});
		await wait(Math.random() * 100);
	}
});

(async () => {
	console.log('step 1');
	await test1(ThreadPool);
	console.log('step 2');
	var r = await ThreadPool.requestAll('test', 'Shit...');
	console.log(r);
	console.log('step 3');
	r = await ThreadPool.evaluate(() => "Blablalba");
	console.log(r);
	console.log('step 4');
	ThreadPool.killAll();
})();