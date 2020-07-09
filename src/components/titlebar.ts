/// <reference path="../../window.d.ts" />
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  title: string = ''

  get isAuth() {
    return this.$store.getters.getIsAuth
  }
  get preferencesShow() {
    return this.$store.getters.isPreferencesShowed
  }

  protected reload() {
    this.$store.dispatch('loading', true)
    this.$store.dispatch('action', {
      type: 'GET_JSON'
    })
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
    this.$store.dispatch('action', {
      type: 'EVENTS'
    })
    this.$store.dispatch('action', {
      type: 'LINKS'
    })
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    this.$electron.ipcRenderer.on('set-window-title', (e: any, title: string) => {
      this.title = title
    })
    if(document && document.getElementById) {
      const menuBtn = document.getElementById('menu-button')
      menuBtn && menuBtn.addEventListener('click', (event) => {
        this.$electron.ipcRenderer.send('menu-popup')
      })

      const minimizeBtn = document.getElementById('minimize-button')
      minimizeBtn && minimizeBtn.addEventListener('click', (e) => {
        this.$electron.ipcRenderer.send('minimize')
      })

      const minMaxBtn = document.getElementById('min-max-button')
      minMaxBtn && minMaxBtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('min-max')
      })

      const closebtn = document.getElementById('close-button')
      closebtn && closebtn.addEventListener('click', (e) => {
        this.$electron.ipcRenderer.send('hide')
      })
    }
  }
}
