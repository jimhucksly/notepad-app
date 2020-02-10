import { Vue, Component, Watch } from 'vue-property-decorator'
import storage from '~/plugins/storage'

interface IPreferences {
  downloadsTargetPath: string
}

@Component({
  name: 'Preferences'
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

  get userDataPath() {
    return this.$store.getters['getUserDataPath']
  }
  get downloadsTargetPath() {
    return this.$store.getters['getDownloadsTargetPath']
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

    const valid = Object.keys(this.errors).map(key => this.errors[key]).reduce((a, b) => a + b) === 0
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
      const currentPath = this.preferences.downloadsTargetPath || this.userDataPath
      this.preferences.downloadsTargetPath = response && response[0] ? response[0] : currentPath
    })
  }

  mounted() {
    this.preferences.downloadsTargetPath = this.$store.getters['getDownloadsTargetPath']
    this.defaults.downloadsTargetPath = this.$store.getters['getDownloadsTargetPath']
  }
}
