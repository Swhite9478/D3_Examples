import React from 'react';
import Lollipop from '../Lollipop/lollipop';
import MovieBarChart from '../BarChart/moviesBarChart';
import MovieLineChart from '../LineChart/moviesLineChart';
import MovieTimeSeriesChart from '../TimeSeriesChart/moviesTimeSeriesChart';

const SVG = (props) => {
    return (
      <div className='chart-container'>
        <Lollipop />
        <MovieBarChart />
        <MovieLineChart />
        <MovieTimeSeriesChart />
      </div>
    );
}

export default SVG;