/**
* Created by Xinhe on 2017/10/7.
*/
<template>
  <div class="home">
    <div class="search">
      <div v-for="item in items"
           :key="item.ID"
           class="section">
        <component :is="item.type"
                   :data="item.data"></component>
        <div class="time">推送时间<span style="margin-left: 10px">{{dateFormat(item.date) + getTime(item.date)}}</span>
        </div>
      </div>
      <h4 v-show="isLoading"
          style="text-align: center">加载中......</h4>
      <h4 v-show="!isLoading && (!items || items.length==0)"
          style="text-align: center">暂无结果</h4>
    </div>
    <div class="calendar">
      <div class="title">
        <h3>日程安排</h3>
      </div>
      <div class="event"
           v-for="time in calendarTime">
        <span class="event-time">{{time}}</span>
        <div v-for="event in calendars[time]">
          <span class="event-title">{{event.title}}</span>
          <p>
            <span>地点：</span>
            <span>{{event.location}}</span>
          </p>
          <p>
            <span>嘉宾：</span>
            <span>{{event.guest}}</span>
          </p>
          <p>
            <span>联系人：</span>
            <span>{{event.contact}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {dateFormat, getTime} from 'Util'
  import news from './news.vue'
  import indicator from './indicator.vue'
  import report from './report.vue'
  import graph from './graph.vue'
  import EventBus from '@/eventBus'

  export default {
    data() {
      return {
        calendars: {},
        items: [],
        isLoading: false,
        currentPage: 0,
        pageSize: 20,
        currentKey:null
      }
    },
    computed: {
      calendarTime() {
        return Object.keys(this.calendars)
                     .sort()
      }
    },
    methods: {
      getTime,
      dateFormat,
      fetch() {
        if (this.isLoading) return
        this.isLoading = true
        this.$http.get('/api/search', {
          params: {
            pageSize: this.pageSize,
            pageNumber: this.currentPage + 1,
            key:this.currentKey
          }
        })
            .then(res => {
              res.forEach((item) => {
                item.date = new Date(item.riqi)
              })
              this.items.push(...res)
              this.isLoading = false
              this.currentPage++
            })
            .catch(err => {
              this.isLoading = false
            })
      }
    },
    mounted() {
      EventBus.$on('homeSearch', (key) => {
        this.items = []
        this.currentKey=key;
        this.fetch()
      })
      this.fetch()
      this.$http.get('/api/calendar/calendar2', {
        params: {
          date: new Date('2017-09-11'),
        }
      })
          .then((calendars) => {
            this.calendars = {}
            calendars.forEach((calendar) => {
              const time = getTime(new Date(calendar.riqi_detail))
              let arr = this.calendars[time]
              if (!arr) {
                arr = []
                this.$set(this.calendars, time, arr)
              }
              arr.push(calendar)
            })
          })
      const doc = $(document)
      const win = $(window)
      win.scroll(() => {
        const scrollTop = win.scrollTop()
        const scrollHeight = doc.height()
        const windowHeight = win.height()
        if (scrollTop + windowHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
          this.fetch()
        }
      })
    },
    components: {
      news,
      indicator,
      report,
      graph
    }
  }
</script>

<style lang="less"
       scoped>
  @import (reference) '../../../assets/styles/common';

  .home {
    display: flex;
    .search {
      flex-grow: 1;
      .section {
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        .time {
          margin-top: 10px;
          align-self: flex-end;
          color: darkgray;
        }
      }
    }
    .calendar {
      flex-shrink: 0;
      align-self: flex-start;
      .section;
      width: 250px;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow: auto;
      .title {
        text-align: center;
        border-bottom: solid 3px @gray;
      }
      .event {
        border-bottom: solid 3px @gray;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        .event-time {
          color: darkgray;
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .event-title {
          color: @blue;
          margin-bottom: 10px;
        }
        > div {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
