import React from 'react';
import Lollipop from './lollipop';
import getMoviesBarChart from './moviesBarChart';
import getMoviesLineChart from './moviesLineChart';
import getMoviesTimeSeriesChart from './moviesTimeSeriesChart';

const SVG = (props) => {
    return (
      <div className='chart-container'>
        <Lollipop />
        {/* {getMoviesBarChart()} */}
        {/* {getMoviesLineChart()} */}
        {/* {getMoviesTimeSeriesChart()} */}
      </div>
    );
}

export default SVG;