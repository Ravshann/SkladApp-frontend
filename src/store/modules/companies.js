
export default {
    namespaced: true,
    state: {
      companies: [],
    },
    getters: {
      get_companies(state) {
        return state.companies;
      },
    },
    mutations: {
      load_companies(state, payload) { state.companies = payload; },
    },
  }
  