<template>
  <div>
    <content-nav :menus="calendarMenu"
                 @search="onSearch"
                 :dataObj="dataObj"
                 @switchTab="tabChanged"></content-nav>
    <calendar-bar @dateChange="onDateChange"
                  @typeChange="onCalendarTypeChange"></calendar-bar>
    <div class="content">
      <!--日历-->
      <div v-if="calendarType=='day'">
        <div v-for="time in dayShown"
             style="    border: 1px solid #f6f6f6;"
             :key="time.time.getTime()">
          <div style="display: flex;">
            <div class="time"
                 style="display: flex;align-items: center;justify-content: center">
              <div>{{getTime(time.time)}}</div>
            </div>
            <div style="display: flex;flex-direction: column;flex-grow: 1">
              <div v-for="item in time.items"
                   :key="item.ID"
                   class="item"
                   :class="{'even':item.number%2===0}"
              >
                <div style="color: #2c8abf;width: 300px;display: flex;align-items: center">
                  <img :src="require(`../../assets/images/flags/${item.country}.png`)"
                       style="flex-grow: 0;height: 20px">
                  <span style="margin-left: 20px">{{item.indicator}}</span>
                </div>
                <div class="values">
                  <div><span>公布值：</span><span>{{item.announce}}{{item.unit}}</span></div>
                  <div><span>预测值：</span><span>{{item.estimate}}{{item.unit}}</span></div>
                  <div><span>前值：</span><span>{{item.previous}}{{item.unit}}</span></div>
                </div>
                <div style="flex-grow: 1;text-align: right">发布机构：{{item.institution}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--周历-->
      {{weekShown}}
      <div v-if="calendarType=='week'">
        <div v-for="time in dayShown"
             style="    border: 1px solid #f6f6f6;"
             :key="time.time.getTime()">
          <div style="display: flex;">
            <div class="time"
                 style="display: flex;align-items: center;justify-content: center">
              <div>{{getTime(time.time)}}</div>
            </div>
            <div style="display: flex;flex-direction: column;flex-grow: 1">
              <div v-for="item in time.items"
                   :key="item.ID"
                   class="item"
                   :class="{'even':item.number%2===0}"
              >
                <div style="color: #2c8abf;width: 300px;display: flex;align-items: center">
                  <img :src="require(`../../assets/images/flags/${item.country}.png`)"
                       style="flex-grow: 0;height: 20px">
                  <span style="margin-left: 20px">{{item.indicator}}</span>
                </div>
                <div class="values">
                  <div><span>公布值：</span><span>{{item.announce}}{{item.unit}}</span></div>
                  <div><span>预测值：</span><span>{{item.estimate}}{{item.unit}}</span></div>
                  <div><span>前值：</span><span>{{item.previous}}{{item.unit}}</span></div>
                </div>
                <div style="flex-grow: 1;text-align: right">发布机构：{{item.institution}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import contentNav from '../contentNav/contentNav.vue'
  import calendarBar from './calendarBar/calendarBar.vue'
  import {dateString, twoDigitNumber} from '../../utils'

  export default {
    data() {
      return {
        calendarMenu: [
          {
            key: 'statistic',
            name: '数据'
          },
          {
            key: 'schedule',
            name: '日程'
          },
        ],
        currentTab: 'statistic',
        dataObj: {},
        showSearchBar: false,
        calendar1Data: {},
        selectedDate: null,
        calendarType: null,
        weekFirstDay: null,
      }
    },
    computed: {
      dayShown() {
        if (!this.selectedDate) return
        const dayData = this.calendar1Data[dateString(this.selectedDate)]
        if (!dayData) return
        const data = Object.keys(dayData)
                           .map((key) => {
                             const time = new Date(key)
                             return {
                               time,
                               items: dayData[key]
                             }
                           })
                           .sort((a, b) => a.time > b.time ? 1 : -1)
        let k = 0
        data.forEach((time) => {
          time.items.forEach(item => {
            item.number = k++
          })
        })
        return data
      },
      weekShown: function () {
        if (!this.weekFirstDay) return

        const weekData = []
        let weekDay = this.weekFirstDay
        for (let i = 0; i < 7; i++) {
          const dayData = this.calendar1Data[dateString(weekDay)]
          const data = !dayData ? null : Object.keys(dayData)
                                               .map((key) => {
                                                 const time = new Date(key)
                                                 return {
                                                   time,
                                                   items: dayData[key]
                                                 }
                                               })
                                               .sort((a, b) => a.time > b.time ? 1 : -1)
          weekData.push({
                          day: weekDay,
                          data
                        })
          weekDay = new Date(weekDay.getTime() + 60 * 60 * 24 * 1000)
        }
        return weekData
      }
    },
    methods: {
      getTime(date) {
        return `${twoDigitNumber(date.getUTCHours())}:${twoDigitNumber(date.getMinutes())}`
      },
      showDetails(item) {
        item.isShowDetails = !item.isShowDetails
      },
      tabChanged(menu) {
        this.showSearchBar = false
        this.currentTab = menu.key
        console.log(menu)
      },
      onSearch(result) {
        console.log(result)
        this.showSearchBar = true
        this.searchStr = result.searchStr
        this.dataObj.searchResult = result.result
        this.currentTab = 'searchResult'
      },
      onDateChange(date) {
        this.selectedDate = date
        const day = this.selectedDate.getDay()
        this.weekFirstDay = new Date(this.selectedDate.getTime() - 60 * 60 * 24 * (day === 0 ? 6 : (day - 1)) * 1000) // will return firstday (i.e. Monday) of the week
      },
      onCalendarTypeChange(type) {
        console.log(type)
        this.calendarType = type
      }
    },
    mounted() {
      this.$http.get('/api/calendar/calendar1')
          .then(res => {
            const calendar1Data = {}
            res.data.forEach((data) => {
              if (!calendar1Data[data.riqi]) {
                calendar1Data[data.riqi] = {}
              }
              if (!calendar1Data[data.riqi][data.riqi_detail]) {
                calendar1Data[data.riqi][data.riqi_detail] = []
              }
              calendar1Data[data.riqi][data.riqi_detail].push(data)
            })
            this.calendar1Data = calendar1Data
          })
    },
    components: {
      contentNav,
      calendarBar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>
  .content {
    background: white;
    .time {
      border-left: 1px solid #f6f6f6;
      border-right: 1px solid #f6f6f6;
      width: 80px;
      text-align: center;
      vertical-align: middle;
      padding-top: 5px
    }
    .item {
      display: flex;
      height: 30px;
      padding: 5px 10px;
      &.even {
        background: #f6f6f6;
      }
      .values {
        display: flex;
        margin-left: 80px;
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
