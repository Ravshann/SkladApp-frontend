
export default {
  namespaced: true,
  state: {
    date: String,
    dashed_data: String
  },
  getters: {
    get_date: function (state) {
      return state.date;
    },
    get_dashed_date: function (state) {
      return state.dashed_data;
    },
  },
  mutations: {
    load_date: function (state, payload) { state.date = payload; },
    load_dashed_date: function (state, payload) { state.dashed_data = payload; },
  },

}
