import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'LinksBtns'
})
export default class LinksBtns extends Vue  {
  protected add() {
    this.$popup.open('linkAdd')
  }
}
