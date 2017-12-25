/**
 * Created by wyq on 17/12/25.
 */
const {Pool, Client} = require("pg");

const pool = new Pool({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	// password: '',
	port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
	console.log(err);
	console.log(res);
});
