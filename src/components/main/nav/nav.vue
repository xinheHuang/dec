<template>
  <div style="position: relative">
    <div class="header">
      <div class="logo">
        <img :src="require('../../../assets/images/navLogo.png')">
      </div>
      <div class="nav">
        <div class="menu">
          <div v-for="nav in navs"
               @click="switchNav(nav)"
               :key="nav.key"
               :class="{'selected':currentNav==nav.key}">

            <icon class='icon'
                  :name="nav.icon"/>
            <span>
            {{nav.name}}
          </span>
          </div>
        </div>
        <div class="user">
          <div class="message">
            <icon class='icon'
                  name="bell"/>
          </div>

          <img :src="userInfo.headPic"
               @click.stop="showUserMenu = !showUserMenu"
               class="profile"/>

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
  import 'vue-awesome/icons/cog'
  import 'vue-awesome/icons/user'
  import 'vue-awesome/icons/power-off'
  import 'vue-awesome/icons/home'
  import 'vue-awesome/icons/newspaper-o'
  import 'vue-awesome/icons/calendar'
  import 'vue-awesome/icons/bell'
  import Icon from 'vue-awesome/components/Icon.vue'
  import EventBus from '../../../eventBus'

  Icon.register(
    {
      hot: {
        width: 32,
        height: 32,
        d: "M10.031 32c-2.133-4.438-0.997-6.981 0.642-9.376 1.795-2.624 2.258-5.221 2.258-5.221s1.411 1.834 0.847 4.703c2.493-2.775 2.963-7.196 2.587-8.889 5.635 3.938 8.043 12.464 4.798 18.783 17.262-9.767 4.294-24.38 2.036-26.027 0.753 1.646 0.895 4.433-0.625 5.785-2.573-9.759-8.937-11.759-8.937-11.759 0.753 5.033-2.728 10.536-6.084 14.648-0.118-2.007-0.243-3.392-1.298-5.312-0.237 3.646-3.023 6.617-3.777 10.27-1.022 4.946 0.765 8.568 7.555 12.394z"
      }
    }
  )

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
//        {
//          key: 'graph',
//          name: '思维导图'
//        }
        ],
        currentNav: 'home',
        showUserMenu: false,
        userInfo: {},
      }
    },
    methods: {
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
    mounted() {
      this.$http.get('/api/userInfo')
          .then((info) => {
            this.userInfo = {
              ...info,
              headPic: require('../../../assets/images/headPic.jpg')
            }
          })
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }

  /*.outer {*/
  /*zoom: 1;*/
  /*}*/

  /*!*==for IE6/7 Maxthon2==*!*/
  /*.outer :after {*/
  /*clear: both;*/
  /*content: '.';*/
  /*display: block;*/
  /*width: 0;*/
  /*height: 0;*/
  /*visibility: hidden;*/
  /*}*/

  /*!*==for FF/chrome/opera/IE8==*!*/

  /*.header {*/
  /*background: #000;*/
  /*color: #fff;*/
  /*height: 40px;*/
  /*box-shadow: 0 2px 5px #888888;*/
  /*padding-left: 9rem;*/
  /*padding-right: 2rem;*/
  /*}*/

  /*.header__logo {*/
  /*display: inline-block;*/
  /*width: 5rem;*/
  /*height: 100%;*/
  /*vertical-align: top;*/
  /*background-image: url('../../../assets/images/logo.png');*/
  /*background-size: cover;*/
  /*}*/

  /*.header__nav {*/
  /*display: inline-block;*/
  /*}*/

  /*.header__search {*/
  /*display: inline-block;*/
  /*}*/

  /*.header__nav li {*/
  /*float: left;*/
  /*width: 5rem;*/
  /*font-size: 13px;*/
  /*line-height: 2.5rem;*/
  /*text-align: center;*/
  /*cursor: pointer;*/
  /*font-size: 14px;*/
  /*}*/

  /*.header__nav li:hover {*/
  /*background: #fff;*/
  /*color: #000;*/
  /*}*/

  /*.header__nav .selected {*/
  /*background: #fff;*/
  /*color: #000;*/
  /*}*/

  /*.header__search {*/
  /*position: relative;*/
  /*float: right;*/
  /*margin-top: .3rem;*/
  /*}*/

  /*.header__search i {*/
  /*position: absolute;*/
  /*right: 9px;*/
  /*top: 3px;*/
  /*font-size: 16px;*/
  /*color: #000;*/
  /*font-weight: bold;*/
  /*}*/

  /*.header__search input {*/
  /*width: 13rem;*/
  /*height: 1.5rem;*/
  /*padding-left: .5rem;*/
  /*padding-right: 1.3rem;*/
  /*border-radius: .2rem;*/
  /*border: none;*/
  /*}*/

  /*.header__user {*/
  /*display: inline-block;*/
  /*float: right;*/
  /*margin-left: 2rem;*/
  /*margin-top: .2rem;*/
  /*position: relative;*/
  /*cursor: pointer;*/
  /*}*/

  /*.header__user p {*/
  /*font-size: 12px;*/
  /*text-align: right;*/
  /*}*/

  /*.header__user img {*/
  /*width: 2.2rem;*/
  /*height: 2.2rem;*/
  /*float: right;*/
  /*margin-left: 1rem;*/
  /*}*/

  /*.user__menu {*/
  /*background: #fff;*/
  /*padding: 11px;*/
  /*line-height: 2.3;*/
  /*border-radius: 7px;*/
  /*color: #3a3a3a;*/
  /*position: absolute;*/
  /*overflow: hidden;*/
  /*right: -18px;*/
  /*width: 6rem;*/
  /*animation-duration: .3s !important;*/
  /*}*/

  /*.user__menu li {*/
  /*list-style-type: none;*/
  /*display: flex;*/
  /*font-size: 15px;*/
  /*align-items: center;*/
  /*}*/

  /*.user__menu .icon {*/
  /*margin: 0 5px;*/
  /*height: 15px;*/
  /*color: #9eacc6;*/
  /*}*/
</style>
