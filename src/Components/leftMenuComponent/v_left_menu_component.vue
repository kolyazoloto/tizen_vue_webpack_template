<template>
  <div class="leftMenuComponent">

    <div tabindex="-1" class="routerLinkDiv"
    @keydown.right.prevent="pressRight"
    @keydown.down.prevent="pressDown"
    @keydown.up.prevent="pressUp"
    @keydown.enter.prevent="pressEnter"
    >
      <router-link tabindex="-1" class="routerLink login" :to="{ name: 'login'}">
        <img :src="avatarimg">
        <h3 class='menuName'>{{username}}</h3>
      </router-link>
    </div>

    <div tabindex="-1" class="routerLinkDiv"
    @keydown.right.prevent="pressRight"
    @keydown.down.prevent="pressDown"
    @keydown.up.prevent="pressUp"
    @keydown.enter.prevent="pressEnter"
    >
      <router-link tabindex="-1" class="routerLink search" :to="{ name: 'search'}">
        <MenuSearch class="icon-2x"></MenuSearch>
        <div class="line"></div>
        <h3 class='menuName'>Search</h3>
      </router-link>
    </div>

    <div tabindex="-1" class="routerLinkDiv"
    @keydown.right.prevent="pressRight"
    @keydown.down.prevent="pressDown"
    @keydown.up.prevent="pressUp"
    @keydown.enter.prevent="pressEnter"
    >
      <router-link class="routerLink chooseTitle" :to="{ name: 'chooseTitle', params: {} }">
        <MenuHome class="icon-2x"></MenuHome>
        <div class="line"></div>
        <h3 class='menuName'>Home</h3>
      </router-link>
    </div>

    <div  tabindex="-1" class="routerLinkDiv"
    @keydown.right.prevent="pressRight"
    @keydown.down.prevent="pressDown"
    @keydown.up.prevent="pressUp"
    @keydown.enter.prevent="pressEnter"
    >
      <router-link class="routerLink settings" :to="{ name: 'settings', params: {} }">
        <MenuSettings class="icon-2x"></MenuSettings>
        <div class="line"></div>
        <h3 class='menuName'>Settings</h3>
      </router-link>
    </div>

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

  },
  computed:{
    username:function(){
      return this.$store.state.shikimori.nickname
    },
    avatarimg:function(){
      return this.$store.state.shikimori.avatarimg
    }
  },
  methods:{
    pressRight:function(event){
      let elem = event.target
      //console.log(elem)
      let parentElem = elem.parentElement
      //console.log(parentElem)
      let nextElem = parentElem.nextElementSibling
      nextElem.focus()
    },
    pressDown:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      if (nextElem != undefined){
        nextElem.focus()
      }
    },
    pressUp:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != undefined){
        prevElem.focus()
      }
    },
    pressEnter:function(event){

      let elem = event.target
      let childElem = elem.childNodes[0]
      if(childElem.classList.contains("settings")){
        if (this.$route.path !== "/mainPage/setting"){
          this.$router.push({name:'settings'})
        }
        else{
          let parentElem = elem.parentElement
          //console.log(parentElem)
          let nextElem = parentElem.nextElementSibling
          nextElem.focus()
        }
      }
      if(childElem.classList.contains("search")){
        if (this.$route.path !== "/mainPage/search"){
          this.$router.push({name:'search'})
        }
        else{
          let parentElem = elem.parentElement
          let nextElem = parentElem.nextElementSibling
          nextElem.focus()
        }
      }
      if(childElem.classList.contains("login")){
        if (this.$route.path !== "/mainPage/login"){
          this.$router.push({name:'login'})
        }
        else{
          let parentElem = elem.parentElement
          //console.log(parentElem)
          let nextElem = parentElem.nextElementSibling
          nextElem.focus()
        }
      }
      if(childElem.classList.contains("chooseTitle")){
        if (this.$route.path !== "/mainPage/chooseTitle"){
          this.$router.push({name:'chooseTitle'})
        }
        else{
          let parentElem = elem.parentElement
          let nextElem = parentElem.nextElementSibling
          nextElem.focus()
        }
      }

      //console.log(childElem.className)
    },
  }
}
</script>


<style lang="scss" src="./leftMenuComponent.scss"></style>
