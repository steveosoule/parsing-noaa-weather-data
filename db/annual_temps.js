'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

var temp_symbols = ['tmax', 'tavg', 'tmin'];

var map_temp_datas = function(row, temp){

	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	var data = {
		station_id: station_id
	}

	data['ann_' + temp] = {
		value: stat,
		amount: stat_amount,
		flag: stat_flag
	}

	return data;
};

temp_symbols.forEach(function(temp){
	
	var file_path = config.noaa_path + 'products/temperature/ann-' + temp + '-normal.txt';
	fs.readFile(file_path, 'utf8', function(err, data){
		
		if (err) throw err;

		var rows = data.split('\n').filter(r => r.length);
		var temp_datas = rows.map(function(temp_data){
			return map_temp_datas(temp_data, temp);
		});

		console.log(temp_datas.slice(0,5));

		temp_datas.forEach(function(temp_data){
			Station.updateOne({station_id: temp_data.station_id}, temp_data, {upsert: true}, function(err){
				if( err ) {
					console.log(err);
					return;
				}
				console.log(temp_data.station_id);
			});
		});
	});
});