<template>
  <div tabindex="-1" class="keyComponent">
    <BackSpace v-if="type === 'backspace'" class="icon-2x"></BackSpace>
    <KeyboardSpace v-else-if="type === 'space'" class="icon-2x"></KeyboardSpace>
    <div v-else class="char">
      {{char}}
    </div>
  </div>
</template>

<script>
import KeyboardSpace from 'vue-material-design-icons/KeyboardSpace.vue'
import BackSpace from 'vue-material-design-icons/BackspaceOutline.vue'
export default {
  name: 'keyComponent',
  props:['char','type'],
  components: {
    KeyboardSpace,
    BackSpace,
  },
  methods:{

  }
}
</script>


<style lang="scss" src="./keyComponent.scss"></style>
