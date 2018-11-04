require('../src');
require('../src/threads/threadManager');

const ThreadManager = _('Utils.Threads');

const worker = ThreadManager.create('~/test/worker1.js', {});

(async () => {
	console.log('step 1');
	worker.send('Aloha Kosmos!');
	console.log('step 2');
	worker.request('fuck', 'you');
	console.log('step 3');
	await worker.request('fuck', 'you all');
	console.log('step 4');
	var result = await ThreadManager.evaluate(
		data => data.a + data.b,
		{ a: 1, b: 10 }
	);
	console.log('step 5: ' + result);
})();