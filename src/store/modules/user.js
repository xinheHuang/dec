/**
 * Created by Xinhe on 2017-10-16.
 */
import * as types from 'Store/mutation-types'

const state = {
  userInfo:{},
}

// mutations
const mutations = {
  [types.SET_USERINFO](state,userInfo) {
    state.userInfo=userInfo;
  },
}

export default {
  state,
  mutations
}
