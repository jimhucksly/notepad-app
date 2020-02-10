import anime from 'animejs'

var Anime = function _anime(options) {
  if(options === void 0) options = {}
}

function install(Vue) {
  const slideDown = (el, duration = 300) => {
    el.style.overflow = 'hidden'
    el.style.display = 'block'
    el.style.visibility = 'hidden'
    const h = el.offsetHeight
    el.style.height = '0px'
    el.style.visibility = 'visible'
    anime({
      targets: el,
      height: h,
      easing: 'linear',
      duration: duration,
      complete() {
        el.attributes.removeNamedItem('style')
      }
    })
  }

  const slideUp = (el, duration = 300) => {
    el.style.overflow = 'hidden'
    anime({
      targets: el,
      height: 0,
      easing: 'linear',
      duration: duration,
      complete() {
        el.attributes.removeNamedItem('style')
        el.style.display = 'none'
      }
    })
  }

  if(!Vue.prototype.hasOwnProperty('$slideDown')) {
    Object.defineProperty(Vue.prototype, '$slideDown', {
      get: function get() { return slideDown }
    })
  }

  if(!Vue.prototype.hasOwnProperty('$slideUp')) {
    Object.defineProperty(Vue.prototype, '$slideUp', {
      get: function get() { return slideUp }
    })
  }
}

Anime.install = install
export default Anime
