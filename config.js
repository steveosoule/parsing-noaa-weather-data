const noaa_path = './data/www1.ncdc.noaa.gov/pub/data/normals/1981-2010/';

let db_config = {
	user: 'noaa',
	password: '***',
	url: ''
};

db_config.url = `mongodb://${db_config.user}:${db_config.password}@ds021326.mlab.com:21326/city-data-v3`;

module.exports = {
	noaa_path,
	db_config
}