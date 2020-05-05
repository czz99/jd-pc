import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    count1: 0
  },
  mutations: {
    increment (state) {
      state.count1++
    }
  },
  getters: {

  }
})

export default store
