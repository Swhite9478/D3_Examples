import React from 'react';
import create_lollipop from './lollipop';
import getMoviesBarChart from './moviesBarChart';
import getMoviesLineChart from './moviesLineChart';

const SVG = (props) => {
    return (
      <div className='bar-chart-container'>
        {/* {create_lollipop()} */}
        {/* {getMoviesBarChart()} */}
        {getMoviesLineChart()}
      </div>
    );
}

export default SVG;