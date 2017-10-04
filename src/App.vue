<template>
  <div id="app">
    <nav-menu :navs="navs"
              :currentNav="currentNav"
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

    <node-modal v-if="showNodeModal"
                :node="node"
                @close="closeNodeModal()">
    </node-modal>
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
  import nodeModal from './components/graph/modal/modal.vue'
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
          },
          {
            key: 'graph',
            name: '思维导图'
          }
        ],
        showArticleModal: false,
        articleID: null,
        currentNav: null,
        showScheduleModal: false,
        schedule: null,
        showNodeModal: false,
        node: null

      }
    },
    methods: {
      changeNav(nav) {

        let route = {
          name: nav.key
        }
        if (nav.key === 'graph') {  //temp
          route = {
            ...route,
            params: {id: 1}
          }
        }
        this.$router.push(route)
        this.currentNav = nav.key
      },
      closeNodeModal(){
        this.showNodeModal = false
        EventBus.$emit('nodeModalClose',this.node);
      }
    },
    created() {
      console.log(this.$route)
      this.currentNav = this.$route.name
      EventBus.$on('articleModal', articleID => {
        this.showArticleModal = true
        this.articleID = articleID
      })

      EventBus.$on('scheduleModal', schedule => {
        console.log('schedule', schedule)
        this.showScheduleModal = true
        this.schedule = schedule
      })

      EventBus.$on('nodeModal', node => {
//        console.log('nodemodal')
        this.showNodeModal = true
        this.node = node
      })
    },

    components: {
      navMenu,
      fixedTools,
      news,
      market,
      calendar,
      articleModal,
      scheduleModal,
      nodeModal,
    },
  }
</script>

<style scoped>
  .content {
    /*background: #f6f6f6;*/
    width: 1280px;
    /*height: calc(100% - 40px);*/
    margin: 0 auto;
    margin-top: .6rem;
  }
</style>
