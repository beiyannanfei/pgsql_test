/**
 * Created by wyq on 17/12/27.
 */
const {Pool} = require('pg');
setTimeout(process.exit, 1000, 0);

const pool = new Pool({
	user: 'wyq',
	host: '127.0.0.1',
	database: 'mydb',
	password: '',
	port: 5432,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,    //0 为无限期挂起
});

//从池中获取客户端。如果池已满并且所有客户端当前都已检出，则将等待一个FIFO队列，直到客户端被释放回池为止。
// 如果池中有空闲的客户端，它将返回到回调process.nextTick。如果池未满，将创建新客户端并将其返回给此回调。
pool.connect((err, client, release) => {
	if (err) {
		return console.error('Error acquiring client', err.stack);
	}
	client.query('SELECT NOW()', (err, result) => {
		release();    //是否连接
		if (err) {
			return console.error('Error executing query', err.stack);
		}
		console.log(result.rows);
	})
});

/*
const { Pool } = require('pg')

const pool = new Pool()

;(async function(){
  const client = await pool.connect()
  await client.query('SELECT NOW()')
  client.release()//如果您忘记释放客户端，那么您的应用程序将迅速耗尽池中闲置的可用客户端，并且所有进一步的调用pool.connect将会由于错误而超时，或者如果connectionTimeoutMills配置为0，则无限期挂起。
})()
 */

/*
const { Pool } = require('pg')
const pool = new Pool()
//通常，我们只需要在数据库上运行一个查询，为了方便，池有一个方法来在第一个可用的空闲客户端上运行查询并返回结果。
pool.query('SELECT $1::text as name', ['brianc'], (err, result) => {    //query方法不需要调用releaseCallback，
  if (err) {
    return console.error('Error executing query', err.stack)
  }
  console.log(result.rows[0].name) // brianc
})

 */

/*
const { Pool } = require('pg')      //pool.query（）=> Promise
const pool = new Pool()

pool.query('SELECT $1::text as name', ['brianc'])
  .then((res) => console.log(res.rows[0].name)) // brianc
  .catch(err => console.error('Error executing query', err.stack))
 */

/*
pool.end(() => {    //Calling pool.end will drain the pool of all active clients, disconnect them, and shut down any internal timers in the pool
  console.log('pool has ended')
})

// or this:
pool.end().then(() => console.log('pool has ended'))
 */

/*
pool.totalCount: int
池中存在的客户端总数。

pool.idleCount: int
未检出但当前在池中闲置的客户端数量。

pool.waitingCount: int
所有客户端签出时，等待客户端的排队请求数。监测这个数字可能会有帮助，看看是否需要调整池的大小。

pool.on('connect', (client: Client) => void) => void
每当池建立一个新的客户端连接到PostgreSQL后端时，它将发射connect与新连接的客户端的事件。这为您提供了在客户端上运行设置命令的机会。
const pool = new Pool()
pool.on('connect', (client) => {  client.query('SET DATESTYLE = iso, mdy')})

pool.on('acquire', (client: Client) => void) => void
无论何时从池中检出一个客户端，池将向acquire获取的客户端发送事件。

pool.on('error', (err: Error, client: Client) => void) => void
当客户端闲置在池中时，它仍然可以发出错误，因为它连接到一个活的后端。如果后端发生故障或遇到网络分区，则应用程序中的所有空闲，
连接的客户端将通过池的错误事件发送器发出错误。错误侦听器将作为第一个参数传递错误，并将错误发生的客户端作为第二个参数传递。
客户端将被自动终止并从池中移除，只有在您想要检查时才会将其传递给错误处理程序。

pool.on('remove', (client: Client) => void) => void
每当客户关闭并从池中移除时，池将发出remove事件。
 */