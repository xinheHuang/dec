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
            <template v-if="!isEdit">
              <span class="name">{{profile.name}}</span>
              <span>{{profile.broker}}</span>
              <span>{{profile.position}}</span>
            </template>
            <template v-else>
              <input class="name"
                     v-model="tempProfile.name" />
              <input v-model="tempProfile.broker" />
              <input v-model="tempProfile.position" />
            </template>
          </div>
        </div>
        <span class="button-blue"
              v-if="!isEdit"
              @click="goEdit()">
          编辑个人资料
        </span>
        <div v-else
             style="display: flex">
          <span class="button-blue"
                style="margin-right: 10px"
                @click="confirmEdit()">
            确认
          </span>
          <span class="button-gray"
                @click="cancelEdit()">
            取消
          </span>
        </div>
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
  import contentNav from 'Component/contentNav/contentNav.vue'
  import graph from './mygraphs/my-graphs.vue'
  import interest from './interest/interest.vue'
  import * as MutationTypes from 'Store/mutation-types'
  import { mapState, mapMutations } from 'vuex'

  export default {
    data() {
      return {
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
        isEdit: false,
        tempProfile: {},
      }
    },
    computed: {
      ...mapState({
        profile: state => state.user.userInfo
      }),
    },
    methods: {
      goEdit() {
        this.isEdit = true
        this.tempProfile = {
          ...this.profile
        }
      },
      cancelEdit() {
        this.isEdit = false
        this.tempProfile = {}
      },
      confirmEdit() {
        this.$http.post('/api/userInfo', {
          userInfo: this.tempProfile
        })
          .then(() => {
            this.$store.commit(MutationTypes.SET_USERINFO,this.tempProfile)
            this.cancelEdit()
          })
      },
      switchTab(menu) {
        if (this.currentMenu === menu) return
        this.currentMenu = menu
      }
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
      input {
        .button-blue;
        width: 200px;
        text-align: left;
        color: black;
      }
    }
  }

</style>
