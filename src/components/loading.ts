import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Loading'
})

export default class Loading extends Vue {
  render(h: any) {
    return h(
      'div',
      {attrs: {id: 'loading_cont'}},
      [
        h(
          'div',{staticClass: 'm-b-5'},
          [h('small',{},'Connection...')]
        ),
        h('div',{staticClass: 'loading'})
      ]
    )
  }
}
