import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Dashboard'
import Login from '@/components/Login.vue'
import Outgoing from "../components/outgoing_component/Outgoing"
import Incoming from "../components/incoming_component/Incoming"
import Remainder from "../components/remainder_component/Remainder"
import Returned from "../components/returned_component/Returned"
import Defected from "../components/defected_component/Defected"
import Clients from "../components/clients_component/Clients"
import Products from "../components/products_component/Products"
import suppliers from "../components/suppliers_component/Suppliers"
import storages from "../components/storages_component/Storages"
Vue.use(Router);

const routes = [

  { path: '/login', name: "login", component: Login },
  {
    path: '/', name: "", component: Dashboard,
    children: [
      { path: "", component: Remainder },
      { path: "outgoing", name: "outgoing", component: Outgoing },
      { path: "incoming", name: "incoming", component: Incoming },
      { path: "returned", name: "returned", component: Returned },
      { path: "defected", name: "defected", component: Defected },
      { path: "clients", name: "clients", component: Clients },
      { path: "products", name: "products", component: Products },
      { path: "suppliers", name: "suppliers", component: suppliers },
      { path: "storages", name: "storages", component: storages },
    ]
  },

]
export default new Router({
  routes
})