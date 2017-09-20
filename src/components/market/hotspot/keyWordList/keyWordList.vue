<!--关键字文章列表-->
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
        <div
          @click="openModal(item)"
          class="item-title"><p>{{
          dotString(item.title, 47)
          }}
        </p></div>
        <div class="divider"
             style="margin: 0 10px"></div>
        <div style="display: flex;justify-content: space-around">
          <div class="item-detail">
            <div class="icon iconcalendar icon-calendar-o"></div>
            <div>{{dateFormat(item.date)}}</div>
          </div>

          <div class="item-detail">
            <div class="icon iconcalendar icon-eye"
                 style="font-size: 20px"></div>
            <div>{{item.num_read}}</div>
          </div>

          <div class="item-detail">
            <div class=" icon icon-like iconfont"></div>
            <div>{{item.num_like}}</div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import '../../../../assets/font/calendar/style.css'
  import EventBus from '../../../../eventBus'
  import { dotString, dateFormat } from '../../../../utils'
  //  console.log(dotString);
  export default {
    props: {
      keyWordList: {
        type: Object,
        required: true,
      }
    },
    methods: {
      openModal(item) {  //
        EventBus.$emit('articleModal', item)
      },
      dotString,
      dateFormat
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
    line-height: 25px;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    margin-bottom: 10px;
    word-wrap: break-word;
    word-break: break-all;
    cursor: pointer;
  }

  .item-detail > * {
    width: 60px;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    line-height: 14px;
    vertical-align: middle;
  }

  .item-detail .icon {
    color: #e2dddd;

  }
</style>
