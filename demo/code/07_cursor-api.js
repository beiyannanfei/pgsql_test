/**
 * Created by wyq on 18/1/4.
 */
const {Pool} = require("pg");
const Cursor = require('pg-cursor');
const co = require("co");
setTimeout(process.exit, 1000, 0);

const pool = new Pool({connectionString: 'postgresql://wyq:@127.0.0.1:5432/demo_db'});

function t1() {
	let cursorSync = function (cursor, count = 10) {
		return new Promise((resolve, reject) => {
			cursor.read(count, (err, rows) => {
				if (!!err) {
					return reject(err);
				}
				return resolve(rows);
			});
		});
	};
	co(function* () {
		const client = yield pool.connect();
		yield client.query("drop table if exists t1");
		yield client.query(`CREATE TABLE t1 (num int)`);
		console.log("begin insert data");
		for (let i = 0; i < 1000; ++i) {
			yield client.query(`insert into t1 values(${i})`);
		}
		console.log("insert 1000 item success");
		let cursor = client.query(new Cursor("select * from t1"));
		// console.log(cursor);
		/*cursor.read(10, (err, rows) => {  //注意：cursor没有promise模式
			if (!!err) {
				console.log("err: %j", err.stack || err.message || err);
				throw err;
			}
			console.log("rows = %j", rows);
			cursor.read(5, (err, rows) => {
				console.log("rows = %j", rows);
			});
		});*/
		cursor.readSync = function (count = 10) {
			let self = this;
			return new Promise((resolve, reject) => {
				self.read(count, (err, rows) => {
					if (!!err) {
						return reject(err);
					}
					return resolve(rows);
				});
			});
		};
		while (1) {
			let rows = yield cursor.readSync();
			if (!rows.length) {
				break;
			}
			console.log("rows = %j", rows);
		}
		/*let rows = yield cursor.readSync();
		console.log("rows = %j", rows);
		rows = yield  cursor.readSync(5);
		console.log("rows = %j", rows);*/
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();













