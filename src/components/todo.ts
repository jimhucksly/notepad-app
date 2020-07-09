import { Vue, Component, Watch } from 'vue-property-decorator'
import { now, indexOf } from '~/helpers'
import { cloneDeep } from 'lodash'

interface ITodo {
  id: string
  date: string
  text: string
  order: number
}

const sortByOrder = (a: ITodo, b: ITodo) => {
  return a.order < b.order ? -1 : 1
}

@Component({
  name: 'Todo'
})
export default class Todo extends Vue {
  protected items: ITodo[] = []
  protected isPopupShow: boolean = false
  protected itemSelected: ITodo | null = null

  get json() {
    return this.$store.getters.getTodo
  }

  get keys() {
    return this.items.map((item: ITodo) => item.id)
  }

  @Watch('json')
  onJsonChanged(json: any) {
    this.setItems()
  }

  protected move(event: MouseEvent, id: string): void | null {
    if(event.which !== 1) {
      // если клик правой кнопкой мыши
      return // то он не запускает перенос
    }

    const container: HTMLElement | null = document.querySelector('.todo_cont')
    const elemsClassName = 'todo_item'
    if(!container || container.childElementCount === 1) return null
    const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`)
    if(!elem) return null

    document.onmouseup = () => {
      elem.style.transform = 'scale(1)'
      this.edit(id)
      setTimeout(() => {
        elem.removeAttribute('style')
      }, 100)
    }

    elem.style.transition = 'all 0.1s'
    elem.style.transform = 'scale(0.95)'

    const startPos = {
      x: event.clientX,
      y: event.clientY
    }

    document.onmousemove = (ev: MouseEvent) => {
      if(Math.abs(ev.clientX - startPos.x) > 10 || Math.abs(ev.clientY - startPos.y) > 10) {
        container.classList.add('todo_cont--drag')

        const avatar: HTMLElement = document.createElement('div')
        avatar.style.display = 'block'
        avatar.style.float = 'left'
        avatar.style.width = elem.offsetWidth + 'px'
        avatar.style.height = elem.offsetHeight + 'px'
        avatar.style.margin = '3px'
        avatar.style.border = '1px dashed #333'
        avatar.style.opacity = '0.6'
        avatar.style.borderRadius = '6px'

        const rectElem: DOMRect = elem.getBoundingClientRect()
        const rectCont: DOMRect = container.getBoundingClientRect()
        const startX = rectElem.left - rectCont.left
        const startY = rectElem.top - rectCont.top

        container.insertBefore(avatar, elem)
        elem.style.position = 'absolute'
        elem.style.left = startX + 'px'
        elem.style.top = startY + 'px'
        elem.style.zIndex = '99'
        elem.style.opacity = '0.7'
        elem.style.transform = 'rotate(7deg)'

        container.childNodes.forEach((el: any) => {
          if(el.classList) {
            const isAvatar = el.classList.contains('dragable-avatar')
            const isSelf = el.classList.contains('dragable')
            if(!isAvatar && !isSelf && el.classList.contains(elemsClassName)) el.classList.add('dropable')
          }
        })

        const dragItem: HTMLElement = elem

        const finishDrag = () => {
          dragItem.classList.remove('dragable')
          dragItem.removeAttribute('style')
          container.querySelectorAll('.dropable').forEach((el: any) => {
            el.classList.remove('dropable')
            el.removeAttribute('style')
          })
          container.classList.remove('todo_cont--drag')
          container.insertBefore(dragItem, avatar)
          container.removeChild(avatar)
          document.onmousemove = null
          document.onmouseup = null
          this.setOrder()
        }

        document.onmousemove = (e: MouseEvent): void | null => {
          const moveX = startPos.x - e.clientX
          const moveY = startPos.y - e.clientY

          dragItem.style.left = startX - moveX + 'px'
          dragItem.style.top = startY - moveY + 'px'

          const { clientX, clientY } = e
          dragItem.style.display = 'none'
          const el: Element | null = document.elementFromPoint(clientX, clientY)
          dragItem.style.display = 'block'
          if(el === null) return null
          const dropItem = el.closest('.dropable')
          if(dropItem === null) return null
          const dropRect: DOMRect = dropItem.getBoundingClientRect()
          const dropCoords = {
            x: e.clientX - dropRect.left,
            y: e.clientY - dropRect.top,
          }
          if(dropCoords.x < dropRect.width / 2) {
            const next: Element | null = dropItem.nextElementSibling
            if(next) {
              container.insertBefore(avatar, next)
            } else container.appendChild(avatar)
          } else {
            if(indexOf(dropItem) === container.childElementCount - 1) {
              container.appendChild(avatar)
            } else {
              container.insertBefore(avatar, dropItem)
            }
          }
        }

        document.onmouseup = (e: MouseEvent): void | null => {
          const { clientX, clientY } = e
          dragItem.style.display = 'none'
          const el = document.elementFromPoint(clientX, clientY)
          dragItem.style.display = 'block'
          // такое возможно, если курсор мыши "вылетел" за границу окна
          if(el === null) {
            finishDrag()
            return null
          }
          finishDrag()
        }
      }
    }
  }

  protected setOrder(): void | null {
    const result  = {}
    const elems = document.querySelectorAll('[data-id]')
    if(!elems.length) return null
    elems.forEach((el: any, index: number) => {
      const id = el.dataset.id
      result[id] = index + 1
      const item = this.items.find((o: ITodo) => o.id === el.dataset.id)
      item && (item.order = index + 1)
    })
    this.items = [ ...this.items ]
    this.$store.dispatch('action', {
      type: 'TODO_SET_ORDER',
      data: result
    })
  }

  protected edit(id: string) {
    document.onmousemove = null
    document.onmouseup = null
    const o = this.items.find((item: ITodo) => item.id === id)
    this.itemSelected = o ? cloneDeep(o) : null
    if(this.itemSelected) {
      this.isPopupShow = true
      this.$nextTick(() => {
        const textarea: any = this.$refs.textarea
        textarea.focus()
        textarea.addEventListener('keydown', (e: any) => {
          if(
            (
            e.code === 'KeyS' ||
            e.key === 's' ||
            e.key === 'ы') &&
            e.ctrlKey
          ) {
            e.preventDefault()
            this.save()
          }
        })
      })
    }
  }

  protected save() {
    if(this.itemSelected) {
      const id = this.itemSelected.id
      const o: ITodo | null = this.items.find((item: ITodo) => item.id === id) || null
      o && (o.text = this.itemSelected.text)
      this.items = [ ...this.items ]
      this.cancel()
      this.$store.dispatch('action', {
        type: 'TODO',
        data: o
      })
    }
  }

  protected cancel() {
    this.isPopupShow = false
    this.itemSelected = null
  }

  protected async remove() {
    if(this.itemSelected) {
      const id = this.itemSelected.id
      this.items = this.items.filter((item: ITodo) => item.id !== id)
      this.cancel()
      await this.$store.dispatch('action', {
        type: 'TODO',
        data: {
          remove: id
        }
      })
      this.setOrder()
    }
  }

  protected setItems() {
    this.items = Object.keys(this.json).map((key: string): ITodo => {
      const o: ITodo = {
        id: key,
        date: now(key).date,
        text: this.json[key].text,
        order: this.json[key].order
      }
      return o
    }).sort(sortByOrder)
  }

  async mounted() {
    await this.$store.dispatch('action', {
      type: 'GET_TODO'
    })

    this.$electron.ipcRenderer.on('todo-add', (event: any) => {
      const { date, stamp } = now()
      let sstamp: number = +stamp
      while(this.keys.includes(sstamp.toString())) {
        sstamp += 1
      }
      const o: any = {
        id: sstamp.toString(),
        date,
        text: '',
        order: this.items.length + 1
      }
      this.items.push(o)
      this.$store.dispatch('action', {
        type: 'TODO',
        data: o
      })
    })
  }
}
