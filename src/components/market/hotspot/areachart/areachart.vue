/**
* Created by xinhehuang on 9/23/17.
*/
<template>

  <svg class="aearChart"
       :width="width"
       :height="height">
  </svg>

</template>
<script>
  import * as d3 from 'd3'

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
      yLabel: {
        type: String,
        default: '',
      },
      margin: {
        type: Object,
        default: () => ({
          top: 30,
          right: 20,
          bottom: 30,
          left: 40
        }),
      },
      data: {
        type: Array,
        required: true,
      },
      keys:{
        type:Array,
        required:true
      }
    },
    methods: {
      renderChart() {
        const { margin, width, height, data, yLabel,keys } = this
        console.log(data);
        const { top, right, bottom, left } = margin
        const svg = d3.select(this.$el) //svg 容器
        svg.selectAll('*')
          .remove()
        const chartWidth = width - left - right
        const chartHeight = height - top - bottom
        const barWidth = chartWidth / 5
        const scaleWidth = chartWidth*2;
        const x = d3.scaleTime()
          .range([0, scaleWidth*2])

        const y = d3.scaleLinear()
          .rangeRound([chartHeight, 0])  //y scale

        const z = d3.scaleOrdinal(d3.schemeCategory10);
        const chart = svg.append('g')  //chart
          .attr('transform', `translate(${left},${top})`)

        const stack = d3.stack();

        const area = d3.area()
          .x(function(d, i) { return x(d.data.date); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); });


        //set domain
        x.domain(d3.extent(data,d => d.date))
        z.domain(keys)
        stack.keys(keys)


        const xAxis = d3.axisBottom(x)
        const yAxis = d3.axisLeft(y)

        const defs = svg.append("defs")

        defs.append("clipPath")
          .attr('id', 'my-clip-path')
          .append('rect')
          .attr('transform', `translate(0,-${top})`)
          .attr('width', chartWidth) //Set the width of the clipping area
          .attr('height', chartHeight + top)

        defs.append("clipPath")
          .attr('id', 'x-clip-path')
          .append('rect')
          .attr('width', chartWidth) //Set the width of the clipping area
          .attr('height', chartHeight + bottom) // set the height of the clipping area


        const layersGroup = chart.append('g')
        layersGroup.attr('clip-path', 'url(#my-clip-path)')


        const layers = layersGroup.selectAll(".layer")
          .data(stack(data))
          .enter().append("g")
          .attr("class", "layer");

        layers.append("path")
          .attr("class", "area")
          .style("fill", function(d) { return z(d.key); })
          .attr("d", area);

        layers.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })



        const xAxisGroup = chart.append("g")
          .attr('class', 'x-axis')
        xAxisGroup.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + chartHeight + ')')
          .call(xAxis)

        xAxisGroup.attr('clip-path', 'url(#x-clip-path)')

        chart.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .append('text')
          .attr('transform', 'rotate(0) ')
          .attr('y', -10)
          .attr('x', -yLabel.length * 12 + 10)
          .attr('text-anchor', 'start')
          .attr('fill', 'black')
          .attr('font-size', 12)
          .text(yLabel)


        svg.append("rect")
          .attr("class", "zoom")
          .attr("width", chartWidth)
          .attr("height", chartHeight + bottom)
          .attr("transform", `translate(${left},${top})`)
          .call(d3.zoom()
            .scaleExtent([1, 1])
            .translateExtent(
              [[0, 0], [scaleWidth, chartHeight]])
            .on("zoom", zoom))


        function zoom() {
          const transform = d3.event.transform
          layers.attr("transform",
            `translate(${transform.x},0)scale(${transform.k},1)`)
          chart.select(".x.axis")
            .attr("transform", `translate(${transform.x},${chartHeight})`)
            .call(xAxis.scale(
              x.rangeRound([0, scaleWidth * transform.k], .1 * transform.k)))
          chart.select(".y.axis")
            .call(yAxis)
        }

      }
    },
    watch: {
      data() {
        this.renderChart()
      }
    },
    mounted() {

    }
  }
</script>
<style lang="less">
  .aearChart {
    .axis.x path {
      /*display: none;*/
    }
    .zoom {
      cursor: move;
      fill: none;
      pointer-events: all;
    }

  }
</style>
