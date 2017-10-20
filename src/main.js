// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './app.vue'
import './assets/styles/main.css'
import 'Asset/icon'
import HttpUtil from 'Util/httpUtil'
import Swal from 'sweetalert'
import Button from './directives/button'
import VTooltip from 'v-tooltip'

Vue.prototype.swal = Swal;
Vue.prototype.$http = HttpUtil
Vue.config.productionTip = false

Vue.directive('button', Button)
Vue.use(VTooltip)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
