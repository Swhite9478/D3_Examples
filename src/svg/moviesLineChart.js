import moviesCsv from '../assets/data/movies.csv';
import * as d3 from 'd3';

// Data Utilities
const parseNA = string => (string === 'NA' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string); 

// Type Conversion
function type(d) {
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget,
        genre:  parseNA(d.genre),
        genres: JSON.parse(d.genres).map(d => d.name),
        homepage: parseNA(d.homepage),
        id: +d.id,
        imdb_id: parseNA(d.imdb_id),
        original_language: (d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity,
        poster_path:parseNA(d.poster_path),
        production_countries: JSON.parse(d.production_countries),
        release_date:date,
        release_year:date.getFullYear(),
        revenue: +d.revenue,
        runtime: +d.runtime,
        status: d.status,
        tagline: parseNA(d.tagline),
        title: parseNA(d.title),
        vote_average: +d.vote_average,
        vote_count: +d.vote_count
    }
}

// Data Preparation
function filterData(movies) {
    return movies.filter(movie => {
        return (
            movie.release_year  > 1999 && 
            movie.release_year < 2010 && 
            movie.revenue > 0 && 
            movie.budget > 0 &&
            movie.genre &&
            movie.title
        );
    });
}

// get the data we will use for the bar chart
function prepareLineChartData(movieData) {
    const dataArray = [...movieData];

    return dataArray;
}

// Main Function
function ready(movies) {
    const moviesClean = filterData(movies);
    const lineChartData = prepareLineChartData(moviesClean);

    console.log('Line Chart Data:', lineChartData);
    

    // Margin Convention
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Scales
    

    // Draw base
    

    // Draw Header 
    

    // Draw Bars
   

    // Draw Axes
}

// Load Data
function loadMovies() {
    return d3.csv(moviesCsv, type)
    .then(resp => {
        return ready(resp);
    });
}

// Use Loaded Data
export default function getMoviesLineChart() {
    loadMovies();
}
