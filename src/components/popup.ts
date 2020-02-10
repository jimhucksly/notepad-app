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
    return this.$store.getters['getAboutPopupShow']
  }
  get uploadingPopupShow() {
    return this.$store.getters['getUploadingPopupShow']
  }
  get showPopup() {
    let flags = ['aboutPopupShow', 'uploadingPopupShow']
    return flags.map(key => this[key]).reduce((res, el) => res || Boolean(el))
  }
  get appName() {
    return this.$electron.remote.getCurrentWindow().getTitle()
  }
}
