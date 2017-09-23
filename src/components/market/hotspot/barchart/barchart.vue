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
      yLabel:{
        type:String,
        default:'',
      },
      margin: {
        type: Object,
        default: () => ({
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        }),
      },
      data: {
        type: Array,
        required: true,
      }
    },
    methods:{
     renderChart(){
       const {margin, width, height, data,yLabel} = this
       const {top, right, bottom, left} = margin
       const svg = d3.select(this.$el) //svg 容器
       const chartWidth = width - left - right
       const chartHeight = height - top - bottom
       const barWidth = chartWidth / 5
       const scaleWidth = barWidth * data.length
       const x = d3.scaleBand()
                   .range([0, scaleWidth])
                   .padding(0.3)  //x scale

       const y = d3.scaleLinear()
                   .rangeRound([chartHeight, 0])  //y scale

       const chart = svg.append('g')  //chart
                        .attr('transform', `translate(${left},${top})`)


       //set domain
       x.domain(data.map(d => d.x))
       y.domain([0, d3.max(data, (d) => (d.y))])

       const xAxis = d3.axisBottom(x)
       const yAxis = d3.axisLeft(y)

       const defs = svg.append("defs")

       //Append a clipPath element to the defs element, and a Shape
       // to define the cliping area
       defs.append("clipPath")
           .attr('id', 'my-clip-path')
           .append('rect')
           .attr('transform', `translate(0,-${top})`)
           .attr('width', chartWidth) //Set the width of the clipping area
           .attr('height', chartHeight + top)
       // set the height of the clipping area

       //clip path for x axis
       defs.append("clipPath")
           .attr('id', 'x-clip-path')
           .append('rect')
           .attr('width', chartWidth) //Set the width of the clipping area
           .attr('height', chartHeight + bottom) // set the height of the clipping area


       const barsGroup = chart.append('g')
       barsGroup.attr('clip-path', 'url(#my-clip-path)')


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
            .attr('y', 0)
            .attr('x',6)
            .attr('text-anchor', 'start')
            .attr('fill','black')
            .attr('font-size',14)
            .text(yLabel)


       const bars = barsGroup.selectAll('.bar')
                             .data(data)
                             .enter()
                             .append('rect')
                             .attr('class', 'bar')
                             .attr('x', d => x(d.x))
                             .attr('y', d => y(d.y))
                             .attr('width', x.bandwidth())
                             .attr('height', d => {
                               return chartHeight - y(d.y)
                             })

       const labels = barsGroup.selectAll(".text")
                               .data(data)
                               .enter()
                               .append("text")
                               .attr("class", "label")
                               .attr("x",
                                     d => x(d.x) + x.bandwidth() / 2 - String(
                                       d.y).length / 2 * 10)
                               .attr("y", d => y(d.y) - 20)
                               .attr("dy", ".75em")
                               .text(d => d.y)

       svg.append("rect")
          .attr("class", "zoom")
          .attr("width", chartWidth)
          .attr("height", chartHeight + bottom)
          .attr("transform", `translate(${left},${top})`)
          .call(d3.zoom()
                  .scaleExtent([1, 1])
                  .translateExtent(
                    [[0, 0], [scaleWidth + barWidth, chartHeight]])
                  .on("zoom", zoom))

       function zoom() {
         const transform = d3.event.transform
         bars.attr("transform",
                   `translate(${transform.x},0)scale(${transform.k},1)`)
         labels.attr("transform",
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
      data(){
        this.renderChart();
      }
    },
    mounted() {

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
