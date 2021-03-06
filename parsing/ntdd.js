'use strict';

var fs = require('fs');
var path = require('path');


var map_htdd = function(row){
	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	return {
		station_id: station_id,
		value: stat,
		amount: stat_amount,
		flag: stat_flag
	}
};

var file_path = config.noaa_path + 'products/temperature/ann-htdd-normal.txt';
fs.readFile(file_path, 'utf8', function(err, data){
	if (err) throw err;

	var rows = data.split('\n').filter(r => r.length);
	// console.log(rows.slice(0,5));
	var htdd = rows.map(map_htdd);
	console.log(htdd.slice(0,5));
});