'use strict';

var fs = require('fs');
var path = require('path');


var map_tavg = function(row){
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

var file_path = config.noaa_path + 'products/temperature/ann-tavg-normal.txt';
fs.readFile(file_path, 'utf8', function(err, data){
	if (err) throw err;

	var rows = data.split('\n').filter(r => r.length);
	var tavgs = rows.map(map_tavg);

	/*var db_config = require('./db.js');
	db_config.MongoClient.connect(db_config.url, function(err, client) {
		if( err ) console.log('ERROR', err);
		console.log("Connected successfully to db server");

		var  db = client.db('city-data');
		db.collection('tavg').insertMany(tavgs);

		client.close();
	});*/

	console.log(tavgs.slice(0,5));
});