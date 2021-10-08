<template>
  <div class="homeComponent">
    <leftMenuComponent></leftMenuComponent>
    <router-view></router-view>
  </div>
</template>

<script>
import leftMenuComponent from '../leftMenuComponent/v_left_menu_component.vue'
export default {
  name: 'homeComponent',
  components: {
    leftMenuComponent,
  },
}
</script>


<style lang="scss" src="./homeComponent.scss"></style>
