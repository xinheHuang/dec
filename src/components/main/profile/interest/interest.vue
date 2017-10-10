/**
* Created by Xinhe on 2017/10/9.
*/
<template>
  <div>
    <div class="interest">
      <span>已关注行业：</span>
      <span v-for="i in industry">

      </span>
    </div>

    <div class="interest">
      <span>已关注个股：</span>
      <span v-for="s in share">

      </span>
    </div>

    <div style="display: flex;align-items: center;justify-content: space-between">
    <search-bar :search="search" placeHolder="搜索行业或个股"/>
      <span class="button-blue">
          点击关注
        </span>
    </div>

  </div>
</template>

<script>
  import SearchBar from '../../searchBar/searchBar.vue'
  export default {
    data(){
      return {
        industry:[],
        share:[],
      }
    },
    methods:{
      search(key){
        //todo
      }
    },
    mounted(){
      this.$http.get('/api/interests',({industry,share})=>{
        this.industry=industry;
        this.share=share;
      })
    },
    components:{
      SearchBar
    }
  }
</script>

<style lang="less" scoped>
  .interest{
    display: flex;
    align-items: center;
    margin: 20px 0;
  }
</style>
