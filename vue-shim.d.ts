import Vue from 'vue'
import * as Vuex from 'vuex'
import { RootState } from 'store/types'

declare module "*.vue" {
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: Vuex.Store<RootState>
    $electron: any
    $popup: {
      open: (s :string) => {}
      close: (s: string) => {}
    }
    $slideUp: Function
    $slideDown: Function
  }
}
