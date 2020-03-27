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

function App() {
  return (
    <div className="App">
      <ToolTipBarChart />
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
