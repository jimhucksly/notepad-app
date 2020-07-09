import { Vue, Component } from 'vue-property-decorator'
import BtnAdd from '~/components/btnAdd'

@Component({
  name: 'TodoBtns',
  components: {
    BtnAdd
  }
})
export default class TodoBtns extends Vue  {
  protected add() {
    this.$electron.ipcRenderer.send('todo-add')
  }
}