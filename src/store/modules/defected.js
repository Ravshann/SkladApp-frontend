
export default {
  namespaced: true,
  state: {
    defected_data: [],
  },
  getters: {
    get_data: function (state) {
      return state.defected_data;
    },
   
  },
  mutations: {
    load_data: function (state, payload) { state.defected_data = payload; },
    
  },
}
