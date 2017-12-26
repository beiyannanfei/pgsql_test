/**
 * Created by wyq on 17/12/25.
 */
const {Client} = require("pg");
const client = new Client({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	password: '',
	port: 5432,
});
client.connect();
module.exports = client;
