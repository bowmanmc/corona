import React from 'react';
import {
    FlexibleWidthXYPlot,
    VerticalBarSeries,
} from 'react-vis';
import moment from 'moment';

import './Chart.scss';

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

    return (
        <div className="Chart">
            <FlexibleWidthXYPlot
                margin={{ left: 0, bottom: 0, right: 0, top: 0 }}
                height={128}
                xType="ordinal"
                yDomain={[0, counts.maxCases]}
            >
                <VerticalBarSeries
                    data={series}
                />

            </FlexibleWidthXYPlot>
        </div>
    );
};
