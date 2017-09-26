<template>
  <div>
    <content-nav :menus="newsMenu"
                 @search="onSearch"
                 :dataObj="dataObj"
                 :searchMethod="searchMethod"
                 @switchTab="tabChanged"></content-nav>
    <table border="1"
           cellspacing="1"
           cellpadding="0"
           class="content__table">
      <tr v-if="showSearchBar"
          style="background: #f6f6f6;">
        <td class="search__td"
            colspan="5">
          <p>"<span class="searched"
                    style="font-weight: bold;">{{ searchStr }}</span>"的搜索结果</p>
        </td>
      </tr>
      <template v-for="(dateItem,i) in dataObj[currentTab]">
        <tr class="content-time">
          <td colspan="5"><i class="iconfont icon-timer"></i>{{ dateItem.date }}
            <time v-if="i === 0"
                  style="margin-left: 10px;">{{currentTime}}
            </time>
          </td>
        </tr>
        <template v-for="(item,index) in dateItem['newsItem']">
          <tr class="news__item">
            <td class="news__time">{{ item.time }}</td>
            <td class="news__content"
                @click="showDetails(item)">
              <div v-if="showSearchBar"
                   v-html="item.content"></div>
              <div v-else>{{ item.content }}</div>
            </td>
            <td class="news__info"><i style="font-size: 21px;"
                                      class="iconfont icon-chakan"></i> {{ item.viewer
              }}
              <i style="font-size: 14px; color: #b3a7a7; margin-left: 23px; margin-right: 7px;"
                 class="iconfont icon-like"></i>{{ item.likes }}
            </td>
            <td class="news__from">{{ item.from }}</td>
          </tr>
          <tr v-show="item.isShowDetails"
              class="news__item-details">
            <td class="news__time"></td>
            <td colspan="4"
                class="news__details">
              <transition mode="out-in"
                          enter-active-class="animated fadeIn"
                          leave-active-class="animated fadeOut">
                <div class="details__wrapper"
                     v-if="item.isShowDetails">
                                    <span v-if="showSearchBar"
                                          v-html="item.details">
                                    </span>
                  <span v-else>
                                        {{ item.details }}
                                    </span>
                  <div class="details__share">
                    <i class="iconfont icon-wechat"
                       @mouseenter="moveOnWechat(item)"
                       @mouseleave="moveOutWechat(item)"></i>
                    <i class="iconfont icon-weibo"></i>
                  </div>
                  <transition mode="out-in"
                              enter-active-class="animated fadeIn"
                              leave-active-class="animated fadeOut">
                    <div class="wechat-qrcode"
                         v-if="item.showWechatQRcode">
                      <img src="http://s.jiathis.com/qrcode.php?url=http://36kr.com/newsflashes/78787"
                           alt="">
                      <p>打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮</p>
                    </div>
                  </transition>
                </div>
              </transition>
            </td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script>
  import contentNav from '../contentNav/contentNav.vue'

  export default {
    data() {
      return {
        currentTime: null,
        newsMenu: [
          { key: 'general', name: '综合' },
          { key: 'social', name: '社会' ,subMenu:[
            {
              key:'social__house',
              name:'房价',
            },
            {
              key:'social__env',
              name:'环境',
            },
            {
              key:'social__food',
              name:'食品安全',
            }
          ]},
          { key: 'entertainment', name: '娱乐' },
          { key: 'car', name: '汽车' },
          { key: 'technical', name: '科技' },
        ],
        currentTab: 'general',
        dataObj: {
          'general': [
            {
              'date': '09月04日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。港股收盘，共有20323支股票处于上涨行情，232支跌停。',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }, {
                  'time': '16:01',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }, {
                  'time': '15:29',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
            {
              'date': '09月02日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false

                }, {
                  'time': '16:01',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }, {
                  'time': '15:29',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
            {
              'date': '07月03日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false

                }, {
                  'time': '16:01',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }, {
                  'time': '15:29',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
            {
              'date': '03月12日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false

                }, {
                  'time': '16:01',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }, {
                  'time': '15:29',
                  'content': '大陆股票全线崩盘，自从08年温家宝总理的四万亿计划之后，政府对难得的转型期没有做出及时调整，导致了这次股市黑色星期五',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '东方财富网',
                  'details': '大陆股票全线崩盘大陆股票全线崩盘大陆股票全线崩盘截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            }
          ],
          'social': [
            {
              'date': '03月12日',
              'newsItem': [
                {
                  'time': '14:11',
                  'content': '社会板块',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ],
            },
          ],
          'entertainment': [
            {
              'date': '03月04日',
              'newsItem': [
                {
                  'time': '11:09',
                  'content': '娱乐板块',
                  'viewer': '54323',
                  'likes': '22',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ],
          'car': [
            {
              'date': '09月01日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '汽车板块',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ],
          'technical': [
            {
              'date': '09月02日',
              'newsItem': [
                {
                  'time': '16:09',
                  'content': '科技板块',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ],
          'social__house': [
            {
              'date': '03月12日',
              'newsItem': [
                {
                  'time': '14:11',
                  'content': '社会子版块-房价',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ],
          'social__env': [
            {
              'date': '03月12日',
              'newsItem': [
                {
                  'time': '14:11',
                  'content': '社会子版块-环境',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ],
          'social__food': [
            {
              'date': '03月12日',
              'newsItem': [
                {
                  'time': '14:11',
                  'content': '社会子版块-食品安全',
                  'viewer': '54323',
                  'likes': '9',
                  'from': '澎湃新闻',
                  'details': '截至港股收盘，共有20323支股票处于上涨行情，232支跌停。所以你以为可以投资了吗？事实上，现在加入只会让你成为资本角逐的游戏，然而媒体是不会这样告诉你的。我也不知道我在打点啥，总之这个是news的详情摘要。',
                  'isShowDetails': false,
                  'showWechatQRcode': false
                }
              ]
            },
          ]
        },
        showSearchBar: false,
      }
    },
    methods: {
      searchMethod(searchStr,selected,dataObj){
        this.searchStr=searchStr
        const regx = new RegExp(searchStr)
        const researchRes = []
        const currentNav = selected
        const results = dataObj[currentNav]

        results.forEach((result) => {
          const newsItem = result.newsItem.filter(item => item.content.search(regx) !== -1)
            .map((item) => ({
              ...item,
              isShowDetails: false,
              content: item.content.replace(searchStr, `<span style="color: red;">${searchStr}</span>`),
              details: item.details.replace(searchStr, `<span style="color: red;">${searchStr}</span>`)
            }))
          const resItem = {
            date: result.date,
            newsItem,
          }
          if (resItem.newsItem.length > 0) {
            researchRes.push(resItem)
          }
        })
        return researchRes
      },
      showDetails(item) {
        item.isShowDetails = !item.isShowDetails
      },
      tabChanged(menu) {
        this.showSearchBar = false;
        this.currentTab = menu.key
        console.log(menu);
      },
      moveOnWechat(item) {
        item.showWechatQRcode = true
      },
      moveOutWechat(item) {
        item.showWechatQRcode = false
      },
      onSearch(result) {
        this.tabChanged({
          key: 'researchRes'
        })
        console.log(result)
        this.showSearchBar = true
        this.dataObj.searchResult = result
        this.currentTab = 'searchResult'
      }
    },
    created() {
      this.currentTime = new Date().toString()
        .split(' ')[4]
      setInterval(() => {
        this.currentTime = new Date().toString()
          .split(' ')[4]
      }, 1000)
    },
    components: {
      contentNav,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
