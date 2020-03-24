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
function prepareScatterData(movieData) {
    return movieData.sort((a,b) => d3.descending(a.budget, b.budget)).filter((d,i) => i < 100);
}

// Main Function
function ready(movies) {
    const moviesClean = filterData(movies);
    const scatterData = prepareScatterData(moviesClean);

    console.log('Line Chart Data:', scatterData);
    

    // Margin Convention
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear()
                .domain(d3.extent(scatterData, v => v.budget))
                .range([0, width]);

    const yScale = d3.scaleLinear()
            .domain(d3.extent(scatterData, v => v.revenue))
            .range([height, 0]);

    // Draw base
    const svg = d3.select('.chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);    

    // Draw Header 
    

    // Draw Bars
   

    // Draw Axes

    // Draw Scatter
    svg.selectAll('.scatter')
                .append('g')
                .attr('class', 'scatter-points')
                .data(scatterData)
                .enter()
                .append('circle')
                .attr('class', 'scatter')
                .attr('cx', d => xScale(d.budget))
                .attr('cy', d => yScale(d.revenue))
                .attr('r', 3)
                .style('fill', 'dodgerblue')
                .style('fill-opacity', 0.7);
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
