<!--第三列日期列表-->
<template>
  <div style="width:150px;padding: 16px 15px 0">
    <div class="key">
      <div>
        {{dateList.date}}
      </div>
    </div>
    <div class="items">
      <div v-for="item in dateList.recommends"
           @click="$emit('select',item.relation.name)"
           class="item"
           :class="{'selected':selected==item.relation.name}">
        {{item.relation.name}}
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import '../../../../assets/font/plus/style.css'

  export default {
    props: {
      dateList: {
        type: Object,
        required: true,
      },
      selected: {
        type: String,
      }
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .iconplus {
    padding: 10px;
    color: #6b6868;
    font-size: 20px
  }

  .key {
    min-height: 40px;
    text-align: center;
    background: #e2dddd;
    padding: 10px 0;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .key > * {

  }

  .key:hover {
    background: #2c8abf;
    color: white;
  }

  .item {
    border: 2px solid #e2dddd;
    margin-top: 10px;
    padding: 5px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }

  .item.selected {
    background: lightblue;
  }
</style>
