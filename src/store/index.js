/**
 * Created by Xinhe on 2017-10-16.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as modules from './modules'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules,
  strict: debug,
})
