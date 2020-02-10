import Vue from 'vue'
import path from 'path'
const App = require(path.resolve(__dirname, '../../../src/App.vue'))

describe('App.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(App)
    }).$mount()

    expect(vm.$el.querySelector('#app')).to.be.not.equal(null)
  })
})
