<template>
  <div class="leftMenuComponent" tabindex="-1">
    <router-link class="routerLink search" :to="{ name: 'search'}">
      <MenuSearch class="icon-2x"></MenuSearch>
      <div class="line"></div>
      <h3 class='menuName'>Search</h3>
    </router-link>

    <router-link class="routerLink chooseTitle" :to="{ name: 'chooseTitle', params: {} }">
      <MenuHome class="icon-2x"></MenuHome>
      <div class="line"></div>
      <h3 class='menuName'>Home</h3>
    </router-link>

    <router-link class="routerLink settings" :to="{ name: 'settings', params: {} }">
      <MenuSettings class="icon-2x"></MenuSettings>
      <div class="line"></div>
      <h3 class='menuName'>Settings</h3>
    </router-link>

  </div>
</template>

<script>
import MenuHome from 'vue-material-design-icons/HomeOutline.vue'
import MenuSearch from 'vue-material-design-icons/Magnify.vue'
import MenuSettings from 'vue-material-design-icons/CogOutline.vue'
export default {
  name: 'leftMenuComponent',
  components: {
    MenuSearch,
    MenuHome,
    MenuSettings

  }
}
</script>


<style lang="scss" src="./leftMenuComponent.scss"></style>
