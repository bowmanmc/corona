import React from 'react';
import moment from 'moment';

import Bars from './Bars';
// import Events from './Events';
import MonthSeparators from './MonthSeparators';

import './CasesChart.scss';

const WIDTH = 1600;
const HEIGHT = 450;

export default ({ data, fips }) => {

    if (!data || !data.counts) {
        return null;
    }

    const counts = data.counts[fips];
    const series = [];
    const start = moment(data.counts.start, 'YYYYMMDD');
    let maxDate = '';
    let maxFound = false;
    for (let i = 0; i < counts.cases.length; i++) {
        series.push({
            x: moment(start).add(i, 'days').toDate(),
            y: counts.cases[i],
        });
        if (!maxFound && counts.cases[i] === data.counts[fips].maxCases) {
            maxFound = true;
            maxDate = moment(start).add(i, 'days').format('MM/DD/YYYY');
        }
    }

    const ctx = {
        width: WIDTH,
        height: HEIGHT,
        max: data.counts[fips].maxCases,
    };

    return (
        <div className="CasesChart">
            <svg className="CasesChart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
                <MonthSeparators series={series} context={ctx} />
                <Bars series={series} context={ctx} />
                {/* <Events series={series} context={ctx} /> */}
            </svg>
            <div className="CasesChart__legend">
                <div className="CasesChart__chartlabel">
                    Count of Daily New Cases
                </div>
                <div className="CasesChart__maxlabel">
                    <div className="CasesChart__maxcolor"></div>
                    <div className="CasesChart__maxtext">
                        Highest
                        ({ctx.max.toLocaleString()})
                        on { maxDate }
                    </div>
                </div>
            </div>
        </div>

    )
};
