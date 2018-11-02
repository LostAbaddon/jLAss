/**
 * Name:	Algorithm
 * Desc:    算法
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.20
 */

// 一次交换获取指定容积限制下更优配置方案
const RearrangePow = 1.05;
const rearrange = (inside, outside, sizeLimit) => {
	var totalV = 0, totalS = 0;
	inside.map(g => {
		totalV += g.data.value;
		totalS += g.data.size;
	});

	// 内部单一元素与外部元素交换
	var result = inside;
	var maxV = totalV;
	inside.map((g, i) => {
		var currV = totalV - g.data.value;
		var currS = totalS - g.data.size;
		var list = inside.copy();
		list.splice(i, 1);
		outside.map(gg => {
			var newS = currS + gg.data.size;
			if (newS < sizeLimit) {
				currS = newS;
				currV += gg.data.value;
				list.push(gg);
			}
		});
		if (currV > maxV) {
			maxV = currV;
			result = list;
		}
	});

	return result;
};
// 指定容积限制下搜索最大资源配置方案
const ArrangePow = 0.9;
const arrangeRoom = (goods, sizeLimit) => {
	var start = new Date().getTime();
	var totalSize = 0, inside = [], outside = [];
	var room = goods.map(g => {
		return {
			rate: g.value / Math.pow(g.size, ArrangePow),
			data: g
		};
	});
	room.sort((ga, gb) => gb.rate - ga.rate);
	room.map(g => {
		var s = g.data.size;
		var nextSize = totalSize + s;
		if (nextSize < sizeLimit) {
			totalSize = nextSize;
			inside.push(g);
		}
	});
	room.map(g => {
		if (inside.indexOf(g) < 0) {
			outside.push(g);
		}
	});
	outside.map(g => g.rate = g.data.value / Math.pow(g.data.size, RearrangePow));
	outside.sort((ga, gb) => gb.rate - ga.rate);

	inside = rearrange(inside, outside, sizeLimit);

	return inside.map(g => g.data);
};

module.exports.arrangeRoom = arrangeRoom;
global.Utils = global.Utils || {};
global.Utils.Algorithm = {
	arrangeRoom: arrangeRoom
};