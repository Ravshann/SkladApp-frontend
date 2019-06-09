
export default {
  namespaced: true,
  state: {
    outgoing_data: [],
    edited_record: Object
  },
  getters: {
    get_outgoing_data: function (state) {
      return state.outgoing_data;
    },
    get_edited_record: function (state) {
      return state.edited_record;
    }
  },
  mutations: {
    load_outgoing_data: function (state, payload) { state.outgoing_data = payload; },
    save_edited_record: function (state, payload) { state.edited_record = payload; }
  },
}
