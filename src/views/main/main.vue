<template>
  <div id="main" @click="closeMenu()">
    <nav-menu></nav-menu>
    <div class="content">
      <router-view></router-view>
    </div>
    <fixed-tools></fixed-tools>
    <footer class="footer"></footer>

    <component v-if="showModal" :is="modal" :modal-data="modalData"></component>
  </div>
</template>

<script>
  import EventBus from '../../eventBus'

  import navMenu from 'Component/nav/nav.vue'
  import fixedTools from 'Component/fixedTools/fixedTools.vue'

  import articleModal from 'View/main/market/modal/modal.vue'
  import scheduleModal from 'View/main/calendar/modal/modal.vue'
  import nodeModal from 'Component/graph/modal/modal.vue'


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
      })

      EventBus.$on('closeModal', (callback) => {
        this.showModal = false
        if (callback) {
          callback(this.modalData)
        }
      })
    },

    components: {
      navMenu,
      fixedTools,

      articleModal,
      scheduleModal,
      nodeModal,
    },
  }
</script>

<style lang="less">
  @import (reference) '../../assets/styles/common';

  #main {
    /*padding-bottom: 20px;*/
    height: 100%;
  }

  .content {
    max-width: 1280px;
    margin: 0 auto;
    margin-top: .6rem;
  }
</style>
