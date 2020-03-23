import * as d3 from "d3";


export default function lollipop() {

    const svg = d3
        .select('body')
        .append('svg')
        .attr('width', 500)
        .attr('height', 500);

    const lolli = svg.append('g')
        .attr('transform', 'translate(100,100)');

    lolli
        .append('line')
        .attr('x2', 200)
        .style('stroke', 'black');

    lolli
        .append('circle')
        .attr('cx', 200)
        .attr('r', 3);

    lolli
        .append('text')
        .attr('y', -10)
        .text('Lolli');

}
