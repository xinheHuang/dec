<template>
  <div id="app">
    <nav-menu :navs="navs"
              @switchNav="changeNav"></nav-menu>
    <div class="content">
      <router-view></router-view>
    </div>
    <fixed-tools></fixed-tools>
    <footer class="footer"></footer>
    <article-modal v-if="showArticleModal"
                   :articleID="articleID"
                   @close="showArticleModal = false">
    </article-modal>
    <schedule-modal v-if="showScheduleModal"
                   :schedule="schedule"
                   @close="showScheduleModal = false">
    </schedule-modal>
  </div>
</template>

<script>
  import navMenu from './components/nav/nav.vue'
  import fixedTools from './components/fixedTools/fixedTools.vue'
  import news from './components/news/news.vue'
  import calendar from './components/calendar/calendar.vue'
  import market from './components/market/market.vue'
  import articleModal from './components/market/modal/modal.vue'
  import scheduleModal from './components/calendar/modal/modal.vue'
  import EventBus from './eventBus'

  export default {
    data() {
      return {
        navs: [
          {
            key: 'news',
            name: '新闻'
          },
          {
            key: 'calendar',
            name: '日历'
          },
          {
            key: 'market',
            name: '市场'
          }
        ],
        showArticleModal: false,
        articleID:null,

        showScheduleModal: false,
        schedule:null

      }
    },
    methods: {
      changeNav(nav) {
        this.$router.push({name:nav.key})
      }
    },
    created() {
      EventBus.$on('articleModal', articleID => {
        this.showArticleModal = true
        this.articleID=articleID;
      })

      EventBus.$on('scheduleModal', schedule => {
        console.log('schedule',schedule)
        this.showScheduleModal = true
        this.schedule=schedule;
      })
    },
    components: {
      navMenu,
      fixedTools,
      news,
      market,
      calendar,
      articleModal,
      scheduleModal
    },
  }
</script>

<style scoped="">
  .content {
    /*background: #f6f6f6;*/
    width: 1280px;
    height: 45rem;
    margin: 0 auto;
    margin-top: .6rem;
  }
</style>
