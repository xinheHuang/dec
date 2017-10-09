/**
* Created by Xinhe on 2017/10/9.
*/
<template>
  <div>
    <div v-for="graph in graphs">
      {{graph.GID}}
    </div>
  </div>
</template>

<script>
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
    }
  }
</script>

<style>
</style>
