import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'File'
})
export default class File extends Vue {
  @Prop()
  itemKey!: string

  @Prop()
  itemFile!: any

  get stamp() {
    return this.itemKey
  }
  get href() {
    return this.itemFile.link
  }
  get fileName() {
    return this.itemFile.name
  }
  get type() {
    return this.itemFile.type
  }
}
