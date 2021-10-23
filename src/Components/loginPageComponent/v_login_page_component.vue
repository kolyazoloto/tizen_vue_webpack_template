
<template>
  <div tabindex="-1" class="loginPageComponent" v-focus @focus="getFocus">
    <loginShikiComponent></loginShikiComponent>
    <loginSmotretAnimeComponent></loginSmotretAnimeComponent>
  </div>
</template>

<script>
import loginShikiComponent from '../loginShikiComponent/v_login_shiki_component.vue'
import loginSmotretAnimeComponent from '../loginSmotretAnimeComponent/v_login_smotretanime_component.vue'
export default {
  name: 'loginPageComponent',
  components: {
    loginShikiComponent,
    loginSmotretAnimeComponent
  },
  directives: {
    focus: {
      inserted: function (el,binding) {
        if ((! binding.hasOwnProperty('value')) || binding.value) {
          el.focus({preventScroll: true})
        }
      }
    }
  },
  mounted:function(){
    /*this.$store.dispatch({
      type: 'shikiAuthorisation',
      nickname: 'kolyazoloto',
      password:'64146414q'
    })*/
  },
  methods:{
    getFocus:function(event){
      let elem = event.target
      let child = elem.childNodes[0]
      //console.log(child)
      if (child != null){
        child.focus()
      }
    }
  }

}
</script>


<style lang="scss" src="./loginPageComponent.scss"></style>
