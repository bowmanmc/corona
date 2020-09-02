import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import './Bars.scss';

export default ({ series, context }) => {

    const MARGIN_TOP = 45;
    const xDomain = [...Array(series.length).keys()];

    const xScale = scaleBand()
        .domain(xDomain)
        .range([0, context.width]);

    const yScale = scaleLinear()
        .domain([0, context.max])
        .range([context.height - MARGIN_TOP, 0]);

    const bars = [];
    const y0 = yScale(0);
    let maxFound = false;
    for (let i = 0; i < series.length; i++) {
        let yVal = yScale(series[i].y);
        let className = "Bars__bar";
        if (series[i].y === context.max && !maxFound) {
            className = "Bars__bar-max";
            maxFound = true;
        }

        bars.push({
            className: className,
            date: series[i].x,
            x: xScale(i),
            y: yVal + MARGIN_TOP,
            height: y0 - yVal,
            width: xScale.bandwidth(),
        });
    }

    return (
        <g className="Bars">
            {bars.map(bar => {
                return (
                    <rect key={bar.x}
                        className={bar.className}
                        x={bar.x}
                        y={bar.y}
                        height={bar.height}
                        width={bar.width}
                    />
                )
            })}
        </g>
    )
};
