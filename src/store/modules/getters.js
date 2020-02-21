import { stateKeys } from './index'
import { upperFirst } from '~/helpers'

const getters = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if(getters[getterKey] === undefined) {
    getters[getterKey] = (state) => {
      return state[key]
    }
  }
})

export default getters
