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
  readonly legend!: string

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
      name: 'todo',
      nameAlt: 'Todo',
      id: 3
    },
    {
      name: 'events',
      nameAlt: 'Events',
      id: 4
    },
    {
      name: 'links',
      nameAlt: 'Links',
      id: 5
    },
    {
      name: 'jsonViewer',
      nameAlt: 'Json Viewer',
      id: 6
    }
  ]

  private isExpand: boolean = false

  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isTodo() {
    return this.$store.getters.getIsTodoShow
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
  get isLinks() {
    return this.$store.getters.getIsLinksShow
  }
  get current() {
    if(this.isProjects) return 1
    if(this.isMarkdown) return 2
    if(this.isTodo) return 3
    if(this.isEvents) return 4
    if(this.isLinks) return 5
    if(this.isJsonViewer) return 6
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
    if(this.isExpand) {
      this.$emit('onExpand')
      const switcher: any = this.$refs.switcher
      document.onclick = (e: any) => {
        if(!e.target.closest('.switcher')) {
          this.isExpand = !this.isExpand
          this.$emit('onHide')
          document.onclick = null
        }
      }
      document.onkeydown = (e) => {
        if(e.keyCode === 27 || e.code === 'Escape') {
          this.isExpand = !this.isExpand
          this.$emit('onHide')
          document.onclick = null
          document.onkeydown = null
        }
      }
    }
    else {
      document.onclick = null
      document.onkeydown = null
      this.$emit('onHide')
    }
  }

  protected select(id: number) {
    this.menu.forEach((item: IMenu) => {
      this.$store.dispatch(item.name, item.id === id)
    })
    this.toggle()
  }
}
