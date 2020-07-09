import { Vue, Component, Watch } from 'vue-property-decorator'
import storage from '~/plugins/storage'
import pkg from '../../package.json'
import AutoLaunch from 'auto-launch'

interface IPreferences {
  downloadsTargetPath: string
}

@Component({
  name: 'Preferences',
})
export default class Preferences extends Vue {
  preferences: IPreferences = {
    downloadsTargetPath: ''
  }
  defaults: IPreferences = {
    downloadsTargetPath: ''
  }
  errors: object = {
    downloadsTargetPath: 0
  }

  appAutoLauncher: any = null
  isAutoLaunchEnabled: boolean = false

  get userDataPath() {
    return this.$store.getters.getUserDataPath
  }
  get downloadsTargetPath() {
    return this.$store.getters.getDownloadsTargetPath
  }

  @Watch('isAutoLaunchEnabled')
  onIsAutoLaunchEnabledChanged(v: boolean) {
    if(v) {
      this.appAutoLauncher.enable()
    } else this.appAutoLauncher.disable()
  }

  protected save() {
    const form: any = this.$refs.form
    const requireds = form.querySelectorAll('[required]')
    if(requireds.length > 0) {
      requireds.forEach((el: any) => {
        const name = el.name
        if(this[name] === '') {
          this.errors[name] = 1
          el.onclick = () => {
            this.errors[name] = 0
            el.onclick = null
          }
        }
      })
    }

    const valid = Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
    if(valid) {
      storage.append(this.userDataPath, 'UserPreferences', {
        downloadsTargetPath: this.preferences.downloadsTargetPath
      })
      this.$store.dispatch('downloadsTargetPath', this.preferences.downloadsTargetPath)
    }
    this.$electron.ipcRenderer.send('preferences-hide')
    this.$store.dispatch('preferences')
  }
  protected cancel() {
    this.$electron.ipcRenderer.send('preferences-hide')
    this.$store.dispatch('preferences')
  }
  protected openFolderDialog() {
    this.$electron.ipcRenderer.send('open-folder-dialog', {
      defaultPath: this.downloadsTargetPath
    })
    this.$electron.ipcRenderer.on('open-dialog-paths-selected', (event: any, response: any) => {
      const path = response && response.filePaths && response.filePaths[0] ? response.filePaths[0] : null
      const currentPath = this.preferences.downloadsTargetPath || this.userDataPath
      this.preferences.downloadsTargetPath = path ? path : currentPath
    })
  }

  mounted() {
    this.preferences.downloadsTargetPath = this.$store.getters.getDownloadsTargetPath
    this.defaults.downloadsTargetPath = this.$store.getters.getDownloadsTargetPath

    const appAutoLauncher = new AutoLaunch({
      name: pkg.build.productName.replace(/ /g, '')
    })

    this.appAutoLauncher = appAutoLauncher

    appAutoLauncher.isEnabled()
      .then((isEnabled: boolean) => {
        this.isAutoLaunchEnabled = isEnabled
        return
      }).catch((err: any) => {})
  }
}
