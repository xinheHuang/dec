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
                     @change="(newGraph)=>{changeGraph(newGraph,graphs)}"
                     :default="graphs.options[0]"></drop-down>
          <span class="button-blue"
                @click="editGraph(graphs.selected)">
           点击编辑
          </span>
        </div>
      </div>
      <graph :edit-mode="false"
             :nodes="graphs.selected.nodes"
             :graph-info="{'name':entity,'author':graphs.selected.userId,'version':graphs.selected.name}" />
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
      changeGraph(newGraph, graphs) {
        console.log('graph change')
        console.log(graphs.selected)
        this.$set(graphs,'selected',newGraph.value);
        console.log(graphs.selected)
      },
      editGraph(graph) {
        console.log('graph edit',graph)
        this.$router.push({ name: 'graphEdit', params: { entity: graph.entity, graphData: graph } })
      }
    },
    mounted() {
      this.$http.get('/api/graphs')
        .then((graphs) => {
          graphs
          //              .filter(graph=>graph.type==1)
            .forEach((graph) => {
              const { entity } = graph
              let graphArr = this.graphMap[entity]
              if (!graphArr) {
                graphArr = []
                this.$set(this.graphMap, entity, graphArr)
              }
              graphArr.push(graph)
            })
          Object.values(this.graphMap)
            .forEach(graphs => {
              this.$set(graphs,'options',this.getOptions(graphs))
              this.$set(graphs,'selected',graphs[0])
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
