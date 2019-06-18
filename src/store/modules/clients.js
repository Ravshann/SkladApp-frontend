
export default {
  namespaced: true,
  state: {
    clients: [],
  },
  getters: {
    get_clients(state) { return state.clients; },
  },
  mutations: {
    load_clients(state, payload) { state.clients = payload; },
  },
}
