<template>
  <header class="header outer">
    <h1 class="header__logo"></h1>
    <nav class="header__nav">
      <ul>
        <li v-for="nav in navs"
            @click="switchNav(nav)"
            :key="nav.key"
            :class="{'selected':currentNav==nav.key}">{{nav.name}}
        </li>
      </ul>
    </nav>
    <div class="header__user"
         @click="showMenu">
      <div style="display: inline-block;">
        <p style="color: #ffd966;">{{ userInfo.star }}</p>
        <p>{{ userInfo.username }}</p>
      </div>
      <img :src="userInfo.headPic">
      <transition mode="out-in"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut">
        <div v-if="showUserMenu"
             class="user__menu">
          <ul>
            <a href="">
              <li><i class="iconfont icon-personal"></i>我的主页</li>
            </a>
            <a href="">
              <li><i class="iconfont icon-setting1"></i>设置</li>
            </a>
            <a href="">
              <li><i class="iconfont icon-power"></i>退出</li>
            </a>
          </ul>
        </div>
      </transition>
    </div>
    <div class="header__search">
      <i class="iconfont icon-magnifier"></i>
      <input type="text"
             name="header_nav"
             placeholder="搜索咨询、数据或研究">
    </div>
  </header>
</template>

<script>
  export default {
    props: {
      navs: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        showUserMenu: false,
        currentNav:'news',
        userInfo: {
          'userid': 1,
          'username': '小明',
          'star': 'AAAA',
          'headPic': require('../../assets/images/headPic.jpg')
        }
      }
    },
    methods: {
      showMenu() {
        this.showUserMenu = !this.showUserMenu
      },
      switchNav(nav){
        this.currentNav = nav.key
        this.$emit('switchNav', nav)
      }
    }
  }
</script>

<style scoped>

  .outer {zoom:1;}    /*==for IE6/7 Maxthon2==*/
  .outer :after {clear:both;content:'.';display:block;width: 0;height: 0;visibility:hidden;}   /*==for FF/chrome/opera/IE8==*/

  .header {
    background: #000;
    color: #fff;
    height: 2.5rem;
    box-shadow: 0 2px 5px #888888;
    padding-left: 9rem;
    padding-right: 2rem;
  }

  .header__logo {
    display: inline-block;
    width: 5rem;
    height: 100%;
    vertical-align: top;
    background-image: url('../../assets/images/logo.png');
    background-size: cover;
  }

  .header__nav {
    display: inline-block;
  }

  .header__search {
    display: inline-block;
  }

  .header__nav li {
    float: left;
    width: 5rem;
    font-size: 13px;
    line-height: 2.5rem;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
  }

  .header__nav li:hover {
    background: #fff;
    color: #000;
  }

  .header__nav .selected {
    background: #fff;
    color: #000;
  }

  .header__search {
    position: relative;
    float: right;
    margin-top: .3rem;
  }

  .header__search i {
    position: absolute;
    right: 9px;
    top: 3px;
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }

  .header__search input {
    width: 13rem;
    height: 1.5rem;
    padding-left: .5rem;
    padding-right: 1.3rem;
    border-radius: .2rem;
    border: none;
  }

  .header__user {
    display: inline-block;
    float: right;
    margin-left: 2rem;
    margin-top: .2rem;
    position: relative;
    cursor: pointer;
  }

  .header__user p {
    font-size: 12px;
    text-align: right;
  }

  .header__user img {
    width: 2.2rem;
    height: 2.2rem;
    float: right;
    margin-left: 1rem;
  }

  .user__menu {
    background: #fff;
    padding: 11px;
    line-height: 2.3;
    border-radius: 7px;
    color: #3a3a3a;
    position: absolute;
    overflow: hidden;
    right: -18px;
    width: 6rem;
    animation-duration: .3s !important;
  }

  .user__menu li {
    list-style-type: none;
    font-size: 15px;
  }

  .user__menu i {
    float: left;
    margin: 0 3px;
    color: #9eacc6;
  }
</style>
