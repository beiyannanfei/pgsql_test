/**
 * Created by wyq on 17/12/27.
 * 项目结构 (https://node-postgres.com/guides/project-structure)
 */
const {Pool} = require('pg');

const pool = new Pool({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	password: '',
	port: 5432,
});

module.exports = {
	query: (text, params, callback) => {      //查询操作实例
		const start = Date.now();
		return pool.query(text, params, (err, res) => {
			const duration = Date.now() - start;
			console.log('executed query', {text, duration, rows: res.rowCount});
			callback(err, res);
		})
	},
	getClient: (callback) => {              //我们需要从池中检出一个客户端来在事务中连续执行服务器查询(容错)
		pool.connect((err, client, done) => {
			const query = client.query.bind(client);

			// monkey patch the query method to keep track of the last query executed
			client.query = () => {
				client.lastQuery = arguments;
				client.query.apply(client, arguments);
			};

			// set a timeout of 5 seconds, after which we will log this client's last query
			const timeout = setTimeout(() => {
				console.error('A client has been checked out for more than 5 seconds!');
				console.error(`The last executed query on this client was: ${client.lastQuery}`);
			}, 5000);

			const release = (err) => {
				// call the actual 'done' method, returning this client to the pool
				done(err);

				// clear our timeout
				clearTimeout(timeout);

				// set the query method back to its old un-monkey-patched version
				client.query = query;
			};

			callback(err, client, done);
		});
	}
};






