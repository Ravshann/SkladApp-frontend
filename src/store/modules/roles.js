
export default {
    namespaced: true,
    state: {
      roles: [],
    },
    getters: {
      get_roles(state) {
        return state.roles;
      },
    },
    mutations: {
      load_roles(state, payload) { state.roles = payload; },
    },
  }
  