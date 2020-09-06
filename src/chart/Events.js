import React from 'react';
import moment from 'moment';
import { scaleTime } from 'd3-scale';

import './Events.scss';

export default ({ series, context }) => {

    const xScale = scaleTime()
        .domain([series[0].x, series[series.length - 1].x])
        .range([0, context.width]);

    const events = [{
        date: moment('2020-03-14', 'YYYY-MM-DD').toDate(),
        title: 'Spring Break',
        color: 'red'
    }, {
        date: moment('2020-05-25', 'YYYY-MM-DD').toDate(),
        title: 'Memorial Day',
        color: 'red',
    }, {
        date: moment('2020-08-14', 'YYYY-MM-DD').toDate(),
        title: 'Back to School',
        color: 'red'
    }, {
        date: moment('2020-07-04', 'YYYY-MM-DD').toDate(),
        title: 'July 4th',
        color: 'red',
    }];

    return (
        <g className="Events">
            {events.map(evt => {
                return (
                    <line
                        key={evt.title}
                        className="Events__event"
                        stroke={evt.color}
                        strokeWidth={1}
                        x1={xScale(evt.date)}
                        x2={xScale(evt.date)}
                        y1={0}
                        y2={context.height}
                    />
                );
            })}
        </g>
    )
};
