/**
* Created by Xinhe on 2017/10/20.
*/
<template>
  <div>
    <h2>{{data.indicator_info.name}}</h2>
    <div class="author">
      <span style="margin-right: 10px">{{data.indicator_info.source}}</span>
      <!--<span>{{data.author}}</span>-->
    </div>
    <div class="content">
      <div class="graph">
        graph here
      </div>
      <div class="comment">
        {{data.comment}}
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      data: Object
    },
    methods:{
      numFormat(num) {
        return num == -1 ? '-' : num
      },
    }
  }
</script>

<style lang="less"
       scoped>
  @import (reference) '../../../assets/styles/common';

  .author {
    margin: 20px 0;
    display: flex;
    align-items: center;
  }
  .content{
    display: flex;
    align-items: flex-start;
    .graph{
      flex-shrink: 0;
      width: 500px;
      height: 300px;
      text-align: center;
    }
    .comment{
      flex-grow: 1;
    }
  }
</style>
