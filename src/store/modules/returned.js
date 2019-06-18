
export default {
  namespaced: true,
  state: {
    returned_data: [],

  },
  getters: {
    get_returned_data: function (state) {
      return state.returned_data;
    }
  },
  mutations: {
    load_returned_data: function (state, payload) { state.returned_data = payload; },
  },
}
