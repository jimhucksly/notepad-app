import { Vue, Component, Prop } from 'vue-property-decorator'

interface IMenu {
  name: string
  nameAlt: string
  id: number
}

@Component({
  name: 'SidebarSwitcher',
})
export default class SidebarSwitcher extends Vue {
  @Prop({ type: String, default: '' })
  legend!: string

  protected menu: IMenu[] = [
    {
      name: 'projects',
      nameAlt: 'Projects',
      id: 1
    },
    {
      name: 'markdown',
      nameAlt: 'Markdown',
      id: 2
    },
    {
      name: 'events',
      nameAlt: 'Events',
      id: 3
    },
    {
      name: 'jsonViewer',
      nameAlt: 'Json Viewer',
      id: 4
    }
  ]

  private isExpand: boolean = false

  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isMarkdown() {
    return this.$store.getters.getIsMarkdownShow
  }
  get isEvents() {
    return this.$store.getters.getIsEventsShow
  }
  get isJsonViewer() {
    return this.$store.getters.getIsJsonViewerShow
  }
  get current() {
    if(this.isProjects) return 1
    if(this.isMarkdown) return 2
    if(this.isEvents) return 3
    if(this.isJsonViewer) return 4
    return 1
  }
  get legendInternal() {
    let result = ''
    if(this.legend) return this.legend
    else {
      this.menu.forEach((item: IMenu) => {
        item.id === this.current && (result = item.nameAlt)
      })
      return result
    }
  }

  protected toggle(): any {
    if(!!this.legend) return null
    this.isExpand = !this.isExpand
    if(this.isExpand) this.$emit('onExpand')
    else this.$emit('onHide')
  }

  protected select(id: number) {
    this.menu.forEach((item: IMenu) => {
      this.$store.dispatch(item.name, item.id === id)
    })
    this.toggle()
  }
}
