/**
* Created by Xinhe on 2017/10/20.
*/
<template>
  <div>
    <h2>{{data.title}}</h2>
    <div class="author">
      <span style="margin-right: 10px">{{data.report.title}}</span>
      <!--<span>{{data.author}}</span>-->
    </div>
    <div class="content">
      <div class="graph">
        graph here
      </div>
      <div class="comment">
        <p>
          <span style="font-weight: bold">简评：</span>
          <span>{{data.comment}}</span>
          <span class="detail" @click="openReport()">
                                  [查看原文]></span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import EventBus from '@/eventBus'
  export default {
    props: {
      data: Object
    },
    methods:{
      openReport() {
        EventBus.$emit('openModal', 'report-modal', `http://valuesimplex.com/dev/spider/kanyanbao_reports/${this.data.fileID}.pdf`)
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
      width: 600px;
      height: 300px;
      text-align: center;
    }
    .comment{
      flex-grow: 1;
    }
  }

  .detail {
    margin-left: 10px;
    color: @blue;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
