import React from 'react';
import create_lollipop from './lollipop';
import getMoviesBarChart from './moviesBarChart';
import getMoviesLineChart from './moviesLineChart';
import getMoviesTimeSeriesChart from './moviesTimeSeriesChart';

const SVG = (props) => {
    return (
      <div className='chart-container'>
        {/* {create_lollipop()} */}
        {/* {getMoviesBarChart()} */}
        {/* {getMoviesLineChart()} */}
        {getMoviesTimeSeriesChart()}
      </div>
    );
}

export default SVG;