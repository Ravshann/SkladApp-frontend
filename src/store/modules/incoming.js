
export default {
  namespaced: true,
  state: {
    incoming_data: [],
    edited_record: Object
  },
  getters: {
    get_incoming_data: function (state) {
      return state.incoming_data;
    },
    get_edited_record: function (state) {
      return state.edited_record;
    }
  },
  mutations: {
    load_incoming_data: function (state, payload) { state.incoming_data = payload; },
    save_edited_record: function (state, payload) { state.edited_record = payload; }
  },
}
