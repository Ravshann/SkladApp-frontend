
export default {
  namespaced: true,
  state: {
    suppliers: [],
  },
  getters: {
    get_suppliers(state) {
      return state.suppliers;
    }
  },
  mutations: {
    load_suppliers(state, payload) { state.suppliers = payload; },
  },
}
