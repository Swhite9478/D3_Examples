import React from 'react';
import create_lollipop from './lollipop';
import generateMovieGraphics from './movies';

const SVG = (props) => {
    return (
      <div className='bar-chart-container'>
        {/* {create_lollipop()} */}
        {generateMovieGraphics()}
      </div>
    );
}

export default SVG;