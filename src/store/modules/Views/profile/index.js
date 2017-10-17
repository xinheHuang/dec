/**
 * Created by Xinhe on 2017-10-16.
 */
import * as types from 'Store/mutation-types'

const state = {
  tab: null,
  scroll: 0,
}

// mutations
const mutations = {
  [types.PROFILE_PAGE_SCROLLED](state,scroll) {
    console.log('mutation',scroll);
    state.scroll=scroll;
  },
  [types.PROFILE_TAB_CHANGED](state,tab) {
    state.tab=tab;
  },

}

export default {
  state,
  mutations
}
