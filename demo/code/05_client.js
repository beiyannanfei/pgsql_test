/**
 * Created by wyq on 18/1/4.
 */
/*
config = {
  user?: string, // default process.env.PGUSER || process.env.USER
  password?: string, //default process.env.PGPASSWORD
  database?: string, // default process.env.PGDATABASE || process.env.USER
  port?: number, // default process.env.PGPORT
  connectionString?: string // e.g. 'postgresql://wyq:@127.0.0.1:5432/mydb';
  ssl?: any, // passed directly to node.TLSSocket
  types?: any, // custom type parsers
  statement_timeout: number, // number of milliseconds before a query will time out default is no timeout
}
 */
const {Client} = require('pg');
const co = require("co");
const moment = require("moment");
const tId = setTimeout(process.exit, 1000, 0);
const client = new Client({database: 'demo_db'});
client.connect();

function t1() {
	client.query("select $1 as name, $2 as age", ["aaa", 20])
		.then(({rows}) => {
			console.log("rows = %j", rows);
			//默认情况下输出为 key: value 对形式
			rows = [{"name": "aaa", "age": "20"}];
			return client.query({
				name: "get-time",   // name of the query - used for prepared statements
				text: "select $1 as name, $2 as age",
				values: ["aaa", 20],
				rowMode: "array"    //数组输出方式
			});
		})
		.then(({rows}) => {
			console.log("rows = %j", rows);
			rows = [["aaa", "20"]];
		})
		.catch(err => {
			console.log("err: %j", err.stack || err.message || err);
		})
}

function t2() {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		let createTbRes = yield client.query(
			`CREATE TABLE users (
			name varchar(80),
			subject varchar(80),
			score int)`
		);
		let insRes = yield client.query(`insert into users values
			('zs', 'js', 85),
			('zs', 'python', 92),
			('ls', 'c++', 50),
			('ls', 'jave', 78),
			('ww', 'go', 98),
			('ww', 'php', 84)
		`);

		const Query = require('pg').Query;
		let query = client.query(new Query("select * from users"));
		query.on('row', (row) => {
			console.log('[%s] row = %j;', +new Date(), row);
		});
		query.on('end', () => {
			console.log('=== query done ===');
			client.end().then(() => {
				console.log("===== client end.")
			});
		});
		query.on('error', (err) => {
			console.error(err.stack);
		});
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

function t3() {
	clearTimeout(tId);
	client.on('error', (err) => {   //run command "pg_ctl -D /usr/local/var/postgres stop"
		console.error('something bad has happened!', err.stack);
	});
}

function t4() {
	client.on("end", function () {
		console.log("==== client end");
	});
	client.end();
}

function t5() { //pub/sub 模式
	client.query("listen channel1");
	client.on("notification", (msg) => {
		console.log("msg = %j;", msg);
		msg = {
			"name": "notification",
			"length": 26,
			"processId": 67073,
			"channel": "channel1",
			"payload": "test msg"
		};
	});
	client.query(`notify channel1, 'test msg'`);
}

t5();


