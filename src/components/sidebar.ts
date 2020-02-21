import { Vue, Component } from 'vue-property-decorator'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import Projects from '~/components/projects'
import SidebarTree from '~/components/sidebarTree'
import JsonViewerBtns from '~/components/JsonViewerBtns'

@Component({
  name: 'Sidebar',
  components: {
    SidebarSwitcher,
    Projects,
    SidebarTree,
    JsonViewerBtns
  }
})
export default class Sidebar extends Vue {
  isSwitcherMenuExpanded: boolean = false

  get isPreferences() {
    return this.$store.getters.getIsPreferencesShow
  }
  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isMarkdown() {
    return this.$store.getters.getIsMarkdownShow
  }
  get isJsonViewer() {
    return this.$store.getters.getIsJsonViewerShow
  }
  get mdTree() {
    return this.$store.getters.getMdTree
  }
}
