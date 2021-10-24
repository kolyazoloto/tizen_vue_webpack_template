<template>
  <div tabindex="-1" class="keyComponent"
  @keydown.right.prevent="pressRight"
  @keydown.left.prevent="pressLeft"
  @keydown.down.prevent="pressDown"
  @keydown.up.prevent="pressUp"
  @keydown.enter.prevent="pressEnter"

  >
    <KeyboardSpace v-if="type === 'space'" class="icon-2x"></KeyboardSpace>
    <BackSpace v-else-if="type === 'backspace'" class="icon-2x"></BackSpace>
    <div v-else class="char">
      {{char}}
    </div>
  </div>
</template>

<script>
import KeyboardSpace from 'vue-material-design-icons/KeyboardSpace.vue'
import BackSpace from 'vue-material-design-icons/Backspace.vue'
export default {
  name: 'keyComponent',
  props:['char','type'],
  components: {
    KeyboardSpace,
    BackSpace,
  },
  methods:{

    pressEnter:function(){
      this.$store.commit('updateSearchrequestString',[this.type,this.char])
      //console.log([this.type,this.char])
    },
    pressRight:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      if (nextElem != null){
        nextElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != null){
        prevElem.focus({preventScroll: true})
      }
      else{
        //Выход в левое меню
        let menuElem = document.querySelector(".routerLink.router-link-exact-active.router-link-active")
        menuElem.parentElement.focus()
      }
    },
    pressDown:function(event){
      let elem = event.target
      let parentElem = elem.parentElement
      let elemIndex = Array.from(parentElem.children).indexOf(elem)
      let nextElem = parentElem.nextElementSibling
      if (nextElem != null){
        let elemcoefIndex = nextElem.children.length/parentElem.children.length
        //console.log(elemcoefIndex)
        //console.log(elemIndex)
        //console.log(Math.floor(elemIndex*elemcoefIndex))
        nextElem.children[Math.floor(elemIndex*elemcoefIndex)].focus({preventScroll: true})
      }
      else{
        let parentElementCoords = parentElem.parentElement.children[0].getBoundingClientRect()
        let nextElemCoords = parentElem.parentElement.nextElementSibling.getBoundingClientRect()
        //console.log(parentElementCoords)
        //console.log(nextElemCoords)
        nextElem = parentElem.parentElement.nextElementSibling
        nextElem.parentElement.scrollBy({
          top: nextElemCoords.y - parentElementCoords.y,
          behavior:'smooth'
        })
        nextElem.focus()
      }
    },
    pressUp:function(event){
      let elem = event.target
      let parentElem = elem.parentElement
      let elemIndex = Array.from(parentElem.children).indexOf(elem)
      let prevElem = parentElem.previousElementSibling
      if (prevElem != null){
        let elemcoefIndex = prevElem.children.length/parentElem.children.length
        //console.log(elemcoefIndex)
        //console.log(elemIndex)
        //console.log(Math.floor(elemIndex*elemcoefIndex))
        prevElem.children[Math.floor(elemIndex*elemcoefIndex)].focus({preventScroll: true})
      }
    },
  }
}
</script>


<style lang="scss" src="./keyComponent.scss"></style>
