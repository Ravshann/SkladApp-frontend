
export default {
  namespaced: true,
  state: {
    storage_managers: [],
  },
  getters: {
    get_storage_managers(state) {
      return state.storage_managers;
    },
  },
  mutations: {
    load_storage_managers(state, payload) { state.storage_managers = payload; },
  },
}
