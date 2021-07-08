import Vue from 'vue'
import VueRouter from 'vue-router'
import homeComponent from '../Components/HomeComponent/v_home_component.vue'


Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

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
