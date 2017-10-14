// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './app.vue'
import httpUtil from './utils/httpUtil'
import './assets/styles/main.css'
import './assets/font/iconfont.css'
// import './assets/styles/animate.css'
// import './assets/styles/common.less'
import $ from 'jquery'
import swal from 'sweetalert'
import Icon from 'vue-awesome/components/Icon.vue'
import Button from './directives/button'
import VTooltip from 'v-tooltip'

Vue.prototype.swal = swal
Vue.prototype.$http = httpUtil
Vue.config.productionTip = false

Vue.directive('button', Button)
Vue.use(VTooltip)

Vue.component('icon', Icon)


new Vue({
          el: '#app',
          router,
          render: h => h(App),
        })
