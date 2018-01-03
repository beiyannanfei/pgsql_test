/**
 * Created by wyq on 18/1/2.
 * 连接池
 */
const {Pool} = require("pg");
setTimeout(process.exit, 1000, 0);

const pool = new Pool({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'demo_db',
	password: '',
	port: 5432,
	max: 20,    //最大连接数，默认10
	idleTimeoutMillis: 30000, //空闲关闭时间，默认10s
	// number of milliseconds to wait before timing out when connecting a new client
	// by default this is 0 which means no timeout
	connectionTimeoutMillis: 2000,  //连接超时时间，默认0，不超时
});
//从池中获取客户端。如果池已满并且所有客户端当前都已检出，则将等待一个FIFO队列，直到客户端被释放回池为止。
// 如果池中有空闲的客户端，它将返回到回调process.nextTick。如果池未满，将创建新客户端并将其返回给此回调。
function t1() {   //回调模式
	pool.connect((err, client, release) => {
		if (!!err) {
			return console.log("pool connect err: %j", err.stack);
		}
		client.query("select now()", (err, {rows}) => {
			release();    //释放连接
			if (!!err) {
				return console.log("client error: %j", err.stack);
			}
			return console.log("rows: %j", rows); //rows: [{"now":"2018-01-03T10:13:39.012Z"}]
		});
	});
}

function t2() {   //promise模式
	pool.connect().then(client => {
		client.query("select now()").then(({rows}) => {
			client.release();
			console.log("rows: %j", rows);
		}).catch(e => {
			client.release();
			console.log(e.stack);
		})
	});
}

function t3() { //query
                //通常，我们只需要在数据库上运行一个查询，为了方便，pool有一个方法来在第一个可用的空闲客户端上运行查询并返回结果。
                // 同时pool.query使用完成后不需要释放，pool内部会自动完成释放
	pool.query("select now()").then(({rows}) => {
		console.log("rows: %j", rows);
	}).catch(e => {
		console.log(e.stack);
	})
}

function t4() {
	pool.connect((err, client, release) => {
		client.query("select now()", (err, {rows}) => {
			console.log("before release pool.totalCount = %j", pool.totalCount);  //1 池中存在的客户端总数。
			console.log("before release pool.idleCount = %j", pool.idleCount);    //0 未检出但当前在池中闲置的客户端数量。
			console.log("before release pool.waitingCount = %j", pool.waitingCount); //0 等待客户端的排队请求数


			release();
			console.log("after release pool.totalCount = %j", pool.totalCount);   //1 池中存在的客户端总数。
			console.log("after release pool.idleCount = %j", pool.idleCount);     //1 未检出但当前在池中闲置的客户端数量。
			console.log("after release pool.waitingCount = %j", pool.waitingCount);  //0 等待客户端的排队请求数
		});
	});


}

t4();

