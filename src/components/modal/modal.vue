<!--弹窗-->
<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="close" >
              <div  @click="$emit('close')">
              <icon name="times-circle"/>
              </div>
            </div>
            <slot name="title"/>
          </div>

          <div class="modal-body">
            <slot name="body"/>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    mounted(){
//      $(this.$el).find('.modal-mask').focus();
//      $(this.$el).find('.modal-mask').keyup((e)=>{
//        console.log('keyup',e)
//      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>

</style>
