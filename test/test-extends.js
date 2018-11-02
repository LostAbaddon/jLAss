require('../src');
require('../src/utils/once');

return;

var { info, log } = logger(0);

// Object

info('Test :: Object');

var o = {};
var oo = { name: 'test' };
log(o);
o.extent(oo);
log(o);
o.name = 'fuck';
log(oo);
log(o);

// Function

info('Test :: Function');

var fs = () => {};
var fa = async () => {};
log(Function.is(fs), AsyncFunction.is(fs));
log(Function.is(fa), AsyncFunction.is(fa));

// Class

info('Test :: Class');

var ca = class A {};
var cb = class B extends ca {};
log(ca.isSubClassOf(ca), ca.isSubClassOf(cb));
log(cb.isSubClassOf(ca), cb.isSubClassOf(cb));

// Array

info('Test :: Array');

var aa = Array.generate(10);
var ab = Array.generate(10, i => i * i);
var ac = Array.random(20);
var ad = Array.random(20, i => 'r-'+(i/2));

log(aa);
log(ab);
log(ac);
log(ad);

var ae = ab.copy();
ae[0] = 100;
log(ab);
log(ae);

ae.remove(100);
log(ae);

ae = ae.randomize();
log(ae);

ae = ae.translate(3);
log(ae);

ae = ae.translate(-6);
log(ae);

// String

info('Test :: String');

var s = String.random(10);
log(s);
log(s.prepadding(20, '_'));
log(s.prepadding(20, '_', true));

// Symbol

info('Test :: Symbol');

var sym = Symbol.setSymbols(['A', 'B', 'C']);
log(sym);
log(Symbol.is(sym.A));

// Math

info('Test :: Math');

var ma = Math.pick(Array.generate(10, i => 100 + i));
log(ma);
var mb = Math.pick(0.3);
log(mb);
var mc = Math.range(5, 15);
log(mc);
var md = Math.range(100);
log(md);

// Date and Time

info('Test :: DateTime');

const timeNormalize = global.Utils.getTimeString;
log(timeNormalize(new Date(), 'DDMMYYssmmhh', ':', 'x', 'y'));

// Timers

info('Test :: Timers');

(async () => {
	var timer = new Clock();
	log('Before Timer');
	await wait(1000);
	timer.stamp('1 second');
	log('Wait For 1 Second');
	await waitLoop();
	timer.stamp('loop');
	log('Wait For Loop');
	await waitTick();
	timer.stamp('tick');
	log('Wait For Tick');
	log('\n', timer.list(false));
})();