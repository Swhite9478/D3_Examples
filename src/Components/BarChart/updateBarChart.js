import React, { Component } from 'react';
import * as d3 from 'd3';
import moviesCsv from '../../assets/data/movies.csv';

export default class UpdateBarChart extends Component {

    componentDidMount() {
        this.loadMovies();
    }

    type(d) {

    }

    ready(data) {
        
    }

    loadMovies() {
        d3.csv(moviesCsv, this.type.bind(this))
        .then(resp => this.ready.bind(this)(resp));
    }

    render() {
        return <div className='barChart' />
    }
}