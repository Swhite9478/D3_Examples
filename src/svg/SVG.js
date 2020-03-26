import React from 'react';
import Lollipop from './lollipop';
import MovieBarChart from './moviesBarChart';
import MovieLineChart from './moviesLineChart';
import MovieTimeSeriesChart from './moviesTimeSeriesChart';

const SVG = (props) => {
    return (
      <div className='chart-container'>
        {/* <Lollipop /> */}
        {/* <MovieBarChart /> */}
        {/* <MovieLineChart /> */}
        <MovieTimeSeriesChart />
      </div>
    );
}

export default SVG;