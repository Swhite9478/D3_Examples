import React from 'react';
import './App.css';
import SVG from "./Components/svg/SVG";
import Lollipop from './Components//Lollipop/lollipop';
import MovieBarChart from './Components/BarChart/moviesBarChart';
import MovieLineChart from './Components/LineChart/moviesLineChart';
import MovieTimeSeriesChart from './Components/TimeSeriesChart/moviesTimeSeriesChart';
import Fruits from './Components/Fruit/Fruits';
import Transition from './Components/Transition/Transition';
import UpdateMovieBarChart from './Components/BarChart/updateBarChart';
import ToolTipBarChart from './Components/BarChart/toolTipBarChart';
import MoviesLineChartBrush from './Components/LineChart/moviesLineChartBrush';
import MovieLineChartBrush from './Components/LineChart/moviesLineChartBrush';

function App() {
  return (
    <div className="App">
      <MovieLineChartBrush />
      {/* <ToolTipBarChart /> */}
      {/* <UpdateMovieBarChart /> */}
      {/* <Lollipop />
      <MovieBarChart />
      <MovieLineChart />
      <MovieTimeSeriesChart />
      <Fruits />
      <Transition /> */}
    </div>
  );
}

export default App;
