/**
 * Name:	ID Utils
 * Desc:    ID 相关工具
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2021.11.08
 */

const newID = (len=16) => {
	var id = '';
	for (let i = 0; i < len; i ++) {
		let j = Math.floor(Math.random() * 64);
		if (j < 36) j = j.toString(36);
		else if (j < 62) j = (j - 26).toString(36).toUpperCase();
		else if (j === 62) j = '_';
		else j = '.';
		id = id + j;
	}
	return id;
};
const ID2Bytes = id => {
	var bytes = [];
	id.split('').forEach(s => {
		if (s === '.') bytes.push(63);
		else if (s === '_') bytes.push(62);
		else if ((s * 1) + '' === s) bytes.push(s * 1);
		else {
			s = s.charCodeAt(0);
			if (s >= 97 && s <= 122) bytes.push(s - 87);
			else if (s >= 65 && s <= 90) bytes.push(s - 29);
		}
	});
	return bytes;
};

module.exports = {newID, ID2Bytes};
_('Utils.ID').newID = newID;
_('Utils.ID').ID2Bytes = ID2Bytes;