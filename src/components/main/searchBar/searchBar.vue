/**
* Created by Xinhe on 2017/10/10.
*/
<template>
  <div class="search">
    <input type="text"
           class="search-input"
           v-model="searchIndicatorKey"
           @keyup.enter="search(searchIndicatorKey)"
           :placeholder="placeHolder">
    <div @click="search(searchIndicatorKey)"
         class="search-img">
      <icon name="search"/>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons/search'
  export default {
    props:{
      search:Function,
      placeHolder:String,
    },
    data(){
      return {
        searchIndicatorKey:null,
      }
    }
  }
</script>

<style lang="less" scoped>
  .search {
    position: relative;
    .search-input {
      /*flex-grow: 1;*/
      /*width: 100%;*/
      border-radius: 5px;
      border: solid 1px black;
      height: 20px;
      font-size: 14px;
      padding: 5px 10px;
    }
    .search-img {
      position: absolute;
      > * {
        height: 20px;
      }
      right: 10px;
      top: 5px;
    }
  }
</style>
