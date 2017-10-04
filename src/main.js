// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import './assets/styles/main.css'
import './assets/font/iconfont.css'
import './assets/styles/animate.css'
import $ from 'jquery'
import Icon from 'vue-awesome/components/Icon.vue'
import Button from './directives/button'
Vue.prototype.$http = axios
Vue.config.productionTip = false



Vue.directive('button',Button)


Vue.component('icon',Icon)


new Vue({
          el: '#app',
          router,
          render: h => h(App),
        })
