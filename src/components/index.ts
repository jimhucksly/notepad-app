import { Vue, Component } from 'vue-property-decorator'
import Titlebar from '~/components/titlebar'
import Loading from '~/components/loading'
import Error from '~/components/error'
import Auth from '~/components/auth'
import Notepad from '~/components/notepad'
import Todo from '~/components/todo'
import Markdown from '~/components/markdown'
import Preferences from '~/components/preferences'
import Events from '~/components/events'
import JsonViewer from '~/components/jsonViewer'
import Links from '~/components/links'
import Sidebar from '~/components/sidebar'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants'

@Component({
  name: 'Index',
  components: {
    Titlebar,
    Loading,
    Auth,
    Error,
    Notepad,
    Todo,
    Markdown,
    Preferences,
    Events,
    JsonViewer,
    Links,
    Sidebar
  }
})
export default class Index extends Vue {
  get params() {
    return this.$store.getters.getParams
  }
  get loading() {
    return this.$store.getters.getLoading
  }
  get isAuth() {
    return this.$store.getters.getIsAuth
  }
  get isPreferences() {
    return this.$store.getters.getIsPreferencesShow
  }
  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isTodo() {
    return this.$store.getters.getIsTodoShow
  }
  get isMarkdown() {
    return this.$store.getters.getIsMarkdownShow
  }
  get isEvents() {
    return this.$store.getters.getIsEventsShow
  }
  get isJsonViewer() {
    return this.$store.getters.getIsJsonViewerShow
  }
  get isLinks() {
    return this.$store.getters.getIsLinksShow
  }
  get token() {
    return this.$store.getters.getToken
  }
  get isError() {
    return this.$store.getters.getError
  }

  protected async checkToken(p: string) {
    this.$store.dispatch('loading', true)
    const token = await storage.get(p, userDataFileName, 'token')
    if(token) {
      this.$store.dispatch('auth', true)
      this.$store.dispatch('token', token)
      this.getJson()
      this.getMd()
      return true
    } else {
      this.$store.dispatch('loading', false)
      this.$store.dispatch('auth', false)
      return null
    }
  }

  protected async getJson() {
    await this.$store.dispatch('action', {
      type: 'GET_JSON'
    })
  }

  protected async getMd() {
    await this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }

  protected async setPath(appPath: string) {
    try {
      this.$store.dispatch('userDataPath', appPath)
      const json: any = await storage.get(appPath, 'UserPreferences')
      if(json.downloadsTargetPath !== undefined) {
        this.$store.dispatch('downloadsTargetPath', json.downloadsTargetPath)
      } else {
        json.downloadsTargetPath = appPath
        this.$store.dispatch('downloadsTargetPath', appPath)
      }
    } catch(e) {
      console.error(e)
      this.$store.dispatch('downloadsTargetPath', appPath)
    }
  }

  async created(): Promise<void> {
    this.$electron.ipcRenderer.send('get-app-path')
    await this.$electron.ipcRenderer.on('set-app-path', async (e: any, appPath: any) => {
      await this.checkToken(appPath)
      await this.setPath(appPath)
    })
  }
}
