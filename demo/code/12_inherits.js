/**
 * Created by wyq on 18/1/9.
 * 继承
 */
const {Client} = require('pg');
const co = require("co");
const moment = require("moment");
const tId = setTimeout(process.exit, 1000, 0);
const client = new Client({database: 'demo_db'});
client.connect();

function t1() {
	co(function* () {
		const baseTableName = "person";
		const subTableName = "employee";
		yield client.query(`drop table if exists ${subTableName}`);
		yield client.query(`drop table if exists ${baseTableName}`);
		yield client.query(`
			CREATE TABLE ${baseTableName} (
				name varchar, 
				age int
			)`);

		yield client.query(`
			create table ${subTableName} (
				company varchar,
				salary int
			) INHERITS (${baseTableName})`);

		yield client.query(`insert into ${baseTableName} values ('zhangsan', 20)`);
		yield client.query(`insert into ${baseTableName} values ('lisi', 25)`);
		yield client.query(`insert into ${baseTableName} values ('wangwu', 30)`);

		yield client.query(`insert into ${subTableName} values ('zhaoliu', 28, 'alipay', 100000)`);
		yield client.query(`insert into ${subTableName} values ('liuneng', 22, 'baidu', 80000)`);

		let {rows: response} = yield client.query(`select * from ${baseTableName} where age > 25`); //会将子表中符合条件的结果显示
		console.log("response: %j", response);//response: [{"name":"wangwu","age":30},{"name":"zhaoliu","age":28}]

		let {rows: response1} = yield client.query(`select * from only ${baseTableName} where age > 25`); //只显示基类表中的结果
		console.log("response1: %j", response1);  //response1: [{"name":"wangwu","age":30}]
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();





