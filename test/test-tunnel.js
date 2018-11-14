const { isMainThread } = require('worker_threads');

const MasterTask = async () => {
	require('../src');
	load('./src/threads/threadManager');
	load('./src/events/channel');

	const ThreadManager = _('Utils.Threads');

	const worker = ThreadManager.create(__filename);
	const tunnel = worker.getTunnel();

	worker.on('_tunnel', (...args) => {
		console.log(args);
	})

	console.log("I'm the master!");

	await wait(1000);
	tunnel.push(123);
	console.log("Master Sent...");

	await wait(1000);

	var msg = await tunnel.pull();
	console.log('Got Msg from Slaver:', msg);

	for (let i = 1; i <= 10; i ++) tunnel.push('x-' + i);
};

const SlaverTask = async () => {
	var tid;
	register('tunnel', (msg, event) => { tid = msg.id });
	register('_tunnel', (msg, event) => console.log(msg));

	await wait(1000);
	const tunnel = TunnelManager.getTunnel(tid);

	console.log("I'm the slaver!");

	var msg = await tunnel.pull();
	console.log('Got Msg from Master:', msg);

	await wait(1000);

	tunnel.push(456);
	console.log("Slaver Sent...");

	for (let i = 0; i < 10; i ++) {
		let d = await tunnel.pull();
		console.log('Nani: ' + d);
	}
	suicide();
};

if (isMainThread) MasterTask();
else SlaverTask();