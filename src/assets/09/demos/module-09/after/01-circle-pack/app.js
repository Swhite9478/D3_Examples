// Type conversion.
const parseStringNA = string => (string === 'NA' ? undefined : string);
const parseNumberNA = number => (number === 'NA' ? null : +number);
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

function type(d) {
  return {
    nodeID: +d.node_id,
    node: parseStringNA(d.node),
    parent: parseStringNA(d.parent),
    revenue: parseNumberNA(d.revenue),
    filmID: parseNumberNA(d.film_id),
  };
}

// Drawing utilities.
function formatNumber(d) {
  return d3
    .format('.2~s')(d)
    .replace('M', ' mil')
    .replace('G', ' bil')
    .replace('T', ' tril');
}

// Main function.
function ready(movies) {
  // Interactivity.
  function mouseover() {
    const nodeData = d3.select(this).data()[0].data;
    const tip = d3.select('.tooltip');
    tip
      .style('top', `${d3.event.clientY + 5}px`)
      .style('left', `${d3.event.clientX + 10}px`)
      .transition()
      .style('opacity', 0.9);

    tip.select('.film').html(nodeData.node);
    tip.select('.studio').html(capitalize(nodeData.parent));
    tip.select('.revenue').html(formatNumber(nodeData.revenue));
  }

  function mousemove() {
    d3.select('.tooltip')
      .style('top', `${d3.event.clientY + 5}px`)
      .style('left', `${d3.event.clientX + 10}px`);
  }

  function mouseout() {
    d3.select('.tooltip')
      .transition()
      .style('opacity', 0);
  }

  // Set dimensions.
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = 680 - margin.right - margin.left;
  const height = 680 - margin.top - margin.bottom;

  // Stratify data into hierarchy.
  const stratify = d3
    .stratify()
    .id(d => d.node)
    .parentId(d => d.parent);

  const filmHierarchy = stratify(movies);

  // Sum and sort data.
  filmHierarchy.sum(d => d.revenue).sort((a, b) => b.value - a.value);

  // Circle pack layout.
  const packLayout = d3
    .pack()
    .size([width, height])
    .padding(10);

  packLayout(filmHierarchy);

  // Flatten the nodes for the visualisation.
  const nodes = filmHierarchy.descendants();

  // Draw base.
  const svg = d3
    .select('.circle-pack-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const studios = ['disney', 'fox', 'paramount', 'sony', 'universal', 'warner'];
  const color = d3
    .scaleOrdinal()
    .domain(studios)
    .range([
      'coral',
      'deepskyblue',
      'lightseagreen',
      'darkmagenta',
      'orchid',
      'yellow',
    ]);

  // Draw pack.
  svg
    .selectAll('.node')
    .data(nodes)
    .join('circle')
    .attr('class', 'node')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .style('fill', d => (d.depth === 2 ? color(d.data.parent) : ''))
    .style('fill-opacity', d => (d.children ? 0.06 : 0.7))
    .style('stroke-width', d => (d.depth === 1 ? 1 : 0))
    .style('stroke', '#ccc')
    .filter(d => !d.children)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
}

// Load data.
const moviesData = d3.csv('data/movies_relations.csv', type).then(res => {
  ready(res);
});
