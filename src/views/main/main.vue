<template>
  <div id="main"
       @click="closeMenu()">
    <nav-menu></nav-menu>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <fixed-tools></fixed-tools>
    <footer class="footer"></footer>

    <component v-if="showModal"
               :is="modal"
               :modal-data="modalData"></component>
  </div>
</template>

<script>
  import EventBus from '@/eventBus'

  import navMenu from 'Component/nav/nav.vue'
  import fixedTools from 'Component/fixedTools/fixedTools.vue'

  import articleModal from 'View/main/market/modal/modal.vue'
  import scheduleModal from 'View/main/calendar/modal/modal.vue'
  import reportModal from 'View/main/home/report-modal.vue'
  import nodeModal from 'Component/graph/modal/modal.vue'
  import imageModal from 'View/main/home/image-modal.vue'
  import * as MutationTypes from 'Store/mutation-types'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        showModal: false,
        modalData: null,
        modal: null,
      }
    },
    methods: {
      closeMenu() {
        EventBus.$emit('menuClose')
      }
    },
    created() {
      EventBus.$on('openModal', (modalName, data) => {
        this.modal = modalName
        this.showModal = true
        this.modalData = data
        $('body').css('overflow','hidden')
      })

      EventBus.$on('closeModal', (callback) => {
        this.showModal = false
        $('body').css('overflow','visible')
        if (callback) {
          callback(this.modalData)
        }
      })
      this.$http.get('/api/userInfo')
          .then((info) => {
            const userInfo = {
              ...info,
              headPic: require('../../assets/images/headPic.jpg')
            }
            this.$store.commit(MutationTypes.SET_USERINFO, userInfo)
          })
    },

    components: {
      navMenu,
      fixedTools,

      articleModal,
      scheduleModal,
      nodeModal,
      reportModal,
      imageModal,
    },
  }
</script>

<style lang="less"
       scoped="">
  @import (reference) '../../assets/styles/common';

  #main {
    /*padding-bottom: 20px;*/
    height: 100%;
  }

  .content {
    max-width: 1280px;
    margin: 0 auto;
  }
</style>
