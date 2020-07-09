import { Vue, Component, Prop } from 'vue-property-decorator'
import { now } from '~/helpers'

@Component({
  name: 'ProjectsArchives'
})
export default class ProjectsArchives extends Vue {
  @Prop({ type: Boolean, default: false })
  init!: boolean

  get items() {
    return this.$store.getters.getArchives
  }

  get json() {
    return this.$store.getters.getJson
  }

  protected getDate(stamp: string) {
    return now(stamp).date
  }

  protected async restore(o: any) {
    const name = `${o.name}_(datetime)${o.date}`
    const html = await this.$store.dispatch('action', {
      type: 'ARCHIVE_RESTORE',
      data: name
    })
    if(html) {
      const {date, stamp} = now()
      const json = {
        [stamp]: {
          key: stamp,
          date,
          name: o.name,
          lock: false,
          message: html
        }
      }
      this.$store.dispatch('json', { ...this.json, ...json })
      const sResponse = await this.$store.dispatch('action', {
        type: 'CREATE',
        data: json
      })
      if(sResponse.status === 'success') {
        this.remove(o)
      }
    }
  }

  protected async remove(o: any) {
    const name = `${o.name}_(datetime)${o.date}`
    const sResponse = await this.$store.dispatch('action', {
      type: 'ARCHIVE_REMOVE',
      data: name
    })
    if(sResponse.status === 'success') {
      const arr = this.items.filter((e: any) => {
        return e.name !== o.name
      })
      this.$store.dispatch('archives', arr)
    }
  }
}
