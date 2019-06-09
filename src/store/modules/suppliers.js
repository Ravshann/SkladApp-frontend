
export default {
  namespaced: true,
  state: {
    suppliers: [],
  },
  getters: {
    get_suppliers: function (state) {
      return state.suppliers;
    },
  },
  mutations: {
    load_suppliers: function (state, payload) { state.suppliers = payload; },
  },
}
