import Vue from 'vue'
import VueRouter from 'vue-router'

import loginPageComponent from '../Components/loginPageComponent/v_login_page_component.vue'
import homeComponent from '../Components/homeComponent/v_home_component.vue'
import chooseTitleComponent from '../Components/chooseTitleComponent/v_chooseTitle_component.vue'
import searchComponent from '../Components/searchComponent/v_search_component.vue'
import videoPlayerComponent from '../Components/videoPlayerComponent/v_video_player_component.vue'
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
        component:loginPageComponent,
      },
      {
        path: 'search',
        name:'search',
        component:searchComponent,
      },
      {
        path: 'settings',
        name:'settings'
      },
    ]
  },
  {
    path: '/player/:id/',
    name:'player',
    component:videoPlayerComponent,
  },

]

const router = new VueRouter({
  routes,

})

export default router
