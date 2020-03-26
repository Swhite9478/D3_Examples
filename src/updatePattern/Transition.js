import React from 'react'
import * as d3 from 'd3';

class Transition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: props.width ? props.width : 400,
            height: props.height ? props.height : 120
        }
    }

    componentDidMount() {
        const data = [1,2,3,4]
        this.drawCircles(data)
    }

    drawCircles(data)  {
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = this.state.width - margin.left - margin.right;
        const height = this.state.height - margin.top - margin.bottom;
        
        const svg = d3.select('.transition-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`); 
    
        // transition
        svg
            .selectAll('circle')
            .data([1,2,3,4])
            .join('circle')
            .attr('cx', margin.left) // start 
            .attr('cy', (d, i) => i * 25  + 12.5)
            .attr('r', 10)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .attr('cx', width - margin.right) // end
            .remove()
    }
    render() { return <div className='transition-container' />}
}

export default Transition;