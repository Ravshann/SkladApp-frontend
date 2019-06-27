
export default {
  namespaced: true,
  state: {
    categories: [],
  },
  getters: {
    get_categories(state) {
      return state.categories;
    },
  },
  mutations: {
    load_categories(state, payload) { state.categories = payload; },
  },
}
