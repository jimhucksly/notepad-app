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
  tree!: object[]

  @Prop({
    type: Number,
    default: 1
  })
  level!: number

  protected selectNode(item: any) {
    const editor = document.querySelector('.editor-preview')
    if(editor) {
      const link: any = editor.querySelector(`a[href*=${item.slug}]`)
      link && link.click()
      if(item.children && item.children.length) {
        const node = this.$refs[item.id][0]
        const ul = node.nextElementSibling
        const isExpanded = node.classList.contains('expanded')
        if(isExpanded) {
          node.classList.remove('expanded')
          node.classList.remove('tree_item_minus')
          node.classList.add('tree_item_plus')
          this.$slideUp(ul, 200)
        } else {
          node.classList.add('expanded')
          node.classList.add('tree_item_minus')
          node.classList.remove('tree_item_plus')
          this.$slideDown(ul, 200)
        }
      }
    }
  }
}
