/**
 * Created by wyq on 17/12/25.
 * 连接URI
 */
const {Pool, Client} = require('pg');
const connectionString = 'postgresql://wyq:@127.0.0.1:5432/mydb';

const pool = new Pool({
	connectionString: connectionString,
});

function t1() {
	pool.query('SELECT NOW()', (err, res) => {
		console.log(err, res);
		pool.end();
	});
}

function t2() {
	pool.query("select * from cities").then(({rows}) => {
		console.log("rows = %j", rows);
		rows = [{"name": "San Francisco", "location": {"x": -194, "y": 53}}];
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

t2();
