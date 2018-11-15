const { isMainThread } = require('worker_threads');

const MasterTask = async () => {
	require('../src');
	load('./src/threads/threadManager');
	load('./src/events/channel');

	const ThreadManager = _('Utils.Threads');

	const worker = ThreadManager.create(__filename);
	const tunnel = worker.getTunnel();

	console.log("I'm the master!");

	await wait(1000);
	tunnel.push(123);
	console.log("Master Sent...");

	await wait(1000);

	var msg = await tunnel.pull();
	console.log('Got Msg from Slaver:', msg);

	for (let i = 1; i <= 10; i ++) tunnel.push('x-' + i);

	await wait(900);
	msg = await tunnel.pull();
	console.log('M: ' + msg);
};

const SlaverTask = async () => {
	var tid;
	register('tunnel', (msg, event) => { tid = msg.id });

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
	tunnel.close();

	await wait(1000);
	tunnel.push('abc');

	await wait(1000);
	suicide();
};

if (isMainThread) MasterTask();
else SlaverTask();