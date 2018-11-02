const {
	Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');

const Tester1 = () => {
	if (isMainThread) {
		const worker = new Worker(__filename);
		const subChannel = new MessageChannel();
		worker.postMessage({ hereIsYourPort: subChannel.port1, message: 'What The Fuck 1...' }, [subChannel.port1]);
		subChannel.port2.on('message', (value) => {
			console.log('received:', value);
		});
	}
	else {
		parentPort.once('message', (value) => {
			console.log('msg worker 1 actived');
			value.hereIsYourPort.postMessage('the worker 1 is sending "' + value.message + '"');
			value.hereIsYourPort.close();
		});
	}
};

const Tester2 = () => {
	if (isMainThread) {
		const worker = new Worker(__filename);
		worker.postMessage({ message: 'What The Fuck 2...' });
		worker.on('message', value => {
			console.log('received:', value);
		});
	}
	else {
		parentPort.once('message', value => {
			console.log('msg worker 2 actived');
			parentPort.postMessage('the worker 2 is sending "' + value.message + '"');
			parentPort.close();
		});
	}
};

// Tester1();
Tester2();