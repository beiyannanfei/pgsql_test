/**
 * Created by wyq on 18/1/4.
 */
const types = require('pg').types;

types.setTypeParser(20, function (val) {
	return parseInt(val)
});



