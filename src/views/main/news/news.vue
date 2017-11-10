<template>
  <div>
    <content-nav :menus="newsMenu"
                 @search="onSearch"
                 :enableSearch="true"
                 :searchMethod="searchMethod"
                 :rootKey="0"
                 :enableAll="true"
                 :allNames="menuAllNames"
                 @switchTab="tabChanged"></content-nav>

    <div v-if="isLoading">
      加载中.......
    </div>
    <div v-else
         class="news">
      <div v-for="(dateNews,date) in news"
           class="time">
        <div class="item">
          <icon name="clock-o"
                style="margin-left: 20px"></icon>
          <span style="margin-left: 10px">{{dateFormat(new Date(date))}}</span>

        </div>
        <div v-for="item in dateNews"
             style="width: 100%">
          <div class="item news-content">
            <div class="news-time"><span>{{getTime(item.date)}}</span></div>
            <div class="news-items">
              <p class="title"
                    @click="showAbstract(item)"
                    v-html="strReplace(item.title)"></p>
              <span>
               <icon name="eye"></icon>
              <span>{{numFormat(item.num_read)}}</span>
            </span>
              <span>
              <icon name="heart"></icon>
               <span>{{numFormat(item.num_like)}}</span>
            </span>
              <span>
              <icon name="comment-o"></icon>
              <span> {{numFormat(item.num_comment)}}</span>
            </span>
              <span class="source"><span style="color: darkgray;margin-right: 10px"> {{item.source }}</span>{{item.author}}</span>
            </div>
          </div>
          <div class="item news-content"
               v-show="item.showAbstract">
            <div class="news-time"></div>
            <div class="news-abstract">
              <p style="color: gray">
                <span style="font-weight: bold">摘要：</span>
                <span v-html="strReplace(item.abstract)"> </span>
                <span class="detail"><a target="_blank"
                                        :href="item.link">[查看原文]</a></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <pagination :total="pageTotal"
                ref="pagination"
                :pageSize="pageSize"
                :changePage="onPageChange"></pagination>
  </div>
</template>

<script>
  import contentNav from 'Component/contentNav/contentNav.vue'
  import pagination from 'Component/pagination/pagination.vue'
  import axios from 'axios'
  import {dateString, getTime, dateFormat} from 'Util'

  const CancelToken = axios.CancelToken

  export default {
    data() {
      return {
        pageSize: 20,
        currentTime: null,
        newsMenu: [],
        currentTab: null,
        showSearchBar: false,
        categories: [],
        pageTotal: 0,
        source: null,
        news: {},
        searchKey: null,
        isLoading: false,
        menuAllNames: ['全部一级行业', '全部二级行业', '全部三级行业',]
      }
    },
    methods: {
      clearSearch() {
        this.searchKey = null
        this.fetchNews()
      },
      strReplace(str) {
        if (!this.searchKey) {
          return str
        }
        //todo 大小写
        return str.replace(new RegExp(this.searchKey, 'g'), `<span style="color: red;">${this.searchKey}</span>`)
      },
      numFormat(num) {
        return num == -1 ? '-' : num
      },
      dateFormat,
      getTime,
      onPageChange(page) {
        console.log('onpage change ', page)
        if (this.source) {
          this.source.cancel()
          this.source = null
        }
        this.source = CancelToken.source()
        this.isLoading = true
        this.$http.get(`/api/industry/${this.currentTab.key}/news`, {
          cancelToken: this.source.token,
          params: {
            key: this.searchKey,
            pageNumber: page,
            pageSize: this.pageSize,
          }
        })
            .then(({news}) => {
              this.source = null
              console.log(news)
              const newsMap = {}
              news.forEach((item) => {
                item.date = new Date(item.time)
                const date = dateString(item.date)
                let n = newsMap[date]
                if (!n) {
                  n = []
                  newsMap[date] = n
                }
                this.$set(item, 'showAbstract', false)
                n.push(item)
              })
              console.log('newsMap', newsMap)
              this.news = newsMap
              this.isLoading = false
            })
            .catch((error) => {
              if (axios.isCancel(error)) {
                console.log('request cancel')
              }
            })
      },

      searchMethod(key) {
        this.searchKey = key
      },
      showAbstract(item) {
        item.showAbstract = !item.showAbstract
      },
      showDetail(item) {
        this.swal({
                    icon: 'info',
                    title: 'todo...'
                  })
      },
      fetchNews() {
        this.isLoading = true
        this.$http.get(`/api/industry/${this.currentTab.key}/pageCount`, {
          params: {
            pageSize: this.pageSize,
            key: this.searchKey
          }
        })
            .then(({pageCount}) => {
              this.pageTotal = Math.max(pageCount, 1)
              console.log(this.pageTotal)
              this.$nextTick(() => {
                this.$refs.pagination.setPage(0)
                this.onPageChange(1)
              })

            })
      },
      tabChanged(menu) {
        this.showSearchBar = false
        this.currentTab = menu
        console.log('menu:', menu)
        this.fetchNews()
      },
      onSearch() {
        this.fetchNews()
      }
    },
    mounted() {
      this.$http.get('/api/industries')
          .then((industries) => {
            this.categories = industries
            const getMenu = (industries) =>
              (!industries) ?
              null :
              industries.map((industry) => ({
                key: industry.industry_id,
                name: industry.name,
                subMenus: getMenu(industry.subs)
              }))
            console.log(getMenu(industries))
            this.newsMenu = getMenu(industries)
          })
    },
    created() {
//      this.currentTime = new Date().toString()
//                                   .split(' ')[4]
//      setInterval(() => {
//        this.currentTime = new Date().toString()
//                                     .split(' ')[4]
//      }, 1000)
    },
    components: {
      contentNav,
      pagination
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped
       lang="less">
  @import (reference) '../../../assets/styles/common';

  .news {
    font-size: 14px;
    .time {
      border-left: 1px solid @border-gray;
      border-right: 1px solid @border-gray;
      background: #f6f6f6;
      vertical-align: middle;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      flex-shrink: 0;
    }
    .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid @border-gray;
      min-height: 40px;
      width: 100%;
      &.news-content {
        > div {
          /*min-height: 30px;*/
        }

        .news-time {
          min-height: 40px;
         align-self: stretch;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          background: #f6f6f6;
          flex-shrink: 0;
        }

        .news-abstract {
          flex-grow: 1;
          p {
            font-size: 14px;
            line-height: 28px;
            margin: 0 10px;
            .detail {
              margin-left: 10px;
              color: @blue;
              cursor: pointer;
              text-decoration: underline;
            }
          }
        }

        .news-items {
          display: flex;
          align-items: center;
          flex-grow: 1;
          .fa-icon{
            color: @gray;
          }
          > span {
            display: flex;
            align-items: center;
            margin: 0 10px;
            width: 80px;
            span {
              margin-left: 10px;
            }

            &.source {
              text-align: center;
              flex-grow: 1;
            }
          }
          .title {
            margin: 0 10px;
            width: 650px;
            cursor: pointer;
            &:hover {
              color: @blue;
            }
          }

        }

        display: flex;
        align-items: center;
        background: @white;
      }
      &.even {
        background: #f6f6f6;
      }
      .values {
        display: flex;
        margin-left: 30px;
        flex-shrink: 0;
        > div {
          width: 200px;
          > span {
            &:first-child {
              color: gray;
            }
            &:last-child {
              color: black;
              font-weight: bold;
            }
          }
        }
      }
    }
  }


</style>
