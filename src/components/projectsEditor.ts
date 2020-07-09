import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'

@Component({
  name: 'ProjectsEditor'
})
export default class ProjectsEditor extends Vue {
  @Prop({ type: String, default: '' })
  itemStamp!: string

  name: string = ''
  isLock: boolean = false
  isDialog: boolean = false

  get json() {
    return this.$store.getters.getJson
  }

  get filter() {
    return this.$store.getters.getFilter
  }

  get item() {
    return this.json[this.itemStamp] || null
  }

  get isFile() {
    return this.item && !!this.item.file
  }

  @Watch('item')
  onItemChanged(o: any) {
    if(o) {
      this.name = o.name
      this.isLock = o.lock
    } else {
      this.name = ''
      this.isLock = false
    }
  }

  @Watch('isLock')
  onIsLockChanged(v: boolean) {
    if(this.item && !v && !this.isDialog) {
      this.isLock = true
      this.isDialog = true
      this.$electron.ipcRenderer.send('open-dialog-unlock-confirm')
    }
  }

  protected async archive() {
    const sResponse = await this.$store.dispatch('action', {
      type: 'ARCHIVE',
      data: this.itemStamp
    })
    if(sResponse.status === 'success') {
      this.removeHandler()
      this.$store.dispatch('action', {
        type: 'GET_ARCHIVES'
      })
    }
  }

  protected remove(e: any) {
    this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
    this.$electron.ipcRenderer.once('remove-is-confimed', () => {
      this.removeHandler()
    })
  }

  protected removeHandler() {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.itemStamp)
    unset(buffFilter, this.itemStamp)
    this.$store.dispatch('json', buffJson)
    this.$store.dispatch('filter', buffFilter)
    this.$store.dispatch('action', {
      type: 'DELETE',
      data: this.itemStamp
    })
    this.$emit('update:itemStamp', '')
  }

  protected save() {
    const o = {
      [this.itemStamp]: {
        key: this.itemStamp,
        date: this.item.date,
        name: this.name,
        lock: this.isLock,
        message: this.item.message,
        file: this.item.file
      }
    }
    this.$store.dispatch('json', { ...this.json, ...o })
    this.$store.dispatch('action', {
      type: 'UPDATE',
      data: o
    })
    this.$emit('update:itemStamp', '')
  }

  protected hide() {
    this.$emit('update:itemStamp', '')
  }

  mounted() {
    this.$electron.ipcRenderer.on('unlock-is-confimed', () => {
      this.isLock = false
      this.$nextTick(() => {
        this.isDialog = false
      })
    })

    this.$electron.ipcRenderer.on('unlock-is-unconfimed', () => {
      this.isDialog = false
    })
  }
}
