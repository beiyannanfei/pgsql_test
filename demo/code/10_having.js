/**
 * Created by wyq on 18/1/9.
 * 理解聚合和SQL的WHERE和HAVING 子句之间的关系非常重要。
 * WHERE和HAVING的基本区别如下： WHERE在分组和聚合计算之前选取输入行(它控制哪些行进入聚合计算)，
 * 而HAVING在分组和聚合之后选取输出行。
 * 因此，WHERE 子句不能包含聚合函数；因为试图用聚合函数判断那些行将要输入给聚合运算是没有意义的。
 * 相反，HAVING子句总是包含聚合函数。当然，你可以写不使用聚合的HAVING 子句，但这样做没什么好处，因为同样的条件用在WHERE阶段会更有效。
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
		let {rows} = yield client.query(`
			select name,sum(score) as totalscore 
			from ${tableName} 
			where name in (select name from ${tableName} where score >= 60 and subject = '数学')
			group by name 
			having sum(score) > 240
		`);
		console.log("rows: %j", rows);  //rows: [{"name":"马八","total_score":"252"},{"name":"张三","total_score":"242"}]
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();