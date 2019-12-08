
export default {
  namespaced: true,
  state: {
    outgoing_data: [],
    sorted: [],
    sorted_flag: false,
    formatted_data: [],
    sorted_formatted_data: [],
  },
  getters: {
    get_outgoing_data: function (state) {
      return state.outgoing_data;
    },
    get_formatted_data: function (state) {
      return state.formatted_data;
    },
    get_sorted_formatted_data: function (state) {
      return state.sorted_formatted_data;
    },
    get_sorted_data: function (state) {
      return state.sorted;
    },
    get_sorted_flag: function (state) {
      return state.sorted_flag;
    },
  },
  mutations: {
    load_outgoing_data: function (state, payload) { state.outgoing_data = payload; },
    load_formatted_data: function (state, payload) { state.formatted_data = payload; },
    load_sorted_data: function (state, payload) { state.sorted = payload; },
    load_sorted_formatted_data: function (state, payload) { state.sorted_formatted_data = payload; },
    set_sorted_flag: function (state, payload) { state.sorted_flag = payload },
  },
}
