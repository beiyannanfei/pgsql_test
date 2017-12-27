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
	max: 20,    //maximum number of clients the pool should contain.by default this is set to 10.
	// number of milliseconds a client must sit idle in the pool and not be checked out
	// before it is disconnected from the backend and discarded
	// default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
	idleTimeoutMillis: 30000,
	// number of milliseconds to wait before timing out when connecting a new client
	// by default this is 0 which means no timeout
	connectionTimeoutMillis: 2000,
});
module.exports = pool;