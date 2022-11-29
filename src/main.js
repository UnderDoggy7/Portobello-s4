import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'

import { boardService } from './services/board.service.js'

import './assets/styles/main.scss'
import rootCmp from './root-cmp.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)
const app = createApp(rootCmp)
    .component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(store)

app.mount('#app')
