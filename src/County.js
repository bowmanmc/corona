import React from 'react';
import moment from 'moment';

import Card from './Card';
import CasesChart from './chart/CasesChart';
import MaskNumber from './MaskNumber';

import './County.scss';

export default ({ data, fips, onAddNeighbors, onClose }) => {

    const county = data?.counties?.[fips];
    const counts = data?.counts?.[fips];

    const newCases = counts?.cases?.[counts?.cases?.length - 1];
    const newDeaths = counts?.deaths?.[counts?.deaths?.length - 1];
    const latestDate = moment(data?.counts?.end, 'YYYYMMDD').format('dddd, MMMM Do YYYY');

    let sevenContext = `${counts?.previousSevenDayAverage?.toFixed(1)} for the previous 7 days.`;
    if (counts?.sevenDayAverage > counts?.previousSevenDayAverage) {
        sevenContext = `Up from ${sevenContext}`;
    }
    else {
        sevenContext = `Down from ${sevenContext}`;
    }

    let fourteenContext = `${counts?.previousFourteenDayAverage?.toFixed(1)} for the previous 14 days.`;
    if (counts?.fourteenDayAverage > counts?.previousFourteenDayAverage) {
        fourteenContext = `Up from ${fourteenContext}`;
    }
    else {
        fourteenContext = `Down from ${fourteenContext}`;
    }

    const adjacentCounties = [];
    for (let i = 0; i < county?.adjacent.length; i++) {
        const afips = county?.adjacent[i];
        adjacentCounties.push(data?.counties?.[afips].name);
    }

    return (
        <div className="County">
            <div className="County__header">
                <h2>{county?.name} County, {county?.state}</h2>
            </div>

            <CasesChart data={data} fips={fips} />

            <div className="County__row">
                <Card
                    description={latestDate}
                    number={`${newCases} new cases, ${newDeaths} deaths`}
                />
                <Card
                    description={"In the Last Seven Days"}
                    number={`${counts?.sevenCases?.toLocaleString()} new cases, ${counts?.sevenDeaths?.toLocaleString()} deaths`}
                />
            </div>

            <div className="County__row">
                <Card
                    description={"7-Day Average Daily New Cases"}
                    context={sevenContext}
                    number={`${counts?.sevenDayAverage?.toFixed(1)} New Cases / Day`}
                />
                <Card
                    description={"14-Day Average Daily New Cases"}
                    context={fourteenContext}
                    number={`${counts?.fourteenDayAverage?.toFixed(1)} New Cases / Day`}
                />
            </div>

            <div className="County__row">
                <Card
                    description={"Total Cases"}
                    number={counts?.totalCases?.toLocaleString()}
                />
                <Card
                    description={"Total Deaths"}
                    number={`${counts?.totalDeaths?.toLocaleString()} people`}
                />
            </div>

            {/* <div className="County__masks">
                <div className="County__maskstitle">Mask Usage Rate</div>
                <div className="County__maskscounts">
                    <MaskNumber label={"Never"} rate={county?.maskusage.never} />
                    <MaskNumber label={"Rarely"} rate={county?.maskusage.rarely} />
                    <MaskNumber label={"Sometimes"} rate={county?.maskusage.sometimes} />
                    <MaskNumber label={"Frequently"} rate={county?.maskusage.frequently} />
                    <MaskNumber label={"Always"} rate={county?.maskusage.always} />
                </div>
            </div> */}

            <div className="County__footer">
                <div className="County__footerleft">
                    <button className="County__footerbtn" onClick={() => {
                        onAddNeighbors(county?.adjacent);
                    }}>
                        Add Neighbor Counties
                        <br />
                        ({adjacentCounties.join(', ')})
                    </button>
                </div>
                <div className="County__footerright">
                    <button className="County__footerbtn" onClick={() => {
                        onClose(fips);
                    }}>x close</button>
                </div>
            </div>
        </div>
    );
};
