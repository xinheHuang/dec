<template>
  <div id="indicators">
    <div style="display: flex;flex-direction: row-reverse">
      <div class="search">
        <input type="text"
               class="search-input"
               v-model="searchIndicatorKey"
               @keypress="search($event)"
               placeholder="搜索指标">
        <div @click="search()" class="search-img">
          <icon name="search"/>
        </div>
      </div>
      <!--<img class="search-img" :src="require('../../../assets/images/search.png')" @click="search()"/>-->
    </div>

    <div class="indicator-table">
      <div class="table">
        <div style="display: flex">
          <span class="name">指标名称</span>
          <span class="frequency">发布频次</span>
          <span class="unit">单位</span>
          <span class="source">来源</span>
        </div>
        <div v-for="indicator in currentPageIndicators" @click="clickIndicator(indicator)" class="indicator"
             :key="indicator.IID"
             :class="{selected:currentSelectIndicator==indicator}">
          <span class="name">{{indicator.title}}</span>
          <span class="frequency">{{indicator.frequency}}</span>
          <span class="unit">{{indicator.unit}}</span>
          <span class="source">{{indicator.source}}</span>
        </div>
      </div>
      <div class="op">
        <div class="pagination">
          <div @click="clickPrev()" :class="{disabled:currentPage<=1}"><span>上一页</span></div>
          <div v-for="page of totalPage" :class="{selected:currentPage===page}" @click="clickPage(page)">
            <span>{{page}}</span>
          </div>
          <div @click="clickNext()" :class="{disabled:currentPage>=totalPage}"><span>下一页</span></div>
        </div>
        <div v-if="currentSelectIndicator">
          <span style="border: none;margin-right: 10px">已选中指标：{{currentSelectIndicator.title}}</span>
          <span style="cursor: pointer;color: #2c8abf;border: none"
                @click="addIndicator(currentSelectIndicator)">添加关联</span>
        </div>
      </div>
    </div>

    <div class="warning-graphs">
      <div v-for="(warning,index) in indicatorWarnings" :key="warning.ID">
        <div class="title-row">
          <h5 class="title">{{warning.indicator.title}}</h5>
          <div class="op">
            <div class="icon" @click="clickWarn(warning)" :class="{selected:warning.warn_type>0}">
              <icon name="bell"/>
            </div>
            <div class="icon" @click="clickDownload(warning)" v-button>
              <icon name="download"/>
            </div>
            <div class="icon" @click="clickRemove(warning,index)" v-button>
              <icon name="trash"/>
            </div>
          </div>
        </div>
        <div style="height: 200px;text-align: center">
          graph here
        </div>
        <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 20px">
          <div class="type" :class="{shown:warning.warn_type>0}">

            <!--fixed-->
            <select v-model="warning.warnType1" @change="type1Change(warning)">
              <option value="1">绝对值</option>
              <option value="2">增速</option>
            </select>
            <select v-model="warning.warnType2" v-if="warning.warnType1!=1">
              <option value="0">同比</option>
              <option value="1">环比</option>
            </select>
            <select v-model="warning.warnType2" disabled v-if="warning.warnType1==1">
              <option value="0"></option>
            </select>
            <!--todo 是否可以修改?-->
            <input disabled :value="warning.upper_limit"/>
            <input disabled :value="warning.lower_limit"/>

          </div>
          <div class="icon" @click="saveWarnChange(warning)" v-button>
            <icon name="save"/>
          </div>
        </div>
      </div>
      `
    </div>
  </div>
</template>
<script>
  import 'vue-awesome/icons/save'
  import 'vue-awesome/icons/bell'
  import 'vue-awesome/icons/download'
  import 'vue-awesome/icons/trash'
  import 'vue-awesome/icons/search'

  export default {
    props: {
      node: Object,
      saved: Function,
      saving: Function,
    },
    data() {
      return {
        selectType1: 1,
        selectType2: 0,
        searchIndicatorKey: null,
        currentPage: 1,
        currentIndicators: [],
        currentSelectIndicator: null,
        indicatorWarnings: [],
      }
    },
    computed: {
      currentPageIndicators() {
        return this.currentIndicators.slice((this.currentPage - 1) * 5, (this.currentPage) * 5)
      },
      totalPage() {
        return Math.ceil(this.currentIndicators.length / 5)
      },
    },
    methods: {
      addIndicator(indicator) {
        this.$http.post('/api/indicatorNode/', {
          IID: indicator.IID,
          NID: this.node.id
        })
          .then(res => {
            const warning = {
              ...res.data,
              indicator

            }
            this.indicatorWarnings.unshift(warning)
          })
      },
      saveWarnChange(warning) {
//        console.log(warning)
        this.saving('设置')
        const warnType = warning.warn_type == 0 ? 0 : (+warning.warnType1) + (+warning.warnType2)
        this.$http.put(`/api/indicatorNode/${warning.ID}`, {
          ...warning,
          warn_type: warnType
        })
          .then(res => {
//          console.log(res.data);
            this.saved('设置')
          })
      },
      clickDownload(warning) {
        console.log('download')
        // todo
      },
      clickRemove(warning, index) {
        const r = confirm('确定取消关联？')
        if (r) {
          this.$http.delete('/api/indicatorNode/' + warning.ID)
            .then((res) => {
              this.indicatorWarnings.splice(index, 1)
            })
        }
      },
      clickWarn(warning) {
        console.log('click')
        if (warning.warn_type > 0) {
          warning.warn_type = 0
        }
        else {
          warning.warn_type = 1
          this.setWarnType(warning)
        }
      },
      type1Change(warning) {
        warning.warnType2 = 0
      },
      search(event) {
        if (event && !event.charCode === 13)
          return
        this.$http.get(`/api/indicator?key=${this.searchIndicatorKey}`)
          .then((res) => {
            this.currentIndicators = res.data
          })
      },
      clickIndicator(indicator) {
        if (indicator === this.currentSelectIndicator) {
          this.currentSelectIndicator = null
//          this.indicatorWarnings=[];
        }
        else {
          this.currentSelectIndicator = indicator
        }
      },
      clickPage(page) {
        if (page >= 1 && page <= this.totalPage && page !== this.currentPage) {
          this.currentPage = page
        }
      },
      clickNext() {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
        }
      },
      clickPrev() {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      },
      setWarnType(warn) {
        this.$set(warn, 'warnType1', warn.warn_type == '1' ? 1 : 2)
        this.$set(warn, 'warnType2', warn.warn_type == '1' ? 0 : 3 - warn.warn_type)
      }
    },
    mounted() {
      this.$http.get(`/api/node/${this.node.id}/indicators`)
        .then((res) => {
          this.indicatorWarnings = res.data
          this.indicatorWarnings.forEach(warn => {
            this.setWarnType(warn)
          })
        })

//      this.$http.get(`/api/indicator?key=`)
//        .then((res) => {
//          this.currentIndicators = res.data
//        })
    },
    components: {
//      Icon
    }
  }
</script>
<style lang="less" scoped>
  #indicators {
    padding: 10px 20px 0;
    .search {
      /*display: flex;*/
      /*display: flex;*/
      /*float: right;*/
      position: relative;
    }
    .search-input {
      /*flex-grow: 1;*/
      /*width: 100%;*/
      border-radius: 5px;
      border: solid 1px black;
      height: 20px;
      font-size: 14px;
      padding: 5px 10px;
    }
    .search-img {
      position: absolute;
      > * {
        height: 20px;
      }
      right: 10px;
      top: 5px;
    }
    .unit {
      width: 100px;
      flex-shrink: 0;
    }
    .frequency {
      width: 150px;
      flex-shrink: 0;
    }
    .source {
      width: 300px;
      flex-shrink: 0;
    }
    .name {
      flex-grow: 1;
    }
    .indicator-table {
      margin-top: 20px;
      .table {
        .indicator {
          cursor: pointer;
          display: flex;
          &.selected {
            background: #2c8abf;
          }
        }
        span {
          border: 1px solid lightgray;
          padding: 10px;
        }
      }
      .op {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pagination {
          display: flex;
          align-items: center;
          div {
            border: 1px solid lightgray;
            height: 30px;
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:first-child, &:last-child {
              width: 60px;
              text-align: center;
              &.disabled {
                color: lightgrey;
                cursor: not-allowed;
              }
            }
            &.selected {
              background: #2c8abf;
              cursor: not-allowed;
            }
          }
        }
        margin-top: 15px;
      }
    }

    .icon {
      > * {
        height: 20px;
        width: auto;
        color: #ccc;
        margin-right: 10px;
      }
      &.selected {
        > * {
          color: #2c8abf;
        }
      }
    }

    .warning-graphs {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 50%;
        padding: 5px 0;
        .title-row {
          padding: 0 20px;
          position: relative;
          .title {
            text-align: center;
          }
          .op {
            position: absolute;
            right: 20px;
            top: 0;
            display: flex;
          }
        }
        .type {
          margin-left: 20px;
          visibility: hidden;
          &.shown {
            visibility: visible
          }
          display: flex;
          align-items: center;
          justify-content: space-around;
          > * {
            margin-right: 10px;
            flex-grow: 0;
            flex-shrink: 1;
          }
          > input {
            width: 50px;
          }
        }
      }
    }
  }
</style>
