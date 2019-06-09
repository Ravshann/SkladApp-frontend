import Vue from 'vue'
import Vuex from 'vuex'
import incoming from './modules/incoming'
import outgoing from './modules/outgoing'
import suppliers from './modules/suppliers'
import clients from "./modules/clients"
import categories from "./modules/categories"
import storages from "./modules/storages"
import products from "./modules/products"
import remainders from "./modules/remainders"
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        outgoing,
        incoming,
        suppliers,
        clients,
        storages,
        products,
        categories,
        remainders,
    },

})