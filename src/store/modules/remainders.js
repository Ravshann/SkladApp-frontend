
export default {
  namespaced: true,
  state: {
    remainder_data: [],
    remainder_data_sorted: [],
    sorted: false
  },
  getters: {
    get_remainder_data: function (state) {
      return state.remainder_data;
    },
    get_sorted_data: function (state) {
      return state.remainder_data_sorted;
    },
    get_sorted: function (state) {
      return state.sorted;
    },
  },
  mutations: {
    load_remainder_data: function (state, payload) { state.remainder_data = payload; },
    load_remainder_data_sorted: function (state, payload) { state.remainder_data_sorted = payload; },
    set_sorted: function (state, payload) { state.sorted = payload },
  },
}
