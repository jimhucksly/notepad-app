import { Vue, Component, Watch } from 'vue-property-decorator'
import { uniqueid } from '~/helpers'

Vue.component('CloseBtn', {
  template: `<div class="popup-close-btn" @click="$emit('click')"></div>`
})

Vue.component('PopupTitle', {
  template: '<div class="popup-title-bar"><slot></slot></div>'
})

@Component({
  name: 'Popup'
})
export default class Popup extends Vue {
  appName: string = ''

  get aboutPopupShow() {
    return this.$store.getters.getIsAboutPopupShow
  }
  get uploadingPopupShow() {
    return this.$store.getters.getIsUploadingPopupShow
  }
  get linkAddPopupShow() {
    return this.$store.getters.getIsLinkAddPopupShow
  }
  get showPopup() {
    const flags: string[] = ['aboutPopupShow', 'uploadingPopupShow', 'linkAddPopupShow']
    return flags.map((key: string) => this[key]).reduce((res, el) => res || Boolean(el))
  }

  @Watch('showPopup')
  onShowPopupChanged(v: boolean) {
    if(!v) {
      this.clear()
    }
  }

  protected linkUrl: string = ''
  protected linkName: string = ''
  protected linkId: string = ''

  protected addLink() {
    if(this.linkUrl && this.linkName) {
      this.$electron.ipcRenderer.send('data-transfer', {
        target: 'links',
        data: {
          id: this.linkId || uniqueid(8),
          url: this.linkUrl,
          name: this.linkName
        }
      })
      this.$popup.close('linkAdd')
      this.clear()
    }
  }

  protected clear() {
    this.linkUrl = ''
    this.linkName = ''
    this.linkId = ''
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    this.$electron.ipcRenderer.on('set-window-title', (e: any, title: string) => {
      this.appName = title
    })
    this.$electron.ipcRenderer.on('data-transfer', (event: any, data: any) => {
      if(data.target === 'popup-link-edit') {
        this.linkUrl = data.data.url
        this.linkName = data.data.name
        this.linkId = data.data.key
      }
    })
  }
}
