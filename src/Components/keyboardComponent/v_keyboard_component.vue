<template>
  <div class="keyboardComponent">
    <div class="column">
      <keyComponent char="" type="backspace">
        <BackSpace class="icon-2x"></BackSpace>
      </keyComponent>
      <keyComponent char="" type="space">
        <KeyboardSpace class="icon-2x"></KeyboardSpace>
      </keyComponent>
    </div>
    <div class="column">
      <keyComponent char="a"></keyComponent>
      <keyComponent char="b"></keyComponent>
      <keyComponent char="c"></keyComponent>
      <keyComponent char="d"></keyComponent>
      <keyComponent char="e"></keyComponent>
      <keyComponent char="f"></keyComponent>
    </div>
    <div class="column">
      <keyComponent char="g"></keyComponent>
      <keyComponent char="h"></keyComponent>
      <keyComponent char="i"></keyComponent>
      <keyComponent char="j"></keyComponent>
      <keyComponent char="k"></keyComponent>
      <keyComponent char="l"></keyComponent>
    </div>
    <div class="column">
      <keyComponent char="m"></keyComponent>
      <keyComponent char="n"></keyComponent>
      <keyComponent char="o"></keyComponent>
      <keyComponent char="p"></keyComponent>
      <keyComponent char="q"></keyComponent>
      <keyComponent char="r"></keyComponent>
    </div>
    <div class="column">
      <keyComponent char="s"></keyComponent>
      <keyComponent char="t"></keyComponent>
      <keyComponent char="u"></keyComponent>
      <keyComponent char="v"></keyComponent>
      <keyComponent char="w"></keyComponent>
      <keyComponent char="x"></keyComponent>
    </div>
    <div class="column">
      <keyComponent char="y"></keyComponent>
      <keyComponent char="z"></keyComponent>
      <keyComponent char="1"></keyComponent>
      <keyComponent char="2"></keyComponent>
      <keyComponent char="3"></keyComponent>
      <keyComponent char="4"></keyComponent>
    </div>
    <div class="column">
      <keyComponent char="5"></keyComponent>
      <keyComponent char="6"></keyComponent>
      <keyComponent char="7"></keyComponent>
      <keyComponent char="8"></keyComponent>
      <keyComponent char="9"></keyComponent>
      <keyComponent char="0"></keyComponent>
    </div>
  </div>
</template>

<script>
import keyComponent from './keyComponent/v_key_component.vue'
import KeyboardSpace from 'vue-material-design-icons/KeyboardSpace.vue'
import BackSpace from 'vue-material-design-icons/BackspaceOutline.vue'
export default {
  name: 'keyboardComponent',
  components: {
    keyComponent,
    KeyboardSpace,
    BackSpace,
  },
  methods:{

  }
}
</script>


<style lang="scss" src="./keyboardComponent.scss"></style>
