import Vue from 'vue'
import Router from 'vue-router'
import News from '../components/news/news.vue'
import Market from '../components/market/market.vue'
import Calendar from '../components/calendar/calendar.vue'
import Graph from '../components/graph/graph.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'news',
      component: News
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/market',
      name: 'market',
      component: Market
    },
    {
      path:'/graph/:id',
      name: 'graph',
      component: Graph
    }
  ]
})
