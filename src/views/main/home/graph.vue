/**
* Created by Xinhe on 2017/10/21.
*/
<template>
  <div>
    <div class="info">
      <div class="graph-info">
        <span class="entity">{{this.data.entity}}</span>
        <span class="author">{{this.data.UID}}</span>
      </div>
      <span class="detail">点击查看</span>
    </div>
    <graph :editMode="false" :nodes="nodes" :graphInfo="graphInfo"></graph>
  </div>
</template>

<script>
  import Graph from 'Component/graph/graph.vue'
  export default {
    props:{
      data:Object
    },
    computed:{
      nodes(){
        return this.data.graph_nodes.map(({NID, title,graph_node_relation})=>{
          const { GNID, FNID, direction } = graph_node_relation
          return {
            NID,
            title,
            GNID,
            FNID,
            direction
          }
        })
      },
      graphInfo(){
        const {UID,name,entity}=this.data
        return {
          author:UID,
          name:entity,
          version:name,
        }
      }
    },
    components:{
      Graph
    }
  }
</script>

<style lang="less" scoped>
  .info{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 5px;
    .graph-info{
      display: flex;
      flex-direction: column;
      .author{
        font-size:20px;
      }
      .entity{
        font-size: 26px;
        font-weight: bold;
      }

    }
    .detail{
      cursor: pointer;
    }
  }
</style>
