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
import date from "./modules/date"
import defected from "./modules/defected"
import returned from "./modules/returned"
import attributes from "./modules/attributes"
import companies from "./modules/companies"
import users from "./modules/users"
import roles from "./modules/roles"
import departments from "./modules/departments"
import department_managers from "./modules/department_managers"
import storage_managers from "./modules/storage_managers"
import logged_user from "./modules/logged_user"


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
        date,
        defected,
        returned,
        attributes,
        companies,
        users,
        roles,
        departments,
        department_managers,
        storage_managers,
        logged_user
    },

})