import React, { Component } from 'react'; 
import * as d3 from 'd3';
import moviesCsv from '../../assets/data/movies.csv';
import '../../assets/css/updateBarChart.css';


export default class ToolTipBarChart extends Component {
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
                <div className='tooltip' />
                <div className='controls'>
                    <button value='revenue'>Revenue</button>
                    <button value='budget'>Budget</button>
                    <button value='popularity'>Popularity</button>
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

   // Main Function
   ready(movies) {
        const svg = this.state.svg;
        var metric = 'revenue';

        function handleClick() {
            console.log(this.value);
            metric = this.value;

            const updatedData  = moviesClean
                .sort((a,b) => b[metric] - a[metric])
                .filter((d,i) => i < 15);

            update(updatedData);

            
        } 

        function cutText(string) { 
            return string.length  < 35 ? string : string.substring(0, 35) + '...';
        }


        function update(data) {
            // update scales
            xScale.domain([0, d3.max(data, d => d[metric])])
            yScale.domain(data.map(d => cutText(d.title)))

            // Set up transition
            const dur = 1000;
            const t = d3.transition().duration(dur).delay((d,i) => i * 20)

            // update bars
            bars
            .selectAll('.bar')
            .data(data, d => d.title)
            .join(
                enter => {
                    enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('y', d => yScale(cutText(d.title)))
                    .attr('height', yScale.bandwidth())
                    .style('fill', 'lightcyan')
                    .transition(t)
                    .attr('width', d => xScale(d[metric]))
                    .style('fill', 'dodgerblue')
                    },

                update =>{ 
                    update 
                    .transition(t)
                    .attr('y', d => yScale(cutText(d.title)))                    
                    .attr('width', d => xScale(d[metric]))
                    },

                exit =>
                    exit
                    .transition()
                    .duration(dur/2)
                    .style('fill-opacity', 0)
                    .remove()
            )

            // update axes
            xAxisDraw.transition(t).call(xAxis.scale(xScale));
            yAxisDraw.transition(t).call(yAxis.scale(yScale));

            yAxisDraw.selectAll('text').attr('dx', '-0.6em');

            // update header
            headline.text(`Total ${metric} by Title ${metric === 'popularity' ? '' : 'in $US'}`);
        }

        const moviesClean = this.filterData(movies);
        const revenueData = moviesClean
            .sort((a,b) => b.revenue - a.revenue)
            .filter((d, i) => i < 15);

        // Scales
        const xScale = d3.scaleLinear()
            .range([0, this.state.width]);

        const yScale = d3.scaleBand()
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
            .append('g')
            .attr('class', 'bars');


        function formatTicks(d) { 
            return d3.format('~s')(d)
            .replace('M', ' mil')
            .replace('G', ' bil')
            .replace('T', ' tril')
        }

        // Draw Axes
        const xAxis = d3.axisTop(xScale)
            .tickFormat(formatTicks)
            .ticks(5)
            .tickSizeInner(-this.state.height)
            .tickSizeOuter(0);

        const xAxisDraw = svg.append('g')
            .attr('class', 'x axis')
        
        const yAxis = d3.axisLeft(yScale)
            .tickSize(0);

        const yAxisDraw = svg.append('g')
            .attr('class', 'y axis')

        update.bind(this)(revenueData);

        d3.selectAll('button').on('click', handleClick);

        // Tooltip handler
        function mouseover(d) {
            tip
            .style('left', `${d3.event.clientX + 15}` + 'px')
            .style('top', d3.event.clientY + 'px')
            .style('opacity', 0.98)
            .html('Hello Tip!')
            
        }

        function mousemove(d) {
            tip
            .style('left', `${d3.event.clientX + 15}` + 'px')
            .style('top', d3.event.clientY + 'px')
        }

        function mouseout(d) {
            tip
            .transition()
            .duration(200)
            .style('opacity', 0)
        }

        // Add tooltip
        const tip = d3.select('.tooltip');
        d3.selectAll('.bar')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);
    }
}