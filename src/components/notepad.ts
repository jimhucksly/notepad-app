import { Vue, Component, Watch } from 'vue-property-decorator'
import { isEmpty } from 'lodash'
import { checkLinks, now, getFileType, dragAndDropLoader, downloadFile } from '~/helpers'
import Controls from '~/components/controls'
import File from '~/components/file'

@Component({
  name: 'Notepad',
  components: {
    Controls,
    File
  }
})
export default class Notepad extends Vue {
  message: string = ''
  newMsgFlag: boolean = false

  get json() {
    return this.$store.getters.getJson
  }
  get filter() {
    return this.$store.getters.getFilter
  }
  get isError() {
    return this.$store.getters.getError
  }
  get hasFilter() {
    return !isEmpty(this.filter)
  }

  @Watch('hasFilter')
  onHasFilterChanged(flag: boolean) {
    if(flag) {
      const notepadCont: any = this.$refs.notepad_cont
      notepadCont.scrollTo(0, 0)
    } else {
      this.$nextTick(() => {
        const notepadCont: any = this.$refs.notepad_cont
        notepadCont.scrollTop = notepadCont.scrollHeight
      })
    }
  }

  protected send(): void | null {
    if(!this.message.length) return null
    this.newMsgFlag = true
    const {date, stamp} = now()
    const o = {
      [stamp]: {
        key: stamp,
        date,
        name: '',
        lock: false,
        message: checkLinks(this.message)
      }
    }
    this.message = ''
    this.$store.dispatch('json', { ...this.json, ...o })
    this.$nextTick(() => {
      const notepad_cont: any = this.$refs.notepad_cont
      notepad_cont.scrollTop = notepad_cont.scrollHeight
      this.$store.dispatch('action', {
        type: 'CREATE',
        data: o
      })
    })
  }
  protected onFileChange(e: any): void | null {
    const files = e.target.files || e.dataTransfer.files
    if(files.length === 0) return null
    const formData = new FormData()
    formData.append('file', files[0])
    formData.set('file', files[0])
    this.upload(formData, getFileType(files[0].name))
  }
  protected addFile(name: string, link: string, type: string) {
    this.newMsgFlag = true
    const {date, stamp} = now()
    const o = {
      [stamp]: {
        key: stamp,
        date,
        name,
        lock: false,
        file: {
          name,
          link,
          type
        }
      }
    }
    this.$store.dispatch('json', { ...this.json, ...o })
    this.$nextTick(() => {
      const notepad_cont: any = this.$refs.notepad_cont
      notepad_cont.scrollTop = notepad_cont.scrollHeight
      this.$store.dispatch('action', {
        type: 'CREATE',
        data: o
      })
    })
  }
  protected async upload(file: object, fileType: string) {
    try {
      const sResponse = await this.$store.dispatch('action', {
        type: 'FILE',
        data: { file }
      })
      if(sResponse && sResponse.filename && sResponse.link) {
        this.addFile(sResponse.filename, sResponse.link, fileType)
      } else throw new Error('error')
    } catch(e) {
      console.error(e)
    }
  }
  protected read() {
    const self: any = this.$refs.notepad_cont
    const rect = self.getBoundingClientRect()
    const viewportHeight = rect.top + rect.height
    const unread = self.querySelectorAll('.unread')
    unread.forEach((el: any, i: number) => {
      const elRect = el.getBoundingClientRect()
      if(elRect.top < viewportHeight) {
        if(!el.classList.contains('.will-be-marked')) {
          setTimeout(() => {
            this.$store.dispatch('read', el.dataset.stamp)
            el.classList.remove('unread')
            el.classList.remove('will-be-marked')
            const hasStyle = el.attributes.getNamedItem('style')
            hasStyle && el.attributes.removeNamedItem('style')
          }, 2000)
        }
        el.classList.add('will-be-marked')
        el.style.transition = 'all 0.5s'
      }
    })
  }
  protected updated() {
    this.read()
  }

  mounted() {
    const notepad_cont: any = this.$refs.notepad_cont
    notepad_cont.scrollTop = notepad_cont.scrollHeight
    dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange)

    window.ondragstart = () => false

    notepad_cont.addEventListener('click', (e: any) => {
      const isLink = e.target.tagName === 'A'
      const hasHref = e.target.href && e.target.href.length
      if(isLink && hasHref) {
        e.preventDefault()
        const href = e.target.href
        const stamp = e.target.dataset.stamp
        const items: any = this.$refs.notepad_item
        const item = items.find((el: any) => el.dataset.stamp === stamp)
        if(item) {
          const loader = item.querySelector('.file_loader')
          const fileName = e.target.dataset.filename
          const finalPath = this.$store.getters.getDownloadsTargetPath + '\\' + fileName
          downloadFile(href, finalPath, loader)
        } else {
          this.$electron.shell.openExternal(e.target.href)
        }
      }
    })

    notepad_cont.addEventListener('scroll', (e: any) => {
      this.read()
    })
  }
}
