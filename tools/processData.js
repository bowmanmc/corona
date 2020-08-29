import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment'
import { csvParse } from 'd3-dsv'

async function process() {
    const NYT_DATA =
        'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';
    console.log('Fetching: ' + NYT_DATA);
    const nytResponse = await (await fetch(NYT_DATA)).text();
    console.log('    ...Data downloaded!');
    const nytcsv = csvParse(nytResponse);

    const temp = {};
    for (let i = 0; i < nytcsv.length; i++) {
        const row = nytcsv[i];
        const day = moment(row.date, 'YYYY-MM-DD');
        const cases = Number(row.cases);
        const deaths = Number(row.deaths);
        const fips = row.fips;

        if (!temp[fips]) {
            temp[fips] = {};
        }
        temp[fips][day.format('YYYYMMDD')] = {
            cases,
            deaths,
        };
    }
    //console.log(JSON.stringify(data['39113']));

    // Need to normalize the dates across all counties
    const fipsCodes = Object.keys(temp);
    const allDates = [];
    for (let i = 0; i < fipsCodes.length; i++) {
        const countyData = temp[fipsCodes[i]];
        const dates = Object.keys(countyData);
        for (let j = 0; j < dates.length; j++) {
            if (allDates.indexOf(dates[j]) < 0) {
                allDates.push(dates[j]);
            }
        }
    }
    allDates.sort();

    // Create final data object
    const data = {
        start: allDates[0],
        end: allDates[allDates.length - 1],
    };
    for (let i = 0; i < fipsCodes.length; i++) {
        const fips = fipsCodes[i];
        const countyData = temp[fips];
        const county = {
            deaths: [],
            cases: [],
            totalDeaths: 0,
            totalCases: 0,
        };
        let maxCases = 0;
        let maxDeaths = 0;

        for (let j = 0; j < allDates.length; j++) {
            const day = allDates[j];
            const yesterday = moment(day, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');

            if (typeof countyData[day] === 'undefined') {
                // -1 means no data recorded for that day (different than a recorded 0)
                county.deaths.push(-1);
                county.cases.push(-1);
            } else {
                const cumulativeDeaths = countyData[day].deaths;
                let newDeaths = cumulativeDeaths;
                if (countyData[yesterday] && countyData[yesterday].deaths > -1) {
                    newDeaths = cumulativeDeaths - countyData[yesterday].deaths;
                }

                const cumulativeCases = countyData[day].cases;
                let newCases = cumulativeCases;
                if (countyData[yesterday] && countyData[yesterday].cases > -1) {
                    newCases = cumulativeCases - countyData[yesterday].cases;
                }

                county.deaths.push(newDeaths);
                county.cases.push(newCases);

                if (newDeaths > maxDeaths) {
                    maxDeaths = newDeaths;
                }
                if (newCases > maxCases) {
                    maxCases = newCases;
                }
            }
        }

        county.totalDeaths = countyData[data.end].deaths;
        county.totalCases = countyData[data.end].cases;
        county.maxCases = maxCases;
        county.maxDeaths = maxDeaths;

        // 7 day average
        let sevenTotal = 0;
        let sevenDeaths = 0;
        for (let i = allDates.length - 8; i < allDates.length - 1; i++) {
            sevenTotal += county.cases[i];
            sevenDeaths += county.deaths[i];
        }
        let sevenAvg = sevenTotal / 7.0;
        county.sevenDayAverage = sevenAvg;
        county.sevenCases = sevenTotal;
        county.sevenDeaths = sevenDeaths;

        let prevSevenTotal = 0;
        for (let i = allDates.length - 15; i < allDates.length - 8; i++) {
            prevSevenTotal += county.cases[i];
        }
        let prevSevenAvg = prevSevenTotal / 7.0;
        county.previousSevenDayAverage = prevSevenAvg;

        // 14 day average
        let fourteenTotal = 0;
        for (let i = allDates.length - 15; i < allDates.length - 1; i++) {
            fourteenTotal += county.cases[i];
        }
        let fourteenAvg = fourteenTotal / 14.0;
        county.fourteenDayAverage = fourteenAvg;

        let prevFourteenTotal = 0;
        for (let i = allDates.length - 29; i < allDates.length - 15; i++) {
            prevFourteenTotal += county.cases[i];
        }
        let prevFourteenAvg = prevFourteenTotal / 14.0;
        county.previousFourteenDayAverage = prevFourteenAvg;

        data[fips] = county;
    }

    // Spot check Montgomery County
    console.log(data['start']);
    console.log(data['end']);
    console.log(data['39113']);


    fs.writeFileSync('public/data/nyt-counts.json', JSON.stringify(data));
}

process()
