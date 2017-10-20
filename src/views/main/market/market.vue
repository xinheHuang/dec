<template>
  <div>
    <content-nav :menus="marketMenu"
                 :enableSearch='false'
                 @switchTab="tabChanged"></content-nav>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
  import contentNav from 'Component/contentNav/contentNav.vue'
  import hotspot from './hotspot/hotspot.vue'
  import recommend from './recommend/recommend.vue'

  export default {
    data() {
      return {
        marketMenu: [
          { key: 'hotspot', name: '关注热点' },
          { key: 'recommend', name: '核心推荐' },
        ],
        currentTab: 'hotspot',
      }
    },
    methods: {
      tabChanged(menu) {
        this.showSearchBar = false
        this.currentTab = menu.key
      },
    },
    components: {
      contentNav,
      hotspot,
      recommend,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
