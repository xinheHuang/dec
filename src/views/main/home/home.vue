/**
* Created by Xinhe on 2017/10/7.
*/
<template>
  <div class="home">
    <div class="content"  style="height: 2000px"></div>
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
  import { getTime } from 'Util'

  export default {
    data() {
      return {
        calendars: {}
      }
    },
    computed: {
      calendarTime() {
        return Object.keys(this.calendars)
          .sort()
      }
    },
    mounted() {
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
    }
  }
</script>

<style lang="less"
       scoped>
  @import (reference) '../../../assets/styles/common';

  .home {
    display: flex;
    .content {
      flex-grow: 1;
    }
    .calendar {
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
        .event-time{
          color:darkgray;
          font-size:20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .event-title{
          color:@blue;
          margin-bottom: 10px;
        }
        >div{
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
