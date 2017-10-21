/**
* Created by Xinhe on 2017/10/20.
*/
<template>
  <div>
    <h2>{{data.title}}</h2>
    <div class="author">
      <span style="margin-right: 10px">{{data.source}}</span>
      <span>{{data.author}}</span>
    </div>
    <p>
      <span style="font-weight: bold">摘要：</span>
      <span>{{data.abstract}}</span>
      <span class="detail"><a target="_blank"
                              :href="data.link">[查看原文]</a></span>
    </p>
    <div class="icons">
           <span>
               <icon name="eye"></icon>
              <span>{{numFormat(data.num_read)}}</span>
          </span>
      <span>
              <icon name="heart"></icon>
               <span>{{numFormat(data.num_like)}}</span>
            </span>
      <span>
              <icon name="comment-o"></icon>
              <span> {{numFormat(data.num_comment)}}</span>
            </span>
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

  .icons{
    display: flex;
    margin-top: 20px;
    align-items: center;
    color: darkgray;
    >span{
      display: flex;
      align-items: center;
      >span{
        margin-left: 5px;
      }
      margin-right: 20px;
    }
  }

  .detail {
    margin-left: 10px;
    color: @blue;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
