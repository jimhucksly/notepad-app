import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'JsonViewerBtns'
})
export default class JsonViewerBtns extends Vue {
  protected open() {
    const openFile = () => {
      const element = document.createElement('input')
      element.type = 'file'
      element.accept = '.txt, .json'
      element.onchange = function() {
        readText(this)
        document.body.removeChild(element)
      }

      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
    }

    const readText = (filePath: any) => {
      let reader: any = null
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader()
      } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.')
        return false
      }
      let output = ''
      if(filePath.files && filePath.files[0]) {
          reader.onload = (e: any) => {
            output = e.target.result
            this.$electron.ipcRenderer.send('json-viewer-src-set', output)
          }
          reader.readAsText(filePath.files[0])
      } else return false
      return true
    }

    openFile()
  }

  protected save() {
    this.$electron.ipcRenderer.send('save-file-dialog', {})
    this.$electron.ipcRenderer.on('save-dialog-file-selected', (e: any, file: any) => {
      if(file && file.filePath) {
        this.$electron.ipcRenderer.send('json-viewer-save', file.filePath)
      }
    })
  }

  protected clear() {
    this.$electron.ipcRenderer.send('json-viewer-clear')
  }
}
