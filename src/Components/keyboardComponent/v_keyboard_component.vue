<template>
  <div tabindex="-1" class="keyboardComponent" @focus="getFocus">
    <div class="column">
      <keyComponent char="" type="space"></keyComponent>
      <keyComponent char="" type="backspace"></keyComponent>
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

export default {
  name: 'keyboardComponent',
  components: {
    keyComponent,
  },
  data:function(){
    return{
      vmodelValue:""
    }
  },
  methods:{
    getFocus:function(event){
      let elem = event.target
      elem.children[1].children[0].focus({preventScroll: true})
    },

  }
}
</script>


<style lang="scss" src="./keyboardComponent.scss"></style>
