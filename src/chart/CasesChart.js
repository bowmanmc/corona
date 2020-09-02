import React from 'react';
import moment from 'moment';

import Bars from './Bars';
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
    for (let i = 0; i < counts.cases.length; i++) {
        series.push({
            x: moment(start).add(i, 'days').toDate(),
            y: counts.cases[i],
        });
    }

    const ctx = {
        width: WIDTH,
        height: HEIGHT,
        max: data.counts[fips].maxCases,
    };

    return (
        <svg className="CasesChart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
            <MonthSeparators series={series} context={ctx} />
            <Bars series={series} context={ctx} />
        </svg>
    )
};
