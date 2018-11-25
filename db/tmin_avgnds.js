'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

const file_keys = ['lsth000', 'lsth010', 'lsth020', 'lsth032', 'lsth040', 'lsth050', 'lsth060', 'lsth070'];

var map_row = function(row, file_key){
	var parts = row.split(/\s+/),
		station_id = parts[0].trim(),
		stat = parts[1].trim(),
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_divisor = 10,
		stat_amount = Number(stat_parts[1]) / stat_divisor,
		stat_flag = stat_parts[2];

	var data = {
		station_id: station_id.trim(),
	};

	var stat_key = 'tmin_avgnds_' + file_key;

	data[stat_key] = {
		value: stat.trim(),
		amount: stat_amount,
		flag: stat_flag.trim()
	};

	return data;
};

var count_total = 0,
	count_done = 0;

file_keys.forEach(function(file_key){

	var file_path = config.noaa_path + 'products/temperature/ann-tmin-avgnds-' + file_key + '.txt';
	fs.readFile(file_path, 'utf8', function(err, data){

		if (err) throw err;
		
		var rows = data.split('\n').filter(r => r.length);

		var file_rows = rows.map(function(file_row){
			return map_row(file_row, file_key);
		});

		count_total += file_rows.length

		file_rows.forEach(function(file_row){
			Station.updateOne({station_id: file_row.station_id}, file_row, {upsert: true}, function(err){
				if( err )  throw err

				count_done++
				if( count_done % 100 ){
					console.log('Done with: ' + count_done + ' out of: ' + count_total);
					console.log(file_row.station_id, file_key);
				}
				if( count_done / count_total > 0.9 ){
					console.log('Almost done')
				}
				if( count_done == count_total ){
					console.log('Done')
				}
			});
		});
	});
});