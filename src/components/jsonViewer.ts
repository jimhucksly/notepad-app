import { Vue, Component } from 'vue-property-decorator'
import { debounce } from 'lodash'

const editor = require('vue2-ace-editor')
require('brace/mode/javascript')
require('brace/theme/twilight')

const JSONFormatter = require('json-formatter-js')
const fs = require('fs')

@Component({
  name: 'JsonViewer',
  components: {
    editor
  }
})
export default class JsonViewer extends Vue {
  editor: any = null
  content: string = ''

  protected editorInit(editor: any) {
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')

    const debounced = debounce((): void | null => {
      const value = editor.getValue()
      if(!value.length) {
        if(res) {
          res.innerHTML = ''
        }
        return null
      }
      let json: any = {}
      try {
        json = JSON.parse(value)
      } catch(e) {
        this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed')
        if(res) {
          res.innerHTML = ''
        }
      }
      const formatter = new JSONFormatter(json)
      if(res) {
        res.innerHTML = ''
        res.appendChild(formatter.render())
      }
      formatter.openAtDepth(1)

      const notice: HTMLElement | null = document.querySelector('.json_viewer_notice')
      if(notice) {
        notice.style.display = 'flex'
        setTimeout(() => {
          notice.style.display = 'none'
        }, 3000)
      }
    }, 3000)

    editor.on('change', debounced)
    this.editor = editor
  }

  mounted() {
    this.$electron.ipcRenderer.on('json-viewer-src-set', (e: any, value: any) => {
      let json: any = {}
      try {
        json = JSON.parse(value)
        this.editor.setValue(JSON.stringify(json, null, 2))
      } catch(e) {
        this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed')
      }
    })
    this.$electron.ipcRenderer.on('json-viewer-save', (a: any, fileName: string) => {
      fs.writeFileSync(fileName, this.editor.getValue(), 'utf-8')
    })
  }
}
