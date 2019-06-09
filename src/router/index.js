import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Dashboard'
import Login from '@/components/Login.vue'
import Outgoing from "../components/outgoing_component/Outgoing"
import Incoming from "../components/incoming_component/Incoming"
import Remainder from "../components/remainder_component/Remainder"

Vue.use(Router);

const routes = [

  { path: '/login', name: "login", component: Login },
  {
    path: '/', name: "", component: Dashboard,
    children: [
      { path: "", component: Remainder },
      { path: "outgoing", name: "outgoing", component: Outgoing },
      { path: "incoming", name: "incoming", component: Incoming },
    ]
  },

]
export default new Router({
  routes
})