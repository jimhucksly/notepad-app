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

  protected editorInit(instance: any) {
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')

    const debounced = debounce((): void | null => {
      const value = instance.getValue()
      if(!value.length) {
        if(res) {
          res.innerHTML = ''
        }
        return null
      }
      let json: any = {}
      try {
        json = JSON.parse(value)
        if(window.localStorage) {
          localStorage.setItem('json_viewer', JSON.stringify(json))
        }
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

    instance.on('change', debounced)
    this.editor = instance
  }

  protected drag(event?: any): void | null {
    const src: HTMLElement | null = document.querySelector('.json_viewer_src')
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')
    const container = document.querySelector('.json_viewer_cont')

    if(event.which !== 1) {
      // если клик правой кнопкой мыши
      return null // то он не запускает перенос
    }
    const startX = event.screenX
    const minW = 17

    if(container && src && res) {
      const srcW = src.clientWidth
      const resW = res.clientWidth
      const contW = container.clientWidth
      document.onmousemove = (e: any) => {
        if(e.screenX < startX) {
          const w: number = srcW - (startX - e.screenX)
          const p: number = w * 100 / contW
          if(p > minW) {
            src.style.maxWidth = p + '%'
            src.style.minWidth = p + '%'
            res.style.maxWidth = 100 - p + '%'
            res.style.minWidth = 100 - p + '%'
          }
        }
        if(e.screenX > startX) {
          const w: number = resW - (e.screenX - startX)
          const p: number = w * 100 / contW
          if(p > minW) {
            res.style.maxWidth = p + '%'
            res.style.minWidth = p + '%'
            src.style.maxWidth = 100 - p + '%'
            src.style.minWidth = 100 - p + '%'
          }
        }

        src.classList.add('non-selectable')
        res.classList.add('non-selectable')
      }

      document.onmouseup = (e: any) => {
        document.onmousemove = null
        document.onmouseup = null
        src.classList.remove('non-selectable')
        res.classList.remove('non-selectable')
      }
    }
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
    this.$electron.ipcRenderer.on('json-viewer-clear', (e: any) => {
      this.editor.setValue('')
      const res: HTMLElement | null = document.querySelector('.json_viewer_res')
      if(res) {
        res.innerHTML = ''
      }
      if(window.localStorage) {
        localStorage.removeItem('json_viewer')
      }
    })

    if(window.localStorage) {
      const value = localStorage.getItem('json_viewer')
      let json: any = {}
      if(value) {
        try {
          json = JSON.parse(value)
          this.editor.setValue(JSON.stringify(json, null, 2))
        } catch(e) {
          console.log(e)
        }
      }
    }
  }

  render(h: any) {
    return h(
      'div',
      {
        staticClass: 'json_viewer json_viewer_cont'
      },
      [
        h(
          'div',
          {
            staticClass: 'json_viewer_src'
          },
          [
            h(
              'editor',
              {
                domProps: {
                  value: this.content
                },
                props: {
                  lang: 'javascript',
                  theme: 'twilight',
                  width: '100%',
                  height: '100%'
                },
                on: {
                  init: (event: any) => { this.editorInit(event) },
                  input: (value: any) => {
                    this.$emit('input', value)
                  }
                }
              }
            ),
            h(
              'div',
              {
                staticClass: 'json_viewer_separator',
                on: {
                  mousedown: (event: any) => {
                    this.drag(event)
                  }
                }
              }
            )
          ]
        ),
        h(
          'div',
          {
            staticClass: 'json_viewer_res'
          }
        ),
        h(
          'div',
          {
            staticClass: 'json_viewer_notice'
          },
          'Json parse successed!'
        )
      ]
    )
  }
}
