import { Vue, Component } from 'vue-property-decorator'

interface ILinks {
  key: {
    url: string
    name: string
  }
}

@Component({
  name: 'Links'
})
export default class Links extends Vue {
  get items() {
    const o: ILinks = this.$store.getters.getLinks
    if(o) {
      return Object.keys(o).map((key: string, index: number, arr: any) => {
        return {
          key,
          url: o[key].url,
          name: o[key].name
        }
      })
    }
    return []
  }

  protected open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  protected edit(key: string) {
    this.$popup.open('linkAdd')
    this.$electron.ipcRenderer.send('data-transfer', {
      target: 'popup-link-edit',
      data: this.items.find((el: any) => el.key === key)
    })
  }

  protected remove(key: string) {
    this.$store.dispatch('action', {
      type: 'LINK',
      data: {
        remove: key
      }
    })
  }

  async mounted() {
    await this.$store.dispatch('action', {
      type: 'LINKS'
    })

    this.$electron.ipcRenderer.on('data-transfer', (event: any, data: any) => {
      if(data.target === 'links') {
        this.$store.dispatch('action', {
          type: 'LINK',
          data: data.data
        })
      }
    })
  }
}
