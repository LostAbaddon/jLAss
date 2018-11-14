/**
 * Name:	Channel
 * Desc:    通道
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2018.11.09
 */

class Channel {
	constructor (consumeFirst=false) {
		this._producer = [];
		this._consumer = [];
		this._consumeFirst = !!consumeFirst;
		this._running = true;
		this._dying = false;
	}
	push (data) {
		return new Promise((res, rej) => {
			if (!this._running) {
				res();
				return;
			}
			if (this._consumer.length === 0) {
				this._producer.push([data, res]);
			}
			else {
				let c = this._consumer.shift();
				if (this._consumeFirst) {
					setImmediate(() => c(data));
					setImmediate(() => res());
				}
				else {
					setImmediate(() => res());
					setImmediate(() => c(data));
				}
				if (this._dying && this._consumer.length === 0) this._running = false;
			}
		});
	}
	pull () {
		return new Promise((res, rej) => {
			if (!this._running) {
				res();
				return;
			}
			if (this._producer.length === 0) {
				this._consumer.push(res);
			}
			else {
				let p = this._producer.shift();
				if (this._consumeFirst) {
					setImmediate(() => res(p[0]));
					setImmediate(() => p[1]());
				}
				else {
					setImmediate(() => p[1]());
					setImmediate(() => res(p[0]));
				}
				if (this._dying && this._producer.length === 0) this._running = false;
			}
		});
	}
	kill () {
		if (!this._running) return;
		this._producer.forEach(p => setImmediate(() => p[1]()));
		this._consumer.forEach(c => setImmediate(() => c()));
		this._running = false;
	}
	close () {
		this._dying = true;
		if (this._producer.length + this._consumer.length === 0) this._running = false;
	}
	get alive () {
		return !this.dying && this._running;
	}
}

exports.Channel = Channel;
_('Utils.Events').Channel = Channel;