<template>
  <div class="fixedTools">
    <transition mode="out-in"
                enter-active-class="animated zoomInLeft"
                leave-active-class="animated zoomOutRight">
      <div v-if="showFixedQRcode"
           class="qrcode-tips">
        <icon name="qrcode" class="icon"></icon>
        <!--<img src="../../assets/images/QRcode.jpg">-->
        <p>为你推送和解读最前沿、最有料的创投资讯</p>
      </div>
    </transition>
    <div class="fixedTools__qrcode"
         @mouseenter="moveOnFixdedToolsQR"
         @mouseleave="moveOutFixdedToolsQR">
      <!--<i class="iconfont icon-qrcode"></i>-->
      <icon name="qrcode" class="icon"></icon>
    </div>
    <div class="fixedTools__top"
         @click="scrollTop()">
      <i class="iconfont icon-up"></i>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons/qrcode'
  export default {
    data() {
      return {
        showFixedQRcode: false,
      }
    },
    methods: {
      moveOnFixdedToolsQR() {
        this.showFixedQRcode = true
      },
      moveOutFixdedToolsQR() {
        this.showFixedQRcode = false
      },
      scrollTop(){
        window.scrollTo(0,0)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fixedTools {
    position: fixed;
    right: 0;
    bottom: 6rem;
    display: inline-block;
    background: #fff;
    border: 1px solid #d6d2d2;
  }

  .fixedTools__qrcode, .fixedTools__top {
    width: 3rem;
    height: 3rem;
    cursor: pointer;
  }

  .fixedTools__qrcode .icon {
    height: 33px;
    width: 33px;
    display: inline-block;
    margin: 8px;
    color: #9e9696;
  }

  .fixedTools__top {
    border-top: 1px solid #d6d2d2;
  }

  .fixedTools__top i {
    font-size: 14px;
    color: #9e9696;
    margin-left: 13px;
    margin-top: 15px;
    font-weight: bold;
    display: inline-block;
  }

  .qrcode-tips {
    position: absolute;
    background: #fff;
    width: 21rem;
    left: -25rem;
    bottom: -1rem;
    padding: 1.5rem;
    border: 1px solid #e2e2e2;
    animation-duration: 0.5s !important;
  }

  .qrcode-tips .icon {
    width: 7rem;
    height: 7rem;
    float: left;
  }

  .qrcode-tips p {
    margin-top: 2rem;
    margin-left: 8rem;
  }
</style>
