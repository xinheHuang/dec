<template>
  <div>
    <nav class="content__nav">
      <ul ref="navs">
        <!-- 推荐后期用json导入，v-for循环 -->
        <li v-for="menu in menus"
            @click="switchTab(menu)"
            :key="menu.key"
            :class="{'selected':selected==menu.key}">
          {{menu.name}}
        </li>
      </ul>
      <div v-if="enableSearch"
           class="search">

        <input type="text"
               class="search-input"
               placeholder="搜索快讯"
               v-model="searchStr"
               @keyup.enter="searchInContent()">
        <div class="search-img"
             @click="searchInContent()">
          <icon name="search"/>
        </div>
        <!--<i class="iconfont icon-search"></i>-->

      </div>
    </nav>
    <nav v-if="showSubMenu"
         class="second-nav">
      <ul>
        <li v-for="subMenu in subMenus"
            @click="switchSubMenu(subMenu)"
            :key="subMenu.key"
            :class="{'selected':selectedSubMenu==subMenu.key}">{{subMenu.name}}
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    props: {
      menus: {
        type: Array,
        required: true,
      },
      dataObj: null,
      enableSearch: {
        type: Boolean,
        default: true,
      },
      searchMethod: Function,
    },
    data() {
      return {
        searchStr: '',
        selected: null,
        showSubMenu: false,
        subMenus: null,
        selectedSubMenu: null,
      }
    },
    methods: {
      switchSubMenu(menu) {
        if (this.selectedSubMenu === menu.key) return
        this.selectedSubMenu = menu.key
        this.$emit('switchTab', menu)
      },

      switchTab(menu) {
        if (this.selected === menu.key) return
        this.showSubMenu = !!menu.subMenu
        this.selected = menu.key
        if (this.showSubMenu) {
          this.subMenus = menu.subMenu
          menu = menu.subMenu[0]
          this.selectedSubMenu = menu.key
        }
        this.$emit('switchTab', menu)
      },
      searchInContent(event) {
        const researchRes = this.searchMethod(this.searchStr, this.selected, this.dataObj)
        this.$emit('search', researchRes)
      },
    },
    mounted() {
      this.switchTab(this.menus[0])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped
       lang="less">
  .content__nav {
    background-color: #fff;
    height: 2.5rem;
    line-height: 2.5rem;
    margin-bottom: 4px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search {
    /*display: flex;*/
    margin-right: 10px;
    position: relative;
  }

  .search-input {
    flex-grow: 1;
    /*width: 100%;*/
    border-radius: 5px;
    border: solid 1px black;
    height: 20px;
    font-size: 14px;
    padding: 5px 10px;
  }

  .search-img {
    position: absolute;
    > *s {
      height: 20px;
    }
    right: 10px;
    top: 5px;
  }

  .content__search {
    float: right;
    position: relative;
    margin-right: 1rem;
  }

  .content__search i {
    position: absolute;
    left: 5px;
    top: 1px;
    font-size: 19px;
    color: #000;
  }

  .content__search input {
    border-radius: 11px;
    border: 1px solid grey;
    padding-left: 1.6rem;
    height: 1.2rem;
    width: 13rem;
  }

  .content__nav li {
    float: left;
    width: 8rem;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
  }

  .content__nav li:hover {
    color: #2c8abf;
    border-bottom: 3px solid #2c8abf;
  }

  .content__nav .selected {
    color: #2c8abf;
    border-bottom: 3px solid #2c8abf;
  }

  .second-nav {
    background: #fff;
    color: #000;
    overflow: hidden;
    line-height: 2.6rem;
  }

  .second-nav li {
    float: left;
    width: 8rem;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
  }

  .second-nav .selected {
    color: #2c8abf;
    background-color: #f6f6f6;
  }

</style>
