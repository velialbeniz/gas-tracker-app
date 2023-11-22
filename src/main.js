import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { Icon } from '@iconify/vue'

const app = createApp(App)

app.mount('#app')

app.component('Icon', Icon)

