//import { appcommon } from 'tizen-tv-webapis';
//import { application } from 'tizen-common-web';

import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
