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
	await worker.requestAndWait('fuck', 'you all');
	console.log('step 4');
})();