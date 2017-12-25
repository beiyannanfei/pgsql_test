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

function t1() {
	pool.query('SELECT NOW()', (err, res) => {
		console.log(err);
		console.log("%j", res.rows);  //[{"now":"2017-12-25T10:10:54.296Z"}]
		pool.end();
	});
}

function t2() {
	pool.query("select * from weather", (err, res) => {
		console.log(err);
		console.log("%j", res.rows);
		let rows = [
			{"city": "San Francisco", "temp_lo": 46, "temp_hi": 50, "prcp": 0.25, "date": "1994-11-26T16:00:00.000Z"},
			{"city": "San Francisco", "temp_lo": 43, "temp_hi": 57, "prcp": 0, "date": "1994-11-28T16:00:00.000Z"},
			{"city": "Hayward", "temp_lo": 37, "temp_hi": 54, "prcp": null, "date": "1994-11-28T16:00:00.000Z"}
		];
		pool.end();
	});
}

const client = new Client({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	password: '',
	port: 5432,
});
client.connect();

function t3() {
	client.query("select * from weather").then(response => {
		console.log("rows = %j", response.rows);
		rows = [
			{"city": "San Francisco", "temp_lo": 46, "temp_hi": 50, "prcp": 0.25, "date": "1994-11-26T16:00:00.000Z"},
			{"city": "San Francisco", "temp_lo": 43, "temp_hi": 57, "prcp": 0, "date": "1994-11-28T16:00:00.000Z"},
			{"city": "Hayward", "temp_lo": 37, "temp_hi": 54, "prcp": null, "date": "1994-11-28T16:00:00.000Z"}
		];
		client.end();
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
