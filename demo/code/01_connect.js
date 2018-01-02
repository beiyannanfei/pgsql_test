/**
 * Created by wyq on 18/1/2.
 */
const {Pool, Client} = require("pg");
setTimeout(process.exit, 1000, 0);

const pool = new Pool({
	// user: 'wyq',
	// host: '127.0.0.1',
	database: 'demo_db',
	// password: '',
	// port: 5432,
});

const client = new Client({
	// user: 'wyq',
	// host: '127.0.0.1',
	// database: 'demo_db',
	// password: '',
	// port: 5432,
	connectionString: 'postgresql://wyq:@127.0.0.1:5432/demo_db'
});
client.connect();

function t1() {
	pool.query('SELECT NOW()', (err, {rows}) => {
		console.log("%s out %j", arguments.callee.name, rows);
		pool.end();
	});
}

t1();

function t2() {
	client.query("select now()").then(({rows}) => {
		console.log("%s out %j", arguments.callee.name, rows);
		client.end();
	});
}

t2();







