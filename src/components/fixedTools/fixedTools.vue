<template>
  <div class="fixedTools">
    <transition name="zoom">
      <div v-if="showFixedQRcode"
           class="qrcode-tips">
        <icon name="qrcode"
              class="icon"></icon>
        <p>为你推送和解读最前沿、最有料的创投资讯</p>
      </div>
    </transition>
    <div class="fixedToolsQrcode"
         @mouseenter="showFixedQRcode = true"
         @mouseleave="showFixedQRcode = false">
      <icon name="qrcode"
            class="icon"></icon>
    </div>
    <div class="fixedToolsTop"
         @click="scrollTop()">
      <icon name="angle-up"
            class="icon"/>
    </div>
  </div>
</template>

<script>


  export default {
    data() {
      return {
        showFixedQRcode: false,
      }
    },
    methods: {
      scrollTop() {
        window.scrollTo(0, 0)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>
  @import (reference) '../../assets/styles/common';
  .fixedTools {
    position: fixed;
    right: 0;
    bottom: 6rem;
    display: inline-block;
    background: #fff;
//    .basic-border;
    .fixedToolsQrcode, .fixedToolsTop {
      width: 50px;
      height: 50px;
      cursor: pointer;
      display: flex;
      .basic-border;
      align-items: center;
      justify-content: center;
      .icon {
        height: 33px;
        width: 33px;
        color: @icon-gray;
      }
    }

    .fixedToolsTop {
      border-top: none;
    }

    .qrcode-tips {
      position: absolute;
      background: @white;
      width: 21rem;
      left: -25rem;
      bottom: -1rem;
      padding: 1.5rem;
      .basic-border;
      .icon {
        width: 7rem;
        height: 7rem;
        float: left;
      }
      p {
        margin-top: 2rem;
        margin-left: 8rem;
      }
    }

  }

</style>
