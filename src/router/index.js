import Vue from 'vue'
import VueRouter from 'vue-router'

import homeComponent from '../Components/HomeComponent/v_home_component.vue'
import loadingComponent from '../Components/loadingComponent/loadingComponent.vue'


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    component: homeComponent
  },
  {
    path: '/player',
  },

]

const router = new VueRouter({
  routes
})

export default router
