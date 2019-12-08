import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import App from './App.vue'
import './plugins/vuetify'

import Vuetify from 'vuetify'
import router from './router'
import store from './store'
import JsonExcel from 'vue-json-excel'
import SaveChangesDialog from "./components/global_components/SaveChangesDialog";
import InformDialogDone from "./components/global_components/InformDialog";
import DataPickMenu from "./components/global_components/DataPickMenu";

Vue.component('downloadExcel', JsonExcel)
Vue.component('save-changes-dialog', SaveChangesDialog)
Vue.component('inform-dialog-done', InformDialogDone)
Vue.component('data-pick-menu', DataPickMenu)

Vue.config.productionTip = true

Vue.use(Vuetify, {
  iconfont: 'fa',
  icons: {
    'right_arrow': 'fas fa-chevron-right',
    'export': 'fas fa-upload',
    'import': 'fas fa-download',
    'return': 'fas fa-undo-alt',
    'defects': 'fas fa-recycle',
    'clients': 'fas fa-hand-holding-usd',
    'goods': 'fas fa-cubes',
    'manager_users_icon': 'fas fa-user-tie',
    "excel_icon": 'fas fa-file-excel',
    "search_icon": 'fas fa-search',
    "period_icon": "fas fa-history",
    "movement": "fas fa-exchange-alt",
    "money": "fas fa-dollar-sign"
  },
  theme: {
    nav_drawer: '#293242',
    white: '#ffffff'
  }
})


new Vue({
  render: h => h(App),
  router: router,
  store: store,
}).$mount('#app')
