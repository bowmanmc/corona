import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment'
import { csvParse } from 'd3-dsv'

async function process() {
    const NYT_DATA =
        'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'
    console.log('Fetching: ' + NYT_DATA)
    const nytResponse = await (await fetch(NYT_DATA)).text()
    console.log('    ...Data downloaded!')
    const nytcsv = csvParse(nytResponse)

    const temp = {}
    for (let i = 0; i < nytcsv.length; i++) {
        const row = nytcsv[i]
        const day = moment(row.date, 'YYYY-MM-DD')
        const cases = Number(row.cases)
        const deaths = Number(row.deaths)
        const fips = row.fips

        if (!temp[fips]) {
            temp[fips] = {}
        }
        temp[fips][day.format('YYYYMMDD')] = {
            cases,
            deaths,
        }
    }
    //console.log(JSON.stringify(data['39113']));

    // Need to normalize the dates across all counties
    const fipsCodes = Object.keys(temp)
    const allDates = []
    for (let i = 0; i < fipsCodes.length; i++) {
        const countyData = temp[fipsCodes[i]]
        const dates = Object.keys(countyData)
        for (let j = 0; j < dates.length; j++) {
            if (allDates.indexOf(dates[j]) < 0) {
                allDates.push(dates[j])
            }
        }
    }
    allDates.sort()

    // Create final data object
    const data = {
        start: allDates[0],
        end: allDates[allDates.length - 1],
    }
    for (let i = 0; i < fipsCodes.length; i++) {
        const fips = fipsCodes[i]
        const countyData = temp[fips]
        const county = {
            deaths: [],
            cases: [],
        }
        for (let j = 0; j < allDates.length; j++) {
            const day = allDates[j]
            if (typeof countyData[day] === 'undefined') {
                // -1 means no data recorded for that day (different than a recorded 0)
                county.deaths.push(-1)
                county.cases.push(-1)
            } else {
                county.deaths.push(countyData[day].deaths)
                county.cases.push(countyData[day].cases)
            }
        }
        data[fips] = county
    }

    // Spot check Montgomery County
    // console.log(data['39113']);
    console.log(data['start'])

    fs.writeFileSync('public/data/nyt-counts.json', JSON.stringify(data))
}

process()
