/**
* Created by Xinhe on 2017/10/9.
*/
<template>
  <div>
    <div class="graph"
         v-for="(graphs,entity) in graphMap">

      <div class="top">
        <div class="title">
          <h3>{{entity}}</h3>
        </div>
        <div class="op">
          <drop-down :options="graphs.options"
                     @change="changeGraph(graphs)"
                     :default="graphs.options[0]"></drop-down>
          <span class="button-blue" @click="editGraph(graphs.selected)">
           点击编辑
          </span>
        </div>
      </div>
      <graph :edit-mode="false"
             :nodes="graphs.selected.nodes"
             :graph-info="{'name':entity,'author':graphs.selected.uid,'version':graphs.selected.name}"/>
    </div>
  </div>
</template>

<script>
  import Graph from 'Component/graph/graph.vue'
  import DropDown from 'Component/dropDown/dropDown.vue'

  export default {
    data() {
      return {
        graphMap: {},
      }
    },
    methods: {
      getOptions(graphs) {
        return graphs.map((graph) => {
          return {
            value: graph,
            text: graph.name
          }
        })
      },
      changeGraphs(graphs) {
        console.log('graph change')
        return (newGraph) => {
          graphs.selected = newGraph.value
        }
      },
      editGraph(graph){
        this.$router.push({ name: 'graphEdit', params: { entity: graph.entity,graphData:graph }})
      }
    },
    mounted() {
      this.$http.get('/api/graph')
          .then((graphs) => {
            graphs.forEach((graph) => {
              const {entity} = graph
              let graphArr = this.graphMap[entity]
              if (graphArr == null) {
                graphArr = []
                this.$set(this.graphMap, entity, graphArr)
              }
              graphArr.push(graph)
            })
            Object.values(this.graphMap)
                  .forEach(graphs => {
                    graphs.options = this.getOptions(graphs)
                    graphs.selected = graphs[0]
                  })
          })
    },
    components: {
      Graph,
      DropDown
    }
  }
</script>

<style lang="less"
       scoped>
  .graph {
    margin: 20px 0;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        display: flex;
        flex-direction: column;
      }
      .op {
        display: flex;
        align-items: center;
        > * {
          margin-left: 20px;
        }
      }
    }
  }
</style>
