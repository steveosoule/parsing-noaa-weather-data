wget -r -e robots=off  --level=1 --reject=html --accept=txt --directory-prefix=./data/ --no-check-certificate https://www1.ncdc.noaa.gov/pub/data/normals/1981-2010/products/temperature/
wget -r -e robots=off  --level=1 --reject=html --accept=txt --directory-prefix=./data/ --no-check-certificate https://www1.ncdc.noaa.gov/pub/data/normals/1981-2010/products/precipitation/
wget -r -e robots=off  --level=1 --reject=html --accept=txt --directory-prefix=./data/ --no-check-certificate https://www1.ncdc.noaa.gov/pub/data/normals/1981-2010/station-inventories/allstations.txt