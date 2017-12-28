/**
 * Created by wyq on 17/12/27.
 * https://node-postgres.com/api/client
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

function t1() {
	const client = new Client({
		database: 'mydb',
	});
	client.connect().then(response => {
		return console.log("connected success %j", response);   //connected success undefined
	}).catch(err => {
		return console.log("connection err: %s", err.stack || err.message || err);
	});
}

function t2() { //client.query - text, optional values, and callback.
	const client = new Client({
		database: 'mydb',
	});
	client.connect().then(response => {
		console.log("connected success");
		//纯文本查询-Plain text query
		return client.query("select now()");
	}).then(({rows}) => {
		console.log("rows = %j", rows); // => rows = [{"now":"2017-12-28T08:20:28.103Z"}]
		// 参数化查询-Parameterized query
		return client.query("select * from weather where city = $1::text", ["San Francisco"]);
	}).then(({rows}) => {
		console.log("rows = %j", rows);
		rows = [
			{"city": "San Francisco", "temp_lo": 46, "temp_hi": 50, "prcp": 0.25, "date": "1994-11-26T16:00:00.000Z"},
			{"city": "San Francisco", "temp_lo": 43, "temp_hi": 57, "prcp": 0, "date": "1994-11-28T16:00:00.000Z"}
		];
		return client.end();
	}).catch(err => {
		client.end();
		return console.log("err: %s", err.stack || err.message || err);
	});
}

t2();




