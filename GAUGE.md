# jLAss 相关规范【意向】

----

## 命名

-	常量：全大写<br>
	例：`var TIMEOUT = 100;`
-	变量：驼峰，以类型缩写开头<br>
	例：`var strPersonName = "John Smith"`
	-	因JS无类型，所以需加上类型前缀，方便区分
	-	例外：块级临时变量可以简化
	-	常用变量名可简化，如`name`、`index`等
	-	常用变量类型缩写：
		-	int:	int
		-	float:	num
		-	string:	str
		-	date:	d
		-	bool:	b
		-	symbol:	sym
		-	array:	arr
-	内部变量：前缀双下划线<br>
	例：`this.__name = "invisible"`
	-	内部变量指只有实例自己会用的变量，外部最好不要调用
-	友变量：前缀单下划线<br>
	例：`this._strNickName = "Peter Parker"`
	-	如果两个类有隶属关系，则属于友类，可相互调用对方的友变量
-	事件：频道结构，使用“:”连接，且第一个部分是发起方标识符<br>
	例：`emit("connection:peer:found")`
	-	不同对象的事件名应该不同

## 目录结构

-	顶层：src、test、bin、lib、core、plugin、data、config等
	-	core：	业务无关的核心组件
	-	lib：	第三方组件
	-	plugin：	可选插件
	-	bin：	shell等脚本
	-	data：	非代码文件
	-	config：	配置文件
	-	test：	测试文件
	-	src：	业务源码
-	src目录
	-	根据业务大类进行拆分，比如网站项目分为frontend与backend，或website与server
	-	根据业务大小进行子目录拆分，比如根据MVC或MVP拆分二级目录
	-	最后根据功能模块进行拆分