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
    const margin = { top: 80, right: 40, bottom: 40, left: 60 };
    const width = 650 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    // Scales
    const xExtent = d3.extent(scatterData, v => v.budget)
                .map((d, i) => i === 0 ? d * 0.95 : d * 1.05);

    const xScale = d3.scaleLinear()
                .domain(xExtent)
                .range([0, width]);

    const yExtent = d3.extent(scatterData, v => v.revenue)
        .map((d, i) => i === 0 ? d * 0.1 : d * 1.1);

    const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height, 0]);

    // Draw base
    const svg = d3.select('.chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);    

    // Draw Header 
    const header = svg.append('g')
                .attr('class', 'bar-header')
                .attr('transform', `translate(0, ${-margin.top / 2})`)
                .append('text');

    header.append('tspan').text('Budget vs Revenue in \$US')
                .attr('dx', `${(width - margin.left - margin.right) / 2.5}`);

    header.append('tspan')
                .text('Top 100 films by budget, 2000-2009')
                .attr('x', 0)
                .attr('dy', '1.5em')
                .attr('dx', `${(width - margin.left - margin.right) / 2.7}`)
                .attr('font-size', '0.8em')
                .attr('fill', '#555');
    

    // Draw Bars
   

    function formatTicks(d) { 
        return d3.format('~s')(d)
                .replace('M', ' mil')
                .replace('G', ' bil')
                .replace('T', ' tril')
    }

    function addLabel(axis, label, xVal, yVal) {
        const newLabel = axis.selectAll('.tick:last-of-type text')
                .clone()
                .text(label)
                .attr('x', xVal)
                .attr('y', yVal)
                .style('text-anchor', 'start')
                .style('font-weight', 'bold')
                .style('fill', '#555');

        if (label === 'Revenue') {
            newLabel.attr('transform', 'rotate(-90)');
        }
    }

    // Draw Axes
    const xAxis = d3.axisBottom(xScale)
                .ticks(5)
                .tickFormat(formatTicks)
                .tickSizeInner(-height)
                .tickSizeOuter(0);

    const xAxisDraw = svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis)
                .call(addLabel, 'Budget',( -width + margin.left + margin.right)/2, 20);

    const yAxis = d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(formatTicks)
                .tickSizeInner(-height)
                .tickSizeOuter(0);

    const yAxisDraw = svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', `translate(0, 0)`)
                .call(yAxis)
                .call(addLabel, 'Revenue', (-height + margin.top + margin.bottom)/2, -50);
    
    yAxisDraw.selectAll('text')
        .attr('dx', '-0.6em'); 

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
