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
      :allNames="this.allNames?this.allNames.slice(1):null"
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
      allNames:Array,
    },
    computed: {
      navMenus() {
        const navs = [...this.menus]
        if (this.enableAll) {
          navs.unshift({
            key: this.rootKey,
            name: this.allNames?this.allNames[0]:'全部',
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

      switchTab(menu) {
        if (this.selected.key === menu.key) return
        this.selected = menu
        if (this.selected.subMenus && this.selected.subMenus.length > 0) return
        this.onMenuChanged(menu)
      },
      onMenuChanged(menu) {
        this.$emit('switchTab', menu)
      },
      async searchInContent(searchStr = '') {
        const researchRes = await this.searchMethod(searchStr)
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
        padding: 10px 0px;
        margin: 0 20px;
        cursor: pointer;
        font-size: 16px;
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
