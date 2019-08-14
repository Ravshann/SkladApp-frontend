import Vue from 'vue'
import axios from "axios"
import Router from 'vue-router'
import store from '../store'
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
import categories from "../components/categories_component/Categories"
import attributes from "../components/attributes_component/Attributes"
import companies from "../components/companies_component/Companies"
import users from "../components/users_component/Users"
import departments from "../components/departments_component/Departments"
import PageNotFound from "../components/global_components/PageNotFound"

import RepositoryFactory from "../services/RepositoryFactory";
const repository = RepositoryFactory.get("login_control");
const storagesRepository = RepositoryFactory.get("storages");
Vue.use(Router);


async function refresh_token(token_object) {
  const { data } = await repository.refresh_token(token_object);
  return data;
}
async function getStorage(user_ID) {
  const { data } = await storagesRepository.get_single(user_ID);
  return data;
}
function login_guard(to, from, next) {
  let token = localStorage.getItem("sklad-user-token");

  if (store.getters['logged_user/get_logged_status']) {
    next();
  } else if (token !== null) {

    let new_credentials = refresh_token({ "token": token });
    new_credentials.then(result => {

      if (result.message === undefined) {
        store.commit("logged_user/load_user_token", result.token);
        store.commit("logged_user/load_user_status", true);
        store.commit("logged_user/load_user_role", result.role);
        store.commit("logged_user/load_username", result.username);
        store.commit("logged_user/load_user_ID", result.user_ID);
        localStorage.removeItem("sklad-user-token");
        localStorage.setItem("sklad-user-token", result.token);
        axios.defaults.headers.common.Authorization = "Bearer " + result.token;

        if (result.role === "Завсклад") {

          let storage = getStorage(result.user_ID);
          storage.then(stor => {
            var array = [stor];
            store.commit("storages/load_storages", array);
          });
        }
        next();
      }
      else {
        next("/login");
      }
    });
  }
  else {
    next("/login");
  }
}

function token_check(to, from, next) {
  let token = localStorage.getItem("sklad-user-token");
  if (token !== null) {
    let new_credentials = refresh_token({ "token": token });

    new_credentials.then(result => {
      if (result.message === undefined) {

        store.commit("logged_user/load_user_token", result.token);
        store.commit("logged_user/load_user_status", true);
        store.commit("logged_user/load_user_role", result.role);
        store.commit("logged_user/load_username", result.username);
        store.commit("logged_user/load_user_ID", result.user_ID);
        localStorage.removeItem("sklad-user-token");
        localStorage.setItem("sklad-user-token", result.token);
        axios.defaults.headers.common.Authorization = "Bearer " + result.token;

        if (result.role === "Завсклад") {
          let storage = getStorage(result.user_ID);
          storage.then(stor => {
            var array = [stor];
            store.commit("storages/load_storages", array);
          })
        }
        next("/");
      }
      else {
        next("/login");
      }
    });
  }
  next();
}


function first_access_level_guard(to, from, next) {
  let role = store.getters['logged_user/get_user_role'];
  if (role === "admin" || role === "Оффис") {
    next();
  }
  else {
    next(from);
  }
}

function second_access_level_guard(to, from, next) {
  let role = store.getters['logged_user/get_user_role'];
  if (role === "admin") {
    next();
  }
  else {
    next(from);
  }
}


const routes = [

  {
    path: '/login', name: "login", component: Login, beforeEnter: token_check,
  },
  {
    path: '/', name: "", component: Dashboard, beforeEnter: login_guard,
    children: [
      { path: "", component: Remainder },
      { path: "outgoing", name: "outgoing", component: Outgoing },
      { path: "incoming", name: "incoming", component: Incoming },
      { path: "returned", name: "returned", component: Returned },
      { path: "defected", name: "defected", component: Defected },

      { path: "products", name: "products", component: Products, beforeEnter: first_access_level_guard },
      { path: "categories", name: "categories", component: categories, beforeEnter: first_access_level_guard },
      { path: "attributes", name: "attributes", component: attributes, beforeEnter: first_access_level_guard },

      { path: "departments", name: "departments", component: departments, beforeEnter: first_access_level_guard },
      { path: "clients", name: "clients", component: Clients },
      { path: "suppliers", name: "suppliers", component: suppliers, beforeEnter: first_access_level_guard },
      { path: "storages", name: "storages", component: storages, beforeEnter: first_access_level_guard },
      { path: "users", name: "users", component: users, beforeEnter: first_access_level_guard },

      { path: "companies", name: "companies", component: companies, beforeEnter: second_access_level_guard },

    ]
  },
  { path: "*", component: PageNotFound }

]
export default new Router({
  mode: 'history',
  routes
})