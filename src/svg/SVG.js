import React from 'react';
import Lollipop from './lollipop';
import MovieBarChart from './moviesBarChart';
import MovieLineChart from './moviesLineChart';
import getMoviesTimeSeriesChart from './moviesTimeSeriesChart';

const SVG = (props) => {
    return (
      <div className='chart-container'>
        {/* <Lollipop /> */}
        {/* <MovieBarChart /> */}
        <MovieLineChart />
        {/* {getMoviesTimeSeriesChart()} */}
      </div>
    );
}

export default SVG;