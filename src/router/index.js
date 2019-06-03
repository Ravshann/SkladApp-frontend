import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Login from '@/components/Login'

Vue.use(Router);

const routes = [
  // { path: '/', name: "login", component: Login },
  { path: '/', name: "dashboard", component: Dashboard }
]
export default new Router({
  routes
})