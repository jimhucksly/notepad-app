import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '../http'
import storage from '@/plugins/storage'
import { userDataFileName } from '@/constants'
import { isJSON } from '@/helpers'

const jsonHeaders = {
  headers: {
    'X-Honeypot': 'App',
    'Content-Type': 'application/json'
  }
}

const actions = {
  auth(store, flag) {
    store.commit('setAuth', flag)
    ipcRenderer.send(flag ? 'authorized' : 'unauthorized')
    store.dispatch('interval', null)
  },
  token(store, value) {
    store.commit('setToken', value)
    const userDataPath = store.getters['getUserDataPath']
    storage.isPathExists(userDataPath)
      .then(() => {
        storage.set(userDataPath, userDataFileName, { token: value })
          .then(() => console.log('write to file is successfully completed'))
          .catch(() => {
            ipcRenderer.send('open-error-dialog', 'write to the file is failed')
            console.error('write to the file is failed')
          })
      })
      .catch(() => console.error(`${userDataPath} is don't exists`))
  },
  loading(store, flag) {
    store.commit('setLoading', flag)
  },
  userDataPath(store, path) {
    store.commit('setUserDataPath', path)
  },
  error(store, flag) {
    store.commit('setError', flag)
  },
  isDevelopment(store, flag) {
    store.commit('setIsDevelopment', flag)
    store.commit('setInterval', null)
  },
  json(store, data) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
        const currentJson = store.getters['getJson']
        Object.keys(json).forEach(key => {
          if(currentJson && currentJson[key] === undefined) json[key]['unread'] = true
        })
        const haveUnread = Object.keys(json).find(key => json[key].unread) !== undefined
        if(haveUnread) ipcRenderer.send('set-icon-notification')
        else ipcRenderer.send('hide-icon-notification')
      } catch (err) {
        console.error(err)
        store.dispatch('interval', null)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else json = data
    store.commit('setJson', json)
  },
  md(store, data) {
    store.commit('setMd', data)
  },
  mdTree(store, tree) {
    store.commit('setMdTree', tree)
  },
  read(store, key) {
    const json = cloneDeep(store.getters['getJson'])
    delete json[key]['unread']
    const haveUnread = Object.keys(json).find(k => json[k].unread) !== undefined
    if(haveUnread) ipcRenderer.send('set-icon-notification')
    else ipcRenderer.send('hide-icon-notification')
    store.commit('setJson', json)
  },
  filter(store, object) {
    store.commit('setFilter', object)
  },
  interval(store, int) {
    if(int) {
      store.commit('setInterval', int)
    } else {
      let interval = store.getters['getInterval']
      if(interval) clearInterval(interval)
    }
  },
  aboutPopupShow(store, flag) {
    store.commit('setAboutPopupShow', flag)
  },
  uploadingPopupShow(store, flag) {
    store.commit('setUploadingPopupShow', flag)
  },
  preferences(store, flag) {
    store.commit('setPreferencesShow', flag)
  },
  projects(store, flag) {
    store.commit('setProjectsShow', flag)
  },
  markdown(store, flag) {
    store.commit('setMarkdownShow', flag)
  },
  jsonViewer(store, flag) {
    store.commit('setJsonViewerShow', flag)
  },
  downloadsTargetPath(store, path) {
    store.commit('setDownloadsTargetPath', path)
  },
  setInterval(store) {
    let interval = store.getters['getInterval']
    if(interval) store.dispatch('interval', null)
    const isDevelopment = store.getters['getIsDevelopment']
    if(isDevelopment) {
      store.dispatch('interval', null)
      return null
    }
    interval = setInterval(() => {
      store.dispatch('action', {
        type: 'CHECK'
      })
        .then(resp => {
          store.dispatch('error', false)
          if(resp.status !== 204) {
            store.dispatch('json', resp.data.data)
            store.dispatch('md', resp.data.md)
          }
        })
        .catch(() => {
          store.dispatch('error', true)
          // ipcRenderer.send('open-error-dialog', 'dispatch CHECK is failed')
          // if(interval) store.dispatch('interval', null)
          // ipcRenderer.on('dialog-error-callback', () => {
          //   store.dispatch('setInterval')
          // })
        })
    }, 5000)
    store.dispatch('interval', interval)
  },
  async action(store, { type, data }) {
    switch(type) {
      case 'AUTH':
        const authResp = await $http.post(type, {
          login: data.login,
          password: data.password
        }, jsonHeaders)
        if(authResp instanceof Error) return Promise.reject(authResp)
        return authResp
      case 'GET_JSON':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        $http.get(type, jsonHeaders)
          .then(resp => {
            setTimeout(() => {
              store.dispatch('loading', false)
            }, 2000)
            store.dispatch('json', resp.data.data)
            store.dispatch('setInterval')
          })
          .catch(() => {
            store.dispatch('loading', false)
            store.dispatch('auth', false)
            store.dispatch('token', null)
            store.dispatch('interval', null)
          })
        return null
      case 'GET_MD':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        $http.get(type, jsonHeaders)
          .then(resp => {
            store.dispatch('md', resp.data.data)
          })
          .catch(() => {})
        return null
      case 'CREATE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const createResp = await $http.post(type, {
          json: data
        }, jsonHeaders)
        if(createResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'send message is failed')
          return Promise.reject(createResp)
        }
        return createResp
      case 'UPDATE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const updateResp = await $http.post(type, {
          json: data
        }, jsonHeaders)
        if(updateResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'send message is failed')
          return Promise.reject(updateResp)
        }
        return updateResp
      case 'DELETE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const deleteResp = await $http.post(type, {
          key: data
        }, jsonHeaders)
        if(deleteResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'delete message is failed')
          return Promise.reject(deleteResp)
        }
        return deleteResp
      case 'CHECK':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const checkResp = await $http.get(type, jsonHeaders)
        if(checkResp instanceof Error) {
          return Promise.reject(checkResp)
        }
        return checkResp
      case 'FILE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        jsonHeaders.headers['Content-Type'] = 'multipart/form-data'
        store.dispatch('uploadingPopupShow', true)
        const uploadResp = await $http.post(type, data.file, jsonHeaders)
        if(uploadResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'file upload is failed')
          return Promise.reject(uploadResp)
        }
        store.dispatch('uploadingPopupShow', false)
        return uploadResp
      case 'SAVE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const saveResp = await $http.post(type, {
          body: data
        }, jsonHeaders)
        if(saveResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'save markdown failed')
          return Promise.reject(saveResp)
        }
        return saveResp
    }
  }
}

export default actions
