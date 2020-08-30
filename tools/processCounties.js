import fs from 'fs'
import fetch from 'node-fetch'
import * as topojson from 'topojson-client'
import { csvParse } from 'd3-dsv'

async function process() {
    const topodata = JSON.parse(
        fs.readFileSync('public/data/counties-10m.json', 'utf-8')
    )

    // Population data
    const popcsv = csvParse(
        fs.readFileSync('public/data/co-est2019-alldata.csv', 'utf-8')
    )
    const popdata = {}
    for (let i = 0; i < popcsv.length; i++) {
        const poprow = popcsv[i]
        const fips = `${poprow['STATE']}${poprow['COUNTY']}`
        popdata[fips] = {
            state: poprow['STNAME'],
            pop2010: Number(poprow['CENSUS2010POP']),
            est2019: Number(poprow['POPESTIMATE2019']),
        }
    }

    // Mask data
    const MASK_DATA =
        'https://raw.githubusercontent.com/nytimes/covid-19-data/master/mask-use/mask-use-by-county.csv'
    const maskResponse = await (await fetch(MASK_DATA)).text()
    const maskcsv = csvParse(maskResponse)
    const maskdata = {}
    for (let i = 0; i < maskcsv.length; i++) {
        const maskrow = maskcsv[i]
        const fips = maskrow['COUNTYFP']
        maskdata[fips] = {
            never: Number(maskrow['NEVER']),
            rarely: Number(maskrow['RARELY']),
            sometimes: Number(maskrow['SOMETIMES']),
            frequently: Number(maskrow['FREQUENTLY']),
            always: Number(maskrow['ALWAYS']),
        }
    }

    // map/shape data
    const counties = topodata.objects.counties.geometries
    const neighbors = topojson.neighbors(topodata.objects.counties.geometries) // used for county adjacency array property
    const countySelect = {};

    // Loop through each county
    for (let i = 0; i < counties.length; i++) {
        const adjacent = []
        // Loop through each adjacent county and add to adjacent array
        for (let j = 0; j < neighbors[i].length; j++) {
            let idx = neighbors[i][j]
            adjacent.push(counties[idx].id)
        }
        // Format final county object
        counties[i].properties.adjacent = adjacent
        counties[i].properties.maskusage = maskdata[counties[i].id]
        Object.assign(counties[i].properties, popdata[counties[i].id])

        // Add to countySelect
        if (!countySelect[counties[i].properties.state]) {
            countySelect[counties[i].properties.state] = [];
        }
        countySelect[counties[i].properties.state].push({
            label: counties[i].properties.name,
            value: counties[i].id,
        });
    }

    // sort the counties in countySelect
    const states = Object.keys(countySelect);
    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        countySelect[state] = countySelect[state].sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        });
    }

    // Spot check montogomery county
    console.log(JSON.stringify(countySelect['Ohio']));
    console.log(counties[2126])

    // Write out modified file
    fs.writeFileSync('public/data/counties.topo.json', JSON.stringify(topodata));
    fs.writeFileSync('public/data/county-select-data.json', JSON.stringify(countySelect));
}

process()
