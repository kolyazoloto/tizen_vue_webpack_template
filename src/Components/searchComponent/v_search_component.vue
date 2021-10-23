<template>
  <div class="searchComponent">
    <keyboardComponent></keyboardComponent>
  </div>
</template>

<script>
import keyboardComponent from '../keyboardComponent/v_keyboard_component.vue'
export default {
  name: 'searchComponent',
  components: {
    keyboardComponent
  },
  methods:{

  }
}
</script>


<style lang="scss" src="./searchComponent.scss"></style>
