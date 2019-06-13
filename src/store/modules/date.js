
export default {
    namespaced: true,
    state: {
      date: String,
    },
    getters: {
      get_date: function (state) {
        return state.date;
      },
    },
    mutations: {
      load_date: function (state, payload) { state.date = payload; },
    },
  }
  