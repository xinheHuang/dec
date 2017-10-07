import Vue from 'vue'
import Router from 'vue-router'
import News from '../components/main/news/news.vue'
import Market from '../components/main/market/market.vue'
import Calendar from '../components/main/calendar/calendar.vue'
import Graph from '../components/main/graph/graph.vue'
import Main from '../components/main/main.vue'
import Login from '../components/login/login.vue'

Vue.use(Router)

export default new Router(
  {
    routes: [
      {
        path: '/',
        redirect: '/main',
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/main',
        redirect: '/news',
        component: Main,
        children: [
          {
            path: '/news',
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
            path: '/graph/:id',
            name: 'graph',
            component: Graph
          }
        ]
      }
    ]
  }
)
