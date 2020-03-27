import React, { Component } from 'react';
import * as d3 from 'd3';
import moviesCsv from '../../assets/data/movies.csv';
import '../../assets/css/updateBarChart.css';

export default class UpdateBarChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: props.width ? props.width : 600,
            height: props.height ? props.height : 500,
            margin: {
                top: props.marginTop ? props.top : 80,
                right: props.marginRight ? props.right : 40,
                bottom: props.marginBottom ? props.bottom : 40,
                left: props.marginLeft ? props.left : 200
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
    cutText = string => string.length  < 35 ? string : string.substring(0, 35) + '...';

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
        const svg = this.state.svg;
        const moviesClean = this.filterData(movies);
        const revenueData = moviesClean
            .sort((a,b) => b.revenue - a.revenue)
            .filter((d, i) => i < 15);

        // Scales
        const xMax = d3.max(revenueData, v => v.revenue);

        const xScale = d3.scaleLinear()
                    .domain([0, xMax])
                    .range([0, this.state.width]);

        const yScale = d3.scaleBand()
                    .domain(revenueData.map(d => this.cutText(d.title)))
                    .rangeRound([0, this.state.height])
                    .paddingInner(.25);

        // Draw Header 
        const header = svg.append('g')
                    .attr('class', 'bar-header')
                    .attr('transform', `translate(0, ${-this.state.margin.top / 2})`)
                    .append('text');

        const headline = header.append('tspan').text('Total Revenue by Title in $US');

        header.append('tspan')
                    .text('Top 15 Films, 2000-2009')
                    .attr('x', 0)
                    .attr('dy', '1.5em')
                    .attr('font-size', '0.8em')
                    .attr('fill', '#555');

        // Draw Bars
        const bars = svg
                    .selectAll('.bar')
                    .data(revenueData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('y', d => yScale(this.cutText(d.title)))
                    .attr('width', d => xScale(d.revenue))
                    .attr('height', yScale.bandwidth())
                    .style('fill', 'dodgerblue');

        function formatTicks(d) { 
            return d3.format('~s')(d)
                    .replace('M', ' mil')
                    .replace('G', ' bil')
                    .replace('T', ' tril')
        }

        // Draw Axes
        const xAxis = d3.axisTop(xScale)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-this.state.height)
                    .tickSizeOuter(0);

        const xAxisDraw = svg.append('g')
                    .attr('class', 'x axis')
                    .call(xAxis);
        
        const yAxis = d3.axisLeft(yScale)
                    .tickSize(0);

        const yAxisDraw = svg.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

        yAxisDraw.selectAll('text')
                    .attr('dx', '-0.6em')
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
}