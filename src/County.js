import React from 'react';

import './County.scss';

export default ({ data, fips }) => {
    return (
        <div className="County">
            <div className="County__name"></div>
            <p>Start: {data?.counts?.start}</p>
            <p>End: {data?.counts?.end}</p>
        </div>
    );
};
