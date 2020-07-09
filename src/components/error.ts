import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Error'
})
export default class Error extends Vue {
  render(h: any) {
    return h(
      'div',
      {
        staticClass: 'error_cont'
      },
      [
        h(
          'div',
          {
            staticClass: 'error_cont_inner'
          },
          'Connection is lost.'
        )
      ]
    )
  }
}
