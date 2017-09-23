/**
* Created by xinhehuang on 9/23/17.
*/
<template>
  <svg class="barChart"
       :width="width"
       :height="height">

  </svg>
</template>
<script>
  import * as d3 from 'd3'

  const csv = require('./message_history.csv')
  console.log(csv)
  export default {
    props: {
      width: {
        type: Number,
        default: 960
      },
      height: {
        type: Number,
        default: 500
      },
      margin: {
        type: Object,
        default: () => ({ top: 20, right: 20, bottom: 30, left: 40 }),
      },
      data: {
        type: Array,
        required: true,
      }
    },
    mounted() {
      const { margin, width, height, data } = this
      const { top, right, bottom, left } = margin
      const svg = d3.select(this.$el) //svg 容器
      const chartWidth = width - left - right
      const chartHeight = height - top - bottom
      const x = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .padding(0.1)  //x scale
      const y = d3.scaleLinear()
        .rangeRound([chartHeight, 0])  //y scale

      const chart = svg.append('g')  //chart
        .attr('transform', `translate(${left},${top})`)

      //set domain
      x.domain(data.map(d => d.x))
      y.domain([0, d3.max(data, (d) => (d.y))])

      chart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(d3.axisBottom(x))

      chart.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y)
          .ticks(10, '%'))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency')

      chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.x))
        .attr('y', d => y(d.y))
        .attr('width', x.bandwidth())
        .attr('height', d => chartHeight - y(d.y))


      //create brush function redraw scatterplot with selection
      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.selectAll(".message")
          .attr("cx", function(d) { return x(d.sent_time); })
          .attr("cy", function(d) { return y(d.messages_sent_in_day); });
        focus.select(".x-axis").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
          .scale(width / (s[1] - s[0]))
          .translate(-s[0], 0));
      }

      //brush
      const brush = d3.brushX()
        .extent([[0, 0], [chartWidth, chartHeight]])
        .on("brush", brushed);
    }
  }
</script>
<style lang="less">
  .barChart {
    .bar {
      fill: steelblue;
    }

    .bar:hover {
      fill: brown;
    }

    .axis--x path {
      display: none;
    }
  }
</style>
