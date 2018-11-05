console.log('Thread-' + thread.threadId + ' is online!!!');

register('init', (data, event) => {
	console.log('Thread Worker Launched!!!');
	console.log(data);
	console.log(event);
});

register('message', (msg, event) => {
	console.log('Message From Host:');
	console.log(msg);
	console.log(event);
});

register('fuck', (msg, event) => {
	console.log('Host is fucking ' + msg);
	console.log(event);
	setTimeout(() => {
		reply(event, "Let's Orgy!!!");
	}, 1000);
	setTimeout(() => {
		suicide();
	}, 2000);
});

register('test', (msg, event) => {
	console.log('Thread-' + thread.threadId + ' Get Test Task!');
	setTimeout(() => {
		var result = thread.threadId;
		reply(event, result);
	}, Math.random() * 500);
});

module.exports = 'This is thread-worker content!'