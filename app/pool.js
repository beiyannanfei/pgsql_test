/**
 * Created by wyq on 17/12/26.
 */
const {Pool} = require("pg");
const pool = new Pool({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	password: '',
	port: 5432,
});
module.exports = pool;