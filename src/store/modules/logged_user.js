export default {
  namespaced: true,
  state: {
    is_logged: false,
    user_token: String(),
    user_role: String(),
    username: String(),
    user_ID: Number(),
  },
  getters: {
    get_user_ID(state) {
      return state.user_ID;
    },
    get_logged_status(state) {
      return state.is_logged;
    },
    get_user_token(state) {
      return state.user_token;
    },
    get_user_role(state) {
      return state.user_role;
    },
    get_username(state) {
      return state.username;
    }
  },
  mutations: {
    load_user_status(state, payload) { state.is_logged = payload; },
    load_user_token(state, payload) { state.user_token = payload; },
    load_user_role(state, payload) { state.user_role = payload; },
    load_username(state, payload) { state.username = payload; },
    load_user_ID(state, payload) { state.user_ID = payload; },
  },

}
