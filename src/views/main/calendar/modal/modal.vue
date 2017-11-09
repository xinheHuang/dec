<!--文章弹窗-->
<template>
  <modal @close="close()">
    <div slot="title">
      <div style="text-align: center">
        <h3 style="color:black;">
          {{modalData.title}}
        </h3>
      </div>
      <div class="info">
        <span><icon name="calendar-o" /><span>{{dateFormat(new Date(modalData.time))}}</span></span>
        <span><icon name="user"/><span>{{modalData.author}}</span></span>
      </div>
      <div class="divider"></div>
    </div>
    <div slot="body">
      <div v-html="modalData.content">

      </div>
    </div>
  </modal>
</template>

<script>
  import modal from 'Component/modal/modal.vue'

  import { dateFormat } from 'Util'
  import EventBus from '@/eventBus'

  export default {
    props: {
      modalData: {  //弹窗文章的属性
        type: Object,
        required: true,
      }
    },
    methods: {
      close(){
        EventBus.$emit('closeModal')
      },
      dateFormat
    },
    components:{
      modal
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

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

</style>
