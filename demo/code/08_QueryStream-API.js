/**
 * Created by wyq on 18/1/5.
 */
const {Pool} = require('pg');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');
const co = require("co");
setTimeout(process.exit, 3000, 0);

const pool = new Pool({connectionString: 'postgresql://wyq:@127.0.0.1:5432/demo_db'});

co(function* () {
	const client = yield pool.connect();
	yield client.query("drop table if exists t1");
	yield client.query(`CREATE TABLE t1 (num int)`);
	console.log("begin insert data");
	for (let i = 0; i < 10; ++i) {
		yield client.query(`insert into t1 values(${i})`);
	}
	console.log("insert 1000 item success");

	const query = new QueryStream("select * from t1");
	const stream = client.query(query);

	// stream.pipe(JSONStream.stringify()).pipe(process.stdout);
	stream.on('end', function () {
		console.log("======= end");
	});
	stream.on("data", function (item) {
		console.log("item: %j", item);
		stream.pause();
		setTimeout(function () {
			stream.resume();
		}, 100);
	});
}).catch(err => {
	console.log(err.stack || err.message || err);
});