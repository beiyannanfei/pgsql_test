/**
 * Created by wyq on 17/12/25.
 * 参数化查询
 */
const client = require("./client");
const co = require("co");
setTimeout(process.exit, 1000, 0);

function t1() { //纯文本
	client.query("select now() as now").then(({rows}) => {
		console.log("rows = %j", rows);
		rows = [{"now": "2017-12-26T07:32:50.903Z"}]
	}).catch(err => {
		console.log("err: %j", err.stack || err.message || err);
	});
}

function t2() {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		console.log("delRes = %j", delRes);
		let createTbRes = yield client.query("CREATE TABLE users (name varchar(80),email varchar(80))");
		console.log("createTbRes = %j", createTbRes);
		//如果您将参数传递给您的查询，您将希望避免字符串连接参数直接查询文本。这可以（并且经常）导致sql注入漏洞
		const text = "insert into users(name, email) values ($1, $2) returning *";
		const values = ["brianc", "brian.m.carlson@gmail.com"];
		//节点postgres的支持paramterized查询，
		// 通过查询文本未改变以及将参数给PostgreSQL服务器其中参数安全地代入与服务器本身内实战检验参数替换码查询
		let {rows} = yield client.query(text, values);
		console.log("rows = %j", rows);
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t2();








