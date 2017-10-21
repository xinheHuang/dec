<!--node弹窗-->
<template>

  <modal @close="close()">
    <div slot="body" style="overflow: hidden">
      <embed :src=modalData class="pdf" type='application/pdf'>
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
  .pdf{
    width: 100%;
    height: 390px;
  }

</style>
