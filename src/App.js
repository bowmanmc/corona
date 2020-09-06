import React, { useState, useEffect } from 'react';

import About from './About';
import AddButton from './AddButton';
import Constants from './Constants';
import County from './County';
import Header from './Header';

import './App.scss';

function App() {
    const [data, setData] = useState({});
    const [fips, setFips] = useState([]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem(Constants.KEY_COUNTIES)) || [];
        setFips(list);
    }, []);

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

    const addCounty = (countyCode) => {
        if (fips.indexOf(countyCode) < 0) {
            fips.push(countyCode);
        }
        setFips([...fips]);
        localStorage.setItem(Constants.KEY_COUNTIES, JSON.stringify(fips));
    };

    const closeCounty = (countyCode) => {
        const idx = fips.indexOf(countyCode);
        if (idx > -1) {
            fips.splice(idx, 1);
        }
        setFips([...fips]);
        localStorage.setItem(Constants.KEY_COUNTIES, JSON.stringify(fips));
    }

    return (
        <div className="App">
            <Header />
            <div className="App__counties">
                {fips.map(f => {
                    return <County key={f} data={data} fips={f} onClose={closeCounty} />;
                })}
            </div>
            <AddButton data={data?.selectData} onAdd={addCounty} />
            <About />
        </div>
    );
}

export default App;
