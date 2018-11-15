require('../src');
load('./src/events/channel');

const Channel = _('Utils.Events.Channel');

const ch1 = new Channel();
const ch2 = new Channel();

const producer = async (label, ch) => {
	for (let i = 0; i < 10; i ++) {
		await wait(Math.random() * 100);
		// await ch.push(label + ":p-" + i);
		ch.push(label + ":p-" + i);
	}
	// await wait(0);
	ch.close();
};
const consumer = async (label, ch) => {
	while (ch.alive) {
		let msg = await ch.pull();
		console.log(label + " >> " + msg);
	}
	console.log('[ ' + label + ' >> DONE ]');
};

(async () => {
	ch1.combine(ch2);

	producer('A', ch1);
	producer('B', ch2);
	consumer('A', ch1);
	consumer('B', ch2);
})();