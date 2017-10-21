<!--node弹窗-->
<template>

  <modal @close="close()">
    <div slot="body" style="overflow: hidden;text-align: center">
      <img :src=modalData class="image" />
    </div>
  </modal>
</template>

<script>
  import Modal from 'Component/modal/modal.vue'
  import EventBus from '@/eventBus'

  export default {
    props: {
      modalData:String
    },
    data() {
      return {
      }
    },
    methods: {

      close(){
        EventBus.$emit('closeModal');
      },

    },
    components: {
      Modal,
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>
  .img{
    width: auto;
    height: 390px;
  }

</style>
