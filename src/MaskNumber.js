import React from 'react';

import './MaskNumber.scss';

export default ({ label, rate }) => {

    const percentage = (rate * 100).toFixed(0);

    return (
        <div className="MaskNumber">
            <span className="MaskNumber__rate">{percentage}%</span>
            <span className="MaskNumber__label">{label}</span>
        </div>
    );
};
