/**
* Created by Xinhe on 2017/10/15.
*/
<template>
  <graph v-if="graph"
         :editMode="true"
         :nodes="graph.nodes || []"
         :graph-info="{'name':entity,'author':graph.uid,'version':graph.name}"
         :onSaveDraft="saveDraft"
         :onSaveFinal="saveFinal"
  />
</template>

<script>
  import Graph from 'Component/graph/graph.vue'
  import EventBus from '@/eventBus'

  export default {
    props: {
      entity: String,
      graphData: Object,
    },
    data() {
      return {
        graph: this.graphData
      }
    },
    methods: {
      saveDraft(nodes) {
        return this.$http.post(`/api/graph/draft?entity=${this.entity}`, {
          nodes,
        })
          .then((res) => {
            this.getGraphData()
          })
      },
      saveFinal(nodes, name) {
        return this.$http.post(`/api/graph/final`,{
          entity:this.entity,
          name,
          nodes,
        })
      },
      getGraphData() {
        this.$http.get(`/api/graph/draft?entity=${this.entity}`)
          .then(graph => {
            this.graph = graph
          })
      }
    },
    components: {
      Graph
    },
    mounted() {
      if (!this.graphData) {
        this.getGraphData()
      }
    }
  }
</script>

<style scoped
       lang="less">
</style>
