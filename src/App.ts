/// <reference path="../vue-shim.d.ts" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import Popup from './components/popup'

@Component({
  name: 'App',
  components: {
    Popup
  }
})
export default class App extends Vue {
  get notification() {
    return this.$store.getters.getNotification
  }

  @Watch('notification')
  onNotificationChanged(flag: boolean) {
    if(flag) {
      this.$electron.ipcRenderer.send('set-icon-notification')
    }
  }

  mounted() {
    this.$store.dispatch('isDevelopment', process.env.NODE_ENV === 'development')
    this.$electron.ipcRenderer.on('preferences-show', () => {
      this.$store.dispatch('preferences', true)
    })
    this.$electron.ipcRenderer.on('reload', () => {
      this.$store.dispatch('loading', true)
      this.$store.dispatch('action', {
        type: 'GET_JSON'
      })
      this.$store.dispatch('action', {
        type: 'GET_MD'
      })
    })
    this.$electron.ipcRenderer.on('sign-out', () => {
      this.$store.dispatch('auth', false)
      this.$store.dispatch('token', null)
    })
    this.$electron.ipcRenderer.on('about', () => {
      this.$popup.open('about')
    })
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      let selection = null
      let hasSelection = false
      if(window.getSelection) {
        const s = window.getSelection()
        selection = s ? s.toString() : ''
        hasSelection = selection ? !!selection.length : false
      }
      if(hasSelection) {
        this.$electron.ipcRenderer.send('context-menu-popup', {
          window: this.$electron.remote.getCurrentWindow()
        })
      }
    })
  }

  beforeDestroy() {
    this.$store.dispatch('timeout', null)
  }

  render(h: any) {
    return h(
      'div',
      {
        attrs: {
          id: 'app'
        }
      },
      [
        h(
          'router-view',
          {
            attrs: {
              id: 'content'
            }
          }
        ),
        h(
          'popup'
        )
      ]
    )
  }
}
