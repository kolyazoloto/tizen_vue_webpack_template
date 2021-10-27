<template>
  <div tabindex="-1" class="keyboardComponent" @focus="getFocus" >
    <div @changelang="changeLang" class="column">
      <keyComponent char="" type="space"></keyComponent>
      <keyComponent char="" type="backspace"></keyComponent>
      <keyComponent char="" type="web"></keyComponent>
    </div>
    <template v-if="lang==='eng'">
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
    </template>

    <template v-else-if="lang==='ru'">
      <div class="column">
        <keyComponent char="а"></keyComponent>
        <keyComponent char="б"></keyComponent>
        <keyComponent char="в"></keyComponent>
        <keyComponent char="г"></keyComponent>
        <keyComponent char="д"></keyComponent>
        <keyComponent char="е"></keyComponent>
      </div>
      <div class="column">
        <keyComponent char="ж"></keyComponent>
        <keyComponent char="з"></keyComponent>
        <keyComponent char="и"></keyComponent>
        <keyComponent char="й"></keyComponent>
        <keyComponent char="к"></keyComponent>
        <keyComponent char="л"></keyComponent>
      </div>
      <div class="column">
        <keyComponent char="м"></keyComponent>
        <keyComponent char="н"></keyComponent>
        <keyComponent char="о"></keyComponent>
        <keyComponent char="п"></keyComponent>
        <keyComponent char="р"></keyComponent>
        <keyComponent char="с"></keyComponent>
      </div>
      <div class="column">
        <keyComponent char="т"></keyComponent>
        <keyComponent char="у"></keyComponent>
        <keyComponent char="ф"></keyComponent>
        <keyComponent char="х"></keyComponent>
        <keyComponent char="ц"></keyComponent>
        <keyComponent char="ч"></keyComponent>
      </div>
      <div class="column">
        <keyComponent char="ш"></keyComponent>
        <keyComponent char="щ"></keyComponent>
        <keyComponent char="ъ"></keyComponent>
        <keyComponent char="ы"></keyComponent>
        <keyComponent char="ь"></keyComponent>
        <keyComponent char="э"></keyComponent>
      </div>
      <div class="column">
        <keyComponent char="ю"></keyComponent>
        <keyComponent char="я"></keyComponent>
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
    </template>
  </div>
</template>

<script>
import keyComponent from './keyComponent/v_key_component.vue'

export default {
  name: 'keyboardComponent',
  components: {
    keyComponent,
  },
  computed:{
    lang:function(){
      return this.$store.state.keyboardLang
    }
  },
  methods:{
    getFocus:function(event){
      let elem = event.target
      elem.children[1].children[0].focus({preventScroll: true})
    },
    changeLang:function(){
      console.log("alo")
    }

  }
}
</script>


<style scoped="true" lang="scss" src="./keyboardComponent.scss"></style>
