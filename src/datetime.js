/**
 * Name:	Auxillary Utils and Extends for DateTime
 * Desc:    日期时间相关拓展
 * Author:	LostAbaddon
 * Version:	0.0.1
 * Date:	2017.09.23
 */

const getDTMatch = (format, match, lim, def) => {
	if (isNaN(def)) def = lim;
	var temp = format.match(match);
	if (!temp) temp = def;
	else temp = temp.length;
	if (temp < lim) temp = lim;
	return temp;
}
const getDateString = (Y, M, D, link) => {
	link = link || '/';
	var temp = [];
	if (Y.length > 0) temp.push(Y);
	if (M.length > 0) temp.push(M);
	if (D.length > 0) temp.push(D);
	return temp.join(link);
};
const getTimeString = (h, m, s, ms, link) => {
	link = link || ':';
	var temp = [];
	if (h.length > 0) temp.push(h);
	if (m.length > 0) temp.push(m);
	if (s.length > 0) temp.push(s);
	var result = temp.join(link);
	if (ms.length > 0) result += '.' + ms;
	return result;
};
const timeNormalize = (time, format, datelink, timelink, combinelink) => {
	time = time || new Date();
	// format = format || 'YYYYMMDDhhmmssx';
	format = format || 'YYYYMMDDhhmmss';
	datelink = datelink || '/';
	timelink = timelink || ':';
	combinelink = combinelink || ' ';

	var Ys = getDTMatch(format, /Y/g, 0, 0);
	var Ms = getDTMatch(format, /M/g, 1, 0);
	var Ds = getDTMatch(format, /D/g, 1, 0);
	var hs = getDTMatch(format, /h/g, 0, 0);
	var mms = getDTMatch(format, /m/g, 0, 0);
	var ss = getDTMatch(format, /s/g, 0, 0);
	var mss = getDTMatch(format, /x/g, 0);

	var Y = (time.getYear() + 1900 + '').prepadding(Ys, '0');
	var M = (time.getMonth() + 1 + '').prepadding(Ms, '0');
	var D = (time.getDate() + '').prepadding(Ds, '0');
	var h = (time.getHours() + '').prepadding(hs, '0');
	var m = (time.getMinutes() + '').prepadding(mms, '0');
	var s = (time.getSeconds() + '').prepadding(ss, '0');
	var ms = (time.getMilliseconds() + '').prepadding(mss, '0');

	if (Ys === 0) Y = '';
	if (Ms === 0) M = '';
	if (Ds === 0) D = '';
	if (hs === 0) h = '';
	if (mms === 0) m = '';
	if (ss === 0) s = '';
	if (mss === 0) ms = '';

	var sDate = getDateString(Y, M, D, datelink);
	var sTime = getTimeString(h, m, s, ms, timelink);
	if (sTime.length === 0) return sDate;
	return sDate + combinelink + sTime;
};

_('Utils').getTimeString = timeNormalize;