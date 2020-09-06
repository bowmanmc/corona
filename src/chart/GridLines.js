import React from 'react';
import { scaleLinear } from 'd3-scale';

import './GridLines.scss';

export default ({ context }) => {

    const MARGIN_TOP = 45;
    const yScale = scaleLinear()
        .domain([0, context.max])
        .range([context.height - MARGIN_TOP, 0]);

    const numDivisions = 5;
    const oneDiv = Math.round(context.max / numDivisions);

    const vals = [];
    for (let i = 0; i < numDivisions - 1; i++) {
        const val = oneDiv + (oneDiv * i);
        if (vals.indexOf(val) < 0) {
            vals.push(oneDiv + (oneDiv * i));
        }
    }

    return (
        <g className="GridLines">
            {vals.map(val => {
                return (
                    <>
                        <line
                            x1={17}
                            x2={context.width}
                            y1={yScale(val) + MARGIN_TOP}
                            y2={yScale(val) + MARGIN_TOP}
                        />
                        <text
                            x={17}
                            y={yScale(val) + MARGIN_TOP - 7}>
                            {val.toLocaleString()} New Cases
                        </text>
                    </>
                );
            })}
        </g>
    )
};
