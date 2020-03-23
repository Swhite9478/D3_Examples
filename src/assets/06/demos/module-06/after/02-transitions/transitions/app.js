// Set up.
const svg = d3.select('svg');

// // Transition 1.
// svg
//   .append('circle')
//   .attr('cx', 50)
//   .attr('cy', 50)
//   .attr('r', 10)
//   .transition()
//   .attr('cx', 150);

// // Transition 2.
// svg
//   .append('circle')
//   .attr('cx', 50)
//   .attr('cy', 50)
//   .attr('r', 10)
//   .style('fill', 'royalblue')
//   .transition()
//   .duration(1000)
//   .ease(d3.easeBounce)
//   .attr('cx', 150)
//   .style('fill', 'tomato');

// Transition 3.
svg
  .selectAll('circle')
  .data([1, 2, 3, 4])
  .join('circle')
  .attr('cx', 50)
  .attr('cy', (d, i) => i * 25 + 12.5)
  .attr('r', 10)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 200)
  .attr('cx', 150)
  .remove();