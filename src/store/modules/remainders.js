
export default {
  namespaced: true,
  state: {
    remainder_data: [],
    remainder_data_sorted: [],
    sorted_flag: false,
    defected_remainder_data: [],
    defected_remainder_data_sorted: [],
    defected_sorted_flag: false
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
    get_defected_remainder_data: function (state) {
      return state.defected_remainder_data;
    },
    get_defected_sorted_data: function (state) {
      return state.defected_remainder_data_sorted;
    },
    get_defected_sorted_flag: function (state) {
      return state.defected_sorted_flag;
    },
  },
  mutations: {
    load_remainder_data: function (state, payload) { state.remainder_data = payload; },
    load_remainder_data_sorted: function (state, payload) { state.remainder_data_sorted = payload; },
    set_sorted_flag: function (state, payload) { state.sorted_flag = payload },
    load_defected_remainder_data: function (state, payload) { state.defected_remainder_data = payload; },
    load_defected_remainder_data_sorted: function (state, payload) { state.defected_remainder_data_sorted = payload; },
    set_defected_sorted_flag: function (state, payload) { state.defected_sorted_flag = payload },
  },
}
