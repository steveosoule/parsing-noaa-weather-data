'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

var map_htdd = function(row){
	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	return {
		station_id: station_id,
		htdd: {
			value: stat,
			amount: stat_amount,
			flag: stat_flag
		}
	}
};

var file_path = config.noaa_path + 'products/temperature/ann-htdd-normal.txt';
fs.readFile(file_path, 'utf8', function(err, data){
	if (err) throw err;

	var rows = data.split('\n').filter(r => r.length);
	var htdds = rows.map(map_htdd);

	// ---

	var result_count = htdds.length,
		done_count = 0;
	htdds.forEach(function(htdd){
		Station.findOneAndUpdate({station_id: htdd.station_id}, htdd, {upsert: true}, function(err){
			if( err ) {
				console.log(err);
				return;
			}
			console.log(htdd.station_id);
			done_count++;
			if( done_count+1 === result_count ){
				console.log('DONE');
			}
		});
	});
});