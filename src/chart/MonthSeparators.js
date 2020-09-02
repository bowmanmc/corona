import React from 'react';
import moment from 'moment';
import { scaleTime } from 'd3-scale';

import './MonthSeparators.scss';

export default ({ series, context }) => {

    const xScale = scaleTime()
        .domain([series[0].x, series[series.length - 1].x])
        .range([0, context.width]);


    const currentDate = moment(series[0].x, 'YYYYMMDD').startOf('month');
    const endDate = moment(series[series.length - 1].x, 'YYYYMMDD');
    const dates = [];
    while (currentDate.isBefore(endDate)) {
        dates.push(moment(currentDate).toDate());
        currentDate.add(1, 'month');
    }
    dates.push(moment(currentDate).toDate());

    const separators = [];
    for (let i = 0; i < dates.length - 1; i++) {
        const x = xScale(dates[i]);
        const x2 = xScale(dates[i + 1]);
        separators.push({
            month: moment(dates[i]).format('MMM').toUpperCase(),
            x: x,
            width: (x2 - x),
        });
    }

    return (
        <g className="MonthSeparators">
            {separators.map((separator, i) => {

                let className = "MonthSeparators__separator";
                if (i % 2 === 0) {
                    className = "MonthSeparators__separator-alt";
                }

                return (
                    <g key={separator.month}>
                        <rect className={className}
                            x={separator.x}
                            height={context.height}
                            width={separator.width}
                        />
                        <text
                            x={separator.x + 3}
                            y={42}>{separator.month}
                        </text>
                    </g>
                );
            })}
        </g>
    )
};
