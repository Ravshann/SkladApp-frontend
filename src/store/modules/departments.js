
export default {
  namespaced: true,
  state: {
    departments: [],
  },
  getters: {
    get_departments(state) {
      return state.departments;
    },
  },
  mutations: {
    load_departments(state, payload) { state.departments = payload; },
  },
}
