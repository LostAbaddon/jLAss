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

module.exports = 'This is thread-worker content!'