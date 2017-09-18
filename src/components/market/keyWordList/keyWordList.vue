<template>
  <div style="width:200px;padding: 16px 50px 0">
    <div class="key">
      <div>
        {{keyWordList.key}}
      </div>
      <div>
        总阅读数：{{keyWordList.readNumber}}
      </div>
    </div>
    <div class="items">
      <div v-for="item in keyWordList.items"
           class="item">
        <div class="item-title">{{item.title}}</div>
        <div class="divider"></div>
        <div style="display: flex;justify-content: space-around">
          <div class="item-detail">
            <div class="icon iconcalendar icon-calendar-o"></div>
            <div>{{item.date}}</div>
          </div>

          <div class="item-detail">
            <div class="icon iconcalendar icon-eye"></div>
            <div>{{item.readNumber}}</div>
          </div>

          <div class="item-detail">
            <div class=" icon icon-like iconfont"></div>
            <div>{{item.like}}</div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../assets/font/calendar/style.css'
  export default {
    props: {
      keyWordList: {
        type: Object,
        required: true,
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .key {
    text-align: center;
    background: #e2dddd;
    padding: 10px 0;
    margin-bottom: 20px;
  }

  .key:hover {
    background: #2c8abf;
    color: white;
  }

  .item {
    border: 2px solid #e2dddd;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
  }

  .item-title {
    /*white-space: nowrap;*/
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-bottom: 10px;
  }

  .divider {
    height: 1px;
    background-color: #e2dddd;
    margin: 0 10px;
  }

  .item-detail > * {
    width:50px;
    margin-top: 10px;
    text-align: center;
    font-size:14px;
    line-height: 14px;
    vertical-align: middle;
  }

  .item-detail .icon{
    color:#e2dddd;

  }
</style>
