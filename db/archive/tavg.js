'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

var map_tavg = function(row){
	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	return {
		station_id: station_id,
		ann_tavg: {
			value: stat,
			amount: stat_amount,
			flag: stat_flag
		}
	}
};

var file_path = config.noaa_path + 'products/temperature/ann-tavg-normal.txt';
fs.readFile(file_path, 'utf8', function(err, data){
	if (err) throw err;

	var rows = data.split('\n').filter(r => r.length);
	var tavgs = rows.map(map_tavg);

	console.log(tavgs.slice(0,5));
	
	tavgs.forEach(function(tavg){
		Station.updateOne({station_id: tavg.station_id}, tavg, {upsert: true}, function(err){
			if( err ) {
				console.log(err);
				return;
			}
			console.log(tavg.station_id);
		});
	});
});