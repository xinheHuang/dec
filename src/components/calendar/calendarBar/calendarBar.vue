<template>
  <div class="bar">
    <div class="week">
      <div @click="prevWeek()"><span class="iconarrow icon-chevron-circle-left"
                                     style="margin-right: 5px "></span><span>上一周</span></div>
      <div v-for="weekDay in getDateWeek"
           class="weekDay"
           @click="selectDate(weekDay)"
           :class="{'selected':checkDateEqual(selectedDate,weekDay)}">
        {{weekDayFormat(weekDay)}}
      </div>
      <div @click="nextWeek()"><span>下一周</span><span class="iconarrow icon-chevron-circle-right"
                                                     style="margin-left: 5px "></span></div>
    </div>
    <div class="button-group">
      <span @click="selectType('day')"
            :class="{selected:calendarType=='day'}">
        日历
      </span>
      <span @click="selectType('week')"
            :class="{selected:calendarType=='week'}">
        周历
      </span>
      <span class="today"
            @click="toToday()">
        回到今日
      </span>
    </div>
  </div>
</template>
<script>
  import { weekDayFormat, checkDateEqual } from '../../../utils'
  import '../../../assets/font/arrow/style.css'

  export default {
    data() {
      return {
        calendarType: null,
        selectedDate: null,
        weekFirstDay: null,
      }
    },
    computed: {
      getDateWeek() {
        if (!this.weekFirstDay) return []
        const week = []
        let weekDay = this.weekFirstDay
        for (let i = 0; i < 7; i++) {
          week.push(weekDay)
          weekDay = new Date(weekDay.getTime() + 60 * 60 * 24 * 1000)
        }
        return week
      }
    },
    methods: {
      selectType(type) {
        if (type === this.calendarType) return
        this.calendarType = type
        this.$emit('typeChange', type)
      },
      selectDate(date) {
        if (this.checkDateEqualdate, this.selectecDate) return
        this.selectedDate = date
        this.$emit('dateChange', date)
      },
      prevWeek() {
        this.weekFirstDay = new Date(this.weekFirstDay.getTime() - 7 * 60 * 60 * 24 * 1000)
      },
      nextWeek() {
        this.weekFirstDay = new Date(this.weekFirstDay.getTime() + 7 * 60 * 60 * 24 * 1000)
      },
      toToday() {
        this.selectDate(new Date()) //test
        const day = this.selectedDate.getDay()
        this.weekFirstDay = new Date(this.selectedDate.getTime() - 60 * 60 * 24 * (day === 0 ? 6 : (day - 1)) * 1000) // will return firstday (i.e. Monday) of the week
      },
      weekDayFormat,
      checkDateEqual
    },
    mounted() {
//      this.selectType('day')
      this.selectType('day') //test
      this.toToday()
    }
  }
</script>
<style lang="less"
       scoped>
  .bar {
    background: white;
    padding: 10px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .week {
      width: 70%;
      display: flex;
      justify-content: space-around;
      > div {
        padding: 5px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.weekDay {
          &.selected {
            color: #2c8abf;
          }
        }
        &:first-child, &:last-child {
          background: #f6f6f6;
          border: 1px solid #f6f6f6;
          border-radius: 20px;
        }
      }
    }
  }

  .button-group {
    display: flex;
    span {
      padding: 2px 5px;
      margin: 0 10px;
      cursor: pointer;
      &.selected {
        color: #2c8abf;
      }
    }
    .today {
      color: #2c8abf;
      border: solid 1px #2c8abf;
      border-radius: 5px;
    }
  }


</style>
