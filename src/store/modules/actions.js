import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '../http'
import { isJSON } from '@/helpers'

const jsonHeaders = {
  headers: {
    'X-Honeypot': 'App',
    'Content-Type': 'application/json'
  }
}

const actions = {
  auth(store, flag) {
    store.commit('setIsAuth', flag)
    ipcRenderer.send(flag ? 'authorized' : 'unauthorized')
    store.dispatch('timeout', null)
  },
  token(store, value) {
    store.commit('setToken', value)
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
    store.commit('setTimeout', null)
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
      } catch(err) {
        console.error(err)
        store.dispatch('timeout', null)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else json = data
    store.commit('setJson', json)
  },
  archives(store, data) {
    store.commit('setArchives', data)
  },
  md(store, data) {
    store.commit('setMd', data)
  },
  eventsJson(store, data) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setEvents', json)
  },
  linksJson(store, data) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setLinks', json)
  },
  todoJson(store, data) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setTodo', json)
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
  timeout(store, int) {
    if(int) {
      store.commit('setTimeout', int)
    } else {
      let timeout = store.getters.getTimeout
      if(timeout) clearTimeout(timeout)
    }
  },
  aboutPopupShow(store, flag) {
    store.commit('setIsAboutPopupShow', flag)
  },
  uploadingPopupShow(store, flag) {
    store.commit('setIsUploadingPopupShow', flag)
  },
  linkAddPopupShow(store, flag) {
    store.commit('setIsLinkAddPopupShow', flag)
  },
  preferences(store, flag) {
    store.commit('setIsPreferencesShow', flag)
  },
  projects(store, flag) {
    store.commit('setIsProjectsShow', flag)
  },
  todo(store, flag) {
    store.commit('setIsTodoShow', flag)
  },
  markdown(store, flag) {
    store.commit('setIsMarkdownShow', flag)
  },
  events(store, flag) {
    store.commit('setIsEventsShow', flag)
  },
  jsonViewer(store, flag) {
    store.commit('setIsJsonViewerShow', flag)
  },
  links(store, flag) {
    store.commit('setIsLinksShow', flag)
  },
  downloadsTargetPath(store, path) {
    store.commit('setDownloadsTargetPath', path)
  },
  setTimeout(store) {
    let timeout = store.getters.getTimeout
    if(timeout) store.dispatch('timeout', null)
    clearTimeout(timeout)
    const isDevelopment = store.getters.getIsDevelopment
    if(isDevelopment) {
      store.dispatch('timeout', null)
      clearTimeout(timeout)
      return null
    }
    timeout = setTimeout(() => {
      store.dispatch('action', {
        type: 'CHECK'
      })
        .then(resp => {
          store.dispatch('error', false)
          store.dispatch('setTimeout')
          if(resp.status !== 204) {
            store.dispatch('json', resp.data.data)
            store.dispatch('md', resp.data.md)
            store.dispatch('eventsJson', resp.data.events)
            store.dispatch('linksJson', resp.data.links)
            store.dispatch('todoJson', resp.data.todo)
          } else {
            return null
          }
        })
        .catch(() => {
          store.dispatch('error', true)
          store.dispatch('setTimeout')
        })
    }, 3000)
    store.dispatch('timeout', timeout)
  },
  async action(store, { type, data }) {
    let resp
    switch(type) {
      case 'AUTH':
        const authResp = await $http.post(type, {
          login: data.login,
          password: data.password
        }, jsonHeaders)
        if(authResp instanceof Error) return Promise.reject(authResp)
        return authResp
      case 'GET_JSON':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          setTimeout(() => {
            store.dispatch('loading', false)
          }, 2000)
          store.dispatch('json', resp.data.data)
          store.dispatch('setTimeout')
          $http.get(type, jsonHeaders)
          return resp.data.data
        } catch(e) {
          console.log(e)
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'GET_ARCHIVES':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('archives', resp.data.data)
          return resp.data.data
        } catch(e) {
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'ARCHIVE_RESTORE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            name: data
          }, jsonHeaders)
          if(resp.status === 'success' && resp.message) {
            return resp.message
          }
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'archive restore is failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'ARCHIVE_REMOVE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            name: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'archive remove is failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'GET_MD':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('md', resp.data.data)
          return resp.data.data
        } catch(e) {
          console.log(e)
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'GET_TODO':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('todoJson', resp.data.data)
          return resp.data.data
        } catch(e) {
          console.log(e)
          store.dispatch('loading', false)
          store.dispatch('auth', false)
          store.dispatch('token', null)
          store.dispatch('timeout', null)
          return e
        }
      case 'CREATE':
      case 'UPDATE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            json: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'send message is failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'DELETE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            key: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'delete message is failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'ARCHIVE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            key: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'archive project is failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'CHECK':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'FILE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        jsonHeaders.headers['Content-Type'] = 'multipart/form-data'
        store.dispatch('uploadingPopupShow', true)
        try {
          resp = await $http.post(type, data.file, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('uploadingPopupShow', false)
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'SAVE':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            body: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'save markdown failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'EVENTS':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('eventsJson', resp.data.data)
          return resp.data.data
        } catch(e) {
          console.log(e)
          return e
        }
      case 'EVENT':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            body: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'save event failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'LINKS':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.get(type, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          store.dispatch('linksJson', resp.data.data)
          return resp.data.data
        } catch(e) {
          console.log(e)
          return e
        }
      case 'LINK':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            body: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'save link failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'TODO':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            body: data
          }, jsonHeaders)
          if(!resp) {
            ipcRenderer.send('open-error-dialog', 'todo item add failed')
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
      case 'TODO_SET_ORDER':
        jsonHeaders.headers.Authorization = store.getters.getToken
        try {
          resp = await $http.post(type, {
            body: data
          }, jsonHeaders)
          if(!resp) {
            throw new Error('error')
          }
          return resp
        } catch(e) {
          console.log(e)
          return e
        }
    }
  }
}

export default actions
