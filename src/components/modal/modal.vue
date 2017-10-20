<!--弹窗-->
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <div class="close"  @click="$emit('close')">
              <icon name="times-circle"/>
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

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>

</style>
