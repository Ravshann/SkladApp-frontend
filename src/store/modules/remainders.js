
export default {
  namespaced: true,
  state: {
    remainder_data: [],
    remainder_data_sorted: [],
    sorted_flag: false
  },
  getters: {
    get_remainder_data: function (state) {
      return state.remainder_data;
    },
    get_sorted_data: function (state) {
      return state.remainder_data_sorted;
    },
    get_sorted_flag: function (state) {
      return state.sorted_flag;
    },
  },
  mutations: {
    load_remainder_data: function (state, payload) { state.remainder_data = payload; },
    load_remainder_data_sorted: function (state, payload) { state.remainder_data_sorted = payload; },
    set_sorted_flag: function (state, payload) { state.sorted_flag = payload },
  },
}
