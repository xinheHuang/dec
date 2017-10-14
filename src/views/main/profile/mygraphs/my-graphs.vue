/**
* Created by Xinhe on 2017/10/9.
*/
<template>
  <div>
    <div v-for="(graph,index) in graphs">
      <graph :edit-mode="false" :nodes="graph.nodes"
             :graph-info="{'name':graph.entity,'author':graph.author,'version':index}"/>
    </div>
  </div>
</template>

<script>
  import Graph from 'Component/graph/graph.vue'
  export default {
    data(){
      return {
        graphs:[],
      }
    },
    mounted(){
      this.$http.get('/api/graph').then((graphs)=>{
        this.graphs=graphs;
        console.log(graphs);
      })
    },
    components:{
      Graph
    }
  }
</script>

<style>
</style>
