import React, { Component } from 'react';
import * as d3 from 'd3';
import moviesCsv from '../../assets/data/movies.csv';
import '../../assets/css/updateBarChart.css';

export default class UpdateBarChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: props.width ? props.width : 500,
            height: props.height ? props.height : 500,
            margin: {
                top: props.marginTop ? props.top : 80,
                right: props.marginRight ? props.right : 40,
                bottom: props.marginBottom ? props.bottom : 40,
                left: props.marginLeft ? props.left : 80
            }
        }
    }

    componentDidMount() {
        this.setState({svg: this.drawSvgBase()})
        this.loadMovies();
    }

    drawSvgBase() {
        // Margin Convention
        const svg = d3.select('.barChart')
            .append('svg')
            .attr('width', this.state.width + this.state.margin.left + this.state.margin.right)
            .attr('height', this.state.height + this.state.margin.top + this.state.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.state.margin.left},${this.state.margin.top})`);
        return svg;
    }

    render() {
        return (
            <div className='updateBarChartComponent'>
                <div className='barChart' />
                <div className='controls'>
                    <button value='revenue' onClick={this.handleClick.bind(this)}>Revenue</button>
                    <button value='budget' onClick={this.handleClick.bind(this)}>Budget</button>
                    <button value='popularity' onClick={this.handleClick.bind(this)}>Popularity</button>
                </div>
            </div>
        );
    }

    loadMovies() {
        d3.csv(moviesCsv, this.type.bind(this))
        .then(resp => this.ready.bind(this)(resp));
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

    // Main Function
    ready(movies) {
        const moviesClean = this.filterData(movies);
        const barChartData = this.prepareBarChartData(moviesClean).sort((a,b) => {
            return d3.descending(a.revenue, b.revenue);
        });


        // Scales
        const xMax = d3.max(barChartData, v => v.revenue);

        const xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([0,  this.state.width]);

        const yScale = d3.scaleBand()
            .domain(barChartData.map(d => d.genre))
            .rangeRound([0,  this.state.height])
            .paddingInner(.25);


        // Draw Header 
     

        // Draw Bars
        

        // Draw Axes
        
    }

    handleClick(event) {
        this.update(event.target.value);
    }

    // Update Handler
    update(dataset) {
        this.state.svg.selectAll('text')
            .data(dataset, d => d)
            .join(
                enter => {
                    enter
                    .append('text')
                    
                },

                update => {
                    update
                    .append('text')
                    
                },

                exit => {
                    exit
                    .append('text')
                    
                }
            );
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
}