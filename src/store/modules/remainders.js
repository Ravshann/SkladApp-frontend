
export default {
  namespaced: true,
  state: {
    remainder_data: [],
  },
  getters: {
    get_remainder_data: function (state) {
      return state.remainder_data;
    },
  },
  mutations: {
    load_remainder_data: function (state, payload) { state.remainder_data = payload; },
  },
}
