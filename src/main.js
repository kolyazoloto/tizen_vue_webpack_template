//import { appcommon } from 'tizen-tv-webapis';


import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
import { websetting } from 'tizen-common-web';


Vue.config.productionTip = false
websetting.setUserAgentString('tizen-os')


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
