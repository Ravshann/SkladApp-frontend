
export default {
  namespaced: true,
  state: {
    department_managers: [],
  },
  getters: {
    get_department_managers(state) {
      return state.department_managers;
    },
  },
  mutations: {
    load_department_managers(state, payload) { state.department_managers = payload; },
  },
}
