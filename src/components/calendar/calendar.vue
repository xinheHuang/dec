<template>
  <div>
    <content-nav :menus="calendarMenu"
                 @search="onSearch"
                 :dataObj="calendarType=='week'?weekShownData:dayShownData"
                 :searchMethod="searchMethod"
                 @switchTab="tabChanged"></content-nav>
    <calendar-bar @dateChange="onDateChange"
                  @typeChange="onCalendarTypeChange"></calendar-bar>
    <div class="content">
      <!--日历-->
      <div v-if="calendarType=='day'"
           class="day-calendar">
        <div v-for="time in dayShown"
             style="    border: 1px solid #f6f6f6;"
             :key="time.time.getTime()">
          <div style="display: flex;">
            <div class="time">
              <div>{{getTime(time.time)}}</div>
            </div>
            <div style="display: flex;flex-direction: column;flex-grow: 1">
              <div v-for="item in time.items"
                   :key="item.ID"
              >
                <div class="item"
                     :class="{'even':item.number%2===0}"
                     v-if="currentTab==='statistic'">
                  <div style="color: #2c8abf;width: 250px;display: flex;align-items: center;flex-shrink: 0;">
                    <img :src="require(`../../assets/images/flags/${item.country}.png`)"
                         style="flex-grow: 0;height: 20px">
                    <span style="margin-left: 20px"
                          v-html="item.indicator"></span>
                  </div>
                  <div class="values">
                    <div><span>公布值：</span><span v-html="item.announce+item.unit"></span></div>
                    <div><span>预测值：</span><span v-html="item.estimate=='0'?'-':item.estimate+item.unit"></span></div>
                    <div><span>前值：</span><span v-html="item.previous+item.unit"></span></div>
                  </div>
                  <div style="flex-grow: 1;text-align: right"
                       v-html="item.institution?'发布机构：'+item.institution:''"></div>
                </div>

                <div class="item"
                     :class="{'even':item.number%2===0}"
                     v-if="currentTab==='schedule'">
                  <div style="display: flex;align-items: center ">
                    <p><span style="font-weight: bold"
                             v-html="item.title"></span>
                      <span v-html="item.content"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--周历-->
      <div v-if="calendarType=='week'"
           class="week-calendar">
        <div v-for="(day,index) in weekShown"
             class="day"
             :key="day.day.toISOString()">
          <div style="text-align: center;padding: 10px 0">
            <span>{{'星期' + weekDay[day.day.getDay()]}}</span>
          </div>
          <div class="border"
               :class="{'select':checkDateEqual(day.day,selectedDate)}">
            <div style="background: #f6f6f6;color: gray;padding: 10px">
              <span>{{dateFormat(day.day)}}</span>
            </div>
            <div v-for="time in day.data"
                 :key="time.time.getTime()"
                 class="time">
              <div style="color: gray;padding: 10px">{{getTime(time.time)}}</div>
              <div v-for="item in time.items"
                   :key="item.ID"
                   style="background: #D5FFFF;margin-bottom: 5px">
                <div v-if="currentTab==='statistic'">
                  <div style="display: flex;padding: 5px;align-items: center">
                    <img :src="require(`../../assets/images/flags/${item.country}.png`)"
                         style="flex-grow: 0;height: 15px;margin-right: 5px">
                    <span style="color: #2c8abf;font-size: 12px"
                          v-html="item.indicator+((!item.unit||item.unit==='%')?'':'（'+item.unit+'）')"></span>
                  </div>
                  <div style="display: flex;justify-content: space-around"
                       class="values">
                    <div>
                      <span>前值</span>
                      <span v-html="item.previous+(item.unit==='%'?'%':'')">
                    </span>
                    </div>
                    <div>
                      <span>预测值</span>
                      <span v-html="item.estimate=='0'?'-':item.estimate+(item.unit==='%'?'%':'')">
                    </span>
                    </div>
                    <div>
                      <span>公布值</span>
                      <span v-html="item.announce+(item.unit==='%'?'%':'')">
                    </span>
                    </div>
                  </div>
                </div>
                <div v-if="currentTab==='schedule'"
                     style="font-size: 12px  ">
                  <div style="padding: 5px;align-items: center;cursor: pointer"
                       @click="showModal(item)">
                    <span style="color: #2c8abf;"
                          v-html="item.title"></span>
                  </div>
                  <div v-if="item.type===1"
                       style="padding: 5px;align-items: center">
                    <div v-if="item.dial">
                      <span>接入号码：</span>
                      <span v-html="item.dial"></span>
                    </div>
                    <div v-if="item.password">
                      <span>参会密码：</span>
                      <span v-html="item.password"></span>
                    </div>
                  </div>

                  <div v-if="item.type===2"
                       style="padding: 5px;align-items: center">
                    <div v-if="item.location">
                      <span>地点：</span>
                      <span v-html="item.location"></span>
                    </div>
                    <div v-if="item.guest">
                      <span>嘉宾：</span>
                      <span v-html="item.guest"></span>
                    </div>
                    <div v-if="item.contact">
                      <span>联系人：</span>
                      <span v-html="item.contact"></span>
                    </div>
                  </div>
                </div>
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
  import {dateString, twoDigitNumber, weekDay, dateFormat, checkDateEqual} from '../../utils'
  import EventBus from '../../eventBus'

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
        currentTab: null,
        dataObj: {},
        calendar1Data: {},
        calendar2Data: {},
        selectedDate: null,
        calendarType: null,
        weekFirstDay: null,
        shownData: {},
        searchResult: null,
        dayShownData: null,
        weekShownData: null,
        weekDay
      }
    },
    computed: {
      dayShown() {
        if (!this.selectedDate) return
        if (this.searchResult) {
          console.log('return search result')
          return this.searchResult
        }
        const dayData = this.shownData[dateString(this.selectedDate)]
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
        this.dayShownData = data
        return data
      },
      weekShown() {
        if (!this.weekFirstDay) return
        if (this.searchResult) return this.searchResult
        const weekData = []
        let weekDay = this.weekFirstDay
        for (let i = 0; i < 7; i++) {
          const dayData = this.shownData[dateString(weekDay)]
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
        this.weekShownData = weekData
        return weekData
      }
    },
    methods: {
      searchMethod(searchStr, selected, dataObj) {
        console.log(searchStr, selected, dataObj)
        const {calendarType, currentTab} = this
        const regx = new RegExp(searchStr)
        let searchResult = []
        if (calendarType === 'day') {
          dataObj.forEach((data) => {
            const resultItems = []
            data.items.map(item => {
              let checked = []
              if (currentTab === 'schedule') {
                  checked = ['title', 'content']
              }

              if (currentTab === 'statistic') {
                  checked = ['indicator', 'announce', 'unit', 'estimate', 'previous', 'institution']
              }


              if (checked.some((key) => !item[key] ? false : String(item[key])
                  .search(regx) !== -1)) {
                resultItems.push(checked.reduce((prev, key) => {
                  return {
                    ...prev,
                    [key]: (!item[key]) ? item[key] : String(item[key])
                      .replace(searchStr, `<span style="color: red;">${searchStr}</span>`)
                  }
                }, {...item}))
              }
            })
            if (resultItems.length > 0) {
              searchResult.push({
                                  ...data,
                                  items: resultItems
                                })
            }
          })
        }

        if (calendarType === 'week') {
          searchResult = dataObj.map((day) => {
            let data = day.data
            let tempResult = []
            if (data) {
              data.forEach((data) => {
                const resultItems = []
                data.items.map(item => {
                  let checked = []
                  if (currentTab === 'schedule') {
                    checked = ['title', 'content', 'dial', 'password', 'location', 'contact', 'guest']
                  }

                  if (currentTab === 'statistic') {
                    checked = ['indicator', 'announce', 'unit', 'estimate', 'previous', 'institution']
                  }


                  if (checked.some((key) => !item[key] ? false : String(item[key])
                      .search(regx) !== -1)) {
                    resultItems.push(checked.reduce((prev, key) => {
                      return {
                        ...prev,
                        [key]: (!item[key]) ? item[key] : String(item[key])
                          .replace(searchStr, `<span style="color: red;">${searchStr}</span>`)
                      }
                    }, {...item}))
                  }
                })
                if (resultItems.length > 0) {
                  tempResult.push({
                                    ...data,
                                    items: resultItems
                                  })
                }
              })
            }
            return {
              ...day,
              data: tempResult,
            }
          })
        }
        return searchResult
      },
      dateFormat,
      checkDateEqual,
      showModal(schedule) {
        EventBus.$emit('scheduleModal', schedule)
      },
      getTime(date) {
        return `${twoDigitNumber(date.getUTCHours())}:${twoDigitNumber(date.getMinutes())}`
      },
      tabChanged(menu) {
        this.searchResult = null
        if (this.currentTab === menu.key) return
        this.currentTab = menu.key
        if (this.currentTab === 'statistic') {
          this.shownData = this.calendar1Data
        } else {
          this.shownData = this.calendar2Data
        }

      },
      onSearch(searchResult) {
        this.searchResult = searchResult
        console.log('search result', searchResult)
      },
      onDateChange(date) {
        this.selectedDate = date
        const day = this.selectedDate.getDay()
        this.weekFirstDay = new Date(this.selectedDate.getTime() - 60 * 60 * 24 * (day === 0 ? 6 : (day - 1)) * 1000) // will return firstday (i.e. Monday) of the week
        this.searchResult = null
      },
      onCalendarTypeChange(type) {
        this.searchResult = null
        this.calendarType = type
      }
    },
    mounted() {
      Promise.all([this.$http.get('/api/calendar/calendar1'), this.$http.get('/api/calendar/calendar2')])
             .then(([res1, res2]) => {
               const calendar1Data = {}
               res1.data.forEach((data) => {
                 if (!calendar1Data[data.riqi]) {
                   calendar1Data[data.riqi] = {}
                 }
                 if (!calendar1Data[data.riqi][data.riqi_detail]) {
                   calendar1Data[data.riqi][data.riqi_detail] = []
                 }
                 calendar1Data[data.riqi][data.riqi_detail].push(data)
               })
               this.calendar1Data = calendar1Data

               const calendar2Data = {}
               res2.data.forEach((data) => {
                 const day = new Date(data.riqi_detail)
                 const riqi = dateString(day)
                 if (!calendar2Data[riqi]) {
                   calendar2Data[riqi] = {}
                 }
                 if (!calendar2Data[riqi][data.riqi_detail]) {
                   calendar2Data[riqi][data.riqi_detail] = []
                 }
                 calendar2Data[riqi][data.riqi_detail].push(data)
               })
               this.calendar2Data = calendar2Data

               this.shownData = this.currentTab === 'statistic' ? calendar1Data : calendar2Data
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
    .day-calendar {
      .time {
        border-left: 1px solid #f6f6f6;
        border-right: 1px solid #f6f6f6;
        width: 80px;
        text-align: center;
        vertical-align: middle;
        padding-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .item {
        display: flex;
        min-height: 30px;
        padding: 5px 10px;
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

    .week-calendar {
      border: 1px solid lightgray;
      display: flex;
      .day {
        flex: 1 0 auto;
        width: 0
      }
      .border {
        &.select {
          border: 2px solid #2c8abf;
        }
        > div {
          border: 1px solid lightgray;
        }
      }

      .values {
        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          span {
            margin-bottom: 5px;
            &:first-child {
              color: gray;
            }
          }
        }
      }
    }

  }


</style>
