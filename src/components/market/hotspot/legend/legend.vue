/**
* Created by xinhehuang on 9/23/17.
*/
<template>

  <svg class="legend">  </svg>

</template>
<script>
  import * as d3 from 'd3'

  export default {
    props: {
      keys:{
        type:Array,
        required:true,
      }
    },
    methods: {
      renderChart() {
        const { keys } = this
        const svg = d3.select(this.$el) //svg 容器
        svg.selectAll('*')
          .remove()

        const color = d3.scaleOrdinal(d3.schemeCategory10)
        color.domain(keys)

        var legendRectSize = 18;
        var legendSpacing = 20;

        var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                          return 'translate(' + 0 + ',' + (i*(legendSpacing+legendRectSize)) + ')';
                        });
        legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)
              .style('fill', color)
              .style('stroke', color);

        legend.append('text')
              .attr('x', legendRectSize + legendSpacing)
              .attr('y', 16)
              .attr('font-size',18)
              .text(function(d) { return d; });
      }
    },
    watch: {
      keys() {
        this.renderChart()
      }
    },
    mounted() {

    }
  }
</script>
<style lang="less">
</style>
