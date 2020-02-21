import { Vue, Component } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'

@Component({
  name: 'Projects'
})
export default class Projects extends Vue {
  names: any = {}

  get json() {
    return this.$store.getters.getJson
  }
  get filter() {
    return this.$store.getters.getFilter
  }

  protected triggerEdit(e: any, stamp: string) {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    if(item.classList.contains('edit')) {
      item.classList.remove('edit')
      const o = {
        [stamp]: {
          key: stamp,
          date: this.json[stamp].date,
          name: this.names[stamp],
          lock: this.json[stamp].lock,
          message: this.json[stamp].message,
          file: this.json[stamp].file
        }
      }
      this.$store.dispatch('json', { ...this.json, ...o })
      this.$store.dispatch('action', {
        type: 'UPDATE',
        data: o
      })
    } else {
      item.classList.add('edit')
      this.names = {
        ...this.names,
        [stamp]: this.json[stamp].name || this.json[stamp].key
      }
    }
  }
  protected triggerLock(e: any, stamp: string) {
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
  protected triggerFilter(e: any, stamp: string) {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
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
}
