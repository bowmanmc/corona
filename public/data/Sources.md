# Data Sources

## Source Files (static)
* counties-10m.json - https://github.com/topojson/us-atlas - Census Bureau’s cartographic boundary shapefiles, 2017 edition
* co-est2019-alldata.csv - https://www.census.gov/data/datasets/time-series/demo/popest/2010s-counties-total.html - Census county data

## Source Files (downloaded)
* us-counties.csv - https://github.com/nytimes/covid-19-data - NYTimes Covid data
* mask-use-by-county.csv - https://github.com/nytimes/covid-19-data - NYTimes mask use data by county. See: https://www.nytimes.com/interactive/2020/07/17/upshot/coronavirus-face-mask-map.html

## Generated Files
* counties.topo.json - Shapes from counties-10m.json combined with census data and adjacent county fips codes
