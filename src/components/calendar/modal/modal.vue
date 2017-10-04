<!--文章弹窗-->
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <div class="close">
              <a class="icon-close icon-circle-with-cross"
                 @click="$emit('close')"></a>
            </div>
            <div style="text-align: center">
              <h3 style="color:black;">
                {{schedule.title}}
              </h3>
            </div>
            <div class="info">
              <span><icon name="calendar-o" /><span>{{dateFormat(new Date(schedule.riqi_detail))}}</span></span>
              <span><icon name="user"/><span>{{schedule.author}}</span></span>
            </div>
            <div class="divider"></div>
          </div>

          <div class="modal-body">
            <div v-html="schedule.content">

            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import 'vue-awesome/icons/user'
  import 'vue-awesome/icons/calendar-o'
  import '../../../assets/font/calendar/style.css'
  import '../../../assets/font/close/style.css'
  import { dateFormat } from '../../../utils'

  export default {
    props: {
      schedule: {  //弹窗文章的属性
        type: Object,
        required: true,
      }
    },
    methods: {
      dateFormat
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  .close {
    display: flex;
    flex-direction: row-reverse;
    font-size: 18px;
    color: #6b6868;
    cursor: pointer;
    top: 0;
    margin-bottom: 5px
  }

  .info {
    display: flex;
    justify-content: center;
    color: #6b6868;
    font-size: 14px;
    margin-bottom: 5px;
    >span {
      display: flex;
      align-items: center;
      margin-right: 20px;
      >span{
        margin-left: 10px;
      }
    }
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 900px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
    max-height: 200px;
    overflow-y: auto;
  }

  .modal-default-button {
    float: right;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
