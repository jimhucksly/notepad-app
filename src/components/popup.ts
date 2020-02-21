import { Vue, Component } from 'vue-property-decorator'

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
  get aboutPopupShow() {
    return this.$store.getters.getIsAboutPopupShow
  }
  get uploadingPopupShow() {
    return this.$store.getters.getIsUploadingPopupShow
  }
  get showPopup() {
    const flags: string[] = ['aboutPopupShow', 'uploadingPopupShow']
    return flags.map((key: string) => this[key]).reduce((res, el) => res || Boolean(el))
  }
  get appName() {
    return this.$electron.remote.getCurrentWindow().getTitle()
  }
}
