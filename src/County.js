import React from 'react';
import moment from 'moment';

import Chart from './Chart';

import './County.scss';

export default ({ data, fips }) => {

    const county = data?.counties?.[fips];
    const counts = data?.counts?.[fips];

    const newCases = counts?.cases?.[counts?.cases?.length - 1];
    const newDeaths = counts?.deaths?.[counts?.deaths?.length - 1];
    const latestDate = moment(data?.counts?.end, 'YYYYMMDD').format('dddd, MMMM Do YYYY');
    return (
        <div className="County">
            <div className="County__main">
                <h2>{county?.name} County, {county?.state}</h2>
                <Chart data={data} fips={fips} />
            </div>

            <p>{latestDate}: {newCases} new cases, {newDeaths} deaths</p>
            <p>Last Seven days: {counts?.sevenCases?.toLocaleString()} new cases, {counts?.sevenDeaths?.toLocaleString()} deaths</p>
            <p>Total Cases: {counts?.totalCases?.toLocaleString()}</p>
            <p>Total Deaths: {counts?.totalDeaths?.toLocaleString()} people</p>
            <p>7-Day Avg Daily New Cases: {counts?.sevenDayAverage?.toFixed(1)} ({counts?.previousSevenDayAverage?.toFixed(1)} previous 7 days)</p>
            <p>14-Day Avg Daily New Cases: {counts?.fourteenDayAverage?.toFixed(1)} ({counts?.previousFourteenDayAverage?.toFixed(1)} previous 14 days)</p>
        </div>
    );
};
