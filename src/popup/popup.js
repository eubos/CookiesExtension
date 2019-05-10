import Vue from 'vue'
import App from './App'
import store from '../store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
