
export default {
  namespaced: true,
  state: {
    clients: [],
  },
  getters: {
    get_clients: function (state) {
      return state.clients;
    },
  },
  mutations: {
    load_clients: function (state, payload) { state.clients = payload; },
  },
}
