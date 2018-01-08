/**
 * Created by wyq on 18/1/8.
 */
const {Client} = require('pg');
const co = require("co");
const moment = require("moment");
const tId = setTimeout(process.exit, 1000, 0);
const client = new Client({database: 'demo_db'});
client.connect();

function t1() {
	co(function* () {
		const tableName = "json_01";
		yield client.query(`drop table if exists ${tableName}`);
		yield client.query(
			`CREATE TABLE ${tableName} (
				id varchar,
				name varchar,
				json_value json
			)`
		);
		const jsonData = {
			"ay_name": "阿毅",
			"home": {
				"type": {
					"interval": "5m"
				},
				"love": "now",
				"you": "None"
			},
			"values": {
				"event": ["cpu_r", "cpu_w"],
				"data": ["cpu_r"],
				"threshold": [1, 1]
			},
			"objects": {
				"al": "beauty"
			}
		};
		yield client.query(`insert into ${tableName} values ('001', 'ay', '${JSON.stringify(jsonData)}')`);

		let {rows: res} = yield client.query(`
			select id, name, json_value->>'ay_name' as ayName 
			from ${tableName} 
			where json_value->>'ay_name' = '阿毅'
		`);
		console.log("res: %j", res);  //rows: [{"id":"001","name":"ay","ayname":"阿毅"}]

		let {rows: res0} = yield client.query(`
			select id, name, json_value->>'ay_name' as ayName, json_value->>'objects' as objects
			from ${tableName}
			where json_value->>'ay_name' = '阿毅'
		`);
		console.log("res0: %j", res0);  //res0: [{"id":"001","name":"ay","ayname":"阿毅","objects":"{\"al\":\"beauty\"}"}]

		//数组元素选择
		let {rows: res1} = yield client.query(`
			select json_value->'values'#>>'{event,1}' as event    
			from ${tableName}
			where json_value->>'ay_name' = '阿毅'
		`);
		console.log("res1: %j", res1);  //res1: [{"event":"cpu_w"}]

		//更新数据
		const updateDoc = {
			"ay_name": "阿毅_change",
			"home": {
				"type": {
					"interval_change": "5m"
				},
				"love": "now_change",
				"you": "None_change"
			},
			"values": {
				"event": ["cpu_r_change", "cpu_w_change"],
				"data": ["cpu_r_change"],
				"array": [999, 5]
			},
			"objects": {"al": "beauty"}
		};
		let upResponse = yield client.query(`
			update ${tableName} set json_value = '${JSON.stringify(updateDoc)}'
		`);
		console.log("upResponse: %j", upResponse);  //upResponse: {"command":"UPDATE","rowCount":1,"oid":null,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}

		//删除数据
		let delResponse = yield client.query(`  
			delete from ${tableName} where json_value->'values'#>>'{event,1}' = 'cpu_w_change'
		`);
		console.log("delResponse: %j", delResponse);  //delResponse: {"command":"DELETE","rowCount":1,"oid":null,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}
	}).catch(err => {
		console.log(err.stack || err.message || err);
	});
}

t1();

