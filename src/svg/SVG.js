import React from 'react';
import create_lollipop from './lollipop';

const SVG = (props) => {
    return (
        <div>
            {create_lollipop()}
        </div>
    );
}

export default SVG;