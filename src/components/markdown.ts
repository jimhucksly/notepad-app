import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'

interface ITree {
  children: ITree[]
  name: string
  slug: string
  id: string
}

/* tslint-disable object-literal-shorthand */

Object.defineProperty(SimpleMDE.prototype, 'togglePreviewHandler', {
  value(cb: (arg: any) => void) {
    this.togglePreview()
    setTimeout(() => {
      if(cb instanceof Function) {
        cb(this.isPreviewActive())
      }
    }, 2)
  }
})

Object.defineProperty(SimpleMDE.prototype, 'saveContent', {
  value() {
    this.saveContentHandler()
  }
})

// let autosaveTimeout = null

let nodes: ITree[] = []

const md = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight(str: string, lang: string) { return '' }
})

md.use(MarkdownItAnchor, {
  slugify: (s: string) => {
    const slug = translit(s)
    nodes.push({
      name: s || '',
      slug: slug || '',
      id: uniqueid(8),
      children: []
    })
    return slug
  },
  level: [1, 2, 3],
  permalink: true,
  permalinkClass: 'md-anchor',
  permalinkBefore: false
})

const config: any = {
  autofocus: true,
  toolbar: [
    'bold', 'italic', 'heading', '|',
    'heading-1', 'heading-2', 'heading-3', '|',
    'unordered-list', 'ordered-list', '|',
    'code', 'link', '|',
    'preview', '|',
    {
      action: () => false,
      className: 'fa fa-save no-disable',
      default: true,
      name: 'save',
      title: 'Save'
    }
  ],
  autosave: {
    enabled: false,
    uniqueId: 'MyUniqueID',
    delay: 1000
  },
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
    strikethrough: false,
    underscoresBreakWords: true
  },
  previewRender(plainText: string) {
    nodes = []
    return md.render(plainText)
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: false
  },
  status: [
    {
      className: 'saved-status'
    },
    'autosave', 'lines', 'words', 'cursor'
  ],
  tabSize: 4
}

@Component({
  name: 'Markdown',
})
export default class Markdown extends Vue {
  editor: any = null
  isRendered: boolean = false
  links: string[] = []

  get initialValue() {
    return this.$store.getters.getMd
  }

  @Watch('initialValue')
  onInitialValueCahnged() {
    this.editor.togglePreviewHandler()
    this.buildTree()
  }

  protected buildTree() {
    const tree: ITree[] = []
    let index = -1
    nodes.forEach((item: any) => {
      const node = document.getElementById(item.slug)
      if(node) {
        const level = +node.tagName.slice(-1)
        switch(level) {
          case 1:
            tree.push(item)
            index++
            break
          case 2:
            tree[index].children.push(item)
            break
          case 3:
            const lastIndex = tree[index].children.length - 1
            tree[index].children[lastIndex].children.push(item)
        }
      }
    })
    this.$store.dispatch('mdTree', [ ...cloneDeep(tree) ])
  }

  mounted() {
    const editor = document.getElementById('editor')
    if(editor) {
      const editorElement = document.getElementById('editor')
      const conf: any = {
        ...config
      }
      if(editorElement) conf.element = editorElement
      this.editor = new SimpleMDE(conf)
      this.editor.value(this.initialValue)
      this.editor.togglePreviewHandler()
      const toolbarItemPreview = this.editor.toolbar.find((item: any) => item.name === 'preview')
      if(toolbarItemPreview) {
        toolbarItemPreview.action = () => {
          this.editor.togglePreviewHandler((isActive: boolean) => {
            isActive && this.buildTree()
          })
        }
      }
      const toolbarItemSave = this.editor.toolbar.find((item: any) => item.name === 'save')
      if(toolbarItemSave) {
        toolbarItemSave.action = () => {
          const sRequest = this.$store.dispatch('action', {
            type: 'SAVE',
            data: this.editor.value()
          })
          Promise
            .all([sRequest])
            .then((data: any) => {
              const statusBar = document.querySelector('.editor-statusbar')
              if(statusBar) {
                const savedSatus = statusBar.querySelector('.saved-status')
                const message = 'Markdown is successfully saved!'
                savedSatus && (savedSatus.innerHTML = message)
                setTimeout(() => {
                  savedSatus && (savedSatus.innerHTML = '')
                }, 3000)
              }
            })
        }
      }
      this.buildTree()
      this.isRendered = true
      const cm: any = this.editor.codemirror
      const doc: any = cm.getDoc()
      const count = doc.lineCount()
      const linkedDoc = doc.linkedDoc({
        from: 0,
        to: count
      })

      const result: any = []

      const linked = (o: any) => {
        if(o.children) {
          const arr = o.children
          arr.forEach((item: any) => {
            if(item.lines) {
              item.lines.forEach((line: any) => {
                result.push(line.text)
              })
            }
            if(item.children) {
              linked(item)
            }
          })
        }
      }
      linked(linkedDoc)
      this.links = result

      this.$electron.ipcRenderer.on('codemirror-link-click', (event: any, text: string) => {
        let scrolling: boolean = false
        this.links.forEach((link: string, index: number): void | null => {
          if(scrolling) return null
          if(link.indexOf(text) > -1) {
            scrolling = true
            this.editor.codemirror.scrollIntoView({ line: index, char: 0 }, 200)
            if(index > 0) {
              const scrollInfo = this.editor.codemirror.getScrollInfo()
              this.editor.codemirror.scrollTo(0, scrollInfo.top + scrollInfo.clientHeight / 2)
            }
          }
        })
      })
    }
  }

  beforeDestroy() {
    this.$store.dispatch('mdTree', [])
    this.$store.dispatch('action', {
      type: 'SAVE',
      data: this.editor.value()
    })
  }

  created() {
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }

  render(h: any) {
    return h(
      'div',
      {
        staticClass: 'editor_wrapper',
        style: {
          display: this.isRendered ? 'flex' : 'none'
        }
      },
      [
        h(
          'textarea',
          {
            attrs: {
              name: 'editor',
              id: 'editor'
            }
          }
        )
      ]
    )
  }
}
