<template>
  <div class="bar">
    <div class="week">

    </div>
    <div class="button-group">
      <span @click="selectType('day')" :class="{selected:calendarType=='day'}">
        日历
      </span>
      <span @click="selectType('week')" :class="{selected:calendarType=='week'}">
        周历
      </span>
      <span class="today">
        回到今日
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        calendarType:'day',
        currentWeekStartDate:
      }
    },
    methods:{
      selectType(type){
        this.calendarType=type;
      },
      getDateWeek(date){
        const day = date.getDay();
        const firstday = new Date(date.getTime() - 60*60*24* day*1000); // will return firstday (i.e. Sunday) of the week
        const lastday = new Date(date.getTime() + 60 * 60 *24 * 6 * 1000); // adding (60*60*6*24*1000) means adding six days to the firstday which results in lastday (Saturday) of the week
      }
    }
  }
</script>
<style lang="less" scoped>
  .bar{
    background: white;
    padding: 10px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .button-group{
    display: flex;
    span{
      padding: 2px 5px;
      margin: 0 10px;
      cursor: pointer;
      &.selected{
        color: #2c8abf;
      }
    }
    .today{
      color: #2c8abf;
      border: solid 1px #2c8abf;
      border-radius: 5px;
    }
  }


</style>
