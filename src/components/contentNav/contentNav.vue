<template>
  <div>
    <div class="content-nav">
      <div class="navs">
        <!-- 推荐后期用json导入，v-for循环 -->
        <span v-for="menu in navMenus"
              @click="switchTab(menu)"
              :key="menu.key"
              :class="{'selected':selected.key==menu.key}">
          {{menu.name}}
        </span>
      </div>

      <search-bar v-if="enableSearch"
                  placeHolder="搜索快讯"
                  :search="searchInContent"></search-bar>

    </div>
    <content-nav
      class="sub-menu"
      v-if="selected && selected.subMenus && selected.subMenus.length>0"
      :menus="selected.subMenus"
      :rootKey="selected.key"
      @switchTab="onMenuChanged"
      :enableAll="true"

    ></content-nav>
  </div>
</template>

<script>
  import SearchBar from 'Component/searchBar/searchBar.vue'

  export default {
    name: 'content-nav',
    props: {
      menus: {
        type: Array,
        required: true,
      },
      enableSearch: Boolean,
      enableAll: Boolean,
      rootKey: Number,
      searchMethod: Function,
    },
    computed: {
      navMenus() {
        const navs = [...this.menus]
        if (this.enableAll) {
          navs.unshift({
            key: this.rootKey,
            name: '全部'
          })
        }
        return navs
      },

    },
    data() {
      return {
        selected: {},
      }
    },
    methods: {
      switchSubMenu(menu) {
        if (this.selectedSubMenu === menu.key) return
        this.selectedSubMenu = menu.key
        this.$emit('switchTab', menu)
      },

      switchTab(menu) {
        if (this.selected === menu) return
        this.selected = menu
        if (this.selected.subMenus && this.selected.subMenus.length > 0) return
        this.onMenuChanged(menu)
      },
      onMenuChanged(menu) {
        this.$emit('switchTab', menu)
      },
      searchInContent(searchStr = '') {
        const researchRes = this.searchMethod(searchStr)
        this.$emit('search', researchRes)
      },
    },
    mounted() {
      this.switchTab(this.navMenus[0])
    },
    watch: {
      navMenus(navMenus) {
        this.switchTab(navMenus[0])
      }
    },
    components: {
      SearchBar,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped
       lang="less">
  @import (reference) '../../assets/styles/common';

  .nav-selected {
    color: @blue;
    border-bottom: 3px solid @blue;
  }

  .content-nav {
    background-color: @white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .navs {
      display: flex;
      align-items: center;
      > * {
        padding: 10px 40px;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        &.selected, &:hover {
          .nav-selected
        }
      }
    }
  }

  .sub-menu {

  }

</style>
