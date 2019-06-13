
export default {
  namespaced: true,
  state: {
    returned_data: [],
    edited_record: Object
  },
  getters: {
    get_returned_data: function (state) {
      return state.returned_data;
    },
    get_edited_record: function (state) {
      return state.edited_record;
    }
  },
  mutations: {
    load_returned_data: function (state, payload) { state.returned_data = payload; },
    save_edited_record: function (state, payload) { state.edited_record = payload; }
  },
}
