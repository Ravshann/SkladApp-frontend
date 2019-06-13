
export default {
  namespaced: true,
  state: {
    defected_data: [],
    edited_record: Object
  },
  getters: {
    get_data: function (state) {
      return state.defected_data;
    },
    get_edited_record: function (state) {
      return state.edited_record;
    }
  },
  mutations: {
    load_data: function (state, payload) { state.defected_data = payload; },
    save_edited_record: function (state, payload) { state.edited_record = payload; }
  },
}
