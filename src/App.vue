<template>
  <div id="app">
    <nav-menu :navs="navs" @switchNav="changeNav"></nav-menu>
    <div class="content">
      <component :is="currentView"></component>
    </div>
    <fixed-tools></fixed-tools>
    <footer class="footer"></footer>
  </div>
</template>

<script>
  import navMenu from './components/nav/nav.vue'
  import fixedTools from './components/fixedTools/fixedTools.vue'
  import news from './components/news/news.vue'
  import market from './components/market/market.vue'

  export default {
    data() {
      return {
        navs:[
          {
            key:'news',
            name:'新闻'
          },
          {
            key:'calendar',
            name:'日历'
          },
          {
            key:'market',
            name:'市场'
          }
        ],
        currentView: 'news',
      }
    },
    methods:{
      changeNav(nav){
        this.currentView=nav.key;
      }
    },
    components: {
      navMenu,
      fixedTools,
      news,
      market,
      calendar:news, //后续开发出日历页面需要将这里替换掉
    },
  }
</script>

<style scoped="">
  .content{
    /*background: #f6f6f6;*/
    width: 73rem;
    height: 45rem;
    margin: 0 auto;
    margin-top: .6rem;
  }
</style>
