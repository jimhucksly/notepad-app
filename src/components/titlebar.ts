/// <reference path="../../window.d.ts" />
import { Vue, Component } from 'vue-property-decorator'
import { remote } from 'electron'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  get isAuth() {
    return this.$store.getters.getAuth
  }
  get preferencesShow() {
    return this.$store.getters.isPreferencesShowed
  }
  get title() {
    return this.$electron.remote.getCurrentWindow().getTitle()
  }

  protected reload() {
    this.$store.dispatch('loading', true)
    this.$store.dispatch('action', {
      type: 'GET_JSON'
    })
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }

  mounted() {
    if(document && document.getElementById) {
      const menuBtn = document.getElementById('menu-button')
      menuBtn && menuBtn.addEventListener('click', (event) => {
        window && window.appMenu && window.appMenu.popup(this.$electron.remote.screen, event.x, event.y)
      })

      const minimizeBtn = document.getElementById('minimize-button')
      minimizeBtn && minimizeBtn.addEventListener('click', (e) => {
        remote.getCurrentWindow().minimize()
      })

      const minMaxBtn = document.getElementById('min-max-button')
      minMaxBtn && minMaxBtn.addEventListener('click', () => {
        const currentWindow = remote.getCurrentWindow()
        if(currentWindow.isMaximized()) {
          currentWindow.unmaximize()
        } else {
          currentWindow.maximize()
        }
      })

      const closebtn = document.getElementById('close-button')
      closebtn && closebtn.addEventListener('click', (e) => {
        // remote.app.quit()
        remote.getCurrentWindow().hide()
        return false
      })
    }
  }
}
