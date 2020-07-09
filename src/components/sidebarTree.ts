import { Vue, Component, Prop } from 'vue-property-decorator'
import SidebarTree from '~/components/sidebarTree'

@Component({
  name: 'SidebarTree',
  components: {
    SidebarTree
  }
})
export default class SidebarTreeComponent extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  readonly tree!: object[]

  @Prop({
    type: Number,
    default: 1
  })
  readonly level!: number

  protected selectNode(item: any) {
    this.$electron.ipcRenderer.send('codemirror-link-click', item.name)
    const editor = document.querySelector('.editor-preview')
    if(editor) {
      const link: any = editor.querySelector(`a[href*=${item.slug}]`)
      link && link.click()
      if(item.children && item.children.length) {
        const node = this.$refs[item.id][0]
        const ul = node.nextElementSibling
        const isExpanded = node.classList.contains('expanded')
        node.classList[isExpanded ? 'remove' : 'add']('expanded')
        node.classList[isExpanded ? 'remove' : 'add']('tree_item_minus')
        node.classList[isExpanded ? 'add' : 'remove']('tree_item_plus')
        this[isExpanded ? '$slideUp' : '$slideDown'](ul, 200)
      }
    }
  }
}
