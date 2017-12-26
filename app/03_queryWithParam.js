/**
 * Created by wyq on 17/12/25.
 * 参数化查询
 */
const client = require("./client");

function t1() { //纯文本
	client.query("select now() as now").then(({rows}) => {
		console.log("rows = %j", rows);
		rows = [{"now": "2017-12-26T07:32:50.903Z"}]
	}).catch(err => {
		console.log("err: %j", err.stack || err.message || err);
	});
}

function createTabelUses() {
	client.query("CREATE TABLE users (name varchar(80),email varchar(80));").then(response => {
		console.log("response = %j", response);
		response = {
			"command": "CREATE",
			"rowCount": null,
			"oid": null,
			"rows": [],
			"fields": [],
			"_parsers": [],
			"RowCtor": null,
			"rowAsArray": false
		};
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

function t2() { //执行sql语句之前需要创建tabel(上一个函数)
	const text = "insert into users(name, email) values ($1, $2) returning *";
	const values = ["brianc", "brian.m.carlson@gmail.com"];
	client.query(text, values).then(response => {
		console.log("response = %j", response);
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t2();









