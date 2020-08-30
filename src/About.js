import React from 'react';

import './About.scss';

export default () => {

    return (
        <div className="About">
            <h2>Data Sources</h2>
            <ul>
                <li>
                    Covid Data:&nbsp;
                    <a href="https://github.com/nytimes/covid-19-data">NYTimes COVID-19 Data</a>
                </li>
                <li>
                    Mask Usage:&nbsp;
                    <a href="https://www.nytimes.com/interactive/2020/07/17/upshot/coronavirus-face-mask-map.html">NYTimes Mask Usage Survey</a>
                </li>
            </ul>
        </div>
    );
};
