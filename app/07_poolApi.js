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
pool.query('SELECT $1::text as name', ['brianc'], (err, result) => {
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

