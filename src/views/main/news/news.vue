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
        this.$http.get(`/api/newsCategory/${this.currentTab.key}/news`, {
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
                item.date = new Date(item.riqi)
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
        this.$http.get(`/api/newsCategory/${this.currentTab.key}/pageCount`, {
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
      this.$http.get('/api/newsCategories')
          .then((categories) => {
            this.categories = categories
            const getMenu = (categories) =>
              (!categories) ?
              null :
              categories.map((category) => ({
                key: category.CID,
                name: category.name,
                subMenus: getMenu(category.subs)
              }))
            console.log(getMenu(categories))
            this.newsMenu = getMenu(categories)
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
          > span {
            display: flex;
            align-items: center;
            margin: 0 10px;
            width: 60px;
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

  .content__table {
    border-collapse: collapse;
    border-spacing: 1px;
    background: #fff;
    width: 100%;
    border: none;
    margin-bottom: 1.5rem;
  }

  .content-time td {
    font-size: 14px;
    font-weight: normal;
    padding-left: 1rem;
    line-height: 3rem;
    text-align: left;
    background: #f6f6f6;
  }

  .icon-timer {
    color: #000;
    font-weight: bold;
    padding: 0 .3rem;
  }

  .news__item {
    overflow: hidden;
    font-size: 13px;
  }

  .news__content:hover {
    color: #2c8abf;
    cursor: pointer;
  }

  .news__item td, .news__item-details td {
    border-right-style: none;
    border-left-style: none;
  }

  .news__time {
    text-align: center;
    background: #f6f6f6;
    width: 6rem;
    font-size: 13px;
  }

  .news__item .news__content {
    width: 62%;
    padding: 1rem 0;
    padding-left: 1.5rem;
  }

  .news__item .news__content div {

  }

  .news__item .news__info {
    text-align: right;
    color: #999;
    width: 12rem;
  }

  .news__item .news__from {
    text-align: center;
    color: #999;
  }

  .news__details {
    color: #989797;
    padding: 1rem 0;
    padding-left: 1.5rem;
    padding-right: 2rem;
    line-height: 1.5;
    border: 2px solid #e2dddd;
    border-right-style: solid !important;
    border-left-style: solid !important;
    box-sizing: border-box;
    font-size: 14px;
    /*overflow: hidden;*/
  }

  .details__wrapper:before {
    content: '摘要：';
    font-weight: bold;
    color: #6b6868;
  }

  .details__wrapper:after {
    content: '[查看原文]';
    text-decoration: underline;
    color: #2c8abf;
    cursor: pointer;
  }

  .details__wrapper {
    animation-duration: 0.3s !important;
    position: relative;
  }

  .details__share {
    display: inline-block;
    position: absolute;
    right: 9px;
    bottom: -11px;
  }

  .details__share i {
    font-size: 1.2rem;
    cursor: pointer;
  }

  .details__share .icon-wechat:hover {
    color: #3db73d;
  }

  .details__share .icon-weibo:hover {
    color: #e62e2e;
  }

  .news__item-details {

  }

  .content__table tr {
    /*兼容firefox*/
    border: .1px solid;
    border-color: #eae9e9;
  }

  .content__table tr:first-child {
    border-top-style: hidden;
  }

  .wechat-qrcode {
    position: absolute;
    display: inline-block;
    width: 12rem;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #e8e2e2;
    padding: 1rem;
    top: -5rem;
    right: -7rem;
    animation-duration: 0.5s !important;
  }

  .wechat-qrcode:before {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 64px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
    width: 12px;
    height: 12px;
    border: 1px solid #e9eaec;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    background-color: #fff;
    border-width: 0 1px 1px 0;
  }

  .wechat-qrcode img {
    float: left;
    width: 4rem;
  }

  .wechat-qrcode p {
    margin-left: 6px;
  }

  .searched {
    color: red;
  }

  .search__td {
    padding: 1rem;
    font-style: italic;
  }


</style>
