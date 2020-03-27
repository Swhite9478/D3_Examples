import React, { Component } from 'react';
import * as d3 from 'd3';
import moviesCsv from '../../assets/data/movies.csv';

export default class UpdateBarChart extends Component {

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

    // get the data we will use for the bar chart
    prepareBarChartData(movieData) {
        const dataMap = d3.nest()
                        .key(d => d.genre)
                        .rollup(v => d3.sum(v, leaf => leaf.revenue))
                        .entries(movieData);

        const dataArray = Array.from(dataMap, d=> ({genre: d.key, revenue:d.value}))

        return dataArray;
    }


    // Main Function
    ready(movies) {
        const moviesClean = this.filterData(movies);
        const barChartData = this.prepareBarChartData(moviesClean).sort((a,b) => {
            return d3.descending(a.revenue, b.revenue);
        });

        // Margin Convention
        const margin = { top: 80, right: 40, bottom: 40, left: 80 };
        const width = 650 - margin.left - margin.right;
        const height = 650 - margin.top - margin.bottom;

        // Scales
        const xMax = d3.max(barChartData, v => v.revenue);

        const xScale = d3.scaleLinear()
                    .domain([0, xMax])
                    .range([0, width]);

        const yScale = d3.scaleBand()
                    .domain(barChartData.map(d => d.genre))
                    .rangeRound([0, height])
                    .paddingInner(.25);

        // Draw base
        const svg = d3.select('.barChart')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

        // Draw Header 
     

        // Draw Bars
        

        // Draw Axes
        
    }

    loadMovies() {
        d3.csv(moviesCsv, this.type.bind(this))
        .then(resp => this.ready.bind(this)(resp));
    }

    render() {
        return <div className='barChart' />
    }
}