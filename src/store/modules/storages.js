
export default {
  namespaced: true,
  state: {
    storages: [],
  },
  getters: {
    get_storages: function (state) {
      return state.storages;
    },
  },
  mutations: {
    load_storages: function (state, payload) { state.storages = payload; },
  },
}
