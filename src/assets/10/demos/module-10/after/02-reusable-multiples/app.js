// Reusable bar chart module.
function barChart() {
  // Default configuration values.
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 200 - margin.right - margin.left;
  let height = 100 - margin.top - margin.bottom;
  let x = d => d[0];
  let y = d => d[1];

  // Chart building closure.
  function chart(selection) {
    selection.each(function(data, index) {
      // Standardize the data representation.
      const { key, values } = data[index];
      const standardData = values.map(d => [x(d), y(d)]);

      // Scales.
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(standardData, d => d[0])])
        .range([0, width]);

      const yScale = d3
        .scaleBand()
        .domain(standardData.map(d => d[1]))
        .range([0, height])
        .padding(0.15);

      // Build chart base.
      let svg = d3
        .select(this)
        .selectAll(`svg`)
        .data([standardData]);

      const svgEnter = svg.enter().append('svg');

      svgEnter.append('g').attr('class', 'bar-chart');

      svg = svg.merge(svgEnter);

      // Set chart base dimensions.
      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      const g = svg
        .select('g.bar-chart')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Join functions.
      function onEnter(enter) {
        const barsEnter = enter
          .append('g')
          .attr('class', 'bar')
          .attr('transform', d => `translate(0, ${yScale(d[1])})`);

        barsEnter
          .append('rect')
          .attr('width', d => xScale(d[0]))
          .attr('height', yScale.bandwidth());

        barsEnter
          .append('text')
          .text(d => d[1])
          .attr('y', yScale.bandwidth() / 2)
          .attr('dx', '0.35em')
          .attr('dy', '0.15em');

        return barsEnter;
      }

      function onUpdate(update) {
        const barsUpdate = update.attr(
          'transform',
          d => `translate(0, ${yScale(d[1])})`
        );

        barsUpdate
          .selectAll('rect')
          .attr('width', d => xScale(d[0]))
          .attr('height', yScale.bandwidth());

        barsUpdate
          .selectAll('text')
          .text(d => d[1])
          .attr('y', yScale.bandwidth() / 2)
          .attr('dx', '0.35em')
          .attr('dy', '0.15em');

        return barsUpdate;
      }

      // Draw visual.
      g.selectAll('.bar')
        .data(standardData, d => d[1])
        .join(onEnter, onUpdate, exit => exit.remove());
    });
  }

  // Add configuration getter and setter methods.
  chart.margin = function(_) {
    return arguments.length ? ((margin = _), chart) : margin;
  };

  chart.width = function(_) {
    return arguments.length ? ((width = _), chart) : width;
  };

  chart.height = function(_) {
    return arguments.length ? ((height = _), chart) : height;
  };

  chart.x = function(_) {
    return arguments.length ? ((x = _), chart) : x;
  };

  chart.y = function(_) {
    return arguments.length ? ((y = _), chart) : y;
  };

  return chart;
}

// Data loaded in `index.html` as `bigSix.js`

// Configure chart.
const bars = barChart()
  .x(d => d.revenue)
  .y(d => d.titleShort);

// Build chart.
d3.selectAll('.container')
  .datum(bigSix)
  .call(bars);
