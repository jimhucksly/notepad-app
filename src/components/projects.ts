import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'

@Component({
  name: 'Projects'
})
export default class Projects extends Vue {
  names: any = {}
  checked: string = ''
  isArchivesInit: boolean = false

  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get json() {
    return this.$store.getters.getJson
  }
  get filter() {
    return this.$store.getters.getFilter
  }

  @Watch('isProjects')
  onIsProjectsChanged(v: boolean) {
    this.checked = ''
    this.isArchivesInit = false
    this.$emit('onArchives', this.isArchivesInit)
  }

  protected toggleLock(e: any, stamp: string) {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    const isLocked = item.classList.contains('lock')
    const updateJson = () => {
      const o = {
        [stamp]: {
          key: stamp,
          date: this.json[stamp].date,
          name: this.json[stamp].name,
          lock: !isLocked,
          message: this.json[stamp].message,
          file: this.json[stamp].file
        }
      }
      this.$store.dispatch('json', { ...this.json, ...o })
      this.$store.dispatch('action', {
        type: 'UPDATE',
        data: o
      })
    }
    if(isLocked) {
      this.$electron.ipcRenderer.send('open-dialog-unlock-confirm')
      this.$electron.ipcRenderer.once('unlock-is-confimed', () => {
        item.classList.remove('lock')
        updateJson()
      })
    } else {
      item.classList.add('lock')
      updateJson()
    }
  }
  protected toggleFilter(e: any, stamp: string): void | null {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    const target: any = e.target
    if(target.closest('.projects_item_check')) return null
    if(e.target.tagName === 'DIV' || e.target.tagName === 'LABEL') {
      if(item.classList.contains('active')) {
        const buff = cloneDeep(this.filter)
        unset(buff, stamp)
        this.$store.dispatch('filter', { ...buff })
      } else {
        this.$store.dispatch('filter', { ...this.filter, [stamp]: true })
      }
    }
  }
  protected toggleCheck(e: any) {
    const target: any = e.target
    const isChecked: boolean = target.checked
    if(isChecked) {
      this.isArchivesInit = false
      this.$emit('onArchives', false)
    }
    this.checked = isChecked ? target.dataset.stamp : ''
    this.$emit('onEdit', this.checked)
  }
  protected clearCheck() {
    this.checked = ''
    const input: any = document.querySelectorAll('input[type="checkbox"]:checked')
    if(input && input[0]) {
      input[0].checked = false
    }
  }
  protected toggleArchives() {
    this.isArchivesInit = !this.isArchivesInit
    this.$emit('onArchives', this.isArchivesInit)
  }

  async created() {
    this.$store.dispatch('action', {
      type: 'GET_ARCHIVES'
    })
  }
}
