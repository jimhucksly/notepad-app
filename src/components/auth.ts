import { Vue, Component, Watch } from 'vue-property-decorator'
import _ from 'lodash'

interface IErrors {
  login: number
  pass: number
}

@Component({
  name: 'Auth'
})
export default class Auth extends Vue {
  protected login: string = ''
  protected pass: string = ''
  protected errors: IErrors = {
    login: 0,
    pass: 0
  }

  // watchers

  @Watch('login')
  onLoginChanged(val: string) {
    this.errors.login = val.length > 0 ? 0 : 1
  }
  @Watch('pass')
  onPassChanged(val: string) {
    this.errors.pass = val.length > 0 ? 0 : 1
  }

  // methods

  protected validate(): boolean {
    if(this.login.length === 0) {
      this.errors.login = 1
    }
    if(this.pass.length === 0) {
      this.errors.pass = 1
    }
    return Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
  }

  protected submit() {
    if(this.validate()) {
      this.$store.dispatch('loading', true)
      this.$store.dispatch('action', {
        type: 'AUTH',
        data: {
          login: this.login,
          password: this.pass
        }
      })
        .then((resp: any) => {
          this.$store.dispatch('token', resp.token)
          this.$store.dispatch('auth', true)
          this.$store.dispatch('action', {
            type: 'GET_JSON'
          })
          this.$store.dispatch('action', {
            type: 'GET_MD'
          })
        })
        .catch((err: any) => {
          this.$store.dispatch('loading', false)
          const data = err.response && err.response.data ? err.response.data : (err.response || err)
          if(data.message && !_.isEmpty(data.message)) {
            this.errors = { ...data.message }
            this.errors.login = this.errors.login ? 1 : 0
            this.errors.pass = this.errors.pass ? 1 : 0
            this.validate()
          } else {
            console.error(data)
          }
        })
    }
  }
}