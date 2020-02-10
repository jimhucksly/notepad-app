const getters = {
  getLoading: state => state.loading,
  getAuth: state => state.isAuth,
  getToken: state => state.token,
  getUserDataPath: state => state.userDataPath,
  getError: state => state.error,
  getIsDevelopment: state => state.isDevelopment,
  getJson: state => state.json,
  getMd: state => state.md,
  getMdTree: state => state.mdTree,
  getFilter: state => state.filter,
  getInterval: state => state.interval,
  getNotification: state => state.notification,
  getAboutPopupShow: state => state.aboutPopupShow,
  getUploadingPopupShow: state => state.uploadingPopupShow,
  isPreferencesShowed: state => state.preferencesShow,
  isProjectsShowed: state => state.projectsShow,
  isMarkdownShowed: state => state.markdownShow,
  isJsonViewerShowed: state => state.jsonViewerShow,
  getDownloadsTargetPath: state => state.downloadsTargetPath
}

export default getters
