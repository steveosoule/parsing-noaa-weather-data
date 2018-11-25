# parsing-noaa-weather-data

Parse the NOAA's public weather normal flat-filtes with node.js and store it in mongodb

## Getting Started

- Clone the repo
- Download the NOAA files you want to parse from [ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/products/](ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/products/)
- Update the config.js file to point to where you downloaded the files
- Update the db/db/js with your valid mongodb connection
- Configure & execute js file that parses the data you want