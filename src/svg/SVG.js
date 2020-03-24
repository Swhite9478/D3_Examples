import React from 'react';
import create_lollipop from './lollipop';
import getMoviesBarChart from './movies';

const SVG = (props) => {
    return (
      <div className='bar-chart-container'>
        {/* {create_lollipop()} */}
        {getMoviesBarChart()}
      </div>
    );
}

export default SVG;