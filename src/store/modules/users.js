
export default {
    namespaced: true,
    state: {
      users: [],
    },
    getters: {
      get_users(state) {
        return state.users;
      },
    },
    mutations: {
      load_users(state, payload) { state.users = payload; },
    },
  }
  