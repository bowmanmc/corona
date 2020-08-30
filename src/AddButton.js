import React, { useState } from 'react';
import Select from 'react-select'

import Constants from './Constants';

import './AddButton.scss';

export default ({ data, onAdd }) => {

    if (!data) {
        return null;
    }

    const [selectedState, setSelectedState] = useState(null);
    const [selectedCounty, setSelectedCounty] = useState(null);

    const addCounty = () => {
        onAdd(selectedCounty.value);
        setSelectedCounty(null);
        setSelectedState(null);
    };

    const states = Object.keys(data).sort();
    const stateSelectData = [];
    for (let i = 0; i < states.length; i++) {
        stateSelectData.push({
            label: states[i],
            value: states[i],
        });
    }

    return (
        <div className="AddButton">
            <div className="AddButton__select">
                <Select
                    className="Select"
                    classNamePrefix="Select"
                    value={selectedState}
                    options={stateSelectData}
                    onChange={(newVal) => {
                        setSelectedState(newVal);
                    }}
                />
            </div>
            <div className="AddButton__select">
                {selectedState && (
                    <Select
                        className="Select"
                        classNamePrefix="Select"
                        value={selectedCounty}
                        options={data[selectedState.value]}
                        onChange={newVal => {
                            setSelectedCounty(newVal);
                        }}
                    />
                )}
            </div>
            {selectedCounty && (
                <button onClick={addCounty} className="AddButton__button"><span>Add County</span></button>
            )}
        </div>
    );
};
