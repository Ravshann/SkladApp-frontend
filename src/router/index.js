import Vue from 'vue'
import Router from 'vue-router'
import Remainder from '@/components/Remainder'
import Login from '@/components/Login'

Vue.use(Router);

export default new Router({ 
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/remainder',
      name: 'remainder',
      component: Remainder
    }
  ]
})