<template>
  <div>
    <content-nav :menus="calendarMenu"
                 @search="onSearch"
                 :dataObj="dataObj"
                 @switchTab="tabChanged"></content-nav>
    <calendar-bar></calendar-bar>
  </div>
</template>

<script>
  import contentNav from '../contentNav/contentNav.vue'
  import calendarBar from './calendarBar/calendarBar.vue'
  export default {
    data() {
      return {
        calendarMenu: [
          { key: 'statistic', name: '数据' },
          { key: 'schedule', name: '日程' },
        ],
        currentTab: 'statistic',
        dataObj: {
        },
        showSearchBar: false,
      }
    },
    methods: {
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
        console.log(result)
        this.showSearchBar = true
        this.searchStr = result.searchStr
        this.dataObj.searchResult = result.result
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
      calendarBar
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
