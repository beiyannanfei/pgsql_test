/**
 * Created by wyq on 18/1/9.
 * 窗口函数在和当前行相关的一组表行上执行计算。
 * 这相当于一个可以由聚合函数完成的计算类型。
 * 但不同于常规的聚合函数， 使用的窗口函数不会导致行被分组到一个单一的输出行；
 * 行保留其独立的身份。 在后台，窗口函数能够访问的不止查询结果的当前行。
 */
const {Client} = require('pg');
const co = require("co");
const moment = require("moment");
const tId = setTimeout(process.exit, 1000, 0);
const client = new Client({database: 'demo_db'});
client.connect();

function t1() {
	co(function* () {
		const tableName = "achievement";
		yield client.query(`drop table if exists ${tableName}`);
		yield client.query(
			`CREATE TABLE ${tableName} (
				name varchar,
				subject varchar,
				score int
			)`
		);
		let insRes = yield client.query(`insert into ${tableName} values
			('张三', '数学', 82),			('张三', '语文', 85),			('张三', '英语', 75),
			('李四', '数学', 58),			('李四', '语文', 95),			('李四', '英语', 95),
			('王五', '数学', 62),			('王五', '语文', 80),			('王五', '英语', 70),
			('赵六', '数学', 55),			('赵六', '语文', 60),			('赵六', '英语', 58),
			('牛七', '数学', 98),			('牛七', '语文', 58),			('牛七', '英语', 95),
			('马八', '数学', 84),			('马八', '语文', 84),			('马八', '英语', 84)
		`);
		console.log("insRes = %j", insRes); //insRes = {"command":"INSERT","rowCount":18,"oid":0,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}
		//所有成绩及格且总分大于240的人的姓名和总成绩
		let {rows: rows} = yield client.query(`
			select name, subject, score, sum(score) over (partition by name) as total	from ${tableName}
		`);
		console.log("rows: %j", rows);
		/*rows: [
			{"name":"张三","subject":"英语","score":75,"total":"242"},
			{"name":"张三","subject":"语文","score":85,"total":"242"},
			{"name":"张三","subject":"数学","score":82,"total":"242"},
			{"name":"李四","subject":"数学","score":58,"total":"248"},
			{"name":"李四","subject":"语文","score":95,"total":"248"},
			{"name":"李四","subject":"英语","score":95,"total":"248"},
			{"name":"牛七","subject":"数学","score":98,"total":"251"},
			{"name":"牛七","subject":"语文","score":58,"total":"251"},
			{"name":"牛七","subject":"英语","score":95,"total":"251"},
			{"name":"王五","subject":"英语","score":70,"total":"212"},
			{"name":"王五","subject":"语文","score":80,"total":"212"},
			{"name":"王五","subject":"数学","score":62,"total":"212"},
			{"name":"赵六","subject":"数学","score":55,"total":"173"},
			{"name":"赵六","subject":"语文","score":60,"total":"173"},
			{"name":"赵六","subject":"英语","score":58,"total":"173"},
			{"name":"马八","subject":"数学","score":84,"total":"252"},
			{"name":"马八","subject":"语文","score":84,"total":"252"},
			{"name":"马八","subject":"英语","score":84,"total":"252"}
		]*/

		let {rows: response0} = yield client.query(`
			select name, subject, score, rank() over (partition by subject order by score desc) from ${tableName}
		`);
		console.log("response0: %j", response0);
		/*response0: [
			{"name":"牛七","subject":"数学","score":98,"rank":"1"},
			{"name":"马八","subject":"数学","score":84,"rank":"2"},
			{"name":"张三","subject":"数学","score":82,"rank":"3"},
			{"name":"王五","subject":"数学","score":62,"rank":"4"},
			{"name":"李四","subject":"数学","score":58,"rank":"5"},
			{"name":"赵六","subject":"数学","score":55,"rank":"6"},
			{"name":"牛七","subject":"英语","score":95,"rank":"1"},
			{"name":"李四","subject":"英语","score":95,"rank":"1"},
			{"name":"马八","subject":"英语","score":84,"rank":"3"},
			{"name":"张三","subject":"英语","score":75,"rank":"4"},
			{"name":"王五","subject":"英语","score":70,"rank":"5"},
			{"name":"赵六","subject":"英语","score":58,"rank":"6"},
			{"name":"李四","subject":"语文","score":95,"rank":"1"},
			{"name":"张三","subject":"语文","score":85,"rank":"2"},
			{"name":"马八","subject":"语文","score":84,"rank":"3"},
			{"name":"王五","subject":"语文","score":80,"rank":"4"},
			{"name":"赵六","subject":"语文","score":60,"rank":"5"},
			{"name":"牛七","subject":"语文","score":58,"rank":"6"}
		]*/
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();