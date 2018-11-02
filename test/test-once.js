require('../src');
require('../src/utils/once');

var fs = function (num) {
	var x = Math.floor(num / 2);
	if (x * 2 === num) return x;
	return num * 3 + 1;
};

var s = 30;
console.log(s);
s = fs(s);
console.log(s);
s = fs(s);
console.log(s);
s = fs(s);
console.log(s);

fs = oncilize(fs);

s = 30;
console.log(s);
s = fs(s);
console.log(s);
s = fs(s);
console.log(s);
s = fs(s);
console.log(s);

var fa = function (num, next) {
	var x = Math.floor(num / 2);
	if (x * 2 !== num) x = num * 3 + 1;
	next(x);
};

fa1 = promisify(fa);

(async () => {
	s = 30;
	console.log(s);
	s = await fa1(s);
	console.log(s);
	s = await fa1(s);
	console.log(s);
	s = await fa1(s);
	console.log(s);
})();

fa2 = oncilize(promisify(fa));

(async () => {
	s = 30;
	console.log(s);
	s = await fa2(s);
	console.log(s);
	s = await fa2(s);
	console.log(s);
	s = await fa2(s);
	console.log(s);
})();