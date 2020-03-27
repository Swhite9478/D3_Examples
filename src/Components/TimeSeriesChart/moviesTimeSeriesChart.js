import React, { Component } from 'react';
import moviesCsv from '../../assets/data/movies.csv';
import * as d3 from 'd3';

export default class MovieTimeSeriesChart extends Component {

    componentDidMount() {
        this.loadMovies();
    }

    // Data Utilities
    parseNA = string => (string === 'NA' ? undefined : string);
    parseDate = string => d3.timeParse('%Y-%m-%d')(string); 

    // Type Conversion
    type(d) {
        const date = this.parseDate(d.release_date);
        return {
            budget: +d.budget,
            genre:  this.parseNA(d.genre),
            genres: JSON.parse(d.genres).map(d => d.name),
            homepage: this.parseNA(d.homepage),
            id: +d.id,
            imdb_id: this.parseNA(d.imdb_id),
            original_language: (d.original_language),
            overview: this.parseNA(d.overview),
            popularity: +d.popularity,
            poster_path: this.parseNA(d.poster_path),
            production_countries: JSON.parse(d.production_countries),
            release_date: date,
            release_year: date.getFullYear(),
            revenue: +d.revenue,
            runtime: +d.runtime,
            status: d.status,
            tagline: this.parseNA(d.tagline),
            title: this.parseNA(d.title),
            vote_average: +d.vote_average,
            vote_count: +d.vote_count
        }
    }

    // Data Preparation
    filterData(movies) {
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

    prepareTimeSeriesData(data) {
        const groupByReleaseYear = d => d.release_year;
        const reduceRevenue = values => d3.sum(values, leaf => leaf.revenue);
        const revenueMap = d3.nest()
                        .key(groupByReleaseYear)
                        .rollup(reduceRevenue)
                        .entries(data)
        const reduceBudget = values => d3.sum(values, leaf => leaf.budget);
        const budgetMap = d3.nest()
                        .key(groupByReleaseYear)
                        .rollup(reduceBudget)
                        .entries(data)
        
        // convert to array 
        const revenueArray = Array.from(revenueMap).sort((a,b) => d3.ascending(a.key, b.key));
        const budgetArray = Array.from(budgetMap).sort((a,b) => d3.ascending(a.key, b.key));

        // parse years
        const parseYear = d3.timeParse('%Y');
        const dates = revenueArray.map(d => parseYear(d.key));

        // Money Maximum
        const yValues = [
            ...Array.from(revenueMap.values()),
            ...Array.from(budgetMap.values())
        ];

        const yMax = d3.max(yValues);

        // produce final data
        const lineData = {
            series: [
                {
                    name: 'Revenue',
                    color:'dodgerblue',
                    values: revenueArray.map(d => ({date:parseYear(d.key), value: d.value}))
                },
                {
                    name: 'Budget',
                    color:'darkorange',
                    values: budgetArray.map(d => ({date:parseYear(d.key), value: d.value}))
                }
            ],
            dates:dates,
            yMax: yMax
        }

        return lineData;
    }

    // Main Function
    ready(movies) {
        const moviesClean = this.filterData(movies);
        const timeSeriesData = this.prepareTimeSeriesData(moviesClean);

        console.log('Time Series Data:', timeSeriesData);
        

        // Margin Convention
        const margin = { top: 80, right: 60, bottom: 40, left: 60 };
        const width = 650 - margin.left - margin.right;
        const height = 650 - margin.top - margin.bottom;

        // Scales
        const xScale = d3.scaleTime()
                    .domain(d3.extent(timeSeriesData.dates))
                    .range([0, width]);

        const yScale = d3.scaleLinear()
                    .domain([0, timeSeriesData.yMax.value])
                    .range([height, 0]);
        
        // Line Generator
        const lineGen = d3.line()
                    .x(d => xScale(d.date))
                    .y(d => yScale(d.value)); 

        // Draw base
        const svg = d3.select('.timeSeriesChart')
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

        header.append('tspan').text('Budget and Revenue over time in $US')
                    .attr('dx', `${(width - margin.left - margin.right) / 2.7}`);

        header.append('tspan')
                    .text('Films with budget and revenue figures, 2000-2009')
                    .attr('x', 0)
                    .attr('dy', '1.5em')
                    .attr('dx', `${(width - margin.left - margin.right) / 2.9}`)
                    .attr('font-size', '0.8em')
                    .attr('fill', '#555');

        // Draw Axes
        function formatTicks(d) { 
            return d3.format('~s')(d)
                    .replace('M', ' mil')
                    .replace('G', ' bil')
                    .replace('T', ' tril')
        }

        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

        const xAxisDraw = svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(xAxis)

        const yAxis = d3.axisLeft(yScale)
                    .ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-width)
                    .tickSizeOuter(0);

        const yAxisDraw = svg.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', `translate(0, 0)`)
                    .call(yAxis)
        
        yAxisDraw.selectAll('text')
            .attr('dx', '-0.6em'); 

        // Draw Time Series
        const chartGroup = svg.append('g')
                    .attr('class', 'line-chart');
        
        chartGroup.selectAll('.line-series')
                    .data(timeSeriesData.series)
                    .enter()
                    .append('path')
                    .attr('d', d => {const gen = lineGen(d.values); console.log(gen); return gen;})
                    .attr('class', d => `line-series ${d.name.toLowerCase()}`)
                    .attr('fill', 'none')
                    .style('stroke', d => d.color)
                    .style('stroke-width', '0.2em');

        // Draw Data Points
        function formatDollars(number) {
            return '$' + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
        }

        chartGroup.append('g')
                    .attr('class', 'data-points')
                    .selectAll('data-point')
                    .data(timeSeriesData.series.map(d => d.values).flat())
                    .enter()
                    .append('circle')
                    .attr('cx', d => xScale(d.date))
                    .attr('cy', d => yScale(d.value))
                    .attr('r', 3)
                    .style('fill', 'black')
                    .style('fill-opacity', 0.7)
                    .on('mouseover', function(d, i) {
                        d3.select(this)
                        .attr('r', 10)
                        .style('fill', '#00f541')
                        .style('cursor', 'pointer')
                        .style('fill-opacity', .8)
                        .append("svg:title")
                        .text(d =>  formatDollars(d.value))
                    })
                    .on('mouseleave', function(d, i) {
                        d3.select(this)
                        .attr('r', 3)
                        .style('fill', 'black')
                        .style('fill-opacity', 0.7)                    
                    });


        // Add series label
        chartGroup.append('g')
                    .attr('class', 'series-labels')
                    .selectAll('series-label')
                    .data(timeSeriesData.series)
                    .enter()
                    .append('text')
                    .attr('x', d => xScale(d.values[d.values.length - 1].date) + 5)
                    .attr('y', d => yScale(d.values[d.values.length - 1].value))
                    .text(d => d.name)
                    .style('dominant-baseline', 'central')
                    .style('font-size', '0.7em')
                    .style('font-weight', 'bold')
                    .style('fill', d => d.color);
    }

    // Load Data
    loadMovies() {
        return d3.csv(moviesCsv, this.type.bind(this))
        .then(resp => this.ready.bind(this)(resp));
    }

    render() {
        return <div className='timeSeriesChart' />
    }
}