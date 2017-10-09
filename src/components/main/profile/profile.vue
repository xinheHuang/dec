/**
* Created by Xinhe on 2017/10/8.
*/
<template>
  <div>
    <div class="section">
      <div class="user-profile">
        <div style="display: flex">
          <img :src="profile.headPic"
               style="height: 100px;margin-right: 80px"/>
          <div class="info"
               style="display:flex;flex-direction: column;justify-content: center">
            <span class="name">{{profile.name}}</span>
            <span>{{profile.broker}}</span>
            <span>{{profile.position}}</span>
          </div>
        </div>
        <span class="edit">
          编辑个人资料
        </span>
      </div>
    </div>

    <div class="section">
      <content-nav :menus="menu"
                   @switchTab="switchTab"
                   :enableSearch="false"/>

      <component v-if="currentMenu" :is="currentMenu.key"></component>

    </div>
  </div>
</template>

<script>
  import contentNav from '../contentNav/contentNav.vue'
  import graph from './mygraphs/my-graphs.vue'
  import follow from './follow/follow.vue'
  export default {
    data() {
      return {
        profile: {},
        menu: [
          {
            key: 'follow',
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
    components: {
      contentNav,
      graph,
      follow
    }
  }
</script>

<style scoped
       lang="less">
  @blue: rgb(91, 155, 213);
  .section {
    background: white;
    border: 2px solid #e2dddd;
    margin: 20px;
    padding: 20px 60px;
  }

  .user-profile {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    .edit {
      border: solid 1px @blue;
      color: @blue;
      border-radius: 5px;
      padding: 5px 20px;
    }
    .info {
      .name {
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 20px;
      }
    }
  }

</style>
