import React, { Component } from 'react';
import * as d3 from 'd3';
import '../assets/css/fruits.css';

class Fruits extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: props.width ? props.width : 150,
            height: props.height ? props.height : 200,
            friends: {
                biff: ['Apples', 'Oranges', 'Lemons'],
                chip: ['Apples', 'Oranges'],
                kipper: ['Apples', 'Cherries', 'Peaches', 'Oranges']
            }
        }
    }

    componentDidMount() {
        this.setState({svg: this.drawSvg()});
    }

    // Update Handler
    update(dataset) {
        this.state.svg.selectAll('text')
            .data(dataset, d => d)
            .join(
                enter => {
                    enter
                    .append('text')
                    .text(d => d)
                    .attr('x', -100)
                    .attr('y', (d, i) => i * 30 + 50)
                    .style('font-weight', 'bold')
                    .style('fill', 'dodgerblue')
                    .transition()
                    .attr('x', 30)
                },

                update => {
                    update
                    .transition()
                    .style('font-weight', 'bold')
                    .style('fill', 'gray')
                    .attr('y', (d, i) => i * 30 + 50)
                },

                exit => {
                    exit
                    .transition()
                    .style('fill', 'red')
                    .attr('x', this.state.width)
                    .remove()
                }
            );
    }

    // Click Handler
    click(event) {
        const dataset = this.state.friends[event.target.value];
        this.update(dataset);
    }

    drawSvg()  {
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = this.state.width - margin.left - margin.right;
        const height = this.state.height - margin.top - margin.bottom;
        
        const svg = d3.select('.fruits-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`); 

        return svg;
    }

    render() {

       return (
            <div >
                <h3 className='Header'>Favorite Fruit List</h3>
                <div className='fruits-container' />          
                <div className='controls'>
                    <button className='biff' value="biff" onClick={this.click.bind(this)}>Biff</button>
                    <button className='chip' value="chip" onClick={this.click.bind(this)}>Chip</button>
                    <button className='kipper' value="kipper" onClick={this.click.bind(this)}>Kipper</button>
                </div>
            </div> 
       )
    }
}



export default Fruits;