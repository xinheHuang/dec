/**
* Created by Xinhe on 2017/10/15.
*/
<template>
  <graph v-if="graph"
         :editMode="true"
         :nodes="graph.nodes || []"
         :graph-info="{'name':entity,'author':graph.uid,'version':graph.name}"/>
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
    components: {
      Graph
    },
    mounted() {
      if (!this.graphData) {
        this.$http.get(`/api/graph/draft?entity=${this.entity}`)
            .then(graph => {
              this.graph = graph
            })
      }
    }
  }
</script>

<style scoped
       lang="less">
</style>
