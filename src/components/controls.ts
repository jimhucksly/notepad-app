import { Vue, Component, Prop } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { checkLinks } from '~/helpers'

@Component({
  name: 'Controls'
})

export default class Controls extends Vue {
  @Prop({ type: String, default: '' })
  readonly itemKey!: string

  @Prop({ type: Array, default: () => [] })
  readonly collection!: string[]

  editableItems: string[] = []

  get json() {
    return this.$store.getters.getJson
  }
  get filter() {
    return this.$store.getters.getFilter
  }
  get refs() {
    return this.$parent.$refs
  }

  protected edit(event: any, stamp: string) {
    const items: any = this.refs.notepad_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    this.editableItems.push(stamp)
    const content = item.querySelector('.notepad_item_content')
    const area = document.createElement('textarea')
    area.style.visibility = 'hidden'
    content.innerHTML = ''
    content.appendChild(area)
    const div = document.createElement('div')
    div.innerHTML = this.json[stamp].message
    const urls = div.querySelectorAll('a')
    urls.length && urls.forEach((el: any) => {
      const href: string = el.href
      const p = document.createElement('p')
      p.innerHTML = href
      div.insertBefore(p, el)
      el.remove()
    })
    area.value = div.innerHTML.replace(/<br\/?>/g, '\n').replace(/<\/?p\/?>/g, '')
    area.style.height = area.scrollHeight * 1.1 + 'px'
    area.style.visibility = 'visible'
    area.addEventListener('keydown', (e: any) => {
      if(
        (e.code === 'Enter' ||
        e.key === 'Enter' ||
        e.code === 'KeyS' ||
        e.key === 's' ||
        e.key === 'ы') &&
        e.ctrlKey
      ) {
        e.preventDefault()
        this.save(e, stamp)
      }
    })
  }
  protected save(e: any, stamp: string) {
    const items: any = this.refs.notepad_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    const i = this.editableItems.findIndex((el: string) => el === stamp)
    this.editableItems.splice(i, 1)
    const content = item.querySelector('.notepad_item_content')
    const textarea = content.querySelector('textarea')
    const value = textarea.value.replace(/\n/g, '<br>')
    content.innerHTML = ''
    const p = document.createElement('p')
    p.innerHTML = checkLinks(value)
    content.appendChild(p)
    const o = {
      [stamp]: {
        key: stamp,
        date: this.json[stamp].date,
        name: this.json[stamp].name,
        lock: this.json[stamp].lock,
        message: p.innerHTML
      }
    }
    this.$store.dispatch('json', { ...this.json, ...o })
    this.$nextTick(() => {
      this.$store.dispatch('action', {
        type: 'UPDATE',
        data: o
      })
    })
  }
  protected removeHandler(stamp: string) {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, stamp)
    unset(buffFilter, stamp)
    this.$store.dispatch('json', buffJson)
    this.$store.dispatch('filter', buffFilter)
    this.$store.dispatch('action', {
      type: 'DELETE',
      data: stamp
    })
  }
  protected remove(e: any, stamp: string) {
    const isLocked = this.json[stamp].lock
    !isLocked && this.removeHandler(stamp)
    if(isLocked) {
      this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
      this.$electron.ipcRenderer.once('remove-is-confimed', () => {
        this.removeHandler(stamp)
      })
    }
  }
}
