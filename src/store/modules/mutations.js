import { stateKeys } from './index'
import { upperFirst } from '~/helpers'

const mutations = {
  setJson(state, json) {
    state.json = {}
    state.json = { ...json }
  },
  setEvents(state, data) {
    state.events = {}
    state.events = { ...data }
  },
  setFilter(state, object) {
    state.filter = {}
    state.filter = Object.assign({}, object)
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)

  if(mutations[commitKey] === undefined) {
    mutations[commitKey] = (state, peyload) => {
      state[key] = peyload
    }
  }
})

export default mutations
