'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

const temp_symbols = ['tmax', 'tavg', 'tmin'];
const season_symbols = ['djf', 'mam', 'jja', 'son'];
const season_names = {
	djf: 'winter',
	mam: 'spring',
	jja: 'summer',
	son: 'fall'
};

var map_temps = function(row, season, temp){
	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	var data = {
		station_id: station_id,
	};

	var season_name = season_names[season];

	var stat_key = season_name + '_' + temp;

	data[stat_key] = {
		value: stat,
		amount: stat_amount,
		flag: stat_flag
	};

	return data;
};

var count_total = 0,
	count_done = 0;

season_symbols.forEach(function(season, season_i){
	temp_symbols.forEach(function(temp, temp_i){

		var file_path = config.noaa_path + 'products/temperature/' + season + '-' + temp + '-normal.txt';
		fs.readFile(file_path, 'utf8', function(err, data){

			if (err) throw err;
			
			var rows = data.split('\n').filter(r => r.length);

			var temp_datas = rows.map(function(temp_data){
				return map_temps(temp_data, season, temp);
			});

			count_total += temp_datas.length

			temp_datas.forEach(function(temp_data){
				Station.updateOne({station_id: temp_data.station_id}, temp_data, {upsert: true}, function(err){
					if( err )  throw err

					count_done++
					if( count_done % 100 ) console.log('Done with: ' + count_done + ' out of: ' + count_total);
					if( count_done / count_total > 0.9 ){
						console.log('Almost done')
					}
					if( temp_data.station_id === 'AQW00061705'){
						console.log('FOUND AQW00061705');
					}
					console.log(temp_data.station_id, season, temp);
				});
			});
		});
	});
});