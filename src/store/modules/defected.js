
export default {
  namespaced: true,
  state: {
    defected_data: [],
    sorted: [],
    sorted_flag: false
  },
  getters: {
    get_data: function (state) {
      return state.defected_data;
    },
    get_sorted_data: function (state) {
      return state.sorted;
    },
    get_sorted_flag: function (state) {
      return state.sorted_flag;
    },

  },
  mutations: {
    load_data: function (state, payload) { state.defected_data = payload; },
    load_sorted_data: function (state, payload) { state.sorted = payload; },
    set_sorted_flag: function (state, payload) { state.sorted_flag = payload },
  },
}
