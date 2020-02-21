import { shallowMount } from '@vue/test-utils'
import App from '../src/App'

describe('App', () => {
  test('render App', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.text()).toEqual('A')
  })
})
