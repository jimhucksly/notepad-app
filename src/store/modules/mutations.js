const mutations = {
  setLoading(state, flag) {
    state.loading = flag
  },
  setAuth(state, flag) {
    state.isAuth = flag
  },
  setToken(state, value) {
    state.token = value
  },
  setUserDataPath(state, path) {
    state.userDataPath = path
  },
  setError(state, flag) {
    state.error = flag
  },
  setIsDevelopment(state, flag) {
    state.isDevelopment = flag
  },
  setJson(state, json) {
    state.json = {}
    state.json = Object.assign({}, json)
  },
  setMd(state, data) {
    state.md = data
  },
  setMdTree(state, tree) {
    state.mdTree = tree
  },
  setFilter(state, object) {
    state.filter = {}
    state.filter = Object.assign({}, object)
  },
  setInterval(state, int) {
    state.interval = int
  },
  setNotification(state, flag) {
    state.notification = flag
  },
  setAboutPopupShow(state, flag) {
    state.aboutPopupShow = flag
  },
  setUploadingPopupShow(state, flag) {
    state.uploadingPopupShow = flag
  },
  setPreferencesShow(state, flag) {
    state.preferencesShow = flag
  },
  setProjectsShow(state, flag) {
    state.projectsShow = flag
  },
  setMarkdownShow(state, flag) {
    state.markdownShow = flag
  },
  setJsonViewerShow(state, flag) {
    state.jsonViewerShow = flag
  },
  setDownloadsTargetPath(state, path) {
    state.downloadsTargetPath = path
  }
}

export default mutations
