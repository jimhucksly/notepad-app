import { stateKeys } from './index'

const state = {
  loading: true,
  isProjectsShow: true,
  userDataPath: '',
  downloadsTargetPath: '',
  md: '',
  mdTree: [],
  filter: {},
  unread: {}
}

stateKeys.forEach(key => {
  if(state[key] === undefined) {
    state[key] = null
  }
})

export default state
