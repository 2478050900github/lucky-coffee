import Vue from 'vue'
import Vuex from 'vuex'

import {menuModule} from './menuStore/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menuModule
  }
})
