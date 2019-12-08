
export default {
  namespaced: true,
  state: {
    date: String,
    dashed_data: String,
    first_day: String
  },
  getters: {
    get_date: function (state) {
      return state.date;
    },
    get_dashed_date: function (state) {
      return state.dashed_data;
    },
    get_first_day: function (state) {
      return state.first_day;
    },
  },
  mutations: {
    load_date: function (state, payload) { state.date = payload; },
    load_dashed_date: function (state, payload) { state.dashed_data = payload; },
    load_first_day: function (state, payload) { state.first_day = payload; },

  },

}
