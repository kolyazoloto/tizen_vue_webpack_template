import Vue from 'vue'
import VueRouter from 'vue-router'

import loginPageComponent from '../Components/loginPageComponent/v_login_page_component.vue'
import homeComponent from '../Components/homeComponent/v_home_component.vue'
import chooseTitleComponent from '../Components/chooseTitleComponent/v_chooseTitle_component.vue'
Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect:'/mainPage'
  },
  {
    path: '/mainPage',
    component: homeComponent,
    children:[
      {
        path: '',
        redirect: '/mainPage/chooseTitle'
      },
      {
        path: 'chooseTitle',
        name:'chooseTitle',
        component: chooseTitleComponent,
      },
      {
        path: 'login',
        name:'login',
        component:loginPageComponent
      },
      {
        path: 'search',
        name:'search'
      },
      {
        path: 'settings',
        name:'settings'
      },
    ]
  },
  {
    path: '/player',
  },

]

const router = new VueRouter({
  routes
})

export default router
