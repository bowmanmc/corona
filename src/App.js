import React, { useState, useEffect } from 'react';

import AddButton from './AddButton';
import Constants from './Constants';
import County from './County';

import './App.scss';

function App() {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const topo = await (await fetch('/data/counties.topo.json')).json();
            const counts = await (await fetch('/data/nyt-counts.json')).json();
            const selectData = await (await fetch('/data/county-select-data.json')).json();

            const counties = {};
            let geoms = topo.objects.counties.geometries;
            for (let i = 0; i < geoms.length; i++) {
                counties[geoms[i].id] = geoms[i].properties;
            }
            // console.log(JSON.stringify(counties['39113']));

            setData({
                counties,
                counts,
                selectData,
            });
        };

        fetchData();
    }, []);

    const fips = JSON.parse(localStorage.getItem(Constants.KEY_COUNTIES)) || [];
    return (
        <div className="App">
            {fips.map(f => {
                return <County key={f} data={data} fips={f} />;
            })}
            <AddButton data={data?.selectData} />
        </div>
    );
}

export default App;
