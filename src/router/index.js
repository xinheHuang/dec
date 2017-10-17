import Vue from 'vue'
import Router from 'vue-router'
import News from 'View/main/news/news.vue'
import Market from 'View/main/market/market.vue'
import Calendar from 'View/main/calendar/calendar.vue'
import Main from 'View/main/main.vue'
import Login from 'View/login/login.vue'
import Home from 'View/main/home/home.vue'
import Profile from 'View/main/profile/profile.vue'
import GraphEdit from 'View/main/graphEdit/graphEdit.vue'

Vue.use(Router)

export default new Router(
  {
    mode: 'history',
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
        redirect: '/home',
        component: Main,
        children: [
          {
            path: '/profile',
            name: 'profile',
            component: Profile
          },
          {
            path: '/home',
            name: 'home',
            component: Home
          },
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
            path: '/graphEdit/:entity',
            name: 'graphEdit',
            component: GraphEdit,
            props: true
          }
        ]
      }
    ],
    scrollBehavior(to, from, savedPosition) {
      console.log('scrollBehavior ',to,from,savedPosition)
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
)
