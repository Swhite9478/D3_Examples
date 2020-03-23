import harryPotterCsv from '../assets/data/harry_potter.csv';
import harryPotterJson from "../assets/data/harry_potter.json";
import lordOfTheRingsCsv from "../assets/data/lord_of_the_rings.csv";
import * as d3 from 'd3';
import * as dataFetch from 'd3-fetch'

function harryPotter() {
    d3.csv(harryPotterCsv).then(resp => {
      console.log("Local CSV:", resp);
    });
}

function movies() {
    const potter = d3.csv(harryPotterCsv);
    const rings = d3.csv(lordOfTheRingsCsv);

    let potterResult, ringsResult;
    Promise.all([potter, rings])
    .then(res => [potterResult, ringsResult] = res)
    .then(() => {
         console.log("POTTER:", potterResult);
         console.log("RINGS:", ringsResult);
    });  
}

export default function generateMovieGraphics() {
    movies();
}