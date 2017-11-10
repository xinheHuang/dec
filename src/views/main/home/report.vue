/**
* Created by Xinhe on 2017/10/20.
*/
<template>
  <div>
    <h2>{{data.title}}</h2>
    <div class="author">
      <span style="margin-right: 10px">{{data.REPORT && data.REPORT.title}}</span>
      <!--<span>{{data.author}}</span>-->
    </div>
    <div class="content">
      <img class="graph" :src="imgSrc" @click="openImage()"/>
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
    computed:{
      imgSrc(){
        return `http://valuesimplex.com/dev/wash_manual/report_images/${this.data.fileID}_${this.data.sequence}.png`
      }
    },
    methods:{
      openReport() {
        EventBus.$emit('openModal', 'report-modal', `http://valuesimplex.com/dev/spider/kanyanbao_reports/${this.data.fileID}.pdf`)
      },
      openImage() {
        EventBus.$emit('openModal', 'image-modal', this.imgSrc)
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
      width: 500px;
      height: auto;
      text-align: center;
      cursor: pointer;
    }
    .comment{
      margin-left: 20px;
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
