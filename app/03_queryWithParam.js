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

function t3() { //查询配置对象
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		console.log("delRes = %j", delRes);
		delRes = {
			"command": "DROP", "rowCount": null, "oid": null, "rows": [],
			"fields": [], "_parsers": [], "RowCtor": null, "rowAsArray": false
		};
		let createTbRes = yield client.query("CREATE TABLE users (name varchar(80),email varchar(80))");
		console.log("createTbRes = %j", createTbRes);
		createTbRes = {
			"command": "CREATE", "rowCount": null, "oid": null, "rows": [],
			"fields": [], "_parsers": [], "RowCtor": null, "rowAsArray": false
		};

		const query = {
			text: 'INSERT INTO users(name, email) VALUES($1, $2)',
			values: ['brianc1', 'brian.m.carlson@gmail.com1'],
		};
		let response = yield client.query(query);
		console.log("response = %j", response);
		response = {
			"command": "INSERT", "rowCount": 1, "oid": 0, "rows": [], "fields": [],
			"_parsers": [], "RowCtor": null, "rowAsArray": false
		};
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

function t4() {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		let createTbRes = yield client.query("CREATE TABLE users (name varchar(80),email varchar(80))");

		const insertQuery = {
			text: 'INSERT INTO users(name, email) VALUES($1, $2)',
			values: ['brianc1', 'brian.m.carlson@gmail.com1'],
		};
		yield client.query(insertQuery);

		// PostgreSQL具有准备好的语句的概念。
		// node-postgres通过向name查询配置对象提供一个参数来支持这一点。
		// 如果提供name参数，查询执行计划将在每个连接的基础上缓存在PostgreSQL服务器上。
		// 这意味着如果您使用两个不同的连接，则每个连接都必须解析并计划一次查询。
		// node-postgres为你处理这个问题透明：一个客户端只请求一个查询在第一次被分析的时候，特定的客户端看到了这个查询的名字：
		const query = {
			name: 'fetch-user', //give the query a unique name
			text: "select * from users where name = $1",
			values: [insertQuery.values[0]]
		};
		let {rows} = yield client.query(query);
		console.log("rows = %j", rows);
		rows = [{"name": "brianc1", "email": "brian.m.carlson@gmail.com1"}]
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

function t5() {   //会报错，原因未知
	// 行模式 - 默认情况下，node-postgres读取行并将其收集到JavaScript对象中，
	// 使用与列名匹配的键和与每个列的相应行值相匹配的值。如果你不需要或不想要这个行为，
	// 你可以传递rowMode: 'array'给一个查询对象。
	// 这将通知结果解析器绕过将行收集到JavaScript对象中，而是将其作为值的数组返回。
	const query = {
		text: 'SELECT $1::text as first_name, select $2::text as last_name',
		values: ['Brian', 'Carlson'],
		rowMode: 'array',
	};
	client.query(query).then((rows) => {
		console.log("rows = %j", rows);
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t5();





