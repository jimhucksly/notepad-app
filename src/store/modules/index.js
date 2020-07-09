/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const stateKeys = [
  'loading',
  'isAuth',
  'token',
  'userDataPath',
  'isDevelopment',
  'json',
  'archives',
  'todo',
  'md',
  'events',
  'links',
  'todo',
  'mdTree',
  'filter',
  'unread',
  'isAboutPopupShow',
  'isUploadingPopupShow',
  'isLinkAddPopupShow',
  'isPreferencesShow',
  'isProjectsShow',
  'isTodoShow',
  'isMarkdownShow',
  'isEventsShow',
  'isJsonViewerShow',
  'isLinksShow',
  'downloadsTargetPath',
  'timeout',
  'notification',
  'error'
]

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if(key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
export {
  stateKeys
}
