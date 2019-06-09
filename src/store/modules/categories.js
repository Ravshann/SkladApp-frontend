
export default {
  namespaced: true,
  state: {
    categories: [],
  },
  getters: {
    get_categories: function (state) {
      return state.categories;
    },
  },
  mutations: {
    load_categories: function (state, payload) { state.categories = payload; },
  },
}
