
export default {
  namespaced: true,
  state: {
    attributes: [],
  },
  getters: {
    get_attributes(state) {
      return state.attributes;
    },
  },
  mutations: {
    load_attributes(state, payload) { state.attributes = payload; },
  },
}
