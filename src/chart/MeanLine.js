import React from 'react';
import { scaleLinear } from 'd3-scale';

import './MeanLine.scss';

export default ({ context }) => {

    const MARGIN_TOP = 45;
    const yScale = scaleLinear()
        .domain([0, context.max])
        .range([context.height - MARGIN_TOP, 0]);

    const y = yScale(context.average);

    return (
        <g className="MeanLine">
            <line x1={0} x2={context.width} y1={y} y2={y} />
            <text x={10} y={y - 12}>{context.average.toFixed(0).toLocaleString()} Cases</text>
        </g>
    )
};
