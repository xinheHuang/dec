<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import EventBus from './eventBus'

  export default {
    mounted() {
      EventBus.$on('errorDialog', ({title = '错误', text = '', callback}) => {

        this.swal(
          {
            title,
            text,
            icon: 'error',
          }
        )
            .then(() => {
              if (callback)
                callback()
            })
      })

      EventBus.$on('login', () => {

        if (this.$route.name == 'login') {
          return
        }
        this.$router.push({
                            path: '/login',
                            query: {redirect: this.$route.path}
                          })
      })
    }
  }
</script>

<style lang="less">
  @import './assets/styles/common';
  @import './assets/styles/animate';
  @import './assets/styles/modal';

  #app {
    height: 100%;
  }
</style>
