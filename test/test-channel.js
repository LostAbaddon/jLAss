require('../src');
load('./src/events/channel');

const Channel = _('Utils.Events.Channel');

const consumer1 = async ch => {
	var count = 0;
	while (ch.alive) {
		count ++;
		var data = await ch.pull();
		console.log("Consumer 1: " + data + ' / ' + count);
		await wait(Math.range(105));
	}
};
const consumer2 = async ch => {
	var count = 0;
	while (ch.alive) {
		count ++;
		var data = await ch.pull();
		console.log("Consumer 2: " + data + ' / ' + count);
		await wait(Math.range(95));
	}
};

(async () => {
	var ch = new Channel();
	consumer1(ch);
	consumer2(ch);

	console.log('Send Start');
	for (let i = 0; i < 100; i ++) {
		await ch.push(i);
	}
	console.log('Send Done');

	await wait(100);

	console.log('Send Start');
	for (let i = 0; i < 100; i ++) {
		ch.push(i);
		await wait(100);
	}
	console.log('Send Done');
})();