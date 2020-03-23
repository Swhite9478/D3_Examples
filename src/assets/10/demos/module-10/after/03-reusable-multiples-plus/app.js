// Reusable bar chart module.
function barChart() {
  // Default configuration values.
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 200 - margin.right - margin.left;
  let height = 100 - margin.top - margin.bottom;
  let x = d => d[0];
  let y = d => d[1];
  let xMax = null;
  let textInside = '#10223d';
  let textOutside = '#eee';

  // Utillitis.
  function textIsInside(d, scale) {
    return d[1].length * 6 < scale(d[0]);
  }

  function isAtEnd(d, scale) {
    return scale(d[0]) > width / 2;
  }

  function formatNumber(d) {
    return d3
      .format('.2~s')(d)
      .replace('M', ' mil')
      .replace('G', ' bil')
      .replace('T', ' tril');
  }

  function textLength(d) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '15px Arial';
    return Math.ceil(ctx.measureText(d).width);
  }

  // Chart building closure.
  function chart(selection) {
    selection.each(function(data, index) {
      // Standardize data representation.
      const { key, values: specificData } = data[index];
      const standardData = specificData.map(d => [x(d), y(d)]);

      // Scales.
      const xScale = d3
        .scaleLinear()
        .domain([0, xMax || d3.max(standardData, d => d[0])])
        .range([0, width]);

      const yScale = d3
        .scaleBand()
        .domain(standardData.map(d => d[1]))
        .range([0, height])
        .padding(0.15);

      // Build chart base.
      let svg = d3
        .select(this)
        .selectAll('svg')
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
          .attr('class', 'category')
          .attr('x', d => (textIsInside(d, xScale) ? 0 : xScale(d[0])))
          .attr('y', yScale.bandwidth() / 2)
          .attr('dx', '0.35em')
          .attr('dy', '0.15em')
          .style(
            'fill',
            d => (textIsInside(d, xScale) ? textInside : textOutside)
          );

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
          .attr('x', d => (textIsInside(d, xScale) ? 0 : xScale(d[0])))
          .attr('y', yScale.bandwidth() / 2)
          .attr('dx', '0.35em')
          .attr('dy', '0.15em')
          .style(
            'fill',
            d => (textIsInside(d, xScale) ? textInside : textOutside)
          );

        return barsUpdate;
      }

      // Draw visual.
      const bars = g
        .selectAll('.bar')
        .data(standardData, d => d[1])
        .join(onEnter, onUpdate, exit => exit.remove());

      // Bar value.
      bars
        .append('text')
        .text(d => formatNumber(d[0]))
        .attr('class', 'value')
        .attr(
          'x',
          d =>
            textIsInside(d, xScale)
              ? xScale(d[0])
              : xScale(d[0]) + textLength(d[1])
        )
        .attr('y', yScale.bandwidth() / 2)
        .style('fill', 'pink')
        .attr('text-anchor', d => (isAtEnd(d, xScale) ? 'end' : 'start'))
        .attr('dy', '0.15em')
        .attr('dx', d => (isAtEnd(d, xScale) ? '-0.5em' : '1em'))
        .style('fill', d => (isAtEnd(d, xScale) ? textInside : textOutside))
        .style('fill-opacity', 0);

      // Chart label.
      g.append('text')
        .attr('class', 'label')
        .text(key)
        .attr('x', width - margin.right)
        .attr('y', height - margin.bottom)
        .style('text-anchor', 'end');

      // Interaction.
      function mouseover() {
        d3.select(this)
          .select('.value')
          .transition()
          .style('fill-opacity', 1);
      }
      function mouseout() {
        d3.select(this)
          .select('.value')
          .transition()
          .style('fill-opacity', 0);
      }
      bars.on('mouseover', mouseover).on('mouseout', mouseout);
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

  chart.xMax = function(_) {
    return arguments.length ? ((xMax = _), chart) : xMax;
  };

  chart.textInside = function(_) {
    return arguments.length ? ((textInside = _), chart) : textInside;
  };

  chart.textOutside = function(_) {
    return arguments.length ? ((textOutside = _), chart) : textOutside;
  };

  return chart;
}

d3.select('.header').style('width', '400px');

// Data loaded in in `index.html` as `bigSix.js`.

// Get maximum revenue value.
const revenue = bigSix
  .map(d => d.values)
  .flat()
  .map(d => +d.revenue);
const xMax = d3.max(revenue);

// Configure chart
const bars = barChart()
  .x(d => +d.revenue)
  .y(d => d.titleShort)
  .width(400)
  .xMax(xMax);

// Build chart.
d3.selectAll('.container')
  .datum(bigSix)
  .call(bars);
