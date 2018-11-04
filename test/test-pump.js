require('../src');
require('../src/utils/pump');

const stack_fun_test = (name, age) => {
	// console.log(name, age);
	return name + ' is ' + age + ' old!';
};
const pump_fun_test = list => {
	// console.log(list);
	return 'There\'re ' + list.length + ' men at all!';
};
const responser = result => {
	console.log('Result is: ' + result);
};

const stack_test = pumplize(stack_fun_test, responser).timeout(200);
const pump_test = pumplize(pump_fun_test, responser, false).timeout(50);

(async () => {
	for (let i = 0; i < 20; i ++) {
		stack_test('LostAbaddon(' + i + ')', 10 + i);
		await wait(10);
	}
})();

(async () => {
	for (let i = 0; i < 20; i ++) {
		pump_test('LostAbaddon(' + i + ')', 10 + i);
		await wait(10);
	}
})();