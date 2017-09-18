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
      <div v-if="enableSearch" class="content__search">
        <i class="iconfont icon-search"></i>
        <input type="text"
               name="search"
               placeholder="搜索快讯"
               v-model="searchStr"
               @keypress="searchInContent">
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
      dataObj: Object,
      enableSearch:{
        type:Boolean,
        default:true,
      }
    },
    data() {
      return {
        searchStr: '',
        selected: this.menus[0].key,
        showSubMenu: false,
        subMenus: null,
        selectedSubMenu: null,
      }
    },
    methods: {
      switchSubMenu(menu) {
        this.selectedSubMenu = menu.key
        this.$emit('switchTab', menu)
      },

      switchTab(menu) {
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
        if (event.keyCode === 13) {
          console.log(this.searchStr)
//          this.searchStr = event.target.value
//          this.showSearchBar = true

          const regx = new RegExp(this.searchStr)

          // 如果得到结果集
          const researchRes = []
          // 防止连续搜索结果为空
          const currentNav = this.selected
//          for (var i = 0; i < this.$refs.navs.children.length; i++) {
//            if (this.$refs.navs.children[i].className === 'selected') {
//              currentNav = this.$refs.navs.children[i].getAttribute('name')
//              break
//            }
//          }
          const results = this.dataObj[currentNav]

          results.forEach((result) => {
            const newsItem = result.newsItem.filter(item => item.content.search(regx) !== -1)
              .map((item) => ({
                ...item,
                isShowDetails: false,
                content: item.content.replace(this.searchStr, `<span style="color: red;">${this.searchStr}</span>`),
                details: item.details.replace(this.searchStr, `<span style="color: red;">${this.searchStr}</span>`)
              }))
            const resItem = {
              date: result.date,
              newsItem,
            }
            if (resItem.newsItem.length > 0) {
              researchRes.push(resItem)
            }
          })

          this.$emit('switchTab', {
            key: 'researchRes'
          })
          this.$emit('search', {
            searchStr: this.searchStr,
            result: researchRes
          })

          /* ajax demo */
          // axios.post('/search.php',{
          //     str:this.searchStr,
          //     globel: all
          // }).then(response=>{
          //
          // })

        }
      },
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content__nav {
    background-color: #fff;
    height: 2.5rem;
    line-height: 2.5rem;
    margin-bottom: 4px;
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
