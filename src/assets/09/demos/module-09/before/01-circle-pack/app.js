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
function formatTicks(d) {
  return d3
    .format('.2~s')(d)
    .replace('M', ' mil')
    .replace('G', ' bil')
    .replace('T', ' tril');
}

// Main function.
function ready(movies) {
  // Set dimensions.
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = 680 - margin.right - margin.left;
  const height = 680 - margin.top - margin.bottom;

  // Get hierarchical data.

  // Circle pack layout.

  // Draw pack.
}

// Load data.
const moviesData = d3.csv('data/movies_relations.csv', type).then(res => {
  ready(res);
});
