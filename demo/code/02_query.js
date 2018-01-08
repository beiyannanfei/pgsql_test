/**
 * Created by wyq on 18/1/2.
 */
const {Pool, Client} = require("pg");
const co = require("co");
setTimeout(process.exit, 1000, 0);

const client = new Client({connectionString: 'postgresql://wyq:@127.0.0.1:5432/demo_db'});
client.connect();

function t1() {
	client.query('select now() as now')     //纯文本类型查询
		.then(({rows}) => {
			console.log("%s out %j", arguments.callee.name, rows);
		})
		.catch(err => {
			console.error(err.stack);
		});
}

t1();

function t2() {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		let createTbRes = yield client.query(
			`CREATE TABLE users (
			name varchar(80),
			subject varchar(80),
			score int)`
		);
		let insRes = yield client.query(`insert into users values
			('zs', 'js', 85),
			('zs', 'python', 92),
			('ls', 'c++', 50),
			('ls', 'jave', 78),
			('ww', 'go', 98),
			('ww', 'php', 84)
		`);
		let {rows} = yield client.query(`select * from users where name = 'zs'`);
		console.log("rows = %j", rows);
		rows = [{"name": "zs", "subject": "js", "score": 85}, {"name": "zs", "subject": "python", "score": 92}]
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

function t3(score) {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		let createTbRes = yield client.query(
			`CREATE TABLE users (
			name varchar(80),
			subject varchar(80),
			score int)`
		);
		let insRes = yield client.query(`insert into users values
			('zs', 'js', 85),
			('zs', 'python', 92),
			('ls', 'c++', 50),
			('ls', 'jave', 78),
			('ww', 'go', 98),
			('ww', 'php', 84)
		`);
		let sqlStr = `select * from users where score > ${score}`;
		console.log(sqlStr);
		let {rows} = yield client.query(sqlStr);
		console.log("rows = %j", rows);
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

// t3(90); //rows = [{"name":"zs","subject":"python","score":92},{"name":"ww","subject":"go","score":98}]
// t3(`90;drop table users;`); //sql注入

function t4(score) {
	co(function* () {
		let delRes = yield client.query("drop table if exists users");
		let createTbRes = yield client.query(
			`CREATE TABLE users (
			name varchar(80),
			subject varchar(80),
			score int)`
		);
		let insRes = yield client.query(`insert into users values
			('zs', 'js', 85),
			('zs', 'python', 92),
			('ls', 'c++', 50),
			('ls', 'jave', 78),
			('ww', 'go', 98),
			('ww', 'php', 84)
		`);
		let text = `select * from users where score > $1`;
		let values = [score];
		let {rows} = yield client.query(text, values);
		console.log("rows = %j", rows);
	}).catch(err => {
		console.log(err.message || err);
	});
}

// t4(84); //rows = [{"name":"zs","subject":"js","score":85},{"name":"zs","subject":"python","score":92},{"name":"ww","subject":"go","score":98}]
// t4(`90;drop table users;`); //invalid input syntax for integer: "90;drop table users;"


