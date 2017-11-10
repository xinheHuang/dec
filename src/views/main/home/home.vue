/**
* Created by Xinhe on 2017/10/7.
*/
<template>
  <div class="home">
    <div class="search">
      <div v-for="item in items"
           :key="item.ID"
           @mouseover
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
          <span class="event-title"><span style="margin-right: 10px">[{{event.status}}]</span>{{event.title}}</span>
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
  import {dateFormat, getTime, dateString} from 'Util'
  import news from './news.vue'
  import indicator from './indicator.vue'
  import report from './report.vue'
  import graph from './graph.vue'
  import EventBus from '@/eventBus'

  export default {
    data() {
      return {
        oneHour: 60 * 60 * 1000,
        calendars: {},
        items: [],
        isLoading: false,
        currentPage: 0,
        pageSize: 20,
        currentKey: null,
        currentTime: null,
        timer: null,
      }
    },
    computed: {
      calendarTime() {
        return Object.keys(this.calendars)
                     .sort()
      }
    },
    methods: {
      dateString,
      getTime,
      dateFormat,
      fetch() {
        if (this.isLoading) return
        this.isLoading = true
        this.$http.get('/api/search', {
          params: {
            pageSize: this.pageSize,
            pageNumber: this.currentPage + 1,
            key: this.currentKey
          }
        })
            .then(res => {
              res.forEach((item) => {
                item.date = new Date(item.time)
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
      //timer
//      this.timer=setInterval(()=>{
//        this.currentTime=new Date();
//      },1000)

      EventBus.$on('homeSearch', (key) => {
        this.items = []
        this.currentPage = 0
        this.currentKey = key
        this.fetch()
      })
      this.fetch()
      const current = new Date()
      this.$http.get('/api/calendar/schedule', {
        params: {
          time: current.getTime(),
        }
      })
          .then((calendars) => {
            this.calendars = {}

            calendars.forEach((calendar) => {
              calendar.date = new Date(calendar.time)
              const diff = calendar.date-current
              if (diff < -this.oneHour) {
                calendar.status = '已经结束'
              } else if (diff <= 0) {
                calendar.status = '正在进行'
              } else {
                calendar.status = '还未开始'
              }

              const time = getTime(calendar.date)
              let arr = this.calendars[time]
              if (!arr) {
                arr = []
                this.$set(this.calendars, time, arr)
              }
              arr.push(calendar)
            })
          })
      const ele = $(this.$el)
      const calendar = ele.find('.calendar')
      const doc = $(document)
      const win = $(window)
      const onResize = () => {
        calendar.css('right', ele.offset().left)
        calendar.css('max-height', win.height() - 90)
      }
      win.resize(onResize)
      onResize()
      win.scroll(() => {
        const scrollTop = win.scrollTop()
        const scrollHeight = doc.height()
        const windowHeight = win.height()
        if (scrollTop + windowHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
          this.fetch()
        }
        const top = scrollTop > 50 ? 0 : 50 - scrollTop
        calendar.css('top', top)
        calendar.css('max-height', win.height() - 40 - top)
      })
    },
    destroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
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
      margin-right: 340px;
      flex-grow: 1;
      .section {
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        &:hover{
          /*display: none;*/
          box-shadow:1px 1px 3px #292929;
        }
        .time {
          margin-top: 10px;
          align-self: flex-end;
          color: darkgray;
        }
      }
    }
    .calendar {
      /*flex-shrink: 0;*/
      top: 50px;
      position: fixed;
      align-self: flex-start;
      .section;
      width: 300px;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow: auto;
      box-sizing: border-box;
      .title {
        text-align: center;
        border-bottom: solid 3px @gray;
      }
      .event {
        flex-shrink: 0;
        border-bottom: solid 3px @gray;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        .event-time {
          color: darkgray;
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0 0 0;
        }
        .event-title {
          color: @blue;
          margin-bottom: 10px;
        }
        > div {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
