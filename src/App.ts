/// <reference path="../vue-shim.d.ts" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import { remote } from 'electron'
import Popup from './components/popup'

const { Menu } = remote

@Component({
  name: 'App',
  components: {
    Popup
  }
})
export default class App extends Vue {
  [x: string]: any
  get notification() {
    return this.$store.getters['getNotification']
  }

  @Watch('notification')
  onNotificationChanged(flag: boolean) {
    if(flag) {
      this.$electron.ipcRenderer.send('set-icon-notification')
    }
  }
  mounted() {
    const MenuTemplate = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Preferences...',
            click: () => {
              this.$electron.ipcRenderer.send('preferences-show')
              this.$store.dispatch('preferences', true)
            }
          },
          {
            label: 'Reload',
            click: () => {
              this.$store.dispatch('loading', true)
              this.$store.dispatch('action', {
                type: 'GET_JSON'
              })
              this.$store.dispatch('action', {
                type: 'GET_MD'
              })
            }
          },
          {
            label: 'Sign Out',
            click: () => {
              this.$store.dispatch('auth', false)
              this.$store.dispatch('token', null)
            }
          }
        ]
      },
      {
        label: 'About',
        click: () => this.$popup.open('about')
      }
    ]
    const ContextMenuTemplate: any = [
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }
    ]
    const appMenu = Menu.buildFromTemplate(MenuTemplate)
    window.appMenu = appMenu
    const contextMenu: any = Menu.buildFromTemplate(ContextMenuTemplate)
    Menu.setApplicationMenu(appMenu)
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      let selection: any = null
      let hasSelection: boolean = false
      if(window.getSelection()) {
        selection = window!.getSelection()!.toString()
        hasSelection = selection !== null ? !!selection.length : false
      }
      if(hasSelection) {
        contextMenu.popup(this.$electron.remote.screen, event.x, event.y)
      }
    })

    this.$store.dispatch('isDevelopment', process.env.NODE_ENV === 'development')
  }
  beforeDestroy() {
    this.$store.dispatch('interval', null)
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
