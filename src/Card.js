import React from 'react';

import './Card.scss';

export default ({ number, context, description }) => {

    return (
        <div className="Card">
            {number && <span className="Card__number">{number}</span>}
            {context && <span className="Card__context">{context}</span>}
            {description && <span className="Card__description">{description}</span>}
        </div>
    );
};
