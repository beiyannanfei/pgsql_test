/**
 * Created by wyq on 17/12/25.
 * 连接URI
 */
const {Pool, Client} = require('pg');
const connectionString = 'postgresql://wyq:@127.0.0.1:5432/mydb';

const pool = new Pool({
	connectionString: connectionString,
});

pool.query('SELECT NOW()', (err, res) => {
	console.log(err, res);
	pool.end();
});
