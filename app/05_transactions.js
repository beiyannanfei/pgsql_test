/**
 * Created by wyq on 17/12/26.
 * 事物
 */
const pool = require("./pool");
const co = require("co");
setTimeout(process.exit, 1000, 0);

co(function* () {
	const client = yield pool.connect();
	let delRes = yield client.query("drop table if exists users");
	let createTbRes = yield client.query("CREATE TABLE users (name varchar(80),email varchar(80))");

	try {
		yield client.query("BEGIN");
		let {rows} = yield client.query('INSERT INTO users(name) VALUES($1) RETURNING name', ['brianc']);
		console.log("rows = %j", rows); //rows = [{"name":"brianc"}]

		const insertText = "insert into users values ($1, $2)";
		const insertValues = ["AAA", "bbb"];
		rows = yield client.query(insertText, insertValues);
		console.log("rows = %j", rows);
		// rows = {"command":"INSERT","rowCount":1,"oid":0,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}
		yield client.query("COMMIT");
	}
	catch (e) {
		yield client.query("ROLLBACK");
		throw e;
	}
	finally {
		client.release();
	}
}).catch(err => {
	console.error(err.stack);
});

