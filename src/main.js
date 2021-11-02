//import { appcommon } from 'tizen-tv-webapis';


import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
import { websetting } from 'tizen-common-web';



Vue.config.productionTip = false
websetting.setUserAgentString('Tizen-os')

//////////////////////////////////////////////
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast'// https://github.com/dolce/iziToast
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
  messageSize:25,
  titleSize:28,
})

function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return iziToast[type]({title, message, timeout})
}

VueNotifications.config.timeout = 5000
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)
/////////////////////////////////////////////////////////////
//

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
