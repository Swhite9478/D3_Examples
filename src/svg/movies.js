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
function prepareBarChartData(movieData) {
    const dataMap = d3.nest()
                    .key(d => d.genre)
                    .rollup(v => d3.sum(v, leaf => leaf.revenue))
                    .entries(movieData);

    const dataArray = Array.from(dataMap, d=> ({genre: d.key, revenue:d.value}))

    return dataArray;
}

// Main Function
function ready(movies) {
    const moviesClean = filterData(movies);
    const barChartData = prepareBarChartData(moviesClean).sort((a,b) => {
        return d3.descending(a.revenue, b.revenue);
    });

    // Margin Convention
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Scales
    const xMax = d3.max(barChartData, v => v.revenue);

    const xScale = d3.scaleLinear()
                .domain([0, xMax])
                .range([0, width]);

    const ySCale = d3.scaleBand()
                .domain(barChartData.map(d => d.genre))
                .rangeRound([0, height])
                .paddingInner(.25);

    // Draw base
    const svg = d3.select('.bar-chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw Bars
    const bars = svg
                .selectAll('.bar')
                .data(barChartData)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('y', d => ySCale(d.genre))
                .attr('width', d => xScale(d.revenue))
                .attr('height', ySCale.bandwidth())
                .style('fill', 'dodgerblue')

}

// Load Data
function loadMovies() {
    return d3.csv(moviesCsv, type)
    .then(resp => {
        return ready(resp);
    });
}

// Use Loaded Data
function getMoviesChart() {
    return loadMovies();
}

export default function generateMovieGraphics() {
   getMoviesChart();
}