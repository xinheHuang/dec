<template>
  <div>
    <nav class="content__nav">
      <ul ref="navs">
        <!-- 推荐后期用json导入，v-for循环 -->
        <li v-for="menu in menus"
            @click="switchMenu(menu)"
            :key="menu.industry_id"
            :class="{'selected':selected==menu.industry_id}">
          {{menu.name}}
        </li>
      </ul>
    </nav>
    <nav v-if="subMenus && subMenus.length>0"
         class="second-nav">
      <ul>
        <li v-for="subMenu in subMenus"
            @click="switchSubMenu(subMenu)"
            :key="subMenu.industry_id"
            :class="{'selected':selectedSubMenu==subMenu.industry_id}">{{subMenu.name}}
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: null,
        selected: null,
        subMenus: null,
        selectedSubMenu: null,
      }
    },
    methods: {
      switchSubMenu(menu) {
        this.selectedSubMenu = menu.industry_id
        this.$emit('switchTab', menu)
      },

      switchMenu(menu) {
        this.selected = menu.industry_id
        this.getSubMenu(this.selected)
          .then(subMenus => {
            this.subMenus = subMenus
            this.switchSubMenu(subMenus[0])
          })
      },

      getSubMenu(CID) {
        return this.$http.get(`/api/industries/${CID}`)
      }
    },
    mounted() {
      this.$http.get('/api/industries/0')
        .then(res => {
          this.menus = res
          this.switchMenu(this.menus[0])
        })
    }

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
