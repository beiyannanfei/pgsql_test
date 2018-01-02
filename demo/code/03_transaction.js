/**
 * Created by wyq on 18/1/2.
 * 事务(原子性 一致性 隔离性 持久性)
 */
const {Pool} = require("pg");
const co = require("co");
setTimeout(process.exit, 1000, 0);

const pool = new Pool({connectionString: 'postgresql://wyq:@127.0.0.1:5432/demo_db'});

function t1() {
	co(function* () {
		//对于事务中的所有语句， 您必须使用相同的客户端实例。PostgreSQL将一个事务隔离到各个客户端
		let client = yield pool.connect();
		yield client.query("drop table if exists users");
		yield client.query(`CREATE TABLE users (name varchar(80),subject varchar(80),score int)`);
		try {
			let beginRes = yield client.query("begin");
			console.log("beginRes = %j", beginRes);
			let insRes = yield client.query('insert into users values ($1, $2, $3)', ['test', "math", 95]);
			console.log("insRes = %j", insRes);
			insRes = yield client.query('insert into users values ($1, $2, $3)', ['test', "math", "abcd"]); //err
			console.log("insRes = %j", insRes);
			let commitRes = yield client.query("commit");
			console.log("commitRes = %j", commitRes);
		} catch (e) {
			console.log("e: %j", e.stack || e.message || e);
			let rollbackRes = yield client.query("rollback");
			console.log("rollbackRes = %j", rollbackRes);
			throw e;
		} finally {
			client.release();   //必须释放连接，否则当耗尽连接资源后所有后续请求都会挂起
		}
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();





