/**
 * Name:	Function Utils
 * Desc:    Function 类拓展工具
 * Author:	LostAbaddon
 * Version:	0.0.2
 * Date:	2018.11.01
 */

Function.is = obj => obj instanceof Function;
global.AsyncFunction = (async () => {}).constructor;
AsyncFunction.is = obj => obj instanceof AsyncFunction;