import React from 'react';
import './App.css';
import SVG from "./Components/svg/SVG";
import Lollipop from './Components//Lollipop/lollipop';
import MovieBarChart from './Components/BarChart/moviesBarChart';
import MovieLineChart from './Components/LineChart/moviesLineChart';
import MovieTimeSeriesChart from './Components/TimeSeriesChart/moviesTimeSeriesChart';
import Fruits from './updatePattern/Fruits';
import Transition from './updatePattern/Transition';

function App() {
  return (
    <div className="App">
      <Lollipop />
      <MovieBarChart />
      <MovieLineChart />
      <MovieTimeSeriesChart />
      <Fruits />
      <Transition />
    </div>
  );
}

export default App;
