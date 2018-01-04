/**
 * Created by wyq on 18/1/4.
 */
const {Client} = require('pg');
const co = require("co");
const tId = setTimeout(process.exit, 1000, 0);
const client = new Client({database: 'demo_db'});
client.connect();

co(function* () {
	let result = yield client.query({
		rowMode: "string",
		text: "select 1 as one, 2 as two"
	});
	console.log(result.fields[0].name);   // one
	console.log(result.fields[1].name);   // two
	console.log(result.rows);             // [ anonymous { one: 1, two: 2 } ]

	result = yield client.query({
		rowMode: "array",
		text: "select 1 as one, 2 as two"
	});
	console.log(result.fields[0].name);   // one
	console.log(result.fields[1].name);   // two
	console.log(result.rows);             // [ [ 1, 2 ] ]
	console.log("rowCount: %j", result.rowCount); //结果行数
	console.log("command: %j", result.command); //SELECT  执行的命令
}).catch(err => {
	console.log(err.stack || err.message || err);
});





