import React from 'react';
import { ReactComponent as VirusIcon } from './virus.svg';

import './Header.scss';

export default () => {

    return (
        <div className="Header">
            <VirusIcon />
            <span>Coronavirus Case Tracker</span>
            <VirusIcon />
        </div>
    );
};
