
export default {
  namespaced: true,
  state: {
    returned_data: [],
    sorted: [],
    sorted_flag: false
  },
  getters: {
    get_returned_data: function (state) {
      return state.returned_data;
    },
    get_sorted_data: function (state) {
      return state.sorted;
    },
    get_sorted_flag: function (state) {
      return state.sorted_flag;
    },
  },
  mutations: {
    load_returned_data: function (state, payload) { state.returned_data = payload; },
    load_sorted_data: function (state, payload) { state.sorted = payload; },
    set_sorted_flag: function (state, payload) { state.sorted_flag = payload },
  },
}
