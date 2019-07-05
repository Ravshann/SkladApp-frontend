
export default {
  namespaced: true,
  state: {
    outgoing_data: [],

  },
  getters: {
    get_outgoing_data: function (state) {
      return state.outgoing_data;
    },

  },
  mutations: {
    load_outgoing_data: function (state, payload) { state.outgoing_data = payload; },
  },
}
