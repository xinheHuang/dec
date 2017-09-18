<template>
  <div>
    <content-nav :menus="marketMenu"
                 :enableSearch='false'
                 @switchTab="tabChanged"></content-nav>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
  import contentNav from '../contentNav/contentNav.vue'
  import hotspot from  './hotspot/hotspot.vue'
  import '../../assets/font/angle/style.css'
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
      showDetails(item) {
        item.isShowDetails = !item.isShowDetails
      },
      tabChanged(menu) {
        this.showSearchBar = false
        this.currentTab = menu.key
      },
      moveOnWechat(item) {
        item.showWechatQRcode = true
      },
      moveOutWechat(item) {
        item.showWechatQRcode = false
      },
      onSearch(result) {
        console.log(result)
        this.showSearchBar = true
        this.searchStr = result.searchStr
        this.dataObj.searchResult = result.result
        this.currentTab = 'searchResult'
      }
    },
    created() {
      this.currentTime = new Date().toString()
        .split(' ')[4]
      setInterval(() => {
        this.currentTime = new Date().toString()
          .split(' ')[4]
      }, 1000)
    },
    components: {
      contentNav,
      hotspot
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .section {
    background: white;
    border: 2px solid #e2dddd;
    margin-top: 20px;
    padding: 20px 60px;
  }

  .section h2 {
    border-bottom: 1px solid #e2dddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 200px;
  }
  .conclusion li{
    font-size: 18px;
  }

</style>
