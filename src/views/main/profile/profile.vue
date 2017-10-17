/**
* Created by Xinhe on 2017/10/8.
*/
<template>
  <div>
    <div class="section">
      <div class="user-profile">
        <div style="display: flex">
          <img :src="profile.headPic"
               style="height: 100px;margin-right: 80px" />
          <div class="info"
               style="display:flex;flex-direction: column;justify-content: center">
            <span class="name">{{profile.name}}</span>
            <span>{{profile.industry}}</span>
            <span>{{profile.broker}}</span>
            <span>{{profile.position}}</span>
          </div>
        </div>
        <span class="button-blue">
          编辑个人资料
        </span>
      </div>
    </div>

    <div class="section">
      <content-nav :menus="menu"
                   @switchTab="switchTab"
                   :enableSearch="false" />
      <keep-alive>
        <component v-if="currentMenu"
                   :is="currentMenu.key"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import contentNav from '../../../components/contentNav/contentNav.vue'
  import graph from './mygraphs/my-graphs.vue'
  import interest from './interest/interest.vue'
  import * as MutationTypes from 'Store/mutation-types'

  export default {
    data() {
      return {
        profile: {},
        menu: [
          {
            key: 'interest',
            name: '我的关注'
          },
          {
            key: 'graph',
            name: '我的图谱'
          }
        ],
        currentMenu: null,
      }
    },
    methods: {
      switchTab(menu) {
        if (this.currentMenu === menu) return
        this.currentMenu = menu
      }
    },
    mounted() {
      this.$http.get('/api/userInfo')
        .then((profile) => {
          this.profile = {
            ...profile,
            headPic: require('../../../assets/images/headPic.jpg')
          }
        })
    },
    updated() {

    },
    components: {
      contentNav,
      graph,
      interest
    }
  }
</script>

<style scoped
       lang="less">

  @import (reference) '../../../assets/styles/common';

  .user-profile {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    .info {
      .name {
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 20px;
      }
    }
  }

</style>
