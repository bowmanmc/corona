import React, { useState, useEffect } from 'react';

import County from './County';

import './App.scss';

function App() {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const topo = await (await fetch('/data/counties.topo.json')).json();
            const counts = await (await fetch('/data/nyt-counts.json')).json();

            const counties = {};
            let geoms = topo.objects.counties.geometries;
            for (let i = 0; i < geoms.length; i++) {
                counties[geoms[i].id] = geoms[i].properties;
            }
            console.log(JSON.stringify(counties['39113']));

            setData({
                counties,
                counts,
            });
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <County data={data} fips={'39113'} />
        </div>
    );
}

export default App;
