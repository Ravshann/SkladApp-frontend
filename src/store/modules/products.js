
export default {
  namespaced: true,
  state: {
    products: [],
  },
  getters: {
    get_products: function (state) {
      return state.products;
    },
  },
  mutations: {
    load_products: function (state, payload) { state.products = payload; },
  },
}
