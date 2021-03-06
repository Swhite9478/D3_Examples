import React, { Component } from 'react';
import * as d3 from 'd3';
import movieRelationsCsv from '../../assets/data/movies_relations.csv';
import './treemap.scss';

export default class TreeMap extends Component {
    constructor(props) {
        super(props);

        let marginObj = {
            margin: {
                top: props.marginTop ? props.marginTop : 40,
                right: props.marginRight ? props.marginRight : 40,
                bottom: props.marginBottom ? props.marginBottom : 40,
                left: props.marginLeft ? props.marginLeft : 40
            }
        }

        this.state = {
            margin: marginObj.margin,
            width: props.width ? props.width : 680 - marginObj.margin.right - marginObj.margin.left,
            height: props.height ? props.height : 680 - marginObj.margin.top - marginObj.margin.bottom
        }
    }

    componentDidMount() {
        this.loadData()
        .then(resp => this.ready.bind(this)(resp));
    }

    parseNA = string => string === 'NA' ? undefined : string;
    parseNumberNA = number => number === 'NA' ? null : +number;
    capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

    type = d => {
        return {
            nodeID: this.parseNumberNA(d.node_id),
            node: this.parseNA(d.node),
            parent: this.parseNA(d.parent),
            revenue: this.parseNumberNA(d.revenue),
            filmID: this.parseNumberNA(d.film_id)
        }
    }

    loadData = () => d3.csv(movieRelationsCsv, this.type.bind(this));

    ready = movies => {
        console.log(movies);
        
        function formatNumber(d) {
            return d3
                .format('.2~s')(d)
                .replace('M', 'mil')
                .replace('G', 'bil')
                .replace('T', 'tril');
        }

        // Stratify data into hierarchy
        const stratify = d3.stratify()
            .id(d => d.node)
            .parentId(d => d.parent);

        const filmHierarchy = stratify(movies);

        // Sum up revenue and sort nodes.
        filmHierarchy
            .sum(d => d.revenue)
            .sort((a,b) => d3.descending(a.height, b.height) || d3.descending(a.value, b.value));


        // Circle Pack Layout
        const treeMapLayout = d3.treemap()
            .size([this.state.width, this.state.height])
            .padding(5);

            treeMapLayout(filmHierarchy);

        // Flatten Nodes
        const nodes = filmHierarchy.descendants();

        // Draw Base
        const svg = d3
            .select('.treemap-container')
            .append('svg')
            .attr('width', this.state.width + this.state.margin.right + this.state.margin.left)
            .attr('height', this.state.height + this.state.margin.top + this.state.margin.bottom)
            .append('g')
            .attr('transform', `translate (${this.state.margin.left}, ${this.state.margin.top})`);

        // Draw Circle Pack
        svg 
            .selectAll('.node')
            .data(nodes)
            .join('rect')
            .attr('class', 'node')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('fill', 'forestgreen')
            .style('fill-opacity', 0.3)


    }
    

    render() {
        return <div className='treemap-container' />
    }
}