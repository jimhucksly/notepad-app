import { Vue, Component } from 'vue-property-decorator'
import Titlebar from '~/components/titlebar'
import Loading from '~/components/loading'
import Error from '~/components/error'
import Auth from '~/components/auth'
import Notepad from '~/components/notepad'
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
    Markdown,
    Preferences,
    Events,
    JsonViewer,
    Links,
    Sidebar
  }
})
export default class Index extends Vue {
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

  protected checkToken(p: string) {
    this.$store.dispatch('loading', true)
    storage.isPathExists(p)
      .then(() => {
        return storage.isFileExists(p, userDataFileName)
      })
      .then(() => {
        return storage.get(p, userDataFileName, 'token')
      })
      .then((token) => {
        if(token) {
          this.$store.dispatch('auth', true)
          this.$store.dispatch('token', token)
          this.getJson()
          this.getMd()
        } else throw new Error()
      })
      .catch(() => {
        this.$store.dispatch('loading', false)
        this.$store.dispatch('auth', false)
      })
  }

  protected getJson() {
    this.$store.dispatch('action', {
      type: 'GET_JSON'
    })
  }

  protected getMd() {
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }

  async created(): Promise<void> {
    const appPath = this.$electron.remote.app.getPath('userData')
    try {
      this.$store.dispatch('userDataPath', appPath)
      this.checkToken(appPath)
      const json: any = await storage.get(appPath, 'UserPreferences')
      if(json.downloadsTargetPath !== undefined) {
        this.$store.dispatch('downloadsTargetPath', json.downloadsTargetPath)
      }
    } catch(e) {
      console.error(e)
      this.$store.dispatch('downloadsTargetPath', appPath)
    }
  }
}
