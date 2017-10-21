<template>
  <div style="position: relative">
    <div class="header">

      <div class="logo">
        <img :src="require('../../assets/images/navLogo.png')" style="margin-right: 100px">
        <search-bar v-show="this.currentNav=='home'" :search="onSearch"></search-bar>
      </div>
      <div class="nav">
        <div class="menu">
          <div v-for="nav in navs"
               @click="switchNav(nav)"
               :key="nav.key"
               :class="{'selected':currentNav==nav.key}">

            <icon class='icon'
                  :name="nav.icon" />
            <span>
            {{nav.name}}
          </span>
          </div>
        </div>
        <div class="user">
          <div class="message">
            <icon class='icon'
                  name="bell" />
          </div>

          <img :src="userInfo.headPic"
               @click.stop="showUserMenu = !showUserMenu"
               class="profile" />

        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showUserMenu"
           class="user-menu">
        <div class="arrow"></div>
        <div class="menu"
             @click="showUserMenu=false">
          <div @click="goProfile()">
            <icon class='icon'
                  name="user"></icon>
            <span>我的主页</span>
          </div>
          <div @click="logout()">

            <icon class='icon'
                  name="power-off"></icon>
            <span>退出</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import EventBus from '@/eventBus'
  import { mapState } from 'vuex'
  import SearchBar from 'Component/searchBar/searchBar.vue'
  export default {

    data() {
      return {
        navs: [
          {
            key: 'home',
            name: '首页',
            icon: 'home'
          },
          {
            key: 'news',
            name: '资讯',
            icon: 'newspaper-o'
          },
          {
            key: 'calendar',
            name: '日历',
            icon: 'calendar'
          },
          {
            key: 'market',
            name: '热点',
            icon: 'hot',
          },
        ],
        currentNav: 'home',
        showUserMenu: false,

      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo
      })
    },
    methods: {
      onSearch(key){
        EventBus.$emit('homeSearch',key);
      },
      switchNav(nav) {
        if (nav.key == this.currentNav) return
        this.currentNav = nav.key
        let route = {
          name: nav.key
        }
        this.$router.push(route)
      },
      logout() {
        this.$http.post('/api/auth/logout')
          .then(() => {
            this.$router.push('/login')
          })
      },
      goProfile() {
        this.$router.push('/profile')
      }
    },
    components:{
      SearchBar
    },
    mounted() {
      EventBus.$on('menuClose', () => {
        this.showUserMenu = false
      })
    },
    created() {
      this.currentNav = this.$route.name
    }
  }
</script>

<style scoped
       lang="less">
  .header {
    padding-left: 100px;
    padding-right: 50px;
    display: flex;
    background: black;
    height: 50px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    img {
      height: 30px;
      width: auto;
    }
    .logo {
      flex-shrink: 1;
      display: flex;
      align-items: center;
    }
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .menu {
        display: flex;
        align-items: center;
        justify-content: space-around;
        > div {
          cursor: pointer;
          color: white;
          height: 50px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            margin-right: 10px;
            height: 25px;
            width: 25px;
          }
          &.selected {
            cursor: auto;
            color: black;
            background: #ecf0f5;
          }
        }
      }

      .user {
        display: flex;
        > * {
          cursor: pointer;
        }
        align-items: center;
        margin-left: 50px;
        .message {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            height: 25px;
            width: 25px;
            color: white;
          }
        }
        .profile {
          margin-left: 20px;
        }
      }
    }
  }

  .user-menu {
    z-index: 99999;
    display: flex;
    align-items: center;
    position: absolute;
    width: 120px;
    right: 2.5px;
    flex-direction: column;
    .arrow {
      margin-top: -10px;
      border: 10px solid transparent;
      border-bottom-color: white;
    }
    .menu {
      border-bottom: solid 2px rgb(230, 233, 240);
      border-right: solid 2px rgb(230, 233, 240);
      border-radius: 5px;
      background: white;
      > div {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px 10px;
        .icon {
          color: rgb(156, 171, 197)
        }
        span {
          margin-left: 10px;
        }
      }
    }
  }
</style>
