<template>
  <div id="main" @click="closeMenu()">
    <nav-menu ></nav-menu>
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
  import navMenu from './nav/nav.vue'
  import fixedTools from './fixedTools/fixedTools.vue'
  import news from './news/news.vue'
  import calendar from './calendar/calendar.vue'
  import market from './market/market.vue'
  import articleModal from './market/modal/modal.vue'
  import scheduleModal from './calendar/modal/modal.vue'
  import nodeModal from './graph/modal/modal.vue'
  import EventBus from '../../eventBus'

  export default {
    data() {
      return {
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
      closeNodeModal(){
        this.showNodeModal = false
        EventBus.$emit('nodeModalClose',this.node);
      },
      closeMenu(){
        EventBus.$emit('menuClose');
      }
    },
    created() {
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
  #main{
    /*padding-bottom: 20px;*/
    height: 100%;
  }
  .content {
    max-width: 1280px;
    margin: 0 auto;
    margin-top: .6rem;
  }
</style>
