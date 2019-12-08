
export default {
  namespaced: true,
  state: {
    storages: [],
    defected_storages: [],
    other_storages: []
  },
  getters: {
    get_storages: function (state) {
      return state.storages;
    },
    get_other_storages: function (state) {
      return state.other_storages;
    },
    get_defected_storages: function (state) {
      return state.defected_storages;
    },
  },
  mutations: {
    load_storages: function (state, payload) { state.storages = payload; },
    load_other_storages: function (state, payload) { state.other_storages = payload; },
    load_defected_storages: function (state, payload) { state.defected_storages = payload; },
  },
}
