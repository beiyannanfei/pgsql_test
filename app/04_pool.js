/**
 * Created by wyq on 17/12/26.
 */
const pool = require("./pool");
const co = require("co");
setTimeout(process.exit, 1000, 0);

function t1() {   //Checkout, use, and return
	pool.on("error", (err, client) => {
		console.error('Unexpected error on idle client', err);
		process.exit(-1)
	});

	pool.connect((err, client, done) => {
		if (err) {
			throw err;
		}
		client.query('SELECT * FROM users WHERE name = $1', ["brianc1"], (err, res) => {
			done();
			if (!!err) {
				return console.log(err.stack);
			}
			return console.log("%j", res.rows[0]);  //{"name":"brianc1","email":"brian.m.carlson@gmail.com1"}
		})
	});
}

function t2() {
	pool.connect().then(client => {
		return client.query('SELECT * FROM users WHERE name = $1', ["brianc1"]).then(res => {
			client.release();
			console.log(res.rows[0]);
			pool.end();
		}).catch(e => {
			client.release();
			console.log(err.stack);
		})
	});
}

t2();


