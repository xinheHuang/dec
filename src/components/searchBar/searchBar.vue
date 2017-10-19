/**
* Created by Xinhe on 2017/10/10.
*/
<template>
  <div class="search">
    <input type="text"
           class="search-input"
           v-model="searchKey"
           @keyup.enter="goSearch()"
           :placeholder="placeHolder">
    <div @click="clear()"
         v-show="isSearching">
      <icon name="times" style="color: red"/>
    </div>

    <div @click="goSearch()"
         class="search-img">
      <icon name="search"/>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons/search'
  import 'vue-awesome/icons/times'

  export default {
    props: {
      search: Function,
      placeHolder: String,

    },
    data() {
      return {
        searchKey: null,
        isSearching: false
      }
    },
    methods: {
      goSearch() {
        this.isSearching = !!this.searchKey;
        this.search(this.searchKey)
      },
      clear() {
        this.isSearching = false
        this.searchKey = null
        this.goSearch()
      }
    }
  }
</script>

<style lang="less"
       scoped>
  .search {
    border-radius: 5px;
    border: solid 1px black;
    padding: 5px ;
    align-items: center;
    display: flex;
    .search-input {
      flex-grow: 1;
      border: none;
      height: 20px;
      font-size: 14px;
      padding-left: 5px;
    }
    .search-img {
      margin-left: 5px;
      > * {
        height: 20px;
      }
      right: 10px;
      top: 5px;
    }
  }
</style>
