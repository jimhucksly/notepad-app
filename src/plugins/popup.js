
import store from '@/store'

var Popup = function popup(options) {
  if(options === void 0) options = {}
}

function install(Vue) {
  const open = (ref) => {
    store.dispatch(ref + 'PopupShow', true)
  }

  const close = (ref) => {
    store.dispatch(ref + 'PopupShow', false)
  }

  const _popup = {
    open,
    close
  }

  if(!Vue.prototype.hasOwnProperty('$popup')) {
    Object.defineProperty(Vue.prototype, '$popup', {
      get: function get() { return _popup }
    })
  }
}

Popup.install = install
export default Popup
